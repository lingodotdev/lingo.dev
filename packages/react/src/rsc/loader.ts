/**
 * Loads dictionary for a given locale in React Server Components.
 * 
 * Loads translation dictionaries on the server side for React Server Components, 
 * providing localized content during server-side rendering.
 * 
 * @param locale - Locale code for which to load the dictionary.
 * @returns Promise that resolves to the dictionary object containing localized content.
 * 
 * @example Use with LingoProvider in a Next.js app directory layout
 * ```tsx
 * import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";
 * 
 * export default function RootLayout({
 *   children,
 * }: {
 *   children: React.ReactNode;
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
 * 
 * @example Use directly in a server component
 * ```tsx
 * import { loadDictionary } from "lingo.dev/react/rsc";
 * 
 * export default async function ServerComponent() {
 *   const dictionary = await loadDictionary("de");
 *   
 *   return (
 *     <div>
 *       <h1>{dictionary.title}</h1>
 *       <p>{dictionary.description}</p>
 *     </div>
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
