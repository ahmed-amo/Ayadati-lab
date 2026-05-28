'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  fetchDashboardStats,
  fetchGuestBookings,
  confirmGuestBooking,
  type DashboardStats,
  type GuestBookingRow,
  ApiError,
} from '@/lib/api';
import { useTenant } from '@/lib/tenant-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ReceptionistDashboardPage() {
  const t = useTranslations('dashboard.receptionist');
  const locale = useLocale();
  const { tenantSlug } = useTenant();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<GuestBookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, b] = await Promise.all([
        fetchDashboardStats(tenantSlug),
        fetchGuestBookings(tenantSlug),
      ]);
      setStats(s);
      setBookings(b);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [tenantSlug]);

  const handleConfirm = async (id: number) => {
    try {
      await confirmGuestBooking(tenantSlug, id);
      await load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Error');
    }
  };

  const pending = bookings.filter((b) => b.status === 'PENDING');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-navy">{t('title')}</h2>
        <p className="text-brand-blue-light">{t('subtitle')}</p>
      </div>

      {loading ? (
        <p className="text-gray-text">{t('loading')}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t('pendingBookings'), value: stats?.bookingsPending ?? 0 },
              { label: t('todayAppointments'), value: stats?.appointmentsToday ?? 0 },
              { label: t('totalAppointments'), value: stats?.appointmentsTotal ?? 0 },
              { label: t('patients'), value: stats?.patients ?? 0 },
            ].map((item) => (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-brand-navy">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('pendingRequests')}</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${locale}/receptionist/bookings`}>{t('viewAll')}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <p className="text-sm text-gray-text">{t('noPending')}</p>
              ) : (
                <ul className="divide-y">
                  {pending.slice(0, 5).map((b) => (
                    <li
                      key={b.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-4"
                    >
                      <div>
                        <p className="font-medium text-brand-navy">{b.fullName}</p>
                        <p className="text-sm text-gray-text">
                          {new Date(b.appointmentDate).toLocaleDateString(locale)} ·{' '}
                          {b.preferredTime} · {b.testType}
                        </p>
                        <p className="text-xs text-gray-text">{b.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{b.status}</Badge>
                        <Button size="sm" onClick={() => void handleConfirm(b.id)}>
                          {t('confirm')}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
