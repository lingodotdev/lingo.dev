"use client";

import { useState, useEffect } from "react";
import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

/**
 * The props for the `LocaleSwitcher` component.
 */
export type LocaleSwitcherProps = {
  /**
   * An array of locale codes to display in the dropdown.
   *
   * This should contain both the source and target locales.
   */
  locales: string[];
  /**
   * A custom class name for the dropddown's `select` element.
   */
  className?: string;
};

/**
 * An unstyled dropdown for switching between locales.
 *
 * This component:
 *
 * - Only works in environments that support cookies
 * - Gets and sets the current locale from the `"lingo-locale"` cookie
 * - Triggers a full page reload when the locale is changed
 *
 * @example Creating a locale switcher
 * ```tsx
 * import { LocaleSwitcher } from "lingo.dev/react/client";
 *
 * export function App() {
 *   return (
 *     <header>
 *       <nav>
 *         <LocaleSwitcher locales={["en", "es"]} />
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
