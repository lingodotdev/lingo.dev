/**
 * Loads a dictionary containing localized content for the given locale.
 *
 * This function:
 *
 * - Should be used in React Server Components
 * - Should be passed into the `LingoProvider` component
 *
 * @param locale - The locale code for which to load the dictionary.
 *
 * @returns Promise that resolves to the dictionary object containing localized content.
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
 *     <LingoProvider loadDictionary={loadDictionary}>
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
export const loadDictionary = async (locale: string): Promise<any> => {
  return {};
};

export const loadDictionary_internal = async (
  locale: string,
  loaders: Record<string, () => Promise<any>> = {},
): Promise<any> => {
  const loader = loaders[locale];
  if (!loader) {
    throw new Error(`No loader found for locale: ${locale}`);
  }

  return loader().then((m) => m.default);
};
