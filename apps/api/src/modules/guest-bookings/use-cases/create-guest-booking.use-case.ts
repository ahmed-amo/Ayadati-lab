import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuestBooking } from '@prisma/client';
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
}

@Injectable()
export class CreateGuestBookingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateGuestBookingDto): Promise<GuestBookingCreatedResult> {
    const appointmentDate = new Date(dto.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new BadRequestException('Appointment date cannot be in the past');
    }

    const service = await this.prisma.labService.findFirst({
      where: { slug: dto.testType, isActive: true },
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
        appointmentDate: { gte: dayStart, lte: dayEnd },
        status: { not: 'CANCELLED' },
      },
    });

    if (dailyCount >= 50) {
      throw new BadRequestException(
        'No more appointments available on this date',
      );
    }

    const booking = await this.prisma.$transaction(async (tx) => {
      const guest = await tx.guestBooking.create({
        data: {
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

    return this.toResult(booking);
  }

  private toResult(booking: GuestBooking): GuestBookingCreatedResult {
    return {
      id: booking.id,
      qrToken: booking.qrToken,
      fullName: booking.fullName,
      appointmentDate: booking.appointmentDate.toISOString().slice(0, 10),
      preferredTime: booking.preferredTime,
      testType: booking.testType,
      status: booking.status,
    };
  }
}

// @vitest-environment node
// describe('CreateGuestBookingUseCase', () => { it.todo('rejects past dates'); });
