/**
 * Build-time translation processor
 *
 * Handles translation generation and validation at build time
 * Supports two modes:
 * - "translate": Generate all translations, fail if translation fails
 * - "cache-only": Validate cache completeness, fail if incomplete
 */
// TODO (AleksandrSl 08/12/2025): Add ICU validation for messages? The problem is that we don't know which will be rendered as a simple text
import fs from "fs/promises";
import path from "path";
import type { LingoConfig, MetadataSchema } from "../types";
import { logger } from "../utils/logger";
import {
  startTranslationServer,
  type TranslationServer,
} from "../translation-server";
import { loadMetadata } from "../metadata/manager";
import { createCache, type TranslationCache } from "../translators";
import { dictionaryFrom } from "../translators/api";
import type { LocaleCode } from "lingo.dev/spec";

export interface BuildTranslationOptions {
  config: LingoConfig;
  publicOutputPath: string;
  metadataFilePath: string;
}

export interface BuildTranslationResult {
  /**
   * Whether the build succeeded
   */
  success: boolean;

  /**
   * Error message if build failed
   */
  error?: string;

  /**
   * Translation statistics per locale
   */
  stats: Record<
    string,
    {
      total: number;
      translated: number;
      failed: number;
    }
  >;
}

/**
 * Process translations at build time
 *
 * @throws Error if validation or translation fails (causes build to fail)
 */
export async function processBuildTranslations(
  options: BuildTranslationOptions,
): Promise<BuildTranslationResult> {
  const { config, publicOutputPath, metadataFilePath } = options;

  // Determine build mode (env var > options > config)
  const buildMode =
    (process.env.LINGO_BUILD_MODE as "translate" | "cache-only") ||
    config.buildMode;

  logger.info(`🌍 Build mode: ${buildMode}`);

  if (metadataFilePath) {
    logger.info(`📋 Using build metadata file: ${metadataFilePath}`);
  }

  const metadata = await loadMetadata(metadataFilePath);

  if (!metadata || Object.keys(metadata.entries).length === 0) {
    logger.info("No translations to process (metadata is empty)");
    return {
      success: true,
      stats: {},
    };
  }

  const totalEntries = Object.keys(metadata.entries).length;
  logger.info(`📊 Found ${totalEntries} translatable entries`);

  const cache = createCache(config);

  // Handle cache-only mode
  if (buildMode === "cache-only") {
    logger.info("🔍 Validating translation cache...");
    await validateCache(config, metadata, cache);
    logger.info("✅ Cache validation passed");

    if (publicOutputPath) {
      await copyStaticFiles(config, publicOutputPath, metadata, cache);
    }

    return {
      success: true,
      stats: buildCacheStats(config, metadata),
    };
  }

  // Handle translate mode
  logger.info("🔄 Generating translations...");
  let translationServer: TranslationServer | undefined;

  try {
    translationServer = await startTranslationServer({
      startPort: config.dev.translationServerStartPort,
      onError: (err) => {
        logger.error("Translation server error:", err);
      },
      config,
    });

    // When pluralization is enabled, we need to generate the source locale file too
    // because pluralization modifies the sourceText
    const needsSourceLocale = config.pluralization?.enabled !== false;
    const allLocales = needsSourceLocale
      ? [config.sourceLocale, ...config.targetLocales]
      : config.targetLocales;

    logger.info(
      `Processing translations for ${allLocales.length} locale(s)${needsSourceLocale ? " (including source locale for pluralization)" : ""}...`,
    );

    const stats: BuildTranslationResult["stats"] = {};
    const errors: Array<{ locale: LocaleCode; error: string }> = [];

    // Translate all locales in parallel
    const localePromises = allLocales.map(async (locale) => {
      logger.info(`Translating to ${locale}...`);

      const result = await translationServer!.translateAll(locale);

      stats[locale] = {
        total: totalEntries,
        translated: Object.keys(result.translations).length,
        failed: result.errors.length,
      };

      if (result.errors.length > 0) {
        logger.warn(
          `⚠️  ${result.errors.length} translation error(s) for ${locale}`,
        );
        errors.push({
          locale,
          error: `${result.errors.length} translation(s) failed`,
        });
      } else {
        logger.info(`✅ ${locale} completed successfully`);
      }
    });

    await Promise.all(localePromises);

    // Fail build if any translations failed in translate mode
    if (errors.length > 0) {
      const errorMsg = formatTranslationErrors(errors);
      logger.error(errorMsg);
      process.exit(1);
    }

    // Copy cache to public directory if requested
    if (publicOutputPath) {
      await copyStaticFiles(config, publicOutputPath, metadata, cache);
    }

    logger.info("✅ Translation generation completed successfully");

    return {
      success: true,
      stats,
    };
  } catch (error) {
    logger.error("❌ Translation generation failed:", error);
    process.exit(1);
  } finally {
    if (translationServer) {
      await translationServer.stop();
      logger.info("✅ Translation server stopped");
    }
  }
}

/**
 * Validate that all required translations exist in cache
 * @throws Error if cache is incomplete or missing
 */
