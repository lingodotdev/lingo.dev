/**
 * React components for Lingo.dev translation runtime
 *
 * @module @lingo.dev/_compiler-beta/react
 */

"use client";

// Export context and provider
export {
  TranslationProvider,
  useTranslationContext,
  type TranslationContextType,
  type TranslationProviderProps,
} from "./client/TranslationContext";

// Export hooks
export {
  useTranslation,
  useTranslationWithStatus,
  type TranslationFunction,
} from "./client/useTranslation";

// Export components
export {
  LocaleSwitcher,
  getLocaleFromCookies,
  type LocaleSwitcherProps,
  type LocaleConfig,
} from "./client/LocaleSwitcher";
