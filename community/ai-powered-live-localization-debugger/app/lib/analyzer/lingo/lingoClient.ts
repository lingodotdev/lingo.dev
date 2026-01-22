
import { LingoDotDevEngine } from "lingo.dev/sdk";


const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});


export interface TranslationSuggestion {
  translatedText: string;
}

export interface SemanticCheckResult {
  isConsistent: boolean;
  reason?: string;
}

export async function suggestTranslation(
  text: string,
  sourceLocale: string,
  targetLocale: string
): Promise<TranslationSuggestion> {
  try {
    const translatedText = await lingo.localizeText(text, {
      sourceLocale,
      targetLocale,
    });

    return { translatedText };
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to generate translation with Lingo.dev"
    );
  }
}


export async function checkSemanticConsistency(
  sourceText: string,
  targetText: string,
  sourceLocale: string,
  targetLocale: string
): Promise<SemanticCheckResult> {
  try {

    const backTranslated = await lingo.localizeText(targetText, {
      sourceLocale: targetLocale,
      targetLocale: sourceLocale,
    });

    const isConsistent =
      normalize(sourceText) === normalize(backTranslated);

    return {
      isConsistent,
      reason: isConsistent
        ? undefined
        : "Target translation may not preserve the original meaning.",
    };
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed semantic consistency check with Lingo.dev"
    );
  }
}


function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}
