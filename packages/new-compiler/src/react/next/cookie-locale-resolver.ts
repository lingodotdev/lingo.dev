/**
 * Next.js-specific locale resolver
 * Reads locale from Next.js cookies
 *
 * This resolver ONLY handles locale resolution - it does NOT fetch translations.
 * Translation fetching is handled by the core translation service (server/translations.ts)
 */
import type { CookieConfig } from "../../types";
import { cookies } from "next/headers";
import { logger } from "../../utils/logger";
import type { LocaleCode } from "lingo.dev/spec";

/**
 * Configuration for Next.js locale resolver
 */
interface NextLocaleResolverConfig {
  /**
   * Cookie configuration (name and maxAge)
   * @default { name: 'locale', maxAge: 31536000 }
   */
  cookieConfig: CookieConfig;

  /**
   * Default locale if cookie is not set
   * @default 'en'
   */
  defaultLocale: LocaleCode;
}

/**
 * Create Next.js locale resolver
 *
 * This resolver reads the locale from Next.js cookies.
 * It does NOT fetch translations - that's handled separately by the core translation service.
 *
 * @param config - Configuration options
 * @returns Locale resolver function
 */
export function createNextCookieLocaleResolver(
  config: NextLocaleResolverConfig,
): () => Promise<string> {
  const cookieName = config.cookieConfig.name;
  const defaultLocale = config.defaultLocale;

  return async () => {
    try {
      const cookieStore = await cookies();
      return cookieStore.get(cookieName)?.value || defaultLocale;
    } catch (error) {
      // Fallback on error (e.g., not in Next.js environment, or cookies() failed)
      if (process.env.DEBUG) {
        logger.error(`Error reading locale from Next.js cookies: ${error}\n`);
      }
      return defaultLocale;
    }
  };
}
