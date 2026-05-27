import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { fetchLabServices, type LabServiceDto } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { FlaskConical } from 'lucide-react';

function serviceName(service: LabServiceDto, locale: string): string {
  if (locale === 'ar') return service.nameAr;
  if (locale === 'en') return service.nameEn;
  return service.nameFr;
}

export async function ServicesSection({ locale }: { locale: string }) {
  const t = await getTranslations('services');
  let services: LabServiceDto[] = [];
  try {
    services = await fetchLabServices();
  } catch {
    services = [];
  }

  return (
    <section id="services" className="bg-gray-light py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-brand-navy md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-brand-blue-light">{t('subtitle')}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(services.length > 0
            ? services
            : [
                {
                  slug: 'cbc',
                  nameFr: 'NFS / CBC',
                  nameAr: 'تحليل الدم',
                  nameEn: 'CBC',
                  description: null,
                },
              ]
          ).map((service) => (
            <article
              key={service.slug}
              className="flex flex-col rounded-2xl border border-gray-mid bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/20 text-brand-navy">
                <FlaskConical className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-brand-navy">
                {serviceName(service, locale)}
              </h3>
              {service.description && (
                <p className="mt-2 flex-1 text-sm text-gray-text">
                  {service.description}
                </p>
              )}
              <Button asChild className="mt-6 w-full" variant="default">
                <Link
                  href={`/${locale}/booking?test=${service.slug}`}
                >
                  {t('cta')}
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
