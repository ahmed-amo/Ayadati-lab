import { Injectable } from '@nestjs/common';
import { GuestBooking, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GuestBookingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.GuestBookingCreateInput): Promise<GuestBooking> {
    return this.prisma.guestBooking.create({ data });
  }

  findByQrToken(qrToken: string): Promise<GuestBooking | null> {
    return this.prisma.guestBooking.findUnique({ where: { qrToken } });
  }
}
