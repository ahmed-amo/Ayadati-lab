import { getTranslations } from 'next-intl/server';

export async function PublicFooter() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-mid bg-brand-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-xl font-bold">
            AYADATI <span className="text-brand-teal">LAB</span>
          </p>
          <p className="mt-2 text-sm text-white/70">{t('address')}</p>
        </div>
        <div className="text-sm text-white/80">
          <p>{t('email')}</p>
          <p className="mt-1">{t('phone')}</p>
        </div>
        <div className="text-sm text-white/60 md:text-end">
          {t('rights', { year })}
        </div>
      </div>
    </footer>
  );
}
