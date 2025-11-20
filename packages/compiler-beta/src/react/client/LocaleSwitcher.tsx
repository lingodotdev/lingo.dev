"use client";

import { useTransition } from "react";
import { useTranslationContext } from "./TranslationContext";
import { useRouter } from "next/navigation";

/**
 * Locale configuration
 */
export interface LocaleConfig {
  /**
   * Locale code (e.g., 'en', 'de', 'fr')
   */
  code: string;

  /**
   * Display name (e.g., 'English', 'Deutsch', 'Français')
   */
  label: string;
}

/**
 * LocaleSwitcher component props
 */
export interface LocaleSwitcherProps {
  /**
   * Available locales
   * @default [{ code: 'en', label: 'English' }]
   */
  locales?: LocaleConfig[];

  /**
   * Optional router instance for Next.js integration
   * If provided, calls router.refresh() after locale change
   * This ensures Server Components re-render with new locale
   *
   * @example
   * ```tsx
   * import { useRouter } from 'next/navigation';
   *
   * function MyComponent() {
   *   const router = useRouter();
   *   return <LocaleSwitcher router={router} />;
   * }
   * ```
   */
  router?: {
    reload: () => void;
    refresh?: () => void;
  };

  /**
   * Cookie name for storing locale
   * @default 'locale'
   */
  cookieName?: string;

  /**
   * Cookie max age in seconds
   * @default 31536000 (1 year)
   */
  cookieMaxAge?: number;

  /**
   * Custom styles for the select element
   */
  style?: React.CSSProperties;

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
 * Set locale in cookies (client-side)
 */
function setLocaleInCookies(
  locale: string,
  cookieName: string = "locale",
  maxAge: number = 31536000,
): void {
  if (typeof document === "undefined") {
    console.warn("[LocaleSwitcher] Cannot set cookie: document is undefined");
    return;
  }

  document.cookie = `${cookieName}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * LocaleSwitcher Component
 *
 * Provides a dropdown to switch between locales.
 * Handles both Client and Server Component updates seamlessly.
 *
 * **How it works:**
 * 1. User selects new locale
 * 2. Updates cookie (for Server Components to read)
 * 3. Updates context (for Client Components to re-render)
 * 4. Calls router.refresh() to re-execute Server Components
 * 5. Client state is preserved throughout!
 *
 * @example
 * ```tsx
 * // Basic usage (Client Components only)
 * import { LocaleSwitcher } from '@lingo.dev/_compiler-beta/react';
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
 *
 * @example
 * ```tsx
 * // With Next.js router (for Server Components)
 * 'use client';
 * import { useRouter } from 'next/navigation';
 * import { LocaleSwitcher } from '@lingo.dev/_compiler-beta/react';
 *
 * export function Header() {
 *   const router = useRouter();
 *
 *   return (
 *     <header>
 *       <LocaleSwitcher
 *         router={router}
 *         locales={[
 *           { code: 'en', label: 'English' },
 *           { code: 'de', label: 'Deutsch' },
 *         ]}
 *       />
 *     </header>
 *   );
 * }
 * ```
 */
export function LocaleSwitcher({
  locales = [{ code: "en", label: "English" }],
  cookieName = "locale",
  cookieMaxAge = 31536000,
  style,
  className = "lingo-locale-switcher",
  showLoadingState = true,
}: LocaleSwitcherProps) {
  const { locale, setLocale, isLoading } = useTranslationContext();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocaleChange = (newLocale: string) => {
    setLocaleInCookies(newLocale, cookieName, cookieMaxAge);
    setLocale(newLocale);

    // 3. Refresh Server Components (if router provided)
    if (router) {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  const loading = showLoadingState && (isPending || isLoading);

  return (
    <select
      value={locale}
      onChange={(e) => handleLocaleChange(e.target.value)}
      disabled={loading}
      className={className}
      style={{
        opacity: loading ? 0.5 : 1,
        cursor: loading ? "wait" : "pointer",
        ...style,
      }}
      aria-label="Select language"
    >
      {locales.map((loc) => (
        <option key={loc.code} value={loc.code}>
          {loc.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Get current locale from cookies (client-side)
 *
 * @param cookieName - Name of the cookie
 * @param defaultLocale - Default locale if cookie not found
 * @returns Current locale from cookie or default
 */
export function getLocaleFromCookies(
  cookieName: string = "locale",
  defaultLocale: string = "en",
): string {
  if (typeof document === "undefined") {
    return defaultLocale;
  }

  const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
  return match ? match[2] : defaultLocale;
}
