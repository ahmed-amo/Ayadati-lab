import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { memoryStorage } from 'multer';
import { Roles } from '../../common/auth/roles.decorator';
import { TenantInterceptor } from '../../common/tenant/tenant.interceptor';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@Controller('t/:tenantSlug/uploads')
@UseInterceptors(TenantInterceptor)
@Roles(UserRole.ADMIN, UserRole.AUDITOR)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('logo')
  @ApiOperation({ summary: 'Upload clinic logo for prescription header' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  uploadLogo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.saveImage(file, 'logo');
  }

  @Post('signature')
  @ApiOperation({ summary: 'Upload doctor signature image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  uploadSignature(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.saveImage(file, 'signature');
  }
}
