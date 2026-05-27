'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const locales = ['fr', 'ar', 'en'] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-mid bg-white/80 p-1 text-xs font-semibold backdrop-blur">
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            'rounded-md px-2.5 py-1 uppercase transition-colors',
            locale === loc
              ? 'bg-brand-navy text-white'
              : 'text-brand-navy hover:bg-gray-light',
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
