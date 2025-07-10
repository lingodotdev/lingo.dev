import { cookies, headers } from "next/headers";
import { LOCALE_HEADER_NAME, LOCALE_COOKIE_NAME } from "../core";

/**
 * Returns the locale sent via the custom header. Falls back to "en" when the
 * header is absent.
 */
export async function loadLocaleFromHeaders(): Promise<string> {
  const requestHeaders = await headers();
  return requestHeaders.get(LOCALE_HEADER_NAME) || "en";
}

/**
 * Returns the locale stored in the incoming request cookies. Falls back to
 * "en" when the cookie is absent.
 */
export async function loadLocaleFromCookies(): Promise<string> {
  const requestCookies = await cookies();
  return requestCookies.get(LOCALE_COOKIE_NAME)?.value || "en";
}

/**
 * Loads the appropriate dictionary for the current request.
 */
export async function loadDictionaryFromRequest(
  loader: (locale: string) => Promise<any>,
) {
  const locale = await loadLocaleFromCookies();
  return loader(locale);
}
