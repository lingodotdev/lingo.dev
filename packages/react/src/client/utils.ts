"use client";

import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE } from "../core";
import Cookies from "js-cookie";

/**
 * Retrieves the current locale from browser cookies.
 * 
 * Falls back to the default locale if running in a server environment
 * or if no locale cookie is found.
 * 
 * @returns Current locale code from cookies or default locale.
 * 
 * @example Get the current locale
 * ```tsx
 * import { getLocaleFromCookies } from "lingo.dev/react/client";
 * 
 * export function MyComponent() {
 *   const currentLocale = getLocaleFromCookies();
 *   
 *   return <div>Current locale: {currentLocale}</div>;
 * }
 * ```
 */
export function getLocaleFromCookies(): string {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  return Cookies.get(LOCALE_COOKIE_NAME) || DEFAULT_LOCALE;
}

/**
 * Sets the locale in browser cookies.
 * 
 * Stores the locale with a 365-day expiration and lax SameSite policy.
 * Does nothing if running in a server environment.
 * 
 * @param locale - Locale code to store in cookies.
 * 
 * @example Set the locale to Spanish
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
