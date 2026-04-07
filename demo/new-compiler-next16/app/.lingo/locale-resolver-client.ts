/**
 * Custom path-based locale resolver for Next.js client-side
 *
 * These are utility functions (not hooks) that can be called from anywhere,
 * including inside callbacks, event handlers, etc.
 *
 * Note: We use window.location instead of Next.js hooks because these functions
 * are called from within useCallback/event handlers where hooks cannot be used.
 */

"use client";

import type { LocaleCode } from "@lingo.dev/compiler"
import { sourceLocale } from "../../supported-locales";

/**
 * Get locale from the current pathname
 *
 * This is a regular function (not a hook) that can be called from anywhere.
 * It reads from window.location.pathname to extract the locale.
 *
 * @returns Locale code extracted from path or default locale
 */
export function getClientLocale(): LocaleCode {
  if (typeof window === "undefined") {
    return sourceLocale;
  }

  try {
    const pathname = window.location.pathname;
    const segments = pathname.split("/").filter(Boolean);
    const potentialLocale = segments[0];

    if (potentialLocale) {
      return potentialLocale as LocaleCode;
    }

    return sourceLocale;
  } catch (error) {
    console.error("Error resolving locale from path:", error);
    return sourceLocale;
  }
}

/**
 * Get the pathname for a given locale
 *
 * This is a utility function that computes what the path should be for a locale change.
 * It doesn't perform navigation - the caller is responsible for that.
 *
 * @param locale - Locale to switch to
 * @returns The new pathname with the locale prefix
 */
function getLocalePathname(locale: LocaleCode): string {
  if (typeof window === "undefined") {
    return `/${locale}`;
  }

  try {
    const pathname = window.location.pathname;
    const segments = pathname.split("/").filter(Boolean);

    // Replace the first segment (current locale) with the new locale
    if (segments[0]) {
      segments[0] = locale;
    } else {
      // If no segments, just add the locale
      segments.unshift(locale);
    }

    return "/" + segments.join("/");
  } catch (error) {
    console.error("Error computing locale pathname:", error);
    return `/${locale}`;
  }
}

/**
 * Returns new URL that will be used to navigate to the new locale
 *
 * @param locale - Locale to switch to
 */
export function persistLocale(locale: LocaleCode): string | undefined {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const newPath = getLocalePathname(locale);
    const search = window.location.search;
    const hash = window.location.hash;
    return newPath + search + hash;
  } catch (error) {
    console.error("Error persisting locale:", error);
  }
}
