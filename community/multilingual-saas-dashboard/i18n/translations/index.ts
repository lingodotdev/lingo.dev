import { en } from "./en";
import type { Locale } from "@/types";

export type { TranslationSchema } from "./en";

export const sourceTranslations = en;

export const locales: Locale[] = ["en", "hi", "fr", "es"];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिंदी",
  fr: "Français",
  es: "Español",
};
