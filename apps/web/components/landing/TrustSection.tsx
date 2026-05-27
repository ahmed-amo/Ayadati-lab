'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

export function TrustSection() {
  const t = useTranslations('trust');

  const items = [t('item1'), t('item2'), t('item3'), t('item4')];

  return (
    <section id="about" className="bg-brand-navy py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-3xl font-bold md:text-4xl">{t('title')}</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal"
                aria-hidden
              />
              <span className="text-white/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
