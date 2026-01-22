"use client";

import { sourceTranslations, defaultLocale } from "./translations";
import type { Locale } from "@/types";
import type { TranslationSchema } from "./translations";

const translationCache = new Map<Locale, TranslationSchema>();

translationCache.set(defaultLocale, sourceTranslations);

export async function translateToLocale(
  targetLocale: Locale
): Promise<TranslationSchema> {
  if (targetLocale === defaultLocale) {
    return sourceTranslations;
  }

  const cached = translationCache.get(targetLocale);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: sourceTranslations,
        targetLocale,
      }),
    });

    if (!response.ok) {
      throw new Error("Translation request failed");
    }

    const { translated } = await response.json();
    translationCache.set(targetLocale, translated as TranslationSchema);
    return translated as TranslationSchema;
  } catch (error) {
    console.error(`Translation to ${targetLocale} failed:`, error);
    return sourceTranslations;
  }
}

export function getCachedTranslation(locale: Locale): TranslationSchema | null {
  return translationCache.get(locale) || null;
}

export function clearTranslationCache(): void {
  translationCache.clear();
  translationCache.set(defaultLocale, sourceTranslations);
}
