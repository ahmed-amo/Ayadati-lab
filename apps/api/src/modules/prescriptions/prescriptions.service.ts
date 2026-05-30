import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prescription,
  PrescriptionGender,
  PrescriptionStatus,
  Prisma,
  User,
} from '@prisma/client';
import { TenantContext } from '../../common/tenant/tenant-context.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePrescriptionDto,
  HeaderThemeDto,
  UpdatePrescriptionDto,
} from './dto/prescription.dto';

const prescriptionInclude = {
  doctor: { select: { id: true, fullName: true } },
  items: {
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
          dosageForm: true,
          strength: true,
        },
      },
    },
  },
} as const;

function toJsonTheme(theme?: HeaderThemeDto): Prisma.InputJsonValue | undefined {
  if (!theme) return undefined;
  return theme as Prisma.InputJsonValue;
}

export interface PrescriptionItemDetail {
  id: number;
  dosage: string;
  frequency: string;
  duration: string;
  medicine: {
    id: number;
    name: string;
    dosageForm: string;
    strength: string;
  };
}

export interface PrescriptionDetailDto {
  id: number;
  patientName: string;
  age: number;
  gender: PrescriptionGender;
  date: string;
  status: PrescriptionStatus;
  clinicNameSnapshot: string;
  logoUrl: string | null;
  signatureUrl: string | null;
  headerTheme: unknown;
  createdAt: string;
  updatedAt: string;
  doctor: { id: number; fullName: string };
  items: PrescriptionItemDetail[];
}

export interface PrescriptionListItem {
  id: number;
  patientName: string;
  age: number;
  gender: PrescriptionGender;
  date: string;
  status: PrescriptionStatus;
  itemCount: number;
  createdAt: string;
}

export interface PatientSuggestion {
  patientName: string;
  age: number;
  gender: PrescriptionGender;
  lastDate: string;
}

