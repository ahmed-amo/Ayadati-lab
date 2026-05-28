import { Injectable, NotFoundException } from '@nestjs/common';
import { Tenant, TenantStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveBySlug(slug: string): Promise<Tenant> {
    const normalized = slug.toLowerCase().trim();
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: normalized },
    });

    if (!tenant) {
      throw new NotFoundException('Laboratory not found');
    }

    if (tenant.status === TenantStatus.SUSPENDED) {
      throw new NotFoundException('This laboratory account is suspended');
    }

    return tenant;
  }

  async isSlugAvailable(slug: string): Promise<boolean> {
    const normalized = slug.toLowerCase().trim();
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: normalized },
      select: { id: true },
    });
    return !existing;
  }
}
