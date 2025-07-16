import { cookies, headers } from "next/headers";
import { LOCALE_HEADER_NAME, LOCALE_COOKIE_NAME } from "../core";

/**
 * Retrieves the current locale from Next.js request headers.
 * 
 * Extracts the locale from the x-lingo-locale header in Next.js applications
 * using React Server Components. Falls back to "en" if no header is found.
 * 
 * @returns Promise that resolves to the locale code from headers or "en" as fallback.
 * 
 * @example Get locale from headers in a server component
 * ```typescript
 * import { loadLocaleFromHeaders } from "lingo.dev/react/rsc";
 * 
 * export default async function ServerComponent() {
 *   const locale = await loadLocaleFromHeaders();
 *   
 *   return <div>Current locale: {locale}</div>;
 * }
 * ```
 */
export async function loadLocaleFromHeaders() {
  const requestHeaders = await headers();
  const result = requestHeaders.get(LOCALE_HEADER_NAME) || "en";

  return result;
}

/**
 * Retrieves the current locale from Next.js request cookies.
 * 
 * Extracts the locale from the lingo-locale cookie in Next.js applications
 * using React Server Components. Falls back to "en" if no cookie is found.
 * 
 * @returns Promise that resolves to the locale code from cookies or "en" as fallback.
 * 
 * @example Get locale from cookies in a server component
 * ```typescript
 * import { loadLocaleFromCookies } from "lingo.dev/react/rsc";
 * 
 * export default async function ServerComponent() {
 *   const locale = await loadLocaleFromCookies();
 *   
 *   return <div>User's saved locale: {locale}</div>;
 * }
 * ```
 */
export async function loadLocaleFromCookies() {
  const requestCookies = await cookies();
  const result = requestCookies.get(LOCALE_COOKIE_NAME)?.value || "en";
  return result;
}

/**
 * Sets the locale in Next.js request cookies.
 * 
 * Stores the locale in the lingo-locale cookie for Next.js applications
 * using React Server Components. This is typically used in server actions.
 * 
 * @param locale - Locale code to store in cookies.
 * 
 * @example Set locale in a server action
 * ```typescript
 * import { setLocaleInCookies } from "lingo.dev/react/rsc";
 * 
 * export async function changeLocale(locale: string) {
 *   "use server";
 *   
 *   await setLocaleInCookies(locale);
 *   redirect("/");
 * }
 * ```
 */
export async function setLocaleInCookies(locale: string) {
  const requestCookies = await cookies();
  requestCookies.set(LOCALE_COOKIE_NAME, locale);
}

/**
 * Loads dictionary from request using the locale from cookies.
 * 
 * Convenience function that combines getting the locale from cookies
 * and loading the dictionary using a provided loader function.
 * 
 * @param loader - Function that loads dictionary for a given locale.
 * @returns Promise that resolves to the loaded dictionary.
 * 
 * @example Load dictionary from request in a server component
 * ```typescript
 * import { loadDictionaryFromRequest, loadDictionary } from "lingo.dev/react/rsc";
 * 
 * export default async function ServerComponent() {
 *   const dictionary = await loadDictionaryFromRequest(loadDictionary);
 *   
 *   return <div>{dictionary.welcome}</div>;
 * }
 * ```
 */
export async function loadDictionaryFromRequest(
  loader: (locale: string) => Promise<any>,
) {
  const locale = await loadLocaleFromCookies();
  return loader(locale);
}
