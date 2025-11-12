"use client";

import { LOCALE_COOKIE_NAME } from "../core";
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
export function getLocaleFromCookies(): string | null {
  if (typeof document === "undefined") return null;

  return Cookies.get(LOCALE_COOKIE_NAME) ?? null;
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

/**
 * Returns a new array with duplicate strings removed while preserving order.
 * Normalizes entries by trimming whitespace before comparing so common
 * accidental duplicates (extra spaces) are removed as well.
 *
 * This is a small defensive helper intended for UI lists such as pricing
 * feature lists where translations or assembled data may accidentally
 * contain duplicate entries.
 */
export function dedupeFeatures(features?: Array<string | null | undefined>) {
  if (!features || !Array.isArray(features)) return [] as string[];

  const seen = new Set<string>();
  const out: string[] = [];

  for (const f of features) {
    if (typeof f !== "string") continue;
    const norm = f.trim();
    if (!norm) continue;
    if (seen.has(norm)) continue;
    seen.add(norm);
    out.push(norm);
  }

  return out;
}
