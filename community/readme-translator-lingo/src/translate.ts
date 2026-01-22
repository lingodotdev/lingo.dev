import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY!,
});

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  const result = await lingo.localizeText(text, {
    sourceLocale: "en",
    targetLocale: targetLang,
  });

  return result;
}