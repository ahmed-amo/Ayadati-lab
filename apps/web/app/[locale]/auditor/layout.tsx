'use client';

import { LanguageProvider } from '@/lib/language-context';
import { RequireRole } from '@/components/auth/RequireRole';
import { AppShell } from '@/components/layouts/AppShell';

export default function AuditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="auditor">
      <LanguageProvider>
        <AppShell role="auditor">{children}</AppShell>
      </LanguageProvider>
    </RequireRole>
  );
}
