"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslationContext } from "./TranslationContext";

/**
 * Translation function type
 */
export type TranslationFunction = (hash: string, source: string) => string;

/**
 * useTranslation Hook
 *
 * Returns a translation function `t(hash)` that:
 * - Returns original text for source locale
 * - Returns translated text for target locales
 * - Automatically requests missing translations
 * - Falls back to source text while loading
 *
 * This hook is automatically injected by the Babel plugin.
 * You typically don't need to call it manually.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * export function Welcome() {
 *   const t = useTranslation();
 *
 *   return (
 *     <div>
 *       <h1>{t('hash_abc123')}</h1>
 *       <p>{t('hash_def456')}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTranslation(): TranslationFunction {
  const { translations, requestTranslation } = useTranslationContext();
  const [translatingHash, startTranslation] = useState<string | null>(null);

  useEffect(() => {
    if (translatingHash) {
      requestTranslation(translatingHash);
    }
  }, [startTranslation]);

  /**
   * Translation function
   */
  const t = useCallback(
    (hash: string, source: string): string => {
      // For target locales, check translations cache
      if (translations[hash]) {
        return translations[hash];
      }

      if (!translatingHash) {
        startTranslation(hash);
      }

      // No metadata entry found, return hash
      console.warn(`[useTranslation] Unknown hash: ${hash}`);
      return source;
    },
    [translations, requestTranslation, startTranslation, translatingHash],
  );

  return t;
}

/**
 * Hook variant that returns translation function and loading state
 *
 * @example
 * ```tsx
 * const { t, isLoading } = useTranslationWithStatus();
 *
 * if (isLoading) {
 *   return <LoadingSpinner />;
 * }
 *
 * return <h1>{t('hash_abc')}</h1>;
 * ```
 */
export function useTranslationWithStatus() {
  const context = useTranslationContext();
  const t = useTranslation();

  return {
    t,
    isLoading: context.isLoading,
    locale: context.locale,
    setLocale: context.setLocale,
  };
}
