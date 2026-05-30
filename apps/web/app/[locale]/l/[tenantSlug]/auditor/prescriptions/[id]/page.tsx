'use client';

import { use } from 'react';
import { PrescriptionBuilder } from '@/components/prescriptions/prescription-builder';

export default function EditPrescriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <PrescriptionBuilder prescriptionId={parseInt(id, 10)} />;
}
