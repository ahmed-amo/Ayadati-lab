'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Building2, Layers, Shield } from 'lucide-react';

export function PlatformHeroSection() {
  const locale = useLocale();
  const t = useTranslations('platform');

  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-32">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-wider">
          {t('badge')}
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/85">{t('subtitle')}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="bg-teal-500 text-white hover:bg-teal-600"
          >
            <Link href={`/${locale}/register`}>{t('ctaRegister')}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={`/${locale}/l/demo-lab`}>{t('ctaDemo')}</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Building2, title: t('feat1Title'), desc: t('feat1Desc') },
            { icon: Layers, title: t('feat2Title'), desc: t('feat2Desc') },
            { icon: Shield, title: t('feat3Title'), desc: t('feat3Desc') },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
            >
              <item.icon className="h-8 w-8 text-brand-teal" />
              <p className="mt-3 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-white/75">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
