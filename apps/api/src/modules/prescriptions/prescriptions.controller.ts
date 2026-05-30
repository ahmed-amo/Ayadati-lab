import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole, type User } from '@prisma/client';
import type { Response } from 'express';
import { AuthUser } from '../../common/auth/auth-user.decorator';
import { Roles } from '../../common/auth/roles.decorator';
import { TenantInterceptor } from '../../common/tenant/tenant.interceptor';
import {
  CreatePrescriptionDto,
  PatientSearchQueryDto,
  UpdatePrescriptionDto,
} from './dto/prescription.dto';
import { PrescriptionPdfService } from './prescription-pdf.service';
import { PrescriptionsService } from './prescriptions.service';

@ApiTags('prescriptions')
@Controller('t/:tenantSlug/prescriptions')
@UseInterceptors(TenantInterceptor)
@Roles(UserRole.AUDITOR, UserRole.ADMIN)
export class PrescriptionsController {
  constructor(
    private readonly prescriptionsService: PrescriptionsService,
    private readonly pdfService: PrescriptionPdfService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List prescriptions for this tenant' })
  list(@AuthUser() user: User) {
    const doctorId = user.role === UserRole.AUDITOR ? user.id : undefined;
    return this.prescriptionsService.findAll(doctorId);
  }

  @Get('patients/search')
  @ApiOperation({ summary: 'Autocomplete patient history' })
  searchPatients(@Query() query: PatientSearchQueryDto) {
    return this.prescriptionsService.searchPatients(query.q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.findOne(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Export prescription as PDF' })
  async exportPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const prescription = await this.prescriptionsService.findOne(id);
    const buffer = await this.pdfService.generate(prescription);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="prescription-${id}.pdf"`,
    );
    res.send(buffer);
  }

  @Post()
  @ApiOperation({ summary: 'Create a prescription' })
  create(@AuthUser() user: User, @Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(user, dto);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a previous prescription as draft' })
  duplicate(@AuthUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.duplicate(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a prescription or save draft' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(id, dto);
  }
}
