'use client';

import { LanguageProvider } from '@/lib/language-context';
import { RequireRole } from '@/components/auth/RequireRole';
import { AppShell } from '@/components/layouts/AppShell';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="patient">
      <LanguageProvider>
        <AppShell role="patient">{children}</AppShell>
      </LanguageProvider>
    </RequireRole>
  );
}
