'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import {
  fetchGuestBookings,
  confirmGuestBooking,
  type GuestBookingRow,
  ApiError,
} from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ReceptionistBookingsPage() {
  const t = useTranslations('dashboard.receptionist');
  const locale = useLocale();
  const [bookings, setBookings] = useState<GuestBookingRow[]>([]);

  const load = () =>
    fetchGuestBookings()
      .then(setBookings)
      .catch(() => setBookings([]));

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-navy">{t('allBookings')}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t('bookingsList')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div>
                  <p className="font-medium">{b.fullName}</p>
                  <p className="text-sm text-gray-text">
                    {new Date(b.appointmentDate).toLocaleDateString(locale)} ·{' '}
                    {b.preferredTime} · {b.testType}
                  </p>
                  <p className="font-mono text-xs text-brand-teal">{b.qrToken}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{b.status}</Badge>
                  {b.status === 'PENDING' && (
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await confirmGuestBooking(b.id);
                          await load();
                        } catch (e) {
                          alert(e instanceof ApiError ? e.message : 'Error');
                        }
                      }}
                    >
                      {t('confirm')}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
