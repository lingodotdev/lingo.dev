"use client";

import { Suspense, useMemo } from "react";
import type { ReactNode } from "react";
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
  children: ReactNode;
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
  children: ReactNode;
  /**
   * Optional fallback element rendered while the dictionary is loading.
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
 * - Suspends rendering while the dictionary loads (no UI by default, opt-in with `fallback` prop)
 *
 * @template D - The type of the dictionary object containing localized content.
 *
 * @example Use in a Vite application with loading UI
 * ```tsx file="src/main.tsx"
 * import { LingoProviderFallback, LingoProviderWrapper, loadDictionary } from "lingo.dev/react/client";
 * import { StrictMode } from 'react'
 * import { createRoot } from 'react-dom/client'
 * import './index.css'
 * import App from './App.tsx'
 *
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <LingoProviderWrapper
 *       loadDictionary={(locale) => loadDictionary(locale)}
 *       fallback={<LingoProviderFallback />}
 *     >
 *       <App />
 *     </LingoProviderWrapper>
 *   </StrictMode>,
 * );
 * ```
 */
export function LingoProviderWrapper<D>(props: LingoProviderWrapperProps<D>) {
  const locale = useMemo(() => getLocaleFromCookies(), []);
  const resource = useMemo(
    () =>
      createDictionaryResource({
        load: () => props.loadDictionary(locale),
        locale,
      }),
    [props.loadDictionary, locale],
  );

  return (
    <Suspense fallback={props.fallback}>
      <DictionaryBoundary resource={resource}>
        {props.children}
      </DictionaryBoundary>
    </Suspense>
  );
}

function DictionaryBoundary<D>(props: {
  resource: DictionaryResource<D>;
  children: ReactNode;
}) {
  const dictionary = props.resource.read();
  return (
    <LingoProvider dictionary={dictionary}>{props.children}</LingoProvider>
  );
}

type DictionaryResource<D> = {
  read(): D;
};

function createDictionaryResource<D>(options: {
  load: () => Promise<D>;
  locale: string | null;
}): DictionaryResource<D> {
  let status: "pending" | "success" | "error" = "pending";
  let value: D;
  let error: unknown;

  const { locale } = options;
  console.log(`[Lingo.dev] Loading dictionary file for locale ${locale}...`);

  const suspender = options
    .load()
    .then((result) => {
      value = result;
      status = "success";
      return result;
    })
    .catch((err) => {
      console.log("[Lingo.dev] Failed to load dictionary:", err);
      error = err;
      status = "error";
      throw err;
    });

  return {
    read(): D {
      if (status === "pending") {
        throw suspender;
      }
      if (status === "error") {
        throw error;
      }
      return value;
    },
  };
}

export function LingoProviderFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="lingo-provider-fallback"
    >
      Loading translations...
    </div>
  );
}
