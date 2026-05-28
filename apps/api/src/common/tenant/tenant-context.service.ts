import { Injectable, Scope } from '@nestjs/common';
import type { Tenant } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private tenant: Tenant | null = null;

  setTenant(tenant: Tenant): void {
    this.tenant = tenant;
  }

  getTenant(): Tenant {
    if (!this.tenant) {
      throw new Error('Tenant context is not set for this request');
    }
    return this.tenant;
  }

  getTenantId(): string {
    return this.getTenant().id;
  }

  tryGetTenant(): Tenant | null {
    return this.tenant;
  }
}
