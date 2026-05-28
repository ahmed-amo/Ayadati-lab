export function tenantBasePath(locale: string, tenantSlug: string): string {
  return `/${locale}/l/${tenantSlug}`;
}
