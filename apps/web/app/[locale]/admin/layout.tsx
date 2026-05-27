'use client';

import { RequireRole } from '@/components/auth/RequireRole';
import { AppShell } from '@/components/layouts/AppShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="admin">
      <AppShell role="admin">{children}</AppShell>
    </RequireRole>
  );
}
