import { LingoDotDevEngine } from "lingo.dev/sdk";

// The SDK automatically uses LINGODOTDEV_API_KEY from environment variables

export async function translateText(
  texts: string[],
  targetLocale: string,
  sourceLocale: string = "en",
): Promise<string[]> {
  if (!process.env.LINGODOTDEV_API_KEY) {
    throw new Error("LINGODOTDEV_API_KEY is not configured");
  }

  // Filter out empty/null texts and track their indices
  const validTexts: { index: number; text: string }[] = [];
  texts.forEach((text, index) => {
    if (text && text.trim()) {
      validTexts.push({ index, text });
    }
  });

  if (validTexts.length === 0) {
    return texts;
  }

  // Create a keyed object for the API
  const textObject: Record<string, string> = {};
  validTexts.forEach((item, i) => {
    textObject[`text_${i}`] = item.text;
  });

  try {
    const lingoDotDev = new LingoDotDevEngine({
      apiKey: process.env.LINGODOTDEV_API_KEY!,
    });

    const result = await lingoDotDev.localizeObject(textObject, {
      sourceLocale,
      targetLocale,
    });

    // Reconstruct the array with translations in original positions
    const translatedTexts = [...texts];
    validTexts.forEach((item, i) => {
      const key = `text_${i}`;
      if (result[key]) {
        translatedTexts[item.index] = result[key];
      }
    });

    return translatedTexts;
  } catch (error) {
    console.error("Translation error:", error);
    // Return original texts on error
    return texts;
  }
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
];
