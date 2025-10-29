"use client";

import React, { Suspense, ReactNode } from "react";
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
 * A simple default fallback component displayed while the dictionary is loading.
 */
function DefaultLoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <p style={{ color: "#666", margin: 0 }}>Loading translations...</p>
      </div>
    </div>
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
   * Optional fallback UI to display while the dictionary is loading.
   * If not provided, a default loading spinner will be shown.
   */
  fallback?: ReactNode;
};

/**
 * A context provider that loads the dictionary for the current locale and makes localized content available to its descendants.
 *
 * This component:
 *
 * - Should be placed at the top of the component tree
 * - Should be used in purely client-side rendered applications (e.g., Vite-based apps)
 * - Uses React Suspense internally to handle async dictionary loading
 * - Shows a loading fallback while the dictionary is being fetched
 *
 * @template D - The type of the dictionary object containing localized content.
 *
 * @example Use in a Vite application with default fallback
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
 *
 * @example Use with custom loading fallback
 * ```tsx
 * <LingoProviderWrapper
 *   loadDictionary={(locale) => loadDictionary(locale)}
 *   fallback={<div>Loading your language...</div>}
 * >
 *   <App />
 * </LingoProviderWrapper>
 * ```
 */
/**
 * Cache to store loaded dictionaries to maintain stable references
 */
const dictionaryCache = new Map<string, any>();
const loadingPromises = new Map<string, Promise<any>>();

/**
 * Clears the dictionary cache.
 * @internal
 */
export function clearDictionaryCache() {
  dictionaryCache.clear();
  loadingPromises.clear();
}

/**
 * Internal component that loads the dictionary and suspends until ready.
 */
function LingoProviderWrapperInternal<D>(
  props: Omit<LingoProviderWrapperProps<D>, "fallback">,
) {
  const locale = getLocaleFromCookies();
  const cacheKey = `dictionary-${locale}`;

  // Check if dictionary is already loaded
  if (dictionaryCache.has(cacheKey)) {
    const dictionary = dictionaryCache.get(cacheKey);
    return (
      <LingoProvider dictionary={dictionary}>{props.children}</LingoProvider>
    );
  }

  // Check if we're currently loading
  if (!loadingPromises.has(cacheKey)) {
    console.log(`[Lingo.dev] Loading dictionary file for locale ${locale}...`);
    const promise = props
      .loadDictionary(locale)
      .then((dict) => {
        console.log(`[Lingo.dev] Dictionary loaded successfully`);
        dictionaryCache.set(cacheKey, dict);
        loadingPromises.delete(cacheKey);
        return dict;
      })
      .catch((error) => {
        console.error("[Lingo.dev] Failed to load dictionary:", error);
        loadingPromises.delete(cacheKey);
        throw error;
      });
    loadingPromises.set(cacheKey, promise);
  }

  // Throw the promise to trigger Suspense
  throw loadingPromises.get(cacheKey)!;
}

export function LingoProviderWrapper<D>(props: LingoProviderWrapperProps<D>) {
  const { fallback = <DefaultLoadingFallback />, ...rest } = props;

  return (
    <Suspense fallback={fallback}>
      <LingoProviderWrapperInternal {...rest} />
    </Suspense>
  );
}
