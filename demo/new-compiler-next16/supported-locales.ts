import type { LocaleCode } from "@lingo.dev/compiler"
export const targetLocales: LocaleCode[] = ["es", "de", "ru"];
export const sourceLocale: LocaleCode = "en";
export const supportedLocales: LocaleCode[] = [...targetLocales, sourceLocale];
