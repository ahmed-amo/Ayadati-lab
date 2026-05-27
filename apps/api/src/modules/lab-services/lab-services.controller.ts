import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LabServicesService } from './lab-services.service';

@ApiTags('lab-services')
@Controller('public/lab-services')
export class LabServicesController {
  constructor(private readonly labServicesService: LabServicesService) {}

  @Get()
  @ApiOperation({ summary: 'List active lab services for booking form' })
  list() {
    return this.labServicesService.findActive();
  }
}
