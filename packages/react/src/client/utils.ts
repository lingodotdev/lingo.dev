"use client";

import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE } from "../core";
import Cookies from "js-cookie";

/**
 * Gets the current locale from the `"lingo-locale"` cookie.
 *
 * Defaults to `"en"` if:
 *
 * - Running in an environment that doesn't support cookies
 * - No `"lingo-locale"` cookie is found
 *
 * @returns The current locale code, or `"en"` as a fallback.
 *
 * @example Get the current locale
 * ```tsx
 * import { getLocaleFromCookies } from "lingo.dev/react/client";
 *
 * export function App() {
 *   const currentLocale = getLocaleFromCookies();
 *   return <div>Current locale: {currentLocale}</div>;
 * }
 * ```
 */
export function getLocaleFromCookies(): string {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  return Cookies.get(LOCALE_COOKIE_NAME) || DEFAULT_LOCALE;
}

/**
 * Sets the current locale in the `"lingo-locale"` cookie.
 *
 * Does nothing in environments that don't support cookies.
 *
 * @param locale - The locale code to store in the `"lingo-locale"` cookie.
 *
 * @example Set the current locale
 * ```tsx
 * import { setLocaleInCookies } from "lingo.dev/react/client";
 *
 * export function LanguageButton() {
 *   const handleClick = () => {
 *     setLocaleInCookies("es");
 *     window.location.reload();
 *   };
 *
 *   return <button onClick={handleClick}>Switch to Spanish</button>;
 * }
 * ```
 */
export function setLocaleInCookies(locale: string): void {
  if (typeof document === "undefined") return;

  Cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    expires: 365,
    sameSite: "lax",
  });
}
