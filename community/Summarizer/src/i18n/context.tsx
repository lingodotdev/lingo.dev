'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enMessages from './en.json';
import esMessages from './es.json';
import frMessages from './fr.json';
import deMessages from './de.json';
import jaMessages from './ja.json';

const messages: { [key:string]: any } = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  ja: jaMessages,
};

const get = (obj: any, path: string, defaultValue: any = undefined): any => {
    const pathArray = path.split('.');
    let current = obj;
    for (let i = 0; i < pathArray.length; i++) {
        if (current === null || current === undefined) {
            return defaultValue;
        }
        current = current[pathArray[i]];
    }
    return current === undefined ? defaultValue : current;
};

type LocalizationContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, defaultText?: string) => string;
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState('en');
  
  useEffect(() => {
    const browserLocale = navigator.language.split('-')[0];
    if (messages[browserLocale]) {
      setLocale(browserLocale);
    }
  }, []);

  const t = (key: string, defaultText?: string): string => {
    const translations = messages[locale] || messages['en'];
    const translation = get(translations, key, defaultText || key);
    return translation;
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
