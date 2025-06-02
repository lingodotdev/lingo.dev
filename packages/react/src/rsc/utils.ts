import { cookies, headers } from "next/headers";
import { LOCALE_HEADER_NAME, LOCALE_COOKIE_NAME } from "../core";

export async function loadLocaleFromHeaders() {
  const requestHeaders = await headers();
  const result = requestHeaders.get(LOCALE_HEADER_NAME) || "en";

  return result;
}

export async function loadLocaleFromCookies() {
  const requestCookies = await cookies();
  const result = requestCookies.get(LOCALE_COOKIE_NAME)?.value || "en";
  return result;
}

export async function setLocaleInCookies(locale: string) {
  const requestCookies = await cookies();
  requestCookies.set(LOCALE_COOKIE_NAME, locale);
}

export async function loadDictionaryFromRequest(
  loader: (locale: string) => Promise<any>,
) {
  const locale = await loadLocaleFromCookies();
  return loader(locale);
}
