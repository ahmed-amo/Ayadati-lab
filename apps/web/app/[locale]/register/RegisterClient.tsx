'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { registerTenant, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterClient() {
  const t = useTranslations('register');
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const result = await registerTenant({
        labName: String(form.get('labName')),
        slug: String(form.get('slug')),
        adminEmail: String(form.get('adminEmail')),
        adminFullName: String(form.get('adminFullName')),
        adminPassword: String(form.get('adminPassword')),
        city: String(form.get('city') || '') || undefined,
        phone: String(form.get('phone') || '') || undefined,
      });
      router.push(`/${locale}/l/${result.tenant.slug}/login`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-3xl font-bold text-brand-navy">{t('title')}</h1>
      <p className="mt-2 text-brand-blue-light">{t('subtitle')}</p>
      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-gray-mid bg-white p-8 shadow-card"
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="labName">{t('labName')}</Label>
          <Input id="labName" name="labName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">{t('slug')}</Label>
          <Input id="slug" name="slug" placeholder="el-amal-lab" required />
          <p className="text-xs text-gray-text">{t('slugHint')}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminFullName">{t('adminName')}</Label>
          <Input id="adminFullName" name="adminFullName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminEmail">{t('adminEmail')}</Label>
          <Input id="adminEmail" name="adminEmail" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminPassword">{t('adminPassword')}</Label>
          <Input
            id="adminPassword"
            name="adminPassword"
            type="password"
            minLength={8}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">{t('city')}</Label>
          <Input id="city" name="city" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('submitting') : t('submit')}
        </Button>
      </form>
    </div>
  );
}
