import { redirect } from 'next/navigation';

export default async function LegacyPatientResultsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/l/demo-lab/patient/results`);
}
