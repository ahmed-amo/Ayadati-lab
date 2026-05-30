import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { TenantContext } from '../../common/tenant/tenant-context.service';

export type UploadKind = 'logo' | 'signature';

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

@Injectable()
export class UploadsService {
  private readonly uploadRoot: string;

  constructor(
    private readonly tenantContext: TenantContext,
    private readonly config: ConfigService,
  ) {
    this.uploadRoot =
      this.config.get<string>('app.uploadDir') ??
      join(process.cwd(), 'uploads');
  }

  async saveImage(
    file: Express.Multer.File,
    kind: UploadKind,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException('Only PNG, JPEG, WebP, and GIF are allowed');
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('File must be under 2MB');
    }

    const tenantId = this.tenantContext.getTenantId();
    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? 'png';
    const filename = `${kind}-${randomUUID()}.${ext}`;
    const dir = join(this.uploadRoot, tenantId);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), file.buffer);

    const apiPrefix = this.config.get<string>('app.apiPrefix', 'api/v1');
    return {
      url: `/${apiPrefix}/uploads/${tenantId}/${filename}`,
    };
  }
}
