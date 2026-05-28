'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { navForRole, type AppRole } from '@/lib/nav-config';
import { useTenant } from '@/lib/tenant-context';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ROLE_LABEL: Record<AppRole, string> = {
  admin: 'Admin',
  auditor: 'Auditor',
  nurse: 'Nurse',
  receptionist: 'Receptionist',
  patient: 'Patient',
};

interface AppShellProps {
  children: React.ReactNode;
  role: AppRole;
  title?: string;
}

export function AppShell({ children, role, title }: AppShellProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { tenantSlug, tenant } = useTenant();
  const sections = navForRole(locale, tenantSlug, role);
  const isRtl = locale === 'ar';

  return (
    <div className="flex min-h-screen bg-gray-light">
      <aside
        className={cn(
          'fixed inset-y-0 z-40 w-64 bg-brand-navy text-white transition-transform md:translate-x-0',
          isRtl ? 'right-0' : 'left-0',
          mobileOpen ? 'translate-x-0' : isRtl ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-teal text-sm font-bold text-brand-navy">
            A
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">
              {tenant?.name ?? 'AYADATI LAB'}
            </p>
            <p className="text-xs text-brand-teal">{ROLE_LABEL[role]}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-4">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          active
                            ? 'bg-brand-blue text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs text-white/60">{user?.fullName}</p>
          <p className="truncate text-xs text-white/40">{user?.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('logout')}
          </Button>
        </div>
      </aside>

      <div
        className={cn(
          'flex min-h-screen flex-1 flex-col md:ml-64',
          isRtl && 'md:mr-64 md:ml-0',
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-mid bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 text-brand-navy" />
            </button>
            {title && (
              <h1 className="text-lg font-semibold text-brand-navy">{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/booking`}
              className="hidden text-sm text-brand-blue hover:underline sm:inline"
            >
              {t('book')}
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
