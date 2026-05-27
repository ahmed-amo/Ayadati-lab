'use client';

import { LanguageProvider } from '@/lib/language-context';
import { RequireRole } from '@/components/auth/RequireRole';
import { AppShell } from '@/components/layouts/AppShell';

export default function NurseLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="nurse">
      <LanguageProvider>
        <AppShell role="nurse">{children}</AppShell>
      </LanguageProvider>
    </RequireRole>
  );
}
