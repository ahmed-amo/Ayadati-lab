'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  const t = useTranslations('cta');
  const locale = useLocale();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-hero-gradient px-8 py-14 text-center text-white shadow-glow md:px-16">
        <h2 className="text-3xl font-bold md:text-4xl">{t('title')}</h2>
        <p className="mx-auto mt-4 max-w-lg text-white/85">{t('subtitle')}</p>
        <Button asChild variant="teal" size="lg" className="mt-8">
          <Link href={`/${locale}/booking`}>{t('button')}</Link>
        </Button>
      </div>
    </section>
  );
}
