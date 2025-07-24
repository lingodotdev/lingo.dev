import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "../core";

/**
 * A placeholder function for loading dictionaries that contain localized content.
 *
 * This function:
 *
 * - Should be used in React Router and Remix applications
 * - Should be passed into the `LingoProvider` component
 * - Is transformed into functional code by Lingo.dev Compiler
 *
 * @param requestOrExplicitLocale - Either a `Request` object (from loader functions) or an explicit locale string.
 *
 * @returns Promise that resolves to the dictionary object containing localized content.
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
export const loadDictionary = async (
  requestOrExplicitLocale: Request | string,
): Promise<any> => {
  return null;
};

function loadLocaleFromCookies(request: Request) {
  // it's a Request, so get the Cookie header
  const cookieHeaderValue = request.headers.get("Cookie");

  // there's no Cookie header, so return default
  if (!cookieHeaderValue) {
    return DEFAULT_LOCALE;
  }

  // get the lingo-locale cookie
  const cookiePrefix = `${LOCALE_COOKIE_NAME}=`;
  const cookie = cookieHeaderValue
    .split(";")
    .find((cookie) => cookie.trim().startsWith(cookiePrefix));

  // there's no lingo-locale cookie, so return default
  if (!cookie) {
    return DEFAULT_LOCALE;
  }

  // extract the locale value from the cookie
  return cookie.trim().substring(cookiePrefix.length);
}

export async function loadDictionary_internal(
  requestOrExplicitLocale: Request | string,
  dictionaryLoader: Record<string, () => Promise<any>>,
) {
  // gets the locale (falls back to "en")
  const locale =
    typeof requestOrExplicitLocale === "string"
      ? requestOrExplicitLocale
      : loadLocaleFromCookies(requestOrExplicitLocale);

  // get dictionary loader for the locale
  const loader = dictionaryLoader[locale];

  // locale is not available in the dictionary
  if (!loader) {
    // TODO: throw a clear error message
    return null;
  }

  return loader().then((value) => value.default);
}
