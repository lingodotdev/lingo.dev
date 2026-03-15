"use client";

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { logger } from "../../utils/logger";
import type { LingoDevState } from "../../widget/types";
import { fetchTranslations } from "./utils";
import { serverUrl, sourceLocale } from "@lingo.dev/compiler/virtual/config";
import {
  getClientLocale,
  persistLocale,
} from "@lingo.dev/compiler/virtual/locale/client";
import { LingoContext } from "./LingoContext";
import type { LocaleCode } from "lingo.dev/spec";

const noop = () => {};

/**
 * Translation provider props
 */
export type LingoProviderProps = PropsWithChildren<{
  /**
   * Initial locale to use
   */
  initialLocale?: LocaleCode;

  /**
   * Initial translations (pre-loaded)
   */
  initialTranslations?: Record<string, string>;

  /**
   * Optional router instance for Next.js integration
   * If provided, calls router.refresh() after locale change
   * This ensures Server Components re-render with new locale
   */
  router?: { refresh: () => void };

  /**
   * Development widget configuration
   */
  devWidget?: {
    /**
     * Enable/disable widget (default: true in dev mode)
     * Set to false to opt-out
     */
    enabled?: boolean;

    /**
     * Widget position on screen
     * @default 'bottom-left'
     */
    position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  };
}>;

const IS_DEV = process.env.NODE_ENV === "development";
const BATCH_DELAY = 200;

