import { createContext, useContext } from "react";
import type { LocaleCode } from "lingo.dev/spec";

interface LingoContextType {
  /**
   * Source locale (default language)
   */
  sourceLocale: LocaleCode;

  /**
   * Current locale (e.g., 'en', 'de', 'fr')
   */
  locale: LocaleCode;

  /**
   * Change the current locale and dynamically load translations
   */
  setLocale: (locale: LocaleCode) => Promise<void>;

  /**
   * Translation dictionary: hash -> translated text
   */
  translations: Record<string, string>;

  /**
   * Register a hash as being used in a component
   * The provider will automatically request missing translations
   */
  registerHashes: (hashes: string[]) => void;

  /**
   * Whether translations are currently being loaded
   */
  isLoading: boolean;

  /**
   * Development statistics (only in dev mode)
   */
  _devStats?: {
    pendingCount: number;
    totalRegisteredCount: number;
  };
}

export const LingoContext = createContext<LingoContextType | null>(null);

export function useLingoContext(): LingoContextType {
  const context = useContext(LingoContext);

  if (!context) {
    // TODO (AleksandrSl 14/12/2025): Shouldn't throw in production
    throw new Error("useLingoContext must be used within LingoProvider");
  }

  return context;
}
