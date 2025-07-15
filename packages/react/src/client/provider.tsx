"use client";

import { useEffect, useState } from "react";
import { LingoContext } from "./context";
import { getLocaleFromCookies } from "./utils";

export type LingoProviderProps<D> = {
  /**
   * Dictionary object containing localized content.
   */
  dictionary: D;
  /**
   * Child components containing localizable content.
   */
  children: React.ReactNode;
};

/**
 * Context provider that makes localized content available to its descendants.
 * 
 * This component should be placed at the top of the component tree and is designed
 * for use in client-side applications with pre-loaded dictionaries.
 * 
 * @template D - Type of the dictionary object containing localized content.
 * @throws {Error} When no dictionary is provided.
 * 
 * @example Use in a React Router application
 * ```tsx
 * import { LingoProvider } from "lingo.dev/react/client";
 * import { loadDictionary } from "lingo.dev/react/react-router";
 * import type { LoaderFunctionArgs } from "react-router";
 * import { useLoaderData, Outlet } from "react-router";
 * 
 * export async function loader(args: LoaderFunctionArgs) {
 *   return {
 *     lingoDictionary: await loadDictionary(args.request),
 *   };
 * }
 * 
 * export default function Root() {
 *   const { lingoDictionary } = useLoaderData<typeof loader>();
 * 
 *   return (
 *     <LingoProvider dictionary={lingoDictionary}>
 *       <Outlet />
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

export type LingoProviderWrapperProps<D> = {
  /**
   * Loads dictionary for the current locale.
   * @param locale - Locale code to load dictionary for.
   */
  loadDictionary: (locale: string) => Promise<D>;
  /**
   * Child components containing localizable content.
   */
  children: React.ReactNode;
};

/**
 * Context provider that makes localized content available to its descendants for client-side applications.
 * 
 * This component automatically loads the dictionary based on the user's locale from cookies
 * and should be placed at the top of the component tree. Use this for client-side rendered
 * applications where the dictionary needs to be loaded dynamically.
 * 
 * @template D - Type of the dictionary object containing localized content.
 * 
 * @example Use in a Vite application
 * ```tsx
 * import React from "react";
 * import ReactDOM from "react-dom/client";
 * import App from "./App.tsx";
 * import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";
 * 
 * ReactDOM.createRoot(document.getElementById("root")!).render(
 *   <React.StrictMode>
 *     <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
 *       <App />
 *     </LingoProviderWrapper>
 *   </React.StrictMode>,
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
