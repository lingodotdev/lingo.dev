"use server";

import { LingoDotDevEngine } from "lingo.dev/sdk";
import { defaultContent, type Content } from "../content";

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

export async function translateContent(targetLocale: string): Promise<Content> {
  if (targetLocale === "en") return defaultContent;

  try {
    const translated = await lingo.localizeObject(defaultContent, {
      sourceLocale: "en",
      targetLocale: targetLocale,
    });
    return translated as Content;
  } catch (error) {
    return defaultContent;
  }
}
