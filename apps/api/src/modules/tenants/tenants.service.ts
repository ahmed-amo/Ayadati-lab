import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantPlan, TenantStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { isValidTenantSlug, normalizeTenantSlug } from '../../common/tenant/tenant-slug.util';
import { DEFAULT_LAB_SERVICES } from './default-lab-services';
import { RegisterTenantDto } from './dto/register-tenant.dto';

export interface TenantPublicProfile {
  slug: string;
  name: string;
  nameAr: string | null;
  city: string | null;
  phone: string | null;
  logoUrl: string | null;
  plan: TenantPlan;
  status: TenantStatus;
}

export interface RegisterTenantResult {
  tenant: TenantPublicProfile;
  admin: { email: string; fullName: string; role: string };
  portalUrl: string;
}

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterTenantDto): Promise<RegisterTenantResult> {
    const slug = normalizeTenantSlug(dto.slug);
    if (!isValidTenantSlug(slug)) {
      throw new BadRequestException(
        'Slug must be 3–48 characters: lowercase letters, numbers, hyphens',
      );
    }

    const email = dto.adminEmail.toLowerCase().trim();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const passwordHash = await bcrypt.hash(dto.adminPassword, 10);

    try {
      const tenant = await this.prisma.$transaction(async (tx) => {
        const created = await tx.tenant.create({
          data: {
            slug,
            name: dto.labName.trim(),
            city: dto.city?.trim() || null,
            phone: dto.phone?.trim() || null,
            email,
            status: TenantStatus.TRIAL,
            plan: TenantPlan.STARTER,
            trialEndsAt,
          },
        });

        await tx.labService.createMany({
          data: DEFAULT_LAB_SERVICES.map((s) => ({
            tenantId: created.id,
            ...s,
          })),
        });

        await tx.user.create({
          data: {
            tenantId: created.id,
            email,
            fullName: dto.adminFullName.trim(),
            role: UserRole.ADMIN,
            passwordHash,
          },
        });

        return created;
      });

      return {
        tenant: this.toPublicProfile(tenant),
        admin: { email, fullName: dto.adminFullName.trim(), role: UserRole.ADMIN },
        portalUrl: `/l/${tenant.slug}`,
      };
    } catch (e: unknown) {
      if (
        typeof e === 'object' &&
        e !== null &&
        'code' in e &&
        (e as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('Lab slug or admin email already exists');
      }
      throw e;
    }
  }

  async getPublicProfile(slug: string): Promise<TenantPublicProfile> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: slug.toLowerCase().trim() },
    });
    if (!tenant || tenant.status === TenantStatus.SUSPENDED) {
      throw new NotFoundException('Laboratory not found');
    }
    return this.toPublicProfile(tenant);
  }

  listActiveTenants() {
    return this.prisma.tenant.findMany({
      where: { status: { in: [TenantStatus.ACTIVE, TenantStatus.TRIAL] } },
      orderBy: { createdAt: 'desc' },
      select: {
        slug: true,
        name: true,
        nameAr: true,
        city: true,
        plan: true,
        status: true,
      },
    });
  }

  private toPublicProfile(tenant: {
    slug: string;
    name: string;
    nameAr: string | null;
    city: string | null;
    phone: string | null;
    logoUrl: string | null;
    plan: TenantPlan;
    status: TenantStatus;
  }): TenantPublicProfile {
    return {
      slug: tenant.slug,
      name: tenant.name,
      nameAr: tenant.nameAr,
      city: tenant.city,
      phone: tenant.phone,
      logoUrl: tenant.logoUrl,
      plan: tenant.plan,
      status: tenant.status,
    };
  }
}
