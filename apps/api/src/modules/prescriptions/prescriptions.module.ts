import { Module } from '@nestjs/common';
import { PrescriptionPdfService } from './prescription-pdf.service';
import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';

@Module({
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService, PrescriptionPdfService],
})
export class PrescriptionsModule {}
