import { redirect } from 'next/navigation';

export default async function LegacyAdminRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/l/demo-lab/admin`);
}
