import { Injectable, NotFoundException } from '@nestjs/common';
import { GuestBookingStatus, AppointmentStatus } from '@prisma/client';
import { TenantContext } from '../../common/tenant/tenant-context.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContext,
  ) {}

  async getStats() {
    const tenantId = this.tenantContext.getTenantId();
    const [bookingsPending, appointmentsToday, appointmentsTotal, patients] =
      await Promise.all([
        this.prisma.guestBooking.count({
          where: { tenantId, status: GuestBookingStatus.PENDING },
        }),
        this.prisma.appointment.count({
          where: {
            tenantId,
            appointmentDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
            status: { not: AppointmentStatus.CANCELLED },
          },
        }),
        this.prisma.appointment.count({ where: { tenantId } }),
        this.prisma.patient.count({ where: { tenantId } }),
      ]);

    return {
      bookingsPending,
      appointmentsToday,
      appointmentsTotal,
      patients,
    };
  }

  listGuestBookings() {
    const tenantId = this.tenantContext.getTenantId();
    return this.prisma.guestBooking.findMany({
      where: { tenantId },
      orderBy: { appointmentDate: 'asc' },
      include: { appointment: true },
    });
  }

  async confirmGuestBooking(id: number) {
    const tenantId = this.tenantContext.getTenantId();
    const booking = await this.prisma.guestBooking.findFirst({
      where: { id, tenantId },
      include: { appointment: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.$transaction([
      this.prisma.guestBooking.update({
        where: { id },
        data: { status: GuestBookingStatus.CONFIRMED },
      }),
      this.prisma.appointment.update({
        where: { id: booking.appointment!.id },
        data: { status: AppointmentStatus.CONFIRMED },
      }),
    ]);
  }

  listAppointments() {
    const tenantId = this.tenantContext.getTenantId();
    return this.prisma.appointment.findMany({
      where: { tenantId },
      orderBy: { appointmentDate: 'desc' },
      include: {
        guestBooking: true,
        patient: { include: { user: true } },
      },
      take: 100,
    });
  }
}
