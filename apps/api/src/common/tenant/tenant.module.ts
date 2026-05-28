import { Global, Module } from '@nestjs/common';
import { TenantContext } from './tenant-context.service';
import { TenantResolverService } from './tenant-resolver.service';
import { TenantInterceptor } from './tenant.interceptor';

@Global()
@Module({
  providers: [TenantContext, TenantResolverService, TenantInterceptor],
  exports: [TenantContext, TenantResolverService, TenantInterceptor],
})
export class TenantModule {}
