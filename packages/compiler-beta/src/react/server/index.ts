/**
 * Server-side translation utilities for React Server Components
 *
 * @module @lingo.dev/_compiler-beta/react/server
 */

import { cookies } from "next/headers";
import type { MetadataSchema } from "../../types";
import type { Translator, TranslatableEntry } from "../../translate/api";

/**
 * Dictionary schema for translation
 */
export interface DictionarySchema {
  version: number;
  locale: string;
  files: Record<
    string,
    {
      entries: Record<string, string>;
    }
  >;
}

/**
 * Get locale from cookies (server-side)
 */
export async function getLocaleFromCookies(
  cookieName = "locale",
  defaultLocale = "en",
): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(cookieName)?.value || defaultLocale;
  } catch {
    return defaultLocale;
  }
}

/**
 * Get server-side translations function
 * This is the async alternative to useTranslation() for Server Components
 *
 * IMPORTANT: The metadata parameter should be an imported JSON file, not loaded from fs
 * Example: import metadata from './app/.lingo/metadata.json'
 *
 * @param options Configuration options (metadata is required)
 * @returns Translation function
 */
export async function getServerTranslations(options: {
  metadata: MetadataSchema;
  locale?: string;
  sourceLocale?: string;
  translator?: Translator<any>;
  translations?: Record<string, string>;
  serverPort?: number | null;
}): Promise<(hash: string) => string> {
  const sourceLocale = options.sourceLocale || "en";
  const metadata = options.metadata;

  // Get locale from cookies if not provided
  const locale = options.locale || (await getLocaleFromCookies());

  // For source locale, return source text directly
  if (locale === sourceLocale) {
    return (hash: string) => {
      if (!metadata?.entries?.[hash]) {
        console.warn(`[lingo.dev] Missing metadata for hash: ${hash}`);
        return hash;
      }
      return metadata.entries[hash].sourceText;
    };
  }

  // For non-source locales, we need translations
  let translations: Record<string, string> = {};

  // Check if serverPort is provided - fetch from translation server
  if (options.serverPort) {
    console.log(
      `[lingo.dev] Fetching translations from server (port ${options.serverPort}) for locale: ${locale}`,
    );
    try {
      const response = await fetch(
        `http://127.0.0.1:${options.serverPort}/translations/${locale}`,
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          `[lingo.dev] Fetched translations for locale: ${locale}`,
          data,
        );

        // Extract translations from dictionary format
        if (data.files) {
          Object.values(data.files || {}).forEach((file: any) => {
            Object.assign(translations, file.entries || {});
          });
        }
      } else {
        console.warn(
          `[lingo.dev] Failed to fetch from server: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error(`[lingo.dev] Error fetching from server:`, error);
    }
  } else if (options.translations) {
    // Check if translations dictionary was provided (from dynamic import)
    console.log(
      `[lingo.dev] Using pre-loaded translations for locale: ${locale}`,
    );
    translations = options.translations;
  } else if (options.translator) {
    // Fallback: use translator if provided
    console.log(`[lingo.dev] Using translator for locale: ${locale}`);

    // Build entries map from metadata
    const entriesMap: Record<string, TranslatableEntry> = {};
    Object.entries(metadata.entries || {}).forEach(([hash, entry]) => {
      entriesMap[hash] = {
        text: entry.sourceText,
        context: entry.context || {},
      };
    });

    try {
      translations = await options.translator.batchTranslate(
        locale,
        entriesMap,
      );
    } catch (translateError) {
      console.error(`[lingo.dev] Translator failed:`, translateError);
    }
  }

  // console.log(`[lingo.dev] Fetched translations for locale: ${locale}`, translations);

  // Return translation function
  return (hash: string) => {
    console.log(`[lingo.dev] Translating hash: ${hash} for locale: ${locale}`);
    // Try to get translation
    if (translations[hash]) {
      return translations[hash];
    }

    // Fallback to source text
    if (metadata?.entries?.[hash]) {
      if (Object.keys(translations).length === 0) {
        // Only warn once if no translations were loaded
        console.warn(
          `[lingo.dev] No translator provided. Using source text for locale: ${locale}`,
        );
      }
      return metadata.entries[hash].sourceText;
    }

    // Last resort: return hash itself
    console.warn(`[lingo.dev] Missing metadata for hash: ${hash}`);
    return hash;
  };
}
