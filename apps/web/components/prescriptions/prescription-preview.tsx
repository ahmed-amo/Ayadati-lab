'use client';

import { forwardRef } from 'react';
import { resolveUploadUrl } from '@/lib/api';
import type { PrescriptionFormValues } from '@/lib/prescription-schema';

interface PrescriptionPreviewProps {
  data: PrescriptionFormValues;
  doctorName?: string;
  className?: string;
}

export const PrescriptionPreview = forwardRef<
  HTMLDivElement,
  PrescriptionPreviewProps
>(function PrescriptionPreview({ data, doctorName, className }, ref) {
  const theme = data.headerTheme;
  const accent = theme.accentColor ?? '#1e3a5f';
  const layout = theme.layout ?? 'classic';
  const logoUrl = resolveUploadUrl(data.logoUrl);
  const signatureUrl = resolveUploadUrl(data.signatureUrl);

  return (
    <div
      ref={ref}
      data-print-area
      className={`mx-auto w-full max-w-[210mm] bg-white p-8 text-gray-900 shadow-sm print:shadow-none ${className ?? ''}`}
      style={{ minHeight: '297mm' }}
    >
      <div
        className={
          layout === 'bordered'
            ? 'rounded-lg border-2 p-6'
            : layout === 'minimal'
              ? 'pb-4'
              : 'pb-6'
        }
        style={{ borderColor: layout === 'bordered' ? accent : undefined }}
      >
        <div className="flex items-center justify-between gap-4">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Clinic logo" className="h-16 w-auto object-contain" />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-gray-100" />
          )}
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold" style={{ color: accent }}>
              {data.clinicNameSnapshot || 'Clinic Name'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Medical Prescription</p>
          </div>
          <div className="w-16" />
        </div>

        {theme.showSeparator !== false && (
          <hr className="my-4" style={{ borderColor: accent, opacity: 0.3 }} />
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Patient:</span>{' '}
          <span className="font-medium">{data.patientName || '—'}</span>
        </div>
        <div>
          <span className="text-gray-500">Date:</span>{' '}
          <span className="font-medium">{data.date || '—'}</span>
        </div>
        <div>
          <span className="text-gray-500">Age:</span>{' '}
          <span className="font-medium">{data.age ?? '—'}</span>
        </div>
        <div>
          <span className="text-gray-500">Gender:</span>{' '}
          <span className="font-medium capitalize">
            {data.gender?.toLowerCase() ?? '—'}
          </span>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="text-lg font-semibold" style={{ color: accent }}>
          ℞ Prescription
        </h3>
      </div>

      {data.items.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No medicines added yet
        </p>
      ) : (
        <ol className="space-y-4">
          {data.items.map((item, index) => (
            <li key={`${item.medicineId}-${index}`} className="border-b border-gray-100 pb-3">
              <p className="font-semibold">
                {index + 1}. {item.medicineName}{' '}
                <span className="font-normal text-gray-500">
                  ({item.dosageForm} {item.strength})
                </span>
              </p>
              <div className="mt-1 grid grid-cols-3 gap-2 text-sm text-gray-600">
                <p>Dosage: {item.dosage || '—'}</p>
                <p>Frequency: {item.frequency || '—'}</p>
                <p>Duration: {item.duration || '—'}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-12 flex items-end justify-end gap-4">
        {signatureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={signatureUrl}
            alt="Doctor signature"
            className="h-16 w-auto object-contain"
          />
        ) : null}
        <div className="text-right">
          <div
            className="mb-1 w-48 border-b border-gray-300"
            style={{ borderColor: accent }}
          />
          <p className="text-sm font-medium">{doctorName ?? 'Doctor'}</p>
        </div>
      </div>
    </div>
  );
});
