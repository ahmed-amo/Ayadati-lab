import { Module } from '@nestjs/common';
import { LabServicesController } from './lab-services.controller';
import { LabServicesService } from './lab-services.service';

@Module({
  controllers: [LabServicesController],
  providers: [LabServicesService],
})
export class LabServicesModule {}
