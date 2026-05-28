'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { fetchAppointments, type AppointmentRow } from '@/lib/api';
import { useTenant } from '@/lib/tenant-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ReceptionistAppointmentsPage() {
  const t = useTranslations('dashboard.receptionist');
  const locale = useLocale();
  const { tenantSlug } = useTenant();
  const [rows, setRows] = useState<AppointmentRow[]>([]);

  useEffect(() => {
    void fetchAppointments(tenantSlug).then(setRows).catch(() => setRows([]));
  }, [tenantSlug]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-navy">{t('appointmentsTitle')}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t('appointmentsList')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {rows.map((a) => (
              <li key={a.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">
                    {a.guestBooking?.fullName ??
                      a.patient?.user?.fullName ??
                      `#${a.id}`}
                  </p>
                  <Badge>{a.status}</Badge>
                </div>
                <p className="text-sm text-gray-text">
                  {new Date(a.appointmentDate).toLocaleDateString(locale)} ·{' '}
                  {a.guestBooking?.preferredTime ?? '—'} · {a.testType}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
