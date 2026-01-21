import type { ReactNode } from "react";
import { use } from "react";
import { getServerLocale } from "@lingo.dev/compiler/virtual/locale/server";
import { fetchTranslationsOnServer } from "../server-only/translations";
import {
  renderRichText,
  type RichTextParams,
} from "../shared/render-rich-text";
import { logger } from "../../utils/logger";
import type { TranslationHook } from "../types";

// TODO (AleksandrSl 01/12/2025): Should we add back the cache?
const getTranslations = async (hashes: string[]) => {
  // 1. Resolve locale (framework-specific)
  const locale = await getServerLocale();

  // 2. Fetch translations (universal)
  const translations = await fetchTranslationsOnServer(locale, hashes);

  logger.debug(
    `Server. The translations for locale ${locale} are: ${JSON.stringify(translations)}`,
  );

  return {
    locale,
    translations,
  };
};

/**
 * Server-side translation hook
 *
 * Works in Server Components WITHOUT async/await!
 * Uses React's use() hook to unwrap the cached promise.
 *
 * This hook has the SAME signature as the client-side version,
 * making components truly isomorphic.
 *
 * @param hashes - List of translation hashes used in component (injected by compiler)
 * @returns Translation function
 *
 * @example
 * ```tsx
 * // Works in Server Components (no async needed!)
 * export default function ServerPage() {
 *   const t = useTranslation(['hash_abc', 'hash_def']);
 *   return <h1>{t('hash_abc', 'Welcome')}</h1>;
 * }
 *
 * // Also works in Client Components (via conditional exports)
 * 'use client';
 * export default function ClientPage() {
 *   const t = useTranslation(['hash_abc', 'hash_def']);
 *   return <h1>{t('hash_abc', 'Welcome')}</h1>;
 * }
 * ```
 */
export const useTranslation: TranslationHook = (hashes: string[]) => {
  const { locale, translations } = use(getTranslations(hashes));
  logger.debug(
    `Server. The translations for locale ${locale} are: ${JSON.stringify(translations)}`,
  );

  return {
    t: (
      hash: string,
      source: string,
      params?: RichTextParams,
    ): string | ReactNode => {
      const text = translations[hash] || source;

      if (!params) {
        return text;
      }

      return renderRichText(text, params, locale);
    },
    locale,
  };
};
