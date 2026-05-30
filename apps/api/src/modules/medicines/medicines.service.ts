import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Medicine } from '@prisma/client';
import { TenantContext } from '../../common/tenant/tenant-context.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateMedicineDto,
  UpdateMedicineDto,
} from './dto/medicine.dto';

export interface MedicineDto {
  id: number;
  name: string;
  dosageForm: string;
  strength: string;
  notes: string | null;
  createdAt: string;
}

@Injectable()
export class MedicinesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContext,
  ) {}

  async findAll(search?: string): Promise<MedicineDto[]> {
    const tenantId = this.tenantContext.getTenantId();
    const q = search?.trim();

    const medicines = await this.prisma.medicine.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { dosageForm: { contains: q, mode: 'insensitive' } },
                { strength: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });

    return medicines.map((m) => this.toDto(m));
  }

  async create(dto: CreateMedicineDto): Promise<MedicineDto> {
    const tenantId = this.tenantContext.getTenantId();
    const medicine = await this.prisma.medicine.create({
      data: {
        tenantId,
        name: dto.name.trim(),
        dosageForm: dto.dosageForm.trim(),
        strength: dto.strength.trim(),
        notes: dto.notes?.trim() || null,
      },
    });
    return this.toDto(medicine);
  }

  async update(id: number, dto: UpdateMedicineDto): Promise<MedicineDto> {
    await this.ensureExists(id);
    const medicine = await this.prisma.medicine.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.dosageForm !== undefined
          ? { dosageForm: dto.dosageForm.trim() }
          : {}),
        ...(dto.strength !== undefined ? { strength: dto.strength.trim() } : {}),
        ...(dto.notes !== undefined
          ? { notes: dto.notes?.trim() || null }
          : {}),
      },
    });
    return this.toDto(medicine);
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.medicine.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async ensureExists(id: number): Promise<Medicine> {
    const tenantId = this.tenantContext.getTenantId();
    const medicine = await this.prisma.medicine.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }
    return medicine;
  }

  private toDto(m: Medicine): MedicineDto {
    return {
      id: m.id,
      name: m.name,
      dosageForm: m.dosageForm,
      strength: m.strength,
      notes: m.notes,
      createdAt: m.createdAt.toISOString(),
    };
  }
}
