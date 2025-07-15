"use client";

import { useState, useEffect } from "react";
import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

export type LocaleSwitcherProps = {
  /**
   * Custom class name for the dropdown's select element.
   */
  className?: string;
  /**
   * Array of locale codes (should contain both source and target locales).
   */
  locales: string[];
};

/**
 * Dropdown component for switching between locales.
 * 
 * This component provides users with a way to change languages and triggers a full page
 * reload when the locale is changed. It only works in environments that support cookies
 * and does not need to be a child of LingoProvider or LingoProviderWrapper.
 * 
 * @example Add a language switcher to your header
 * ```tsx
 * import { LocaleSwitcher } from "lingo.dev/react/client";
 * 
 * export function Header() {
 *   return (
 *     <header>
 *       <nav>
 *         <LocaleSwitcher locales={["en", "es", "fr", "de"]} />
 *       </nav>
 *     </header>
 *   );
 * }
 * ```
 */
export function LocaleSwitcher(props: LocaleSwitcherProps) {
  const { locales } = props;
  const [locale, setLocale] = useState<string>("");

  useEffect(() => {
    const currentLocale = getLocaleFromCookies();
    setLocale(currentLocale);
  }, [locales]);

  if (!locale) {
    return null;
  }

  return (
    <select
      value={locale}
      className={props.className}
      onChange={(e) => {
        handleLocaleChange(e.target.value);
      }}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale}
        </option>
      ))}
    </select>
  );

  function handleLocaleChange(newLocale: string): Promise<void> {
    setLocaleInCookies(newLocale);
    window.location.reload();
    return Promise.resolve();
  }
}
