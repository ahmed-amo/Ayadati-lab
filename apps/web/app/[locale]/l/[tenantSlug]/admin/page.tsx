'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { fetchDashboardStats, type DashboardStats } from '@/lib/api';
import { useTenant } from '@/lib/tenant-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const t = useTranslations('dashboard.admin');
  const { tenantSlug } = useTenant();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    void fetchDashboardStats(tenantSlug).then(setStats);
  }, [tenantSlug]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-navy">{t('title')}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t('pendingBookings'), value: stats?.bookingsPending ?? '—' },
          { label: t('todayAppointments'), value: stats?.appointmentsToday ?? '—' },
          { label: t('totalAppointments'), value: stats?.appointmentsTotal ?? '—' },
          { label: t('patients'), value: stats?.patients ?? '—' },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
