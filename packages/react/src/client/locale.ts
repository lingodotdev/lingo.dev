"use client";

import { useEffect, useState } from "react";
import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

/**
 * Gets the current locale used by the Lingo compiler.
 *
 * @returns The current locale code, or `null` if no locale is set.
 */
export function useLingoLocale(): string | null {
  const [locale, setLocale] = useState<string | null>(null);
  useEffect(() => {
    setLocale(getLocaleFromCookies());
  }, []);
  return locale;
}

/**
 * Sets the current locale used by the Lingo compiler.
 *
 * **Note:** This function triggers a full page reload to ensure all components
 * are re-rendered with the new locale. This is necessary because locale changes
 * affect the entire application state.
 *
 * @param locale - The locale code to set. Must be a valid locale code (e.g., "en", "es", "fr-CA").

 *
 * @example Set the current locale
 * ```tsx
 * import { setLingoLocale } from "lingo.dev/react/client";
 *
 * export function LanguageSwitcher() {
 *   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
 *     setLingoLocale(event.target.value);
 *   };
 *
 *   return (
 *     <select onChange={handleChange}>
 *       <option value="en">English</option>
 *       <option value="es">Spanish</option>
 *     </select>
 *   );
 * }
 * ```
 */
export function setLingoLocale(locale: string) {
  setLocaleInCookies(locale);
  window.location.reload();
}
