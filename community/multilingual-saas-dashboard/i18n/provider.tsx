"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { Locale } from "@/types";
import {
  sourceTranslations,
  defaultLocale,
  locales,
} from "./translations";
import type { TranslationSchema } from "./translations";
import { translateToLocale, getCachedTranslation } from "./lingo-service";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isLoading: boolean;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "saas-dashboard-locale";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof current === "string" ? current : path;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<TranslationSchema>(sourceTranslations);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && locales.includes(stored)) {
        setLocaleState(stored);
        
        const cached = getCachedTranslation(stored);
        if (cached) {
          setTranslations(cached);
        } else if (stored !== defaultLocale) {
          setIsTranslating(true);
          const translated = await translateToLocale(stored);
          setTranslations(translated);
          setIsTranslating(false);
        }
      }
      setIsLoading(false);
    };

    initializeLanguage();
  }, []);

  const setLocale = useCallback(async (newLocale: Locale) => {
    if (newLocale === locale) return;

    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);

    if (newLocale === defaultLocale) {
      setTranslations(sourceTranslations);
      return;
    }

    const cached = getCachedTranslation(newLocale);
    if (cached) {
      setTranslations(cached);
      return;
    }

    setIsTranslating(true);
    const translated = await translateToLocale(newLocale);
    setTranslations(translated);
    setIsTranslating(false);
  }, [locale]);

  const t = useCallback(
    (key: string): string => {
      const translation = getNestedValue(
        translations as unknown as Record<string, unknown>,
        key
      );
      if (translation === key) {
        return getNestedValue(
          sourceTranslations as unknown as Record<string, unknown>,
          key
        );
      }
      return translation;
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isLoading, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
