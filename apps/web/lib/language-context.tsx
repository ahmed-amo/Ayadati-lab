'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

type Locale = 'fr' | 'ar' | 'en';

interface LanguageContextValue {
  language: Locale;
  setLanguage: (code: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Bridge for AYADATI UI components — maps to next-intl locale switching */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const setLanguage = useCallback(
    (code: Locale) => {
      const segments = pathname.split('/');
      if (segments.length > 1) {
        segments[1] = code;
        router.push(segments.join('/') || `/${code}`);
      }
    },
    [pathname, router],
  );

  const t = useCallback((key: string) => key.replace(/[._]/g, ' '), []);

  const value = useMemo(
    () => ({ language: locale, setLanguage, t }),
    [locale, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
