'use client';

import { useRouter } from 'next/navigation';
import { LingoProvider, useLingoContext } from '@lingo.dev/compiler/react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useEffect, useState } from 'react';

function LocaleSync({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLingoContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('lingolaunch_locale');
    const validLocales = ['en', 'es', 'de', 'fr', 'hi'];
    if (savedLocale && validLocales.includes(savedLocale) && savedLocale !== locale) {
      setLocale(savedLocale as any);
    }
  }, []);

  useEffect(() => {
    if (mounted && locale) {
      localStorage.setItem('lingolaunch_locale', locale);
    }
  }, [locale, mounted]);

  if (!mounted) {
    return null; // or a loading spinner to prevent hydration mismatch/flash
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <LingoProvider router={router}>
      <LocaleSync>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </LocaleSync>
    </LingoProvider>
  );
}
