import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "../core";

export const loadDictionary = async (
  requestOrExplicitLocale: Request | string,
): Promise<any> => {
  return null;
};

export async function loadDictionary_internal(
  requestOrExplicitLocale: Request | string,
  dictionaryLoader: Record<string, () => Promise<any>>,
) {
  const locale = parseLocaleCode(requestOrExplicitLocale);

  // get dictionary loader for specific locale
  const loader = dictionaryLoader[locale];

  // locale is not available in the dictionary
  if (!loader) {
    // TODO: throw a clear error message
    return null;
  }

  return loader().then((value) => value.default);
}

function parseLocaleCode(input: Request | string): string {
  // if it's a string, assume it's a locale code
  if (typeof input === "string") {
    return input;
  }

  // it's a Request, so get the Cookie header
  const cookieHeaderValue = input.headers.get("Cookie");

  // there's no Cookie header, so return default
  if (!cookieHeaderValue) {
    return DEFAULT_LOCALE;
  }

  // get the lingo-locale cookie
  const cookies = cookieHeaderValue.split(";");
  const cookie = cookies.find(isLingoLocaleCookie);

  // there's no lingo-locale cookie, so return default
  if (!cookie) {
    return DEFAULT_LOCALE;
  }

  return cookie;
}

function isLingoLocaleCookie(cookie: string) {
  return cookie.trim().startsWith(`${LOCALE_COOKIE_NAME}=`);
}
