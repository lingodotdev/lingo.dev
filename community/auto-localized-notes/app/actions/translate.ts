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
  try {
    const result = await lingoDotDev.localizeText(text, {
      sourceLocale: fromLang,
      targetLocale: toLang,
    });

    return result;
  } catch (error) {
    console.error(error);
    return "error translating the text";
  }
}

export async function recognizeText(text: string) {
  try {
    const detectedLang = await lingoDotDev.recognizeLocale(text);

    return detectedLang;
  } catch (error) {
    console.error(error);
    return "error detecting the language";
  }
}
