import { Injectable, NotFoundException } from '@nestjs/common';
import { GuestBooking, Prisma } from '@prisma/client';
import { TenantContext } from '../../common/tenant/tenant-context.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GuestBookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContext,
  ) {}

  create(data: Prisma.GuestBookingCreateInput): Promise<GuestBooking> {
    return this.prisma.guestBooking.create({ data });
  }

  async findByQrToken(qrToken: string): Promise<GuestBooking> {
    const tenantId = this.tenantContext.getTenantId();
    const booking = await this.prisma.guestBooking.findFirst({
      where: { tenantId, qrToken },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }
}
