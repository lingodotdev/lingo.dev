import type { LocaleCode } from "lingo.dev/spec";

/**
 * Get the current locale on the client
 * @returns Resolved locale code
 */
export function getClientLocale(): LocaleCode {
  return "en";
}

const __NOOP_PERSIST_LOCALE__ = () => { return undefined };

/**
 * Persist the locale on the client
 * @param locale - Locale code to persist
 *
 * May return the new url in case the redirect is needed after setting the locale
 */
export function persistLocale(locale: LocaleCode): string | undefined {
  return __NOOP_PERSIST_LOCALE__();
}
