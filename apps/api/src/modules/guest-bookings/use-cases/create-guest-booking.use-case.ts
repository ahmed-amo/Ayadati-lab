import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuestBooking } from '@prisma/client';
import { TenantContext } from '../../../common/tenant/tenant-context.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateGuestBookingDto } from '../dto/create-guest-booking.dto';

export interface GuestBookingCreatedResult {
  id: number;
  qrToken: string;
  fullName: string;
  appointmentDate: string;
  preferredTime: string;
  testType: string;
  status: string;
  tenantSlug: string;
}

@Injectable()
export class CreateGuestBookingUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContext,
  ) {}

  async execute(dto: CreateGuestBookingDto): Promise<GuestBookingCreatedResult> {
    const tenant = this.tenantContext.getTenant();
    const tenantId = tenant.id;

    const appointmentDate = new Date(dto.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new BadRequestException('Appointment date cannot be in the past');
    }

    const service = await this.prisma.labService.findFirst({
      where: { tenantId, slug: dto.testType, isActive: true },
    });

    if (!service) {
      throw new NotFoundException('Selected lab service is not available');
    }

    const dayStart = new Date(appointmentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(appointmentDate);
    dayEnd.setHours(23, 59, 59, 999);

    const dailyCount = await this.prisma.guestBooking.count({
      where: {
        tenantId,
        appointmentDate: { gte: dayStart, lte: dayEnd },
        status: { not: 'CANCELLED' },
      },
    });

    if (dailyCount >= tenant.dailyBookingLimit) {
      throw new BadRequestException(
        'No more appointments available on this date',
      );
    }

    const booking = await this.prisma.$transaction(async (tx) => {
      const guest = await tx.guestBooking.create({
        data: {
          tenantId,
          fullName: dto.fullName.trim(),
          phone: dto.phone,
          email: dto.email?.trim() || null,
          nationalId: dto.nationalId?.trim() || null,
          appointmentDate,
          preferredTime: dto.preferredTime,
          testType: service.slug,
          notes: dto.notes?.trim() || null,
        },
      });

      await tx.appointment.create({
        data: {
          tenantId,
          guestBookingId: guest.id,
          appointmentDate,
          testType: service.slug,
          isWalkin: true,
          notes: dto.notes?.trim() || null,
          tokenExpiresAt: new Date(
            appointmentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
          ),
        },
      });

      return guest;
    });

    return this.toResult(booking, tenant.slug);
  }

  private toResult(
    booking: GuestBooking,
    tenantSlug: string,
  ): GuestBookingCreatedResult {
    return {
      id: booking.id,
      qrToken: booking.qrToken,
      fullName: booking.fullName,
      appointmentDate: booking.appointmentDate.toISOString().slice(0, 10),
      preferredTime: booking.preferredTime,
      testType: booking.testType,
      status: booking.status,
      tenantSlug,
    };
  }
}
