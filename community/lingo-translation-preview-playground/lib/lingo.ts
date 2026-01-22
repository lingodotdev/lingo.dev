"use server";

import { LingoDotDevEngine } from "lingo.dev/sdk";

export interface TranslationResult {
  [locale: string]: string;
}

export async function translateText(
  text: string,
  targetLocales: string[],
): Promise<TranslationResult> {
  const apiKey = process.env.LINGO_API_KEY;

  if (!apiKey) {
    throw new Error("LINGO_API_KEY is not set.");
  }

  const lingo = new LingoDotDevEngine({ apiKey });

  const results = await lingo.batchLocalizeText(text, {
    sourceLocale: "en",
    targetLocales: targetLocales as any,
    fast: true,
  });

  const resultMap: TranslationResult = {};
  results.forEach((translatedText, index) => {
    resultMap[targetLocales[index]] = translatedText;
  });

  return resultMap;
}
