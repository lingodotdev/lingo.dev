import { LOCALE_COOKIE_NAME } from "../core";

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
