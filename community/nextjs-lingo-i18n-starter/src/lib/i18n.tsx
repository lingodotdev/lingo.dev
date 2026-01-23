export const languages = ["en", "hi", "es"] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = "en";

export function isValidLang(lang: string): lang is Lang {
  return (languages as readonly string[]).includes(lang);
}
