'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, Clock, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  tenantSlug?: string;
}

export function HeroSection({ tenantSlug = 'demo-lab' }: HeroSectionProps) {
  const t = useTranslations('hero');
  const locale = useLocale();
  const bookingHref = `/${locale}/l/${tenantSlug}/booking`;

  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:px-6 md:py-28">
        <div>
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
            {t('badge')}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-teal-500 text-white hover:bg-teal-600"
            >
              <Link href={bookingHref}>{t('ctaBook')}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#services">{t('ctaServices')}</a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Activity, label: t('statTests'), value: '12k+' },
            { icon: Clock, label: t('statPatients'), value: '8k+' },
            { icon: ShieldCheck, label: t('statSatisfaction'), value: '98%' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur"
            >
              <stat.icon className="h-8 w-8 text-brand-teal" aria-hidden />
              <p className="mt-4 text-2xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-white/75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
