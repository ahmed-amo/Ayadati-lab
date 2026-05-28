import { setRequestLocale } from 'next-intl/server';
import { PublicHeader } from '@/components/layouts/PublicHeader';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import RegisterClient from './RegisterClient';

export default async function RegisterLabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-gray-light">
      <PublicHeader />
      <main className="flex-1 py-12">
        <RegisterClient />
      </main>
      <PublicFooter />
    </div>
  );
}
