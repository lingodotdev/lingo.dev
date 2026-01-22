"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { dictionary, locales, Locale } from '@/data/locales';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof dictionary['en-US'];
  dir: string;
  meta: typeof dictionary['en-US']['meta'];
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en-US');

  // Fallback to en-US if something breaks, though types are safe
  const t = (dictionary[locale] || dictionary['en-US']) as typeof dictionary['en-US'];
  
  // Update document direction and lang attribute slightly after render for a client-side feel
  useEffect(() => {
    // This is optional since we'll wrap the inner content, but good practice
    // document.documentElement.dir = t.meta.dir; 
    // ^ Avoiding this to keep the "Playground" contained within its box usually, 
    // but for a full app you'd do this.
  }, [t.meta.dir]);

  return (
    <I18nContext.Provider value={{ 
        locale, 
        setLocale, 
        t,
        dir: t.meta.dir,
        meta: t.meta
    }}>
      <div dir={t.meta.dir} className="w-full min-h-screen transition-all duration-300">
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
