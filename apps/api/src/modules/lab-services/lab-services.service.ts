import { Injectable } from '@nestjs/common';
import { TenantContext } from '../../common/tenant/tenant-context.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LabServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContext,
  ) {}

  findActive() {
    const tenantId = this.tenantContext.getTenantId();
    return this.prisma.labService.findMany({
      where: { tenantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        slug: true,
        nameFr: true,
        nameAr: true,
        nameEn: true,
        description: true,
      },
    });
  }
}
