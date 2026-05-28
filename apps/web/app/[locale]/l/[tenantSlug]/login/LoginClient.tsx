'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { homeForRole, type AppRole } from '@/lib/nav-config';
import { useTenant } from '@/lib/tenant-context';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

function mapRole(apiRole: string): AppRole {
  const r = apiRole.toLowerCase();
  if (r === 'admin') return 'admin';
  if (r === 'auditor') return 'auditor';
  if (r === 'nurse') return 'nurse';
  if (r === 'receptionist') return 'receptionist';
  return 'patient';
}

export default function LoginClient() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { tenantSlug, tenant } = useTenant();
  const [email, setEmail] = useState('receptionist@ayadatilab.dz');
  const [password, setPassword] = useState('ayadati2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(tenantSlug, email, password);
      const next = searchParams.get('next');
      if (next) {
        router.push(next);
      } else {
        const user = JSON.parse(localStorage.getItem('ayadati_auth') ?? '{}') as {
          role: string;
          tenantSlug: string;
        };
        router.push(
          homeForRole(locale, user.tenantSlug ?? tenantSlug, mapRole(user.role)),
        );
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-hero-gradient">
      <header className="flex justify-end p-4">
        <LanguageSwitcher />
      </header>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-mid bg-white p-8 shadow-card">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal text-lg font-bold text-brand-navy">
              A
            </div>
            <h1 className="text-2xl font-bold text-brand-navy">
              {tenant?.name ?? 'AYADATI LAB'}
            </h1>
            <p className="mt-2 text-sm text-brand-blue-light">{t('subtitle')}</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('submitting') : t('submit')}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-text">
            <Link
              href={`/${locale}/l/${tenantSlug}`}
              className="text-brand-blue hover:underline"
            >
              {t('backHome')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
