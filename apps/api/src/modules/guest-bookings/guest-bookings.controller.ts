import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGuestBookingDto } from './dto/create-guest-booking.dto';
import { CreateGuestBookingUseCase } from './use-cases/create-guest-booking.use-case';
import { GuestBookingsService } from './guest-bookings.service';

@ApiTags('guest-bookings')
@Controller('public/bookings')
export class GuestBookingsController {
  constructor(
    private readonly createGuestBooking: CreateGuestBookingUseCase,
    private readonly guestBookingsService: GuestBookingsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a guest appointment (no sign-in)' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  create(@Body() dto: CreateGuestBookingDto) {
    return this.createGuestBooking.execute(dto);
  }

  @Get(':qrToken')
  @ApiOperation({ summary: 'Look up booking by QR reference token' })
  findOne(@Param('qrToken') qrToken: string) {
    return this.guestBookingsService.findByQrToken(qrToken);
  }
}
