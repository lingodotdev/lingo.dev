import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "../core";

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
