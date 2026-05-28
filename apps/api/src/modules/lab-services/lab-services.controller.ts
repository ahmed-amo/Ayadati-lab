import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantInterceptor } from '../../common/tenant/tenant.interceptor';
import { LabServicesService } from './lab-services.service';

@ApiTags('lab-services')
@Controller('t/:tenantSlug/public/lab-services')
@UseInterceptors(TenantInterceptor)
export class LabServicesController {
  constructor(private readonly labServicesService: LabServicesService) {}

  @Get()
  @ApiOperation({ summary: 'List active lab services for a tenant' })
  list() {
    return this.labServicesService.findActive();
  }
}
