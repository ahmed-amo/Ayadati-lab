import { Module } from '@nestjs/common';
import { GuestBookingsController } from './guest-bookings.controller';
import { GuestBookingsService } from './guest-bookings.service';
import { CreateGuestBookingUseCase } from './use-cases/create-guest-booking.use-case';

@Module({
  controllers: [GuestBookingsController],
  providers: [GuestBookingsService, CreateGuestBookingUseCase],
  exports: [GuestBookingsService],
})
export class GuestBookingsModule {}
