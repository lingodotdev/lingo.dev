"use client";

import { useState, useEffect } from "react";
import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

/**
 * Represents a detailed locale configuration.
 */
export type LocaleConfig = {
  /** The locale code (e.g., "en", "es-MX"). */
  code: string;
  /** The name to display for the locale (e.g., "English", "Español"). */
  displayName: string;
  /** An optional flag icon or component string. */
  flag?: string;
  /** The native name of the language (e.g., "English", "Español"). */
  nativeName?: string;
};

/**
 * The type for the `locales` prop, allowing for simple strings,
 * a key-value object, or a full configuration array.
 */
export type LocalesProp = string[] | Record<string, string> | LocaleConfig[];

/**
 * The props for the `LocaleSwitcher` component.
 */
export type LocaleSwitcherProps = {
  /**
   * The locales to display in the dropdown. Can be an array of strings,
   * an object mapping locale codes to display names, or an array of
   * `LocaleConfig` objects.
   */
  locales: LocalesProp;
  /**
   * A custom class name for the dropdown's `select` element.
   */
  className?: string;
};

/**
 * Normalizes the `locales` prop into a consistent `LocaleConfig[]` format.
 * @param locales - The `locales` prop to normalize.
 * @returns An array of `LocaleConfig` objects.
 */
export function normalizeLocales(locales: LocalesProp): LocaleConfig[] {
  if (Array.isArray(locales)) {
    if (locales.length === 0) return [];

    const isStringArray = locales.every((item) => typeof item === "string");
    const isObjectArray = locales.every(
      (item) => typeof item === "object" && item !== null,
    );

    if (isStringArray) {
      return (locales as string[]).map((code) => ({
        code,
        displayName: code,
      }));
    }

    if (isObjectArray) {
      const isLocaleConfigArray = locales.every(
        (item: any) => "code" in item && "displayName" in item,
      );

      if (!isLocaleConfigArray) {
        throw new Error(
          "Invalid LocaleConfig array provided. Each object must have 'code' and 'displayName' properties.",
        );
      }
      return locales as LocaleConfig[];
    }
  } else if (typeof locales === "object" && locales !== null) {
    // Handle Record<string, string>
    return Object.entries(locales).map(([code, displayName]) => ({
      code,
      displayName,
    }));
  }

  throw new Error(
    "Invalid 'locales' prop provided. It must be an array of strings, an array of LocaleConfig objects, or a Record<string, string>.",
  );
}

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
 *         <LocaleSwitcher locales={{ en: "English", es: "Español" }} />
 *         <LocaleSwitcher locales={[{ code: "en", displayName: "English" }]} />
 *       </nav>
 *     </header>
 *   );
 * }
 * ```
 */
export function LocaleSwitcher(props: LocaleSwitcherProps) {
  const normalizedLocales = normalizeLocales(props.locales);
  const localeCodes = normalizedLocales.map((l) => l.code);
  const [locale, setLocale] = useState<string | undefined>(undefined);

  useEffect(() => {
    const currentLocale = getLocaleFromCookies();
    const isValidLocale = currentLocale && localeCodes.includes(currentLocale);
    setLocale(isValidLocale ? currentLocale : localeCodes[0]);
  }, [localeCodes]);

  if (locale === undefined) {
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
      {normalizedLocales.map((localeConfig) => (
        <option key={localeConfig.code} value={localeConfig.code}>
          {localeConfig.displayName}
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
