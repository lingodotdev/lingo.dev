"use client";

import type { CSSProperties } from "react";
import { useLingoContext } from "./LingoContext";
import type { LocaleCode } from "lingo.dev/spec";

export interface LocaleConfig {
  code: LocaleCode;
  label: string;
}

/**
 * LocaleSwitcher component props
 */
export interface LocaleSwitcherProps {
  /**
   * Available locales, e.g. [{ code: 'en', label: 'English' }]
   */
  locales: LocaleConfig[];

  /**
   * Custom styles for the select element
   */
  style?: CSSProperties;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Show loading indicator
   * @default true
   */
  showLoadingState?: boolean;
}

/**
 * LocaleSwitcher Component
 *
 * Provides a dropdown to switch between locales.
 * Works with both Next.js and other React frameworks.
 *
 * **How it works:**
 * 1. User selects new locale
 * 2. LingoProvider automatically:
 *    - Updates cookie for persistence
 *    - Refreshes Server Components (if Next.js router provided to provider)
 *    - Loads translations for new locale
 * 3. Client state is preserved throughout!
 *
 * @example
 * ```tsx
 * import { LocaleSwitcher } from '@lingo.dev/compiler/react';
 *
 * export function Header() {
 *   return (
 *     <header>
 *       <LocaleSwitcher locales={[
 *         { code: 'en', label: 'English' },
 *         { code: 'de', label: 'Deutsch' },
 *         { code: 'fr', label: 'Français' },
 *       ]} />
 *     </header>
 *   );
 * }
 * ```
 */
export function LocaleSwitcher({
  locales,
  style,
  className = "lingo-locale-switcher",
  showLoadingState = true,
}: LocaleSwitcherProps) {
  const { locale, setLocale, isLoading } = useLingoContext();

  const loading = showLoadingState && isLoading;

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as LocaleCode)}
      disabled={loading}
      className={className}
      style={{
        cursor: loading ? "wait" : "pointer",
        ...style,
      }}
      aria-label="Select language"
      data-testid="lingo-locale-switcher"
    >
      {locales.map((loc) => (
        <option key={loc.code} value={loc.code}>
          {loc.label}
        </option>
      ))}
    </select>
  );
}
