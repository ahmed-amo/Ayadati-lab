import { setRequestLocale } from 'next-intl/server';
import { PublicHeader } from '@/components/layouts/PublicHeader';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { ProcessSection } from '@/components/landing/ProcessSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { CtaSection } from '@/components/landing/CtaSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection locale={locale} />
        <ProcessSection />
        <TrustSection />
        <CtaSection />
      </main>
      <PublicFooter />
    </div>
  );
}
