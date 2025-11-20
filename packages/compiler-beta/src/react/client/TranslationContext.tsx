"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

/**
 * Translation context type
 */
export interface TranslationContextType {
  /**
   * Current locale (e.g., 'en', 'de', 'fr')
   */
  locale: string;

  /**
   * Change the current locale and dynamically load translations
   */
  setLocale: (locale: string) => Promise<void>;

  /**
   * Translation dictionary: hash -> translated text
   */
  translations: Record<string, string>;

  /**
   * Request a translation for a given hash
   * Translations are batched automatically
   */
  requestTranslation: (hash: string) => void;

  /**
   * Whether translations are currently being loaded
   */
  isLoading: boolean;

  /**
   * Source locale (default language)
   */
  sourceLocale: string;

  /**
   * Port of the translation server (if running)
   */
  serverPort?: number | null;
}

/**
 * Translation context
 */
const TranslationContext = createContext<TranslationContextType | null>(null);

/**
 * Translation provider props
 */
export interface TranslationProviderProps {
  /**
   * Initial locale to use
   */
  initialLocale: string;

  /**
   * Source locale (default language)
   */
  sourceLocale?: string;

  /**
   * Initial translations (pre-loaded)
   */
  initialTranslations?: Record<string, string>;

  /**
   * Custom fetch function for translations
   * Default implementation calls /api/translate
   */
  fetchTranslations?: (
    hashes: string[],
    locale: string,
  ) => Promise<Record<string, string>>;

  /**
   * Debounce delay for batching translation requests (ms)
   * Default: 100ms
   */
  batchDelay?: number;

  /**
   * Port of the translation server (if running)
   */
  serverPort?: number | null;

  children: ReactNode;
}

