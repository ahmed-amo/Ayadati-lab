import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { TenantContext } from '../tenant/tenant-context.service';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContext,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: unknown;
    }>();

    const userIdHeader = request.headers['x-user-id'];
    if (!userIdHeader) {
      throw new UnauthorizedException('Authentication required');
    }

    const userId = parseInt(userIdHeader, 10);
    if (Number.isNaN(userId)) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    const tenantId = this.tenantContext.getTenantId();
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId, deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles?.length) {
      const allowed = new Set(requiredRoles);
      if (user.role === UserRole.SUPER_ADMIN) {
        request.user = user;
        return true;
      }
      if (!allowed.has(user.role)) {
        throw new UnauthorizedException('Insufficient permissions');
      }
    }

    request.user = user;
    return true;
  }
}
