import type { LocaleCode } from "lingo.dev/spec";
import { useLingoContext } from "../shared/LingoContext";

/**
 * Hook to get the current locale (reactive).
 *
 * Re-renders the component when locale changes.
 *
 * @example
 * ```tsx
 * import { useLocale } from "@lingo.dev/compiler/react";
 *
 * function MyComponent() {
 *   const locale = useLocale();
 *   return <span>Current: {locale}</span>;
 * }
 * ```
 */
export function useLocale(): LocaleCode {
  return useLingoContext().locale;
}
