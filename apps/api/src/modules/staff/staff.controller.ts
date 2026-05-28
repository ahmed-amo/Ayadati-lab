import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantInterceptor } from '../../common/tenant/tenant.interceptor';
import { StaffService } from './staff.service';

@ApiTags('staff')
@Controller('t/:tenantSlug/staff')
@UseInterceptors(TenantInterceptor)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Dashboard statistics for this laboratory' })
  getStats() {
    return this.staffService.getStats();
  }

  @Get('bookings')
  @ApiOperation({ summary: 'List guest booking requests' })
  listBookings() {
    return this.staffService.listGuestBookings();
  }

  @Patch('bookings/:id/confirm')
  @ApiOperation({ summary: 'Confirm a guest booking' })
  confirmBooking(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.confirmGuestBooking(id);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'List appointments' })
  listAppointments() {
    return this.staffService.listAppointments();
  }
}
