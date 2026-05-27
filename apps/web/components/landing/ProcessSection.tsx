'use client';

import { useTranslations } from 'next-intl';
import { CalendarCheck, MapPin, FileCheck2 } from 'lucide-react';

export function ProcessSection() {
  const t = useTranslations('process');

  const steps = [
    { icon: CalendarCheck, title: t('step1Title'), desc: t('step1Desc') },
    { icon: MapPin, title: t('step2Title'), desc: t('step2Desc') },
    { icon: FileCheck2, title: t('step3Title'), desc: t('step3Desc') },
  ];

  return (
    <section id="process" className="py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold text-brand-navy md:text-4xl">
          {t('title')}
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white">
                <step.icon className="h-7 w-7" aria-hidden />
              </div>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-brand-teal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-brand-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-blue-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
