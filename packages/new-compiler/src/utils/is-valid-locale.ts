import { isValidLocale as _isValidLocale } from "lingo.dev/locale-codes";
import type { LocaleCode } from "lingo.dev/spec";

export function isValidLocale(locale: string): locale is LocaleCode {
  return _isValidLocale(locale);
}

export function parseLocale(
  locale: string | undefined,
): LocaleCode | undefined {
  return locale && isValidLocale(locale) ? locale : undefined;
}

export function parseLocaleOrThrow(locale: string | undefined): LocaleCode {
  if (locale && isValidLocale(locale)) {
    return locale;
  } else {
    throw new Error(`Invalid locale: ${locale}`);
  }
}
