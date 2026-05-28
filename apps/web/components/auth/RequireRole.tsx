'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import type { AppRole } from '@/lib/nav-config';
import { homeForRole } from '@/lib/nav-config';
import { useTenant } from '@/lib/tenant-context';

interface RequireRoleProps {
  role: AppRole;
  children: React.ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, role: userRole, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const { tenantSlug } = useTenant();

  useEffect(() => {
    if (isLoading) return;
    const loginPath = `/${locale}/l/${tenantSlug}/login`;

    if (!user || !userRole) {
      router.replace(`${loginPath}?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.tenantSlug !== tenantSlug) {
      router.replace(homeForRole(locale, user.tenantSlug, userRole));
      return;
    }

    if (userRole !== role && userRole !== 'admin') {
      router.replace(homeForRole(locale, tenantSlug, userRole));
    }
  }, [isLoading, user, userRole, role, router, locale, pathname, tenantSlug]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-light">
        <p className="text-brand-blue-light">Loading…</p>
      </div>
    );
  }

  if (user.tenantSlug !== tenantSlug) {
    return null;
  }

  if (userRole !== role && userRole !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
