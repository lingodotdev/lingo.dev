import { LingoDotDevEngine } from "lingo.dev/sdk";
import type {
  LandingPageContent,
  SupportedLocale,
  TranslatedContent,
} from "./types";

/**
 * Initialize the Lingo.dev translation engine
 */
function createLingoEngine(): LingoDotDevEngine {
  const apiKey = process.env.LINGO_API_KEY;

  if (!apiKey) {
    throw new Error(
      "LINGO_API_KEY environment variable is not set. " +
        "Please set it in your .env.local file.",
    );
  }

  // Map LINGO_API_KEY to apiKey param
  return new LingoDotDevEngine({ apiKey });
}

/**
 * Flatten LandingPageContent into a key-value object for translation
 *
 * The Lingo.dev API works best with flat objects where keys map to string values.
 * This function converts nested content into a flat structure.
 */
function flattenContent(content: LandingPageContent): Record<string, string> {
  return {
    productName: content.productName,
    headline: content.headline,
    subheadline: content.subheadline,
    feature1Title: content.features[0].title,
    feature1Description: content.features[0].description,
    feature2Title: content.features[1].title,
    feature2Description: content.features[1].description,
    feature3Title: content.features[2].title,
    feature3Description: content.features[2].description,
    ctaText: content.ctaText,
  };
}

/**
 * Unflatten translated key-value object back into LandingPageContent
 */
function unflattenContent(flat: Record<string, string>): LandingPageContent {
  return {
    productName: flat.productName,
    headline: flat.headline,
    subheadline: flat.subheadline,
    features: [
      {
        title: flat.feature1Title,
        description: flat.feature1Description,
      },
      {
        title: flat.feature2Title,
        description: flat.feature2Description,
      },
      {
        title: flat.feature3Title,
        description: flat.feature3Description,
      },
    ],
    ctaText: flat.ctaText,
  };
}

/**
 * Translate landing page content to a single target locale
 *
 * Uses Lingo.dev SDK to translate all string fields
 * while preserving the object structure.
 *
 * @param content - English source content
 * @param targetLocale - Target locale code (fr, de, es, ja)
 * @returns Translated content in target locale
 */
export async function translateContent(
  content: LandingPageContent,
  targetLocale: SupportedLocale,
): Promise<LandingPageContent> {
  if (targetLocale === "en") {
    return content;
  }

  const engine = createLingoEngine();
  const flatContent = flattenContent(content);

  // Use Lingo.dev SDK to localize the content
  const translated = await engine.localizeObject(flatContent, {
    sourceLocale: "en",
    targetLocale: targetLocale,
  });

  return unflattenContent(translated as Record<string, string>);
}

/**
 * Translate landing page content to all supported locales
 *
 * This is the main translation function that generates translations
 * for all target languages (French, German, Spanish, Japanese)
 * in parallel for optimal performance.
 *
 * @param content - English source content
 * @returns Object containing translations for all locales (including original English)
 */
export async function translateAllLocales(
  content: LandingPageContent,
): Promise<TranslatedContent> {
  const targetLocales: SupportedLocale[] = ["fr", "de", "es", "ja"];

  // Translate to all target locales in parallel
  const translationPromises = targetLocales.map(async (locale) => {
    try {
      const translated = await translateContent(content, locale);
      return [locale, translated] as const;
    } catch (error) {
      // Fallback to English content if translation fails
      console.error(`Translation to ${locale} failed:`, error);
      return [locale, content] as const;
    }
  });

  const results = await Promise.all(translationPromises);

  // Build the result object with all translations
  const translations: TranslatedContent = {
    en: content, // Original English content
    fr: content, // Will be replaced
    de: content, // Will be replaced
    es: content, // Will be replaced
    ja: content, // Will be replaced
  };

  // Populate with actual translations
  for (const [locale, translated] of results) {
    translations[locale] = translated;
  }

  return translations;
}
