'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  guestBookingSchema,
  type GuestBookingFormValues,
} from '@/lib/booking-schema';
import {
  createGuestBooking,
  fetchLabServices,
  type GuestBookingResult,
  type LabServiceDto,
  ApiError,
} from '@/lib/api';
import { useTenant } from '@/lib/tenant-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2 } from 'lucide-react';

function serviceLabel(service: LabServiceDto, locale: string): string {
  if (locale === 'ar') return service.nameAr;
  if (locale === 'en') return service.nameEn;
  return service.nameFr;
}

interface GuestBookingFormProps {
  defaultTestSlug?: string;
}

export function GuestBookingForm({ defaultTestSlug }: GuestBookingFormProps) {
  const t = useTranslations('booking');
  const locale = useLocale();
  const { tenantSlug } = useTenant();
  const [services, setServices] = useState<LabServiceDto[]>([]);
  const [result, setResult] = useState<GuestBookingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestBookingFormValues>({
    resolver: zodResolver(guestBookingSchema),
    defaultValues: {
      testType: defaultTestSlug ?? '',
      preferredTime: '09:00',
      email: '',
      nationalId: '',
      notes: '',
    },
  });

  useEffect(() => {
    void fetchLabServices(tenantSlug)
      .then(setServices)
      .catch(() => setServices([]));
  }, [tenantSlug]);

  const onSubmit = async (values: GuestBookingFormValues) => {
    setError(null);
    try {
      const booking = await createGuestBooking(tenantSlug, {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        nationalId: values.nationalId || undefined,
        appointmentDate: values.appointmentDate,
        preferredTime: values.preferredTime,
        testType: values.testType,
        notes: values.notes || undefined,
      });
      setResult(booking);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('errorGeneric'));
    }
  };

  if (result) {
    return (
      <div className="rounded-2xl border border-brand-teal/40 bg-white p-8 text-center shadow-card">
        <CheckCircle2
          className="mx-auto h-14 w-14 text-brand-teal"
          aria-hidden
        />
        <h2 className="mt-4 text-2xl font-bold text-brand-navy">
          {t('successTitle')}
        </h2>
        <p className="mt-2 text-brand-blue-light">{t('successBody')}</p>
        <p className="mt-6 text-sm text-gray-text">{t('reference')}</p>
        <p className="mt-1 font-mono text-lg font-bold text-brand-navy">
          {result.qrToken}
        </p>
        <p className="mt-4 text-sm text-brand-navy">
          {result.appointmentDate} · {result.preferredTime}
        </p>
        <Button asChild className="mt-8" variant="default">
          <Link href={`/${locale}`}>{t('backHome')}</Link>
        </Button>
      </div>
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-gray-mid bg-white p-6 shadow-card md:p-8"
    >
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('fullName')}</Label>
          <Input id="fullName" {...register('fullName')} />
          {errors.fullName && (
            <p className="text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input id="phone" placeholder="0555123456" {...register('phone')} />
          {errors.phone && (
            <p className="text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" {...register('email')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalId">{t('nationalId')}</Label>
          <Input id="nationalId" {...register('nationalId')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointmentDate">{t('date')}</Label>
          <Input
            id="appointmentDate"
            type="date"
            min={minDate}
            {...register('appointmentDate')}
          />
          {errors.appointmentDate && (
            <p className="text-xs text-red-600">
              {errors.appointmentDate.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredTime">{t('time')}</Label>
          <Input id="preferredTime" type="time" {...register('preferredTime')} />
          {errors.preferredTime && (
            <p className="text-xs text-red-600">
              {errors.preferredTime.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="testType">{t('testType')}</Label>
        <select
          id="testType"
          className="flex h-11 w-full rounded-lg border border-gray-mid bg-white px-4 text-sm text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          {...register('testType')}
        >
          <option value="">{t('selectTest')}</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {serviceLabel(s, locale)}
            </option>
          ))}
        </select>
        {errors.testType && (
          <p className="text-xs text-red-600">{errors.testType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('notes')}</Label>
        <Textarea id="notes" rows={3} {...register('notes')} />
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
