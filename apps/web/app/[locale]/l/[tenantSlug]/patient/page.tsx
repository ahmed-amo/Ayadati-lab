'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PatientHomePage() {
  const t = useTranslations('dashboard.patient');
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-navy">{t('title')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('resultsCard')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/${locale}/patient/results`}>{t('viewResults')}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('complaintsCard')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href={`/${locale}/patient/complaints`}>{t('viewComplaints')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
