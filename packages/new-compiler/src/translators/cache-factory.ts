/**
 * Cache factory for creating cache instances from config
 */

import type { LingoConfig, PathConfig } from "../types";
import type { TranslationCache } from "./cache";
import { LocalTranslationCache } from "./local-cache";
import { logger } from "../utils/logger";
import { getCacheDir } from "../utils/path-helpers";

export type CacheConfig = Pick<LingoConfig, "cacheType"> & PathConfig;

/**
 * Create a cache instance based on the config
 *
 * @param config - LingoConfig with cacheType and lingoDir
 * @returns TranslationCache instance
 *
 * @example
 * ```typescript
 * const cache = createCache(config);
 * const translations = await cache.get("de");
 * ```
 */
export function createCache(
  config: CacheConfig,
): TranslationCache {
  switch (config.cacheType) {
    case "local":
      return new LocalTranslationCache(
        {
          cacheDir: getCacheDir(config),
        },
        logger,
      );

    default:
      // This should never happen due to TypeScript types, but provides a safeguard
      throw new Error(
        `Unknown cache type: ${config.cacheType}. Only "local" is currently supported.`,
      );
  }
}
