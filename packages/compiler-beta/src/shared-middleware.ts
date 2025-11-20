/**
 * Shared middleware logic for both Vite and Next.js
 *
 * This handler is used by:
 * - Vite plugin middleware (configureServer)
 * - Next.js API route handler
 *
 * It provides a unified implementation for on-demand translation generation
 */

import fs from "fs/promises";
import path from "path";
import type { DictionarySchema } from "./react/server";
import {
  createCachedTranslatorFromConfig,
  type TranslatorConfig,
  type Translator,
} from "./translate";

export interface TranslationMiddlewareConfig {
  sourceRoot: string;
  lingoDir: string;
  sourceLocale: string;
  translator?: TranslatorConfig;
  allowProductionGeneration?: boolean;
}

export interface TranslationResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Handle translation request
 * Returns a normalized response that can be adapted to any framework
 */
export async function handleTranslationRequest(
  locale: string,
  config: TranslationMiddlewareConfig,
): Promise<TranslationResponse> {
  const startTime = performance.now();

  console.log(`[lingo.dev] Translation requested for locale: ${locale}`);

  // Construct cache path
  const cachePath = path.join(
    process.cwd(),
    config.sourceRoot,
    config.lingoDir,
    "cache",
    `${locale}.json`,
  );

  // Check if cached
  try {
    const cached = await fs.readFile(cachePath, "utf-8");
    const endTime = performance.now();
    console.log(
      `[lingo.dev] Cache hit for ${locale} in ${(endTime - startTime).toFixed(2)}ms`,
    );

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
      body: cached,
    };
  } catch (error) {
    // Cache miss - continue to generation
  }

  // Check if we're in production and generation is disabled
  const isDev = process.env.NODE_ENV === "development";
  const canGenerate = isDev || config.allowProductionGeneration;

  if (!canGenerate) {
    console.warn(
      `[lingo.dev] Translation not found for ${locale} and production generation is disabled`,
    );
    return {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Translation not available",
        message: `Translations for locale "${locale}" are not pre-generated. Please run a build to generate translations.`,
        locale,
      }),
    };
  }

  // Load metadata
  const metadataPath = path.join(
    process.cwd(),
    config.sourceRoot,
    config.lingoDir,
    "metadata.json",
  );

  try {
    const metadataContent = await fs.readFile(metadataPath, "utf-8");
    const metadata = JSON.parse(metadataContent);

    // Build source dictionary
    const sourceDictionary: DictionarySchema = {
      version: 0.1,
      locale: config.sourceLocale,
      files: {
        __metadata: {
          entries: Object.entries(metadata.entries || {}).reduce(
            (acc, [hash, entry]: [string, any]) => {
              acc[hash] = entry.sourceText;
              return acc;
            },
            {} as Record<string, string>,
          ),
        },
      },
    };

    // Generate translations
    let translated: DictionarySchema;

    if (config.translator) {
      console.log(
        `[lingo.dev] Generating translations for ${locale} using ${config.translator.type} translator...`,
      );

      // Create cached translator
      const translator = createCachedTranslatorFromConfig(config.translator, {
        cacheDir: config.lingoDir,
        sourceRoot: config.sourceRoot,
      });

      // Prepare entries map
      const entriesMap: Record<
        string,
        { text: string; context: Record<string, any> }
      > = {};
      for (const [hash, sourceText] of Object.entries(
        sourceDictionary.files.__metadata.entries,
      )) {
        entriesMap[hash] = {
          text: sourceText,
          context: {},
        };
      }

      // Batch translate
      const translatedEntries = await translator.batchTranslate(
        locale,
        entriesMap,
      );

      translated = {
        version: sourceDictionary.version,
        locale: locale,
        files: {
          __metadata: {
            entries: translatedEntries,
          },
        },
      };
    } else {
      // Return source dictionary if no translator configured
      translated = sourceDictionary;
    }

    // Save to cache
    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    const translatedJson = JSON.stringify(translated, null, 2);
    await fs.writeFile(cachePath, translatedJson);

    const endTime = performance.now();
    console.log(
      `[lingo.dev] Translation generated for ${locale} in ${(endTime - startTime).toFixed(2)}ms`,
    );

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
      body: translatedJson,
    };
  } catch (error) {
    console.error(`[lingo.dev] Error generating translations:`, error);

    return {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to generate translations",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
