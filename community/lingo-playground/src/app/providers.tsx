"use client";

import { I18nProvider } from '@/lib/I18nContext';
import { ThemeProvider } from '@/lib/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
