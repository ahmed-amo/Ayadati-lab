import { Injectable, NotFoundException } from '@nestjs/common';
import { GuestBookingStatus, AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [bookingsPending, appointmentsToday, appointmentsTotal, patients] =
      await Promise.all([
        this.prisma.guestBooking.count({
          where: { status: GuestBookingStatus.PENDING },
        }),
        this.prisma.appointment.count({
          where: {
            appointmentDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
            status: { not: AppointmentStatus.CANCELLED },
          },
        }),
        this.prisma.appointment.count(),
        this.prisma.patient.count(),
      ]);

    return {
      bookingsPending,
      appointmentsToday,
      appointmentsTotal,
      patients,
    };
  }

  listGuestBookings() {
    return this.prisma.guestBooking.findMany({
      orderBy: { appointmentDate: 'asc' },
      include: { appointment: true },
    });
  }

  async confirmGuestBooking(id: number) {
    const booking = await this.prisma.guestBooking.findUnique({
      where: { id },
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
    return this.prisma.appointment.findMany({
      orderBy: { appointmentDate: 'desc' },
      include: {
        guestBooking: true,
        patient: { include: { user: true } },
      },
      take: 100,
    });
  }
}
