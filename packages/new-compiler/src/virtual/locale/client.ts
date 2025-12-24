import type { LocaleCode } from "lingo.dev/spec";

/**
 * Get the current locale on the client
 * Reads from cookie
 * @returns Resolved locale code
 */
export function getClientLocale(): LocaleCode {
  return "en";
}

const __NOOP_PERSIST_LOCALE__ = () => {};

/**
 * Persist the locale on the client
 * Writes to cookie
 * @param locale - Locale code to persist
 */
export function persistLocale(locale: LocaleCode): void {
  return __NOOP_PERSIST_LOCALE__();
}
