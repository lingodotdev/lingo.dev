"use server";

import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

export async function translateText(
  text: string,
  fromLang: string,
  toLang: string,
) {
  const result = await lingoDotDev.localizeText(text, {
    sourceLocale: fromLang,
    targetLocale: toLang,
  });

  return result;
}

export async function recognizeText(text: string) {
  const detectedLang = await lingoDotDev.recognizeLocale(text);

  return detectedLang;
}
