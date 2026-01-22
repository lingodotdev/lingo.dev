"use client";

import { useLanguage } from "./provider";

export function useTranslation() {
  const { t, locale, setLocale, isLoading, isTranslating } = useLanguage();
  return { t, locale, setLocale, isLoading, isTranslating };
}
