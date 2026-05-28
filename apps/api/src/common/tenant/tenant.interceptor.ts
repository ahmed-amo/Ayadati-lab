import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';
import { TenantContext } from './tenant-context.service';
import { TenantResolverService } from './tenant-resolver.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    private readonly tenantContext: TenantContext,
    private readonly tenantResolver: TenantResolverService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ params?: { tenantSlug?: string } }>();
    const slug = request.params?.tenantSlug;

    if (!slug) {
      return next.handle();
    }

    return from(this.tenantResolver.resolveBySlug(slug)).pipe(
      switchMap((tenant) => {
        this.tenantContext.setTenant(tenant);
        return next.handle();
      }),
    );
  }
}
