import { setRequestLocale } from 'next-intl/server';
import { PublicHeader } from '@/components/layouts/PublicHeader';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { PlatformHeroSection } from '@/components/landing/PlatformHeroSection';
import { TrustSection } from '@/components/landing/TrustSection';
import Link from 'next/link';
import { fetchTenants } from '@/lib/api';

export default async function PlatformHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let tenants: Awaited<ReturnType<typeof fetchTenants>> = [];
  try {
    tenants = await fetchTenants();
  } catch {
    tenants = [];
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      <main className="flex-1">
        <PlatformHeroSection />
        <section className="bg-gray-light py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="text-3xl font-bold text-brand-navy">Laboratories on AYADATI</h2>
            <p className="mt-2 text-brand-blue-light">
              Each lab gets its own branded portal, booking, and staff workspace.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tenants.map((lab) => (
                <li key={lab.slug}>
                  <Link
                    href={`/${locale}/l/${lab.slug}`}
                    className="block rounded-2xl border border-gray-mid bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="text-lg font-semibold text-brand-navy">{lab.name}</p>
                    {lab.city && (
                      <p className="mt-1 text-sm text-gray-text">{lab.city}</p>
                    )}
                    <p className="mt-3 font-mono text-xs text-brand-teal">/l/{lab.slug}</p>
                  </Link>
                </li>
              ))}
            </ul>
            {tenants.length === 0 && (
              <p className="mt-8 text-gray-text">
                No labs yet.{' '}
                <Link href={`/${locale}/register`} className="text-brand-blue underline">
                  Register the first one
                </Link>
                {' '}or visit the{' '}
                <Link href={`/${locale}/l/demo-lab`} className="text-brand-blue underline">
                  demo lab
                </Link>
                .
              </p>
            )}
          </div>
        </section>
        <TrustSection />
      </main>
      <PublicFooter />
    </div>
  );
}
