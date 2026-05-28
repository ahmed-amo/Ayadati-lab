'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-teal text-sm font-bold text-brand-navy">
            A
          </span>
          <span className="text-lg font-bold tracking-tight">
            AYADATI <span className="font-normal text-brand-teal">LAB</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
          <a href="#services" className="hover:text-brand-teal">
            {t('services')}
          </a>
          <a href="#process" className="hover:text-brand-teal">
            {t('process')}
          </a>
          <a href="#about" className="hover:text-brand-teal">
            {t('about')}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="hidden bg-teal-500 text-white hover:bg-teal-600 sm:inline-flex"
          >
            <Link href={`/${locale}/booking`}>{t('book')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
