'use client';

import { LanguageProvider } from '@/lib/language-context';
import { RequireRole } from '@/components/auth/RequireRole';
import { AppShell } from '@/components/layouts/AppShell';

export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="receptionist">
      <LanguageProvider>
        <AppShell role="receptionist">{children}</AppShell>
      </LanguageProvider>
    </RequireRole>
  );
}
