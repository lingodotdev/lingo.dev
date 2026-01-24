import { LingoDotDevEngine } from "lingo.dev/sdk";
import * as dotenv from 'dotenv';
dotenv.config({quiet: true });

let engine: LingoDotDevEngine | null = null;

/**
 * Initializes the Lingo.dev engine with API key.
 */
function getEngine(): LingoDotDevEngine {
  if (engine) {
    return engine;
  }

  const apiKey = process.env.LINGODOTDEV_API_KEY;

  if (!apiKey) {
    throw new Error(
      "LINGODOTDEV_API_KEY environment variable is not set.\n" +
        "Please set it with your Lingo.dev API key:\n" +
        "  export LINGODOTDEV_API_KEY=your_api_key_here\n\n" +
        "Get your API key at: https://lingo.dev"
    );
  }

  engine = new LingoDotDevEngine({
    apiKey,
  });

  return engine;
}

/**
 * Translates text to the target locale.
 */
export async function translateText(
  text: string,
  targetLocale: string,
  sourceLocale: string = "en"
): Promise<string> {
  const lingoDotDev = getEngine();

  try {
    const result = await lingoDotDev.localizeText(text, {
      sourceLocale,
      targetLocale,
    });

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Translation failed: ${error.message}`);
    }
    throw new Error("Translation failed with unknown error");
  }
}

/**
 * Translates text in chunks to handle large man pages.
 * Splits by paragraphs to maintain context.
 */
export async function translateLargeText(
  text: string,
  targetLocale: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  // Split into paragraphs (double newlines or significant whitespace)
  const paragraphs = text.split(/\n\s*\n/);
  const translatedParagraphs: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];

    // Skip empty paragraphs
    if (paragraph.trim() === "") {
      translatedParagraphs.push(paragraph);
      continue;
    }

    // Translate the paragraph
    const translated = await translateText(paragraph, targetLocale);
    translatedParagraphs.push(translated);

    // Report progress
    if (onProgress) {
      const percent = Math.round(((i + 1) / paragraphs.length) * 100);
      onProgress(percent);
    }
  }

  return translatedParagraphs.join("\n\n");
}
