'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

type Language = 'en' | 'fr' | 'ar';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR' },
];

export function LanguageSwitcher() {
  const [mounted, setMounted] = React.useState(false);
  const [language, setLanguage] = React.useState<Language>('en');

  React.useEffect(() => {
    setMounted(true);
    // Get stored language or detect from document
    const stored = localStorage.getItem('language') as Language;
    const htmlLang = document.documentElement.lang as Language;
    setLanguage(stored || htmlLang || 'en');
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-surface rounded-lg border border-border">
      {languages.map((lang) => (
        <motion.div
          key={lang.code}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={language === lang.code ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleLanguageChange(lang.code)}
            className={`h-8 px-3 text-xs font-medium transition-colors ${
              language === lang.code
                ? 'bg-accent text-accent-foreground'
                : 'text-foreground hover:bg-elevated'
            }`}
          >
            {lang.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
