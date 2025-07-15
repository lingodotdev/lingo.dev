import { LOCALE_COOKIE_NAME } from "../core";

/**
 * Loads dictionary for React Router and Remix applications.
 * 
 * Extracts the locale from the request object or uses an explicitly provided locale 
 * string to load the appropriate translation dictionary for server-side rendering scenarios.
 * 
 * @param requestOrExplicitLocale - Either a Request object (from loader functions) or an explicit locale string.
 * @returns Promise that resolves to the dictionary object, or null if no dictionary is found.
 * 
 * @example Use with Request object in a React Router loader
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
 * 
 * @example Use with explicit locale string
 * ```tsx
 * import { loadDictionary } from "lingo.dev/react/react-router";
 * 
 * export async function customLoader() {
 *   const dictionary = await loadDictionary("fr");
 *   return dictionary;
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
