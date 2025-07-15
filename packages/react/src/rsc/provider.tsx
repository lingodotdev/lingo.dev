import { LingoProvider as LingoClientProvider } from "../client";
import { loadDictionaryFromRequest, loadLocaleFromCookies } from "./utils";

export type LingoProviderProps = {
  /**
   * Loads dictionary for the current locale.
   * @param locale - Locale code to load dictionary for.
   */
  loadDictionary: (locale: string) => Promise<any>;
  /**
   * Child components containing localizable content.
   */
  children: React.ReactNode;
};

/**
 * React Server Component provider that makes localized content available to its descendants.
 * 
 * This component should be placed at the top of the component tree and is designed for
 * server-side rendering scenarios with React Server Components (RSC). It automatically
 * loads the dictionary based on the request context.
 * 
 * @example Set up localization in a Next.js root layout
 * ```tsx
 * import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";
 * 
 * export default function RootLayout({ 
 *   children 
 * }: { 
 *   children: React.ReactNode 
 * }) {
 *   return (
 *     <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
 *       <html>
 *         <body>{children}</body>
 *       </html>
 *     </LingoProvider>
 *   );
 * }
 * ```
 */
export async function LingoProvider(props: LingoProviderProps) {
  const dictionary = await loadDictionaryFromRequest(props.loadDictionary);

  return (
    <LingoClientProvider dictionary={dictionary}>
      {props.children}
    </LingoClientProvider>
  );
}