/**
 * Translation Provider Component
 *
 * Wraps your app to provide translation context to all components.
 * Handles locale switching and on-demand translation loading.
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { LingoProvider } from '@lingo.dev/compiler-beta/react';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <LingoProvider initialLocale="en">
 *           {children}
 *         </LingoProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
// Export the appropriate provider directly
export const LingoProvider = IS_DEV ? LingoProvider__Dev : LingoProvider__Prod;

function LingoProvider__Prod({
  initialLocale,
  initialTranslations = {},
  router,
  children,
}: LingoProviderProps) {
  // Use client locale detection if no initialLocale provided
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    if (initialLocale) return initialLocale;
    // Only detect on client-side (not during SSR)
    if (typeof window !== "undefined") {
      return getClientLocale();
    }
    return sourceLocale;
  });
  const [translations, setTranslations] =
    useState<Record<string, string>>(initialTranslations);
  const [isLoading, setIsLoading] = useState(false);

  logger.debug(
    `LingoProvider initialized with locale: ${locale}`,
    initialTranslations,
  );

  /**
   * Update HTML lang attribute when locale changes
   * This ensures screen readers and SEO understand the page language
   */
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  /**
   * Load translations from public/translations/{locale}.json
   * Lazy loads on-demand for SPAs
   */
  const loadTranslations = useCallback(
    async (targetLocale: LocaleCode) => {
      // If we already have initialTranslations (Next.js SSR), don't fetch
      if (Object.keys(initialTranslations).length > 0) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/translations/${targetLocale}.json`);
        if (!response.ok) {
          throw new Error(
            `Failed to load translations for ${targetLocale}: ${response.statusText}`,
          );
        }

        const data = await response.json();
        // Translation files have format: { version, locale, entries: {...} }
        setTranslations(data.entries || data);
        logger.debug(
          `Loaded translations for ${targetLocale}:`,
          Object.keys(data.entries || data).length,
        );
      } catch (error) {
        logger.error(`Failed to load translations for ${targetLocale}:`, error);
        // Fallback to empty translations
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    },
    [initialTranslations],
  );

  // Load translations on mount if not provided via initialTranslations
  useEffect(() => {
    if (Object.keys(initialTranslations).length === 0) {
      loadTranslations(locale);
    }
  }, []); // Only run on mount

  useEffect(() => {
    // TODO (AleksandrSl 08/12/2025): More elegant solution required.
    //  This is used to update the client part when next app changes locale
    if (router) {
      setTranslations(initialTranslations);
    }
  }, [initialTranslations, router]);

  /**
   * Change locale
   * - For Next.js SSR: triggers server re-render via router.refresh()
   * - For SPAs: lazy loads translations from /translations/{locale}.json
   */
  const setLocale = useCallback(
    async (newLocale: LocaleCode) => {
      // 1. Persist to cookie so server can read it on next render
      persistLocale(newLocale);

      // 2. Update local state for immediate UI feedback
      setLocaleState(newLocale);

      // 3a. Next.js pattern: Trigger server re-render
      if (router) {
        router.refresh();
      }
      // 3b. SPA pattern: Lazy load translations
      else {
        await loadTranslations(newLocale);
      }
    },
    [router, loadTranslations],
  );

  return (
    <LingoContext.Provider
      value={{
        locale,
        setLocale,
        translations,
        registerHashes: noop,
        isLoading,
        sourceLocale,
      }}
    >
      {children}
    </LingoContext.Provider>
  );
}

function LingoProvider__Dev({
  initialLocale,
  initialTranslations = {},
  router,
  devWidget,
  children,
}: LingoProviderProps) {
  // Use client locale detection if no initialLocale provided
  const [locale, setLocaleState] = useState(() => {
    if (initialLocale) {
      return initialLocale;
    }
    return getClientLocale();
  });
  const [translations, setTranslations] =
    useState<Record<string, string>>(initialTranslations);
  const [isLoading, setIsLoading] = useState(false);

  const [allSeenHashes, setAllSeenHashes] = useState<Set<string>>(new Set());
  const registeredHashesRef = useRef<Set<string>>(new Set());
  const pendingHashesRef = useRef<Set<string>>(new Set());
  const erroredHashesRef = useRef<Set<string>>(new Set());
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use ref to track translations to avoid stale closures
  const translationsRef = useRef<Record<string, string>>(initialTranslations);
  const localeRef = useRef(locale);

  useEffect(() => {
    translationsRef.current = translations;
  }, [translations]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  /**
   * Update HTML lang attribute when locale changes
   * This ensures screen readers and SEO understand the page language
   */
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  /**
   * Register a hash as being used in a component
   * Called during render - must not trigger state updates immediately
   */
  const registerHashes = useCallback((hashes: string[]) => {
    let wasNew = false;
    hashes.forEach((hash) => {
      wasNew = wasNew || !registeredHashesRef.current.has(hash);
      registeredHashesRef.current.add(hash);
    });

    logger.debug(
      `Registering hashes: ${hashes.join(", ")}. Registered hashes: ${registeredHashesRef.current.values()}. wasNew: ${wasNew}`,
    );

    // Schedule a state update for the next tick to track all hashes
    if (wasNew) {
      setAllSeenHashes((prev) => {
        const next = prev.union(new Set(hashes));
        // TODO (AleksandrSl 25/11/2025): Should be a cheaper solution
        logger.debug(`New allSeenHashes: ${[...next.values()]}`);
        return next;
      });
    }
  }, []);

  /**
   * Check for missing translations and request them (batched)
   * This runs when allSeenHashes changes (hot reload or new components mount)
   */
  useEffect(() => {
    logger.debug(
      `LingoProvider checking translations for locale ${locale}, seen hashes: ${allSeenHashes.size}`,
    );

    // Find hashes that are seen but not translated and not already pending
    const missingHashes: string[] = [];
    logger.debug(
      "allSeenHashes: ",
      [...allSeenHashes.values()],
      [...pendingHashesRef.current.values()],
    );
    for (const hash of allSeenHashes) {
      if (
        !translations[hash] &&
        !pendingHashesRef.current.has(hash) &&
        !erroredHashesRef.current.has(hash)
      ) {
        missingHashes.push(hash);
        pendingHashesRef.current.add(hash);
      }
    }
    logger.debug("Missing hashes: ", missingHashes.join(","));

    // If no missing hashes, nothing to do
    if (missingHashes.length === 0 && localeRef.current == locale) return;

    logger.debug(
      `Requesting translations for ${missingHashes.length} hashes in locale ${locale}`,
    );

    // Cancel existing timer
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
    }

    // Batch the request
    batchTimerRef.current = setTimeout(async () => {
      const hashesToFetch = Array.from(pendingHashesRef.current);
      pendingHashesRef.current.clear();

      logger.debug(`Fetching translations for ${hashesToFetch.length} hashes`);
      if (hashesToFetch.length === 0) return;

      setIsLoading(true);
      try {
        const newTranslations = await fetchTranslations(
          localeRef.current,
          hashesToFetch,
          serverUrl,
        );

        logger.debug(
          `Fetched translations for ${hashesToFetch.length} hashes:`,
          newTranslations,
        );

        const receivedHashes = new Set(Object.keys(newTranslations));
        const missingHashes = hashesToFetch.filter(
          (hash) => !receivedHashes.has(hash),
        );

        if (missingHashes.length > 0) {
          logger.warn(
            `Server did not return translations for ${missingHashes.length} hashes: ${missingHashes.join(", ")}`,
          );
          for (const hash of missingHashes) {
            erroredHashesRef.current.add(hash);
          }
        }

        setTranslations((prev) => ({ ...prev, ...newTranslations }));
        for (const hash of hashesToFetch) {
          registeredHashesRef.current.add(hash);
        }
      } catch (error) {
        logger.warn(
          `Failed to fetch translations from translation server: ${error}.`,
        );
        // Remove from pending so they can be retried
        for (const hash of hashesToFetch) {
          pendingHashesRef.current.delete(hash);
          erroredHashesRef.current.add(hash);
        }
      } finally {
        setIsLoading(false);
      }
    }, BATCH_DELAY);
  }, [allSeenHashes, locale, translations]);

  /**
   * Clear batch timer on unmount
   */
  useEffect(() => {
    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }
    };
  }, []);

  /**
   * Change locale and load translations dynamically
   */
  const setLocale = useCallback(
    async (newLocale: LocaleCode) => {
      // 1. Persist to cookie (unless disabled)
      persistLocale(newLocale);

      // 2. Update state
      setLocaleState(newLocale);

      // 3. Reload Server Components (if router provided)
      if (router) {
        router.refresh();
      }

      // Fetch translations from API endpoint
      setIsLoading(true);
      const startTime = performance.now();

      try {
        logger.info(
          `Fetching translations for locale: ${newLocale}. Server url: ${serverUrl}`,
        );

        // TODO (AleksandrSl 08/12/2025): We should be fetching the existing cached translations here.
        const translatedDict = await fetchTranslations(
          newLocale,
          [],
          serverUrl,
        );

        const endTime = performance.now();
        logger.info(
          `Translation fetch complete for ${newLocale} in ${(endTime - startTime).toFixed(2)}ms`,
        );

        // Extract all translations from a dictionary
        const allTranslations = translatedDict.entries || {};

        logger.debug(`Translations loaded for ${newLocale}:`, allTranslations);

        setTranslations(allTranslations);
      } catch (error) {
        logger.error(`Failed to load translations for ${newLocale}:`, error);
        // Clear translations on error - components will request individually
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // Load widget on client-side only (avoids SSR issues with HTMLElement)
  useEffect(() => {
    if (devWidget?.enabled !== false) {
      // Dynamic import ensures this only runs on the client
      import("../../widget/lingo-dev-widget").catch((err) => {
        logger.error("Failed to load dev widget:", err, err.message);
      });
    }
  }, [devWidget?.enabled]);

  // Publish state to window global for Web Component widget
  useEffect(() => {
    if (typeof window !== "undefined" && devWidget?.enabled !== false) {
      window.__LINGO_DEV_STATE__ = {
        isLoading,
        locale,
        sourceLocale,
        pendingCount: pendingHashesRef.current.size,
        position: devWidget?.position || "bottom-left",
      } satisfies LingoDevState;
      window.__LINGO_DEV_WS_URL__ = serverUrl;
      window.__LINGO_DEV_UPDATE__?.();
    }
  }, [isLoading, locale, sourceLocale, devWidget]);

  // TODO (AleksandrSl 24/11/2025): Should I memo the value?
  return (
    <LingoContext.Provider
      value={{
        locale,
        setLocale,
        translations,
        registerHashes,
        isLoading,
        sourceLocale,
        _devStats: {
          pendingCount: pendingHashesRef.current.size,
          totalRegisteredCount: registeredHashesRef.current.size,
        },
      }}
    >
      {children}
    </LingoContext.Provider>
  );
}
