import type { LocaleCode } from "lingo.dev/spec";

// Module-level references, set by LingoProvider on mount
let _setLocale: ((locale: LocaleCode) => Promise<void>) | null = null;
let _getLocale: (() => LocaleCode) | null = null;

/**
 * Called by LingoProvider to register locale functions
 * @internal
 */
export function _registerLocaleHandlers(
  getLocale: () => LocaleCode,
  setLocaleFn: (locale: LocaleCode) => Promise<void>,
) {
  _getLocale = getLocale;
  _setLocale = setLocaleFn;
}

/**
 * Called by LingoProvider on unmount to clean up
 * @internal
 */
export function _unregisterLocaleHandlers() {
  _getLocale = null;
  _setLocale = null;
}

/**
 * Change the current locale.
 *
 * Can be called from anywhere (event handlers, callbacks, etc.)
 * as long as LingoProvider is mounted.
 *
 * @example
 * ```tsx
 * import { setLocale } from "@lingo.dev/compiler/react";
 *
 * <button onClick={() => setLocale("es")}>Spanish</button>
 * ```
 */
export function setLocale(locale: LocaleCode): Promise<void> {
  if (!_setLocale) {
    throw new Error(
      "setLocale was called before LingoProvider mounted. " +
        "Make sure your component is wrapped in <LingoProvider>.",
    );
  }
  return _setLocale(locale);
}

/**
 * Get current locale (non-reactive).
 *
 * For reactive updates in React components, use the useLocale() hook instead.
 * This function is useful for non-React code or utility functions.
 *
 * @example
 * ```tsx
 * import { getLocale } from "@lingo.dev/compiler/react";
 *
 * const currentLocale = getLocale();
 * ```
 */
export function getLocale(): LocaleCode {
  if (!_getLocale) {
    throw new Error(
      "getLocale was called before LingoProvider mounted. " +
        "Make sure your component is wrapped in <LingoProvider>.",
    );
  }
  return _getLocale();
}
