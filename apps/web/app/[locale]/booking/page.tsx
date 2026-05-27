import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PublicHeader } from '@/components/layouts/PublicHeader';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { GuestBookingForm } from '@/components/booking/GuestBookingForm';

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ test?: string }>;
}) {
  const { locale } = await params;
  const { test } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('booking');

  return (
    <div className="flex min-h-screen flex-col bg-gray-light">
      <PublicHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-brand-navy md:text-4xl">
              {t('title')}
            </h1>
            <p className="mt-3 text-brand-blue-light">{t('subtitle')}</p>
          </div>
          <GuestBookingForm defaultTestSlug={test} />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
