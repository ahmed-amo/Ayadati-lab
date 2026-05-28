import { setRequestLocale } from 'next-intl/server';
import { PublicHeader } from '@/components/layouts/PublicHeader';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { ProcessSection } from '@/components/landing/ProcessSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { CtaSection } from '@/components/landing/CtaSection';

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ locale: string; tenantSlug: string }>;
}) {
  const { locale, tenantSlug } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader tenantSlug={tenantSlug} />
      <main className="flex-1">
        <HeroSection tenantSlug={tenantSlug} />
        <ServicesSection locale={locale} tenantSlug={tenantSlug} />
        <ProcessSection />
        <TrustSection />
        <CtaSection tenantSlug={tenantSlug} />
      </main>
      <PublicFooter />
    </div>
  );
}
