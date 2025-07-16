import { LingoProvider as LingoClientProvider } from "../client";
import { loadDictionaryFromRequest, loadLocaleFromCookies } from "./utils";

/**
 * The props for the `LingoProvider` component.
 */
export type LingoProviderProps = {
  /**
   * A callback function that loads the dictionary for the current locale.
   *
   * @param locale - The locale code to load the dictionary for.
   *
   * @returns The dictionary object containing localized content.
   */
  loadDictionary: (locale: string) => Promise<any>;
  /**
   * The child components containing localizable content.
   */
  children: React.ReactNode;
};

/**
 * A context provider that loads the dictionary for the current locale and makes localized content available to its descendants.
 *
 * This component:
 *
 * - Should be placed at the top of the component tree
 * - Should be used in server-side rendering scenarios with React Server Components (RSC)
 *
 * @template D - The type of the dictionary object containing localized content.
 *
 * @example Use in a Next.js (App Router) application
 * ```tsx file="app/layout.tsx"
 * import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";
 *
 * export default function RootLayout({
 *   children,
 * }: Readonly<{
 *   children: React.ReactNode;
 * }>) {
 *   return (
 *     <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
 *       <html lang="en">
 *        <body>
 *           {children}
 *         </body>
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
