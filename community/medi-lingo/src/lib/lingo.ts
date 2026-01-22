/**
 * Lingo.dev SDK integration for translation
 * 
 * NOTE: This file should ONLY be imported in server-side code (API routes)
 * because the Lingo.dev SDK has server-side dependencies (jsdom).
 * 
 * For the list of supported languages, import from ./languages.ts instead.
 */

import { LingoDotDevEngine } from "lingo.dev/sdk";
import type { MedicalReportAnalysis } from "./types";

// Initialize Lingo.dev engine (lazy initialization)
let lingoEngine: LingoDotDevEngine | null = null;

function getLingoEngine(): LingoDotDevEngine {
  if (!lingoEngine) {
    const apiKey = process.env.LINGODOTDEV_API_KEY;

    if (!apiKey) {
      throw new Error(
        "LINGODOTDEV_API_KEY is not set. Please add it to your .env.local file."
      );
    }

    lingoEngine = new LingoDotDevEngine({
      apiKey,
    });
  }

  return lingoEngine;
}

/**
 * Translates a medical report analysis to the target language
 * @param analysis - The medical report analysis in English
 * @param targetLocale - The target language code (e.g., "es", "hi", "zh-Hans")
 * @returns Translated medical report analysis
 */
export async function translateAnalysis(
  analysis: MedicalReportAnalysis,
  targetLocale: string
): Promise<MedicalReportAnalysis> {
  // If target is English, return as-is
  if (targetLocale === "en") {
    return analysis;
  }

  const engine = getLingoEngine();

  try {
    // Use localizeObject for translating the entire structure
    const translated = await engine.localizeObject(analysis, {
      sourceLocale: "en",
      targetLocale,
    });

    return translated as MedicalReportAnalysis;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(
      `Failed to translate to ${targetLocale}. Please try again.`
    );
  }
}