async function validateCache(
  config: LingoConfig,
  metadata: MetadataSchema,
  cache: TranslationCache,
): Promise<void> {
  const allHashes = Object.keys(metadata.entries);
  const missingLocales: string[] = [];
  const incompleteLocales: Array<{
    locale: LocaleCode;
    missing: number;
    total: number;
  }> = [];

  // Include source locale if pluralization is enabled
  const needsSourceLocale = config.pluralization?.enabled !== false;
  const allLocales = needsSourceLocale
    ? [config.sourceLocale, ...config.targetLocales]
    : config.targetLocales;

  for (const locale of allLocales) {
    try {
      const entries = await cache.get(locale);

      if (Object.keys(entries).length === 0) {
        missingLocales.push(locale);
        logger.debug(`Cache file not found or empty for ${locale}`);
        continue;
      }

      const missingHashes = allHashes.filter((hash) => !entries[hash]);

      if (missingHashes.length > 0) {
        incompleteLocales.push({
          locale,
          missing: missingHashes.length,
          total: allHashes.length,
        });

        // Log first few missing hashes for debugging
        logger.debug(
          `Missing hashes in ${locale}: ${missingHashes.slice(0, 5).join(", ")}${
            missingHashes.length > 5 ? "..." : ""
          }`,
        );
      }
    } catch (error) {
      missingLocales.push(locale);
      logger.debug(`Failed to read cache for ${locale}:`, error);
    }
  }

  if (missingLocales.length > 0 || incompleteLocales.length > 0) {
    const errorMsg = formatCacheValidationError(
      missingLocales,
      incompleteLocales,
    );
    logger.error(errorMsg);
    process.exit(1);
  }
}

function buildCacheStats(
  config: LingoConfig,
  metadata: MetadataSchema,
): BuildTranslationResult["stats"] {
  const totalEntries = Object.keys(metadata.entries).length;
  const stats: BuildTranslationResult["stats"] = {};

  // Include source locale if pluralization is enabled
  const needsSourceLocale = config.pluralization?.enabled !== false;
  const allLocales = needsSourceLocale
    ? [config.sourceLocale, ...config.targetLocales]
    : config.targetLocales;

  for (const locale of allLocales) {
    stats[locale] = {
      total: totalEntries,
      translated: totalEntries, // Assumed complete if validation passed
      failed: 0,
    };
  }

  return stats;
}

async function copyStaticFiles(
  config: LingoConfig,
  publicOutputPath: string,
  metadata: MetadataSchema,
  cache: TranslationCache,
): Promise<void> {
  logger.info(`📦 Generating static translation files in ${publicOutputPath}`);

  await fs.mkdir(publicOutputPath, { recursive: true });

  const usedHashes = new Set(Object.keys(metadata.entries));
  logger.info(`📊 Filtering translations to ${usedHashes.size} used hash(es)`);

  // Include source locale if pluralization is enabled
  const needsSourceLocale = config.pluralization?.enabled !== false;
  const allLocales = needsSourceLocale
    ? [config.sourceLocale, ...config.targetLocales]
    : config.targetLocales;

  for (const locale of allLocales) {
    const publicFilePath = path.join(publicOutputPath, `${locale}.json`);

    try {
      const entries = await cache.get(locale, Array.from(usedHashes));
      const outputData = dictionaryFrom(locale, entries);

      await fs.writeFile(
        publicFilePath,
        JSON.stringify(outputData, null, 2),
        "utf-8",
      );

      logger.info(
        `✓ Generated ${locale}.json (${Object.keys(entries).length} translations)`,
      );
    } catch (error) {
      logger.error(`❌ Failed to generate ${locale}.json:`, error);
      process.exit(1);
    }
  }
}

function formatCacheValidationError(
  missingLocales: string[],
  incompleteLocales: Array<{
    locale: LocaleCode;
    missing: number;
    total: number;
  }>,
): string {
  let msg = "❌ Cache validation failed in cache-only mode:\n\n";

  if (missingLocales.length > 0) {
    msg += `  📁 Missing cache files:\n`;
    msg += missingLocales.map((locale) => `    - ${locale}.json`).join("\n");
    msg += "\n\n";
  }

  if (incompleteLocales.length > 0) {
    msg += `  📊 Incomplete cache:\n`;
    msg += incompleteLocales
      .map(
        (item) =>
          `    - ${item.locale}: ${item.missing}/${item.total} translations missing`,
      )
      .join("\n");
    msg += "\n\n";
  }

  msg += `  💡 To fix:\n`;
  msg += `    1. Set LINGO_BUILD_MODE=translate to generate translations\n`;
  msg += `    2. Commit the generated .lingo/cache/*.json files\n`;
  msg += `    3. Ensure translation API keys are available if generating translations`;

  return msg;
}

function formatTranslationErrors(
  errors: Array<{ locale: LocaleCode; error: string }>,
): string {
  let msg = "❌ Translation generation failed:\n\n";

  msg += errors.map((err) => `  - ${err.locale}: ${err.error}`).join("\n");

  msg += "\n\n";
  msg += `  💡 Translation errors must be resolved in "translate" mode.\n`;
  msg += `     Check translation server logs for details.`;

  return msg;
}
