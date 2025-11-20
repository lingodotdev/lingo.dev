/**
 * Cached translator that checks cache before translating
 */

import { ServerTranslationCache, type ServerCacheConfig } from "./cache-server";
import type { Translator, TranslatableEntry } from "./api";

/**
 * Create a cached version of a translator
 * Wraps any Translator implementation with disk-based caching
 */
export function createCachedTranslator<TConfig>(
  translator: Translator<TConfig>,
  cacheConfig: ServerCacheConfig,
): Translator<TConfig> {
  const cache = new ServerTranslationCache(cacheConfig);

  return {
    config: translator.config,

    async translate(locale: string, entry: TranslatableEntry): Promise<string> {
      // For single translations, we still use the underlying translator
      // (caching individual entries is not efficient)
      return translator.translate(locale, entry);
    },

    async batchTranslate(
      locale: string,
      entriesMap: Record<string, TranslatableEntry>,
    ): Promise<Record<string, string>> {
      // Check if we have cached translations for this locale
      const cached = await cache.getTranslations(locale);

      // If we have all translations cached, return them
      const allHashesInCache = Object.keys(entriesMap).every(
        (hash) => hash in cached,
      );
      if (allHashesInCache && Object.keys(cached).length > 0) {
        console.log(`[lingo.dev] Using cached translations for ${locale}`);
        // Return only the requested hashes
        const result: Record<string, string> = {};
        for (const hash of Object.keys(entriesMap)) {
          result[hash] = cached[hash];
        }
        return result;
      }

      // No complete cache, perform translation
      console.log(`[lingo.dev] Translating to ${locale}...`);
      const translated = await translator.batchTranslate(locale, entriesMap);

      // Cache the result by updating the cache with new translations
      // Merge with existing cache
      const mergedTranslations = { ...cached, ...translated };

      // Convert to DictionarySchema for caching
      const dictionary = {
        version: 0.1,
        locale,
        files: {
          __cache: {
            entries: mergedTranslations,
          },
        },
      };

      await cache.set(locale, dictionary);
      console.log(`[lingo.dev] Cached translations for ${locale}`);

      return translated;
    },
  };
}

/**
 * Export cache utilities for manual cache management
 */
export { ServerTranslationCache };
