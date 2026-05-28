'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { TenantPublicProfile } from './api';

interface TenantContextValue {
  tenantSlug: string;
  tenant: TenantPublicProfile | null;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({
  tenantSlug,
  tenant,
  children,
}: {
  tenantSlug: string;
  tenant: TenantPublicProfile | null;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ tenantSlug, tenant }),
    [tenantSlug, tenant],
  );
  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return ctx;
}

