import { cookies, headers } from "next/headers";
import { LOCALE_HEADER_NAME, LOCALE_COOKIE_NAME } from "../core";

/**
 * Gets the current locale code from the `"x-lingo-locale"` header.
 *
 * @returns Promise that resolves to the current locale code, or `"en"` if no header is found.
 *
 * @example Get locale from headers in a server component
 * ```typescript
 * import { loadLocaleFromHeaders } from "lingo.dev/react/rsc";
 *
 * export default async function ServerComponent() {
 *   const locale = await loadLocaleFromHeaders();
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
 * Gets the current locale code from the `"lingo-locale"` cookie.
 *
 * @returns Promise that resolves to the current locale code, or `"en"` if no cookie is found.
 *
 * @example Get locale from cookies in a server component
 * ```typescript
 * import { loadLocaleFromCookies } from "lingo.dev/react/rsc";
 *
 * export default async function ServerComponent() {
 *   const locale = await loadLocaleFromCookies();
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
 * Sets the current locale in the `"lingo-locale"` cookie.
 *
 * @param locale - The locale code to store in the cookie.
 *
 * @example Set locale in a server action
 * ```typescript
 * import { setLocaleInCookies } from "lingo.dev/react/rsc";
 *
 * export async function changeLocale(locale: string) {
 *   "use server";
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
 * Loads the dictionary for the current locale.
 *
 * The current locale is determined by the `"lingo-locale"` cookie.
 *
 * @param loader - A callback function that loads the dictionary for the current locale.
 *
 * @returns Promise that resolves to the dictionary object containing localized content.
 *
 * @example Load dictionary from request in a server component
 * ```typescript
 * import { loadDictionaryFromRequest, loadDictionary } from "lingo.dev/react/rsc";
 *
 * export default async function ServerComponent() {
 *   const dictionary = await loadDictionaryFromRequest(loadDictionary);
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