@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContext,
  ) {}

  async findAll(doctorId?: number): Promise<PrescriptionListItem[]> {
    const tenantId = this.tenantContext.getTenantId();
    const prescriptions = await this.prisma.prescription.findMany({
      where: {
        tenantId,
        ...(doctorId ? { doctorId } : {}),
      },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return prescriptions.map((p) => ({
      id: p.id,
      patientName: p.patientName,
      age: p.age,
      gender: p.gender,
      date: p.date.toISOString().slice(0, 10),
      status: p.status,
      itemCount: p._count.items,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  async findOne(id: number): Promise<PrescriptionDetailDto> {
    const prescription = await this.getPrescriptionWithItems(id);
    return this.toDetail(prescription);
  }

  async create(
    doctor: User,
    dto: CreatePrescriptionDto,
  ): Promise<PrescriptionDetailDto> {
    const tenantId = this.tenantContext.getTenantId();
    await this.validateMedicines(
      tenantId,
      dto.items.map((i) => i.medicineId),
    );

    const prescription = await this.prisma.$transaction(async (tx) => {
      const created = await tx.prescription.create({
        data: {
          tenantId,
          doctorId: doctor.id,
          patientName: dto.patientName.trim(),
          age: dto.age,
          gender: dto.gender,
          date: new Date(dto.date),
          status: dto.status ?? PrescriptionStatus.DRAFT,
          clinicNameSnapshot: dto.clinicNameSnapshot.trim(),
          logoUrl: dto.logoUrl ?? null,
          signatureUrl: dto.signatureUrl ?? null,
          headerTheme: toJsonTheme(dto.headerTheme),
          items: {
            create: dto.items.map((item) => ({
              medicineId: item.medicineId,
              dosage: item.dosage.trim(),
              frequency: item.frequency.trim(),
              duration: item.duration.trim(),
            })),
          },
        },
        include: prescriptionInclude,
      });
      return created;
    });

    return this.toDetail(prescription);
  }

  async update(
    id: number,
    dto: UpdatePrescriptionDto,
  ): Promise<PrescriptionDetailDto> {
    const tenantId = this.tenantContext.getTenantId();
    await this.ensureExists(id);

    if (dto.items?.length) {
      await this.validateMedicines(
        tenantId,
        dto.items.map((i) => i.medicineId),
      );
    }

    const prescription = await this.prisma.$transaction(async (tx) => {
      if (dto.items) {
        await tx.prescriptionItem.deleteMany({ where: { prescriptionId: id } });
      }

      return tx.prescription.update({
        where: { id },
        data: {
          ...(dto.patientName !== undefined
            ? { patientName: dto.patientName.trim() }
            : {}),
          ...(dto.age !== undefined ? { age: dto.age } : {}),
          ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
          ...(dto.date !== undefined ? { date: new Date(dto.date) } : {}),
          ...(dto.clinicNameSnapshot !== undefined
            ? { clinicNameSnapshot: dto.clinicNameSnapshot.trim() }
            : {}),
          ...(dto.logoUrl !== undefined ? { logoUrl: dto.logoUrl } : {}),
          ...(dto.signatureUrl !== undefined
            ? { signatureUrl: dto.signatureUrl }
            : {}),
          ...(dto.headerTheme !== undefined
            ? { headerTheme: toJsonTheme(dto.headerTheme ?? undefined) }
            : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.items
            ? {
                items: {
                  create: dto.items.map((item) => ({
                    medicineId: item.medicineId,
                    dosage: item.dosage.trim(),
                    frequency: item.frequency.trim(),
                    duration: item.duration.trim(),
                  })),
                },
              }
            : {}),
        },
        include: prescriptionInclude,
      });
    });

    return this.toDetail(prescription);
  }

  async duplicate(id: number, doctor: User): Promise<PrescriptionDetailDto> {
    const source = await this.getPrescriptionWithItems(id);
    return this.create(doctor, {
      patientName: source.patientName,
      age: source.age,
      gender: source.gender,
      date: new Date().toISOString().slice(0, 10),
      clinicNameSnapshot: source.clinicNameSnapshot,
      logoUrl: source.logoUrl ?? undefined,
      signatureUrl: source.signatureUrl ?? undefined,
      headerTheme: (source.headerTheme as object) ?? undefined,
      status: PrescriptionStatus.DRAFT,
      items: source.items.map((item) => ({
        medicineId: item.medicineId,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
      })),
    });
  }

  async searchPatients(query?: string): Promise<PatientSuggestion[]> {
    const tenantId = this.tenantContext.getTenantId();
    const q = query?.trim();

    const prescriptions = await this.prisma.prescription.findMany({
      where: {
        tenantId,
        ...(q
          ? { patientName: { contains: q, mode: 'insensitive' } }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      distinct: ['patientName'],
      select: {
        patientName: true,
        age: true,
        gender: true,
        date: true,
      },
    });

    return prescriptions.map((p) => ({
      patientName: p.patientName,
      age: p.age,
      gender: p.gender,
      lastDate: p.date.toISOString().slice(0, 10),
    }));
  }

  private async validateMedicines(
    tenantId: string,
    medicineIds: number[],
  ): Promise<void> {
    const uniqueIds = [...new Set(medicineIds)];
    const count = await this.prisma.medicine.count({
      where: {
        tenantId,
        id: { in: uniqueIds },
        deletedAt: null,
      },
    });
    if (count !== uniqueIds.length) {
      throw new BadRequestException('One or more medicines are invalid');
    }
  }

  private async ensureExists(id: number): Promise<Prescription> {
    const tenantId = this.tenantContext.getTenantId();
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, tenantId },
    });
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    return prescription;
  }

  private async getPrescriptionWithItems(id: number) {
    const tenantId = this.tenantContext.getTenantId();
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, tenantId },
      include: prescriptionInclude,
    });
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    return prescription;
  }

  private toDetail(
    p: Awaited<ReturnType<typeof this.getPrescriptionWithItems>>,
  ): PrescriptionDetailDto {
    return {
      id: p.id,
      patientName: p.patientName,
      age: p.age,
      gender: p.gender,
      date: p.date.toISOString().slice(0, 10),
      status: p.status,
      clinicNameSnapshot: p.clinicNameSnapshot,
      logoUrl: p.logoUrl,
      signatureUrl: p.signatureUrl,
      headerTheme: p.headerTheme,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      doctor: p.doctor,
      items: p.items.map((item) => ({
        id: item.id,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        medicine: item.medicine,
      })),
    };
  }
}
