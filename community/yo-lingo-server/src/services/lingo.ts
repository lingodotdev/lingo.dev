import { LingoDotDevEngine } from "lingo.dev/sdk";

const apiKey = process.env.LINGO_API_KEY;
if (!apiKey) {
  console.error("❌ LINGO_API_KEY is missing in .env file");
}
export const lingo = new LingoDotDevEngine({
  apiKey: apiKey!,
});

export async function translateContent<T extends Record<string, any>>(
  content: T,
  targetLocales: string[]
) {
  const translations = await lingo.batchLocalizeText(content as any, {
    sourceLocale: "en",
    targetLocales: targetLocales as any,
  });

  const localized = targetLocales.reduce((acc, locale, index) => {
    acc[locale] = translations[index] as any;
    return acc;
  }, {} as Record<string, any>);

  return {
    en: content,
    ...localized,
  };
}