/**
 * Translation Provider Component
 *
 * Wraps your app to provide translation context to all components.
 * Handles locale switching and on-demand translation loading.
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { TranslationProvider } from '@lingo.dev/_compiler-beta/react';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <TranslationProvider initialLocale="en">
 *           {children}
 *         </TranslationProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function TranslationProvider({
  initialLocale,
  sourceLocale = "en",
  initialTranslations = {},
  fetchTranslations: customFetchTranslations,
  batchDelay = 100,
  serverPort: providedServerPort,
  children,
}: TranslationProviderProps) {
  // Use provided serverPort or try to read from global variable
  const serverPort =
    providedServerPort ||
    (typeof window !== "undefined" && (window as any).__LINGO_SERVER_PORT__) ||
    null;

  const [locale, setLocaleState] = useState(initialLocale);
  const [translations, setTranslations] =
    useState<Record<string, string>>(initialTranslations);
  const [pendingTranslations, setPendingTranslations] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(false);

  // Batch timer reference
  const [batchTimer, setBatchTimer] = useState<NodeJS.Timeout | null>(null);

  // Use ref to track translations without causing re-renders in requestTranslation
  const translationsRef = useRef<Record<string, string>>(initialTranslations);

  // Keep ref in sync with state
  useEffect(() => {
    translationsRef.current = translations;
  }, [translations]);

  /**
   * Default fetch function - calls /api/translate endpoint or server if port provided
   */
  const defaultFetchTranslations = useCallback(
    async (hashes: string[], targetLocale: string) => {
      // Determine the URL based on whether serverPort is provided
      const url = serverPort
        ? `http://127.0.0.1:${serverPort}/translations/${targetLocale}`
        : "/api/translate";

      const response = await fetch(url, {
        method: serverPort ? "GET" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: serverPort
          ? undefined
          : JSON.stringify({
              hashes,
              locale: targetLocale,
            }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`);
      }

      const data = await response.json();

      // If using server, extract translations from dictionary format
      if (serverPort && data.files) {
        const allTranslations: Record<string, string> = {};
        Object.values(data.files || {}).forEach((file: any) => {
          Object.assign(allTranslations, file.entries || {});
        });
        return allTranslations;
      }

      return data;
    },
    [serverPort],
  );

  const fetchFn = customFetchTranslations || defaultFetchTranslations;

  /**
   * Execute batched translation request
   */
  const executeBatch = useCallback(async () => {
    if (pendingTranslations.size === 0) return;

    setIsLoading(true);
    const hashes = Array.from(pendingTranslations);

    console.log(
      `[lingo.dev] Fetching translations for ${hashes.length} hashes in locale ${locale}`,
    );
    try {
      const newTranslations = await fetchFn(hashes, locale);

      setTranslations((prev) => ({ ...prev, ...newTranslations }));
      setPendingTranslations(new Set());
    } catch (error) {
      console.error(
        "[TranslationProvider] Failed to fetch translations:",
        error,
      );
      // Keep pending translations for retry
    } finally {
      setIsLoading(false);
    }
  }, [pendingTranslations, locale, fetchFn]);

  /**
   * Clear batch timer on unmount
   */
  useEffect(() => {
    return () => {
      if (batchTimer) {
        clearTimeout(batchTimer);
      }
    };
  }, [batchTimer]);

  /**
   * Request a translation (will be batched)
   */
  const requestTranslation = useCallback(
    (hash: string) => {
      console.log(
        `[lingo.dev] Requesting translation for ${hash} in locale ${locale}`,
      );
      // Skip if already have translation (use ref to avoid dependency)
      if (translationsRef.current[hash]) return;

      // Skip if it's the source locale (no translation needed)
      if (locale === sourceLocale) return;

      // Add to pending set
      setPendingTranslations((prev) => {
        // Skip if already pending
        if (prev.has(hash)) return prev;

        const next = new Set(prev);
        next.add(hash);
        return next;
      });

      // Schedule batch execution
      if (batchTimer) {
        clearTimeout(batchTimer);
      }

      const timer = setTimeout(() => {
        executeBatch();
      }, batchDelay);

      setBatchTimer(timer);
    },
    [locale, sourceLocale, batchTimer, batchDelay, executeBatch],
  );

  /**
   * Change locale and load translations dynamically
   */
  const setLocale = useCallback(
    async (newLocale: string) => {
      setLocaleState(newLocale);

      // For source locale, clear translations
      if (newLocale === sourceLocale) {
        setTranslations({});
        return;
      }

      // Fetch translations from API endpoint
      setIsLoading(true);
      const startTime = performance.now();

      try {
        console.log(
          `[lingo.dev] Fetching translations for locale: ${newLocale}`,
        );

        // Determine URL based on serverPort
        const url = serverPort
          ? `http://127.0.0.1:${serverPort}/translations/${newLocale}`
          : `/api/translations/${newLocale}`;

        // Fetch translation file from API endpoint or server
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch translations: ${response.statusText}`,
          );
        }

        const translatedDict = await response.json();

        const endTime = performance.now();
        console.log(
          `[lingo.dev] Translation fetch complete for ${newLocale} in ${(endTime - startTime).toFixed(2)}ms`,
        );

        // Extract all translations from dictionary files
        const allTranslations: Record<string, string> = {};
        Object.values(translatedDict.files || {}).forEach((file: any) => {
          Object.assign(allTranslations, file.entries || {});
        });

        setTranslations(allTranslations);
      } catch (error) {
        console.error(
          `[lingo.dev] Failed to load translations for ${newLocale}:`,
          error,
        );
        // Clear translations on error - components will request individually
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    },
    [sourceLocale, serverPort],
  );

  return (
    <TranslationContext.Provider
      value={{
        locale,
        setLocale,
        translations,
        requestTranslation,
        isLoading,
        sourceLocale,
        serverPort,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * Hook to access translation context
 *
 * @throws Error if used outside TranslationProvider
 */
export function useTranslationContext(): TranslationContextType {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error(
      "useTranslationContext must be used within TranslationProvider",
    );
  }

  return context;
}
