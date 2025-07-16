import { LOCALE_COOKIE_NAME } from "../core";

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

async function loadLocaleFromCookies(request: Request) {
  const cookieHeaderValue = request.headers.get("Cookie") || "";
  const cookieValue = cookieHeaderValue
    .split(";")
    .find((cookie) => cookie.trim().startsWith(`${LOCALE_COOKIE_NAME}=`));
  const locale = cookieValue ? cookieValue.split("=")[1] : null;
  return locale;
}

export async function loadDictionary_internal(
  requestOrExplicitLocale: Request | string,
  dictionaryLoader: Record<string, () => Promise<any>>,
) {
  const locale =
    typeof requestOrExplicitLocale === "string"
      ? requestOrExplicitLocale
      : await loadLocaleFromCookies(requestOrExplicitLocale);

  if (locale && dictionaryLoader[locale]) {
    return dictionaryLoader[locale]().then((value) => {
      return value.default;
    });
  }
  return null;
}
