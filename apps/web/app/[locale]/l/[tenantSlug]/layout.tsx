import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchTenantProfile } from '@/lib/api';
import { TenantProvider } from '@/lib/tenant-context';

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; tenantSlug: string }>;
}) {
  const { locale, tenantSlug } = await params;
  setRequestLocale(locale);

  let tenant = null;
  try {
    tenant = await fetchTenantProfile(tenantSlug);
  } catch {
    notFound();
  }

  return (
    <TenantProvider tenantSlug={tenantSlug} tenant={tenant}>
      {children}
    </TenantProvider>
  );
}
