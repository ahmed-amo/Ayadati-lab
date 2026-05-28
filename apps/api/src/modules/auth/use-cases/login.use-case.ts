import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TenantContext } from '../../../common/tenant/tenant-context.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from '../dto/login.dto';

export interface LoginResult {
  id: number;
  email: string;
  fullName: string;
  role: string;
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContext,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const tenant = this.tenantContext.getTenant();
    const email = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email,
        },
      },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
    };
  }
}
