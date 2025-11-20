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
import type { DictionarySchema } from "../react/server";
import {
  createCachedTranslatorFromConfig,
  type TranslatorConfig,
} from "../translate";

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

export interface HashTranslationRequest {
  locale: string;
  hashes: string[];
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
  // Use absolute sourceRoot if provided, otherwise resolve relative to cwd
  const rootPath = path.isAbsolute(config.sourceRoot)
    ? config.sourceRoot
    : path.join(process.cwd(), config.sourceRoot);
  const cachePath = path.join(
    rootPath,
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
  const metadataPath = path.join(rootPath, config.lingoDir, "metadata.json");

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

/**
 * Handle translation request for specific hashes only
 * More efficient than translating the entire dictionary
 */
export async function handleHashTranslationRequest(
  locale: string,
  hashes: string[],
  config: TranslationMiddlewareConfig,
): Promise<TranslationResponse> {
  const startTime = performance.now();

  console.log(
    `[lingo.dev] Translation requested for ${hashes.length} hashes in locale: ${locale}`,
  );

  // Use absolute sourceRoot if provided, otherwise resolve relative to cwd
  const rootPath = path.isAbsolute(config.sourceRoot)
    ? config.sourceRoot
    : path.join(process.cwd(), config.sourceRoot);

  // Construct cache path
  const cachePath = path.join(
    rootPath,
    config.lingoDir,
    "cache",
    `${locale}.json`,
  );

  // Check if we have cached translations
  let cachedTranslations: Record<string, string> = {};
  try {
    const cached = await fs.readFile(cachePath, "utf-8");
    const cachedDict = JSON.parse(cached);

    // Extract all translations from cached dictionary
    for (const file of Object.values(cachedDict.files || {})) {
      const entries = (file as any).entries || {};
      Object.assign(cachedTranslations, entries);
    }
  } catch (error) {
    // Cache doesn't exist or is invalid - will generate
  }

  // Check which hashes we already have
  const missingHashes = hashes.filter((hash) => !cachedTranslations[hash]);

  if (missingHashes.length === 0) {
    // All hashes are cached!
    const endTime = performance.now();
    console.log(
      `[lingo.dev] Cache hit for all ${hashes.length} hashes in ${locale} in ${(endTime - startTime).toFixed(2)}ms`,
    );

    const result: Record<string, string> = {};
    for (const hash of hashes) {
      result[hash] = cachedTranslations[hash];
    }

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
      body: JSON.stringify(result),
    };
  }

  // Check if we're in production and generation is disabled
  const isDev = process.env.NODE_ENV === "development";
  const canGenerate = isDev || config.allowProductionGeneration;

  if (!canGenerate) {
    console.warn(
      `[lingo.dev] Translations not found for ${missingHashes.length} hashes in ${locale} and production generation is disabled`,
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
        missingHashes,
      }),
    };
  }

  // Load metadata
  const metadataPath = path.join(rootPath, config.lingoDir, "metadata.json");

  try {
    const metadataContent = await fs.readFile(metadataPath, "utf-8");
    const metadata = JSON.parse(metadataContent);

    // Build entries map for ONLY the missing hashes
    const entriesMap: Record<
      string,
      { text: string; context: Record<string, any> }
    > = {};

    for (const hash of missingHashes) {
      const entry = metadata.entries[hash];
      if (entry) {
        entriesMap[hash] = {
          text: entry.sourceText,
          context: entry.context || {},
        };
      }
    }

    // Generate translations for missing hashes only
    let newTranslations: Record<string, string> = {};

    if (config.translator && Object.keys(entriesMap).length > 0) {
      console.log(
        `[lingo.dev] Generating translations for ${Object.keys(entriesMap).length} missing hashes in ${locale} using ${config.translator.type} translator...`,
      );

      // Create cached translator
      const translator = createCachedTranslatorFromConfig(config.translator, {
        cacheDir: config.lingoDir,
        sourceRoot: config.sourceRoot,
      });

      // Batch translate only the missing hashes
      newTranslations = await translator.batchTranslate(locale, entriesMap);
    }

    // Merge with cached translations
    const allTranslations = { ...cachedTranslations, ...newTranslations };

    // Update cache with merged translations
    const updatedDictionary: DictionarySchema = {
      version: 0.1,
      locale: locale,
      files: {
        __metadata: {
          entries: allTranslations,
        },
      },
    };

    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(updatedDictionary, null, 2));

    // Return only the requested hashes
    const result: Record<string, string> = {};
    for (const hash of hashes) {
      result[hash] = allTranslations[hash] || "";
    }

    const endTime = performance.now();
    console.log(
      `[lingo.dev] Translation generated for ${hashes.length} hashes (${missingHashes.length} new) in ${locale} in ${(endTime - startTime).toFixed(2)}ms`,
    );

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(
      `[lingo.dev] Error generating translations for hashes:`,
      error,
    );

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
