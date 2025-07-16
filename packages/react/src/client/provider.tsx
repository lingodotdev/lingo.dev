"use client";

import { useEffect, useState } from "react";
import { LingoContext } from "./context";
import { getLocaleFromCookies } from "./utils";

/**
 * The props for the `LingoProvider` component.
 */
export type LingoProviderProps<D> = {
  /**
   * The dictionary object that contains localized content.
   */
  dictionary: D;
  /**
   * The child components containing localizable content.
   */
  children: React.ReactNode;
};

/**
 * A context provider that makes localized content from a preloaded dictionary available to its descendants.
 *
 * This component:
 *
 * - Should be placed at the top of the component tree
 * - Should be used in client-side applications that preload data from the server (e.g., React Router apps)
 *
 * @template D - The type of the dictionary object.
 * @throws {Error} When no dictionary is provided.
 *
 * @example Use in a React Router application
 * ```tsx
 * import { LingoProvider } from "lingo.dev/react/client";
 * import { loadDictionary } from "lingo.dev/react/react-router";
 * import type { LoaderFunctionArgs } from "react-router";
 * import { useLoaderData, Outlet } from "react-router";
 *
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   return {
 *     lingoDictionary: await loadDictionary(request),
 *   };
 * }
 *
 * export default function Root() {
 *   const { lingoDictionary } = useLoaderData<typeof loader>();
 *
 *   return (
 *     <LingoProvider dictionary={lingoDictionary}>
 *       <html>
 *         <body>
 *           <Outlet />
 *         </body>
 *       </html>
 *     </LingoProvider>
 *   );
 * }
 * ```
 */
export function LingoProvider<D>(props: LingoProviderProps<D>) {
  // TODO: handle case when no dictionary is provided - throw suspense? return null / other fallback?
  if (!props.dictionary) {
    throw new Error("LingoProvider: dictionary is not provided.");
  }

  return (
    <LingoContext.Provider
      value={{ dictionary: props.dictionary }}
      children={props.children}
    />
  );
}

/**
 * The props for the `LingoProviderWrapper` component.
 */
export type LingoProviderWrapperProps<D> = {
  /**
   * A callback function that loads the dictionary for the current locale.
   *
   * @param locale - The locale code to load the dictionary for.
   *
   * @returns The dictionary object containing localized content.
   */
  loadDictionary: (locale: string) => Promise<D>;
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
 * - Should be used in purely client-side rendered applications (e.g., Vite-based apps)
 *
 * @template D - The type of the dictionary object containing localized content.
 *
 * @example Use in a Vite application
 * ```tsx file="src/main.tsx"
 * import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";
 * import { StrictMode } from 'react'
 * import { createRoot } from 'react-dom/client'
 * import './index.css'
 * import App from './App.tsx'
 *
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
 *       <App />
 *     </LingoProviderWrapper>
 *   </StrictMode>,
 * );
 * ```
 */
export function LingoProviderWrapper<D>(props: LingoProviderWrapperProps<D>) {
  const [dictionary, setDictionary] = useState<D | null>(null);

  // for client-side rendered apps, the dictionary is also loaded on the client
  useEffect(() => {
    (async () => {
      try {
        const locale = getLocaleFromCookies();
        console.log(
          `[Lingo.dev] Loading dictionary file for locale ${locale}...`,
        );
        const localeDictionary = await props.loadDictionary(locale);
        setDictionary(localeDictionary);
      } catch (error) {
        console.log("[Lingo.dev] Failed to load dictionary:", error);
      }
    })();
  }, []);

  // TODO: handle case when the dictionary is loading (throw suspense?)
  if (!dictionary) {
    return null;
  }

  return (
    <LingoProvider dictionary={dictionary}>{props.children}</LingoProvider>
  );
}
