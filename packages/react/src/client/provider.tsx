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
 * import {
 *   Links,
 *   Meta,
 *   Outlet,
 *   Scripts,
 *   ScrollRestoration,
 *   useLoaderData,
 *   type LoaderFunctionArgs,
 * } from "react-router";
 * import "./app.css";
 *
 * export const loader = async ({ request }: LoaderFunctionArgs) => {
 *   return {
 *     lingoDictionary: await loadDictionary(request),
 *   };
 * };
 *
 * export function Layout({ children }: { children: React.ReactNode }) {
 *   const { lingoDictionary } = useLoaderData<typeof loader>();
 *
 *   return (
 *     <LingoProvider dictionary={lingoDictionary}>
 *       <html lang="en">
 *         <head>
 *           <meta charSet="utf-8" />
 *           <meta name="viewport" content="width=device-width, initial-scale=1" />
 *           <Meta />
 *           <Links />
 *         </head>
 *         <body>
 *           {children}
 *           <ScrollRestoration />
 *           <Scripts />
 *         </body>
 *       </html>
 *     </LingoProvider>
 *   );
 * }
 *
 * export default function App() {
 *   return <Outlet />;
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
  loadDictionary: (locale: string | null) => Promise<D>;
  /**
   * The child components containing localizable content.
   */
  children: React.ReactNode;
  /**
   * Optional component to render while the dictionary is loading.
   * If not provided, renders `null` during loading (default behavior).
   *
   * @example
   * ```tsx
   * <LingoProviderWrapper
   *   loadDictionary={loadDictionary}
   *   loadingComponent={<div>Loading translations...</div>}
   * >
   *   <App />
   * </LingoProviderWrapper>
   * ```
   */
  loadingComponent?: React.ReactNode;
  /**
   * Optional component to render when dictionary loading fails.
   * Receives the error as a prop. If not provided, renders `null` on error (default behavior).
   *
   * @example
   * ```tsx
   * <LingoProviderWrapper
   *   loadDictionary={loadDictionary}
   *   errorComponent={({ error }) => (
   *     <div>Failed to load translations: {error.message}</div>
   *   )}
   * >
   *   <App />
   * </LingoProviderWrapper>
   * ```
   */
  errorComponent?: React.ComponentType<{ error: Error }>;
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
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "loaded"; dictionary: D }
    | { status: "error"; error: Error }
  >({ status: "loading" });

  // for client-side rendered apps, the dictionary is also loaded on the client
  useEffect(() => {
    (async () => {
      try {
        const locale = getLocaleFromCookies();
        console.log(
          `[Lingo.dev] Loading dictionary file for locale ${locale}...`,
        );
        const localeDictionary = await props.loadDictionary(locale);
        setState({ status: "loaded", dictionary: localeDictionary });
      } catch (error) {
        console.log("[Lingo.dev] Failed to load dictionary:", error);
        setState({
          status: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    })();
  }, []);

  if (state.status === "loading") {
    return props.loadingComponent ?? null;
  }

  if (state.status === "error") {
    const ErrorComponent = props.errorComponent;
    return ErrorComponent ? <ErrorComponent error={state.error} /> : null;
  }

  return (
    <LingoProvider dictionary={state.dictionary}>
      {props.children}
    </LingoProvider>
  );
}
