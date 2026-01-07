/**
 * TranslationService - Main orchestrator for translation workflow
 *
 * Responsibilities:
 * - Coordinates between metadata, cache, and translator
 * - Determines what needs translation
 * - Handles caching strategy
 * - Manages partial failures
 */

import type { TranslationCache } from "./cache";
import type { TranslatableEntry, Translator } from "./api";
import type { LingoEnvironment, MetadataSchema } from "../types";
import {
  type PluralizationConfig,
  PluralizationService,
} from "./pluralization";
import type { Logger } from "../utils/logger";
import type { LocaleCode } from "lingo.dev/spec";
import { PseudoTranslator } from "./pseudotranslator";
import { LingoTranslator } from "./lingo";
import { type CacheConfig, createCache } from "./cache-factory";
import { MemoryTranslationCache } from "./memory-cache";

export type TranslationServiceConfig = {
  /**
   * Source locale (e.g., "en")
   */
  sourceLocale: LocaleCode;

  /**
   * Pluralization configuration
   * If provided, enables automatic pluralization of source messages
   */
  pluralization: Omit<PluralizationConfig, "sourceLocale">;
  models: "lingo.dev" | Record<string, string>;
  prompt?: string;
  environment: LingoEnvironment;
  dev?: {
    usePseudotranslator?: boolean;
  };
} & CacheConfig;

export interface TranslationResult {
  /**
   * Successfully translated entries (hash -> translated text)
   */
  translations: Record<string, string>;

  errors: TranslationError[];

  stats: {
    total: number;
    cached: number;
    translated: number;
    failed: number;
  };
}

export interface TranslationError {
  hash: string;
  sourceText: string;
  error: string;
}

export class TranslationService {
  private pluralizationService?: PluralizationService;
  private translator: Translator<any>;
  private cache: TranslationCache;

  constructor(
    private config: TranslationServiceConfig,
    private logger: Logger,
  ) {
    const isDev = config.environment === "development";

    // 1. Explicit dev override takes precedence
    if (isDev && config.dev?.usePseudotranslator) {
      this.logger.info(
        "📝 Using pseudotranslator (dev.usePseudotranslator enabled)",
      );
      this.translator = new PseudoTranslator({ delayMedian: 100 }, logger);
      this.cache = new MemoryTranslationCache();
    } else {
      // 2. Try to create real translator
      // LingoTranslator constructor will validate and fetch API keys
      // If validation fails, it will throw an error with helpful message
      try {
        const models = config.models;

        this.logger.debug(
          `Creating Lingo translator with models: ${JSON.stringify(models)}`,
        );

        this.cache = createCache(config);
        this.translator = new LingoTranslator(
          {
            models,
            sourceLocale: config.sourceLocale,
            prompt: config.prompt,
          },
          this.logger,
        );

        if (this.config.pluralization?.enabled) {
          this.pluralizationService = new PluralizationService(
            {
              ...this.config.pluralization,
              sourceLocale: this.config.sourceLocale,
            },
            this.logger,
          );
        }
      } catch (error) {
        // 3. Auto-fallback in dev mode if creation fails
        if (isDev) {
          // Use console.error to ensure visibility in all contexts (loader, server, etc.)
          const errorMsg =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(`⚠️ Translation setup error: \n${errorMsg}\n
⚠️ Auto-fallback to pseudotranslator in development mode.
Set the required API keys for real translations.`);

          this.translator = new PseudoTranslator(
            { delayMedian: 100 },
            this.logger,
          );
          this.cache = new MemoryTranslationCache();
        } else {
          // 4. Fail in production
          throw error;
        }
      }
    }
  }

  /**
   * Translate entries to target locale
   *
   * @param locale Target locale (including source locale)
   * @param metadata Metadata schema with all entries
   * @param requestedHashes Optional: only translate specific hashes
   * @returns Translation result with translations and errors
   */
  async translate(
    locale: LocaleCode,
    metadata: MetadataSchema,
    requestedHashes?: string[],
  ): Promise<TranslationResult> {
    const startTime = performance.now();

    // Step 1: Determine which hashes we need to work with
    const workingHashes = requestedHashes || Object.keys(metadata.entries);

    this.logger.debug(
      `Translation requested for ${workingHashes.length} hashes in locale: ${locale}`,
    );

    // Step 2: Check cache first (same for all locales, including source)
    const cachedTranslations = await this.cache.get(locale);

    // Step 3: Determine what needs translation/pluralization
    const uncachedHashes = workingHashes.filter(
      (hash) => !cachedTranslations[hash],
    );
    this.logger.debug(
      `${uncachedHashes.length} hashes need processing, ${workingHashes.length - uncachedHashes.length} are cached`,
    );

    const cachedCount = workingHashes.length - uncachedHashes.length;

    if (uncachedHashes.length === 0) {
      return {
        translations: this.pickTranslations(cachedTranslations, workingHashes),
        errors: [],
        stats: {
          total: workingHashes.length,
          cached: cachedCount,
          translated: 0,
          failed: 0,
        },
      };
    }

    this.logger.debug(
      `Generating translations for ${uncachedHashes.length} uncached hashes in ${locale}...`,
    );

    // Step 4: Filter metadata to only uncached entries
    const filteredMetadata: MetadataSchema = {
      ...metadata,
      entries: Object.fromEntries(
        uncachedHashes
          .map((hash) => [hash, metadata.entries[hash]])
          .filter(([_, entry]) => entry !== undefined),
      ),
    };

    // Step 5: Process pluralization for filtered entries
    if (this.pluralizationService) {
      this.logger.debug(
        `Processing pluralization for ${Object.keys(filteredMetadata.entries).length} entries...`,
      );
      const pluralStats =
        await this.pluralizationService.process(filteredMetadata);
      this.logger.debug(
        `Pluralization stats: ${pluralStats.pluralized} pluralized, ${pluralStats.rejected} rejected, ${pluralStats.failed} failed`,
      );
    }

    // Step 6: Separate overridden entries from entries that need translation
    const overriddenTranslations: Record<string, string> = {};
    const hashesNeedingTranslation: string[] = [];

    this.logger.debug(
      `Checking for overrides in ${uncachedHashes.length} entries`,
    );

    for (const hash of uncachedHashes) {
      const entry = filteredMetadata.entries[hash];
      if (!entry) continue;

      // Check if this entry has an override for the current locale
      if (entry.overrides && entry.overrides[locale]) {
        overriddenTranslations[hash] = entry.overrides[locale];
        this.logger.debug(
          `Using override for ${hash} in locale ${locale}: "${entry.overrides[locale]}"`,
        );
      } else {
        hashesNeedingTranslation.push(hash);
      }
    }

    const overrideCount = Object.keys(overriddenTranslations).length;

    // Step 7: Prepare entries for translation (excluding overridden ones)
    const entriesToTranslate = this.prepareEntries(
      filteredMetadata,
      hashesNeedingTranslation,
    );

    // Step 8: Translate or return source text
    let newTranslations: Record<string, string> = { ...overriddenTranslations };
    const errors: TranslationError[] = [];

    if (locale === this.config.sourceLocale) {
      // For source locale, just return the (possibly pluralized) sourceText
      this.logger.debug(
        `Source locale detected, returning sourceText for ${hashesNeedingTranslation.length} entries`,
      );
      for (const [hash, entry] of Object.entries(entriesToTranslate)) {
        newTranslations[hash] = entry.text;
      }
    } else if (Object.keys(entriesToTranslate).length > 0) {
      // For other locales, translate only entries without overrides
      try {
        this.logger.debug(
          `Translating ${locale} with ${Object.keys(entriesToTranslate).length} entries`,
        );
        const translatedTexts = await this.translator.translate(
          locale,
          entriesToTranslate,
        );
        // Merge translated texts with overridden translations
        newTranslations = { ...overriddenTranslations, ...translatedTexts };
      } catch (error) {
        this.logger.error(`Translation failed:`, error);

        return {
          translations: this.pickTranslations(
            cachedTranslations,
            workingHashes,
          ),
          errors: [
            {
              hash: "all",
              sourceText: "all",
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown translation error",
            },
          ],
          stats: {
            total: workingHashes.length,
            cached: cachedCount,
            translated: 0,
            failed: uncachedHashes.length,
          },
        };
      }

      // Check for partial failures (some hashes didn't get translated)
      for (const hash of uncachedHashes) {
        if (!newTranslations[hash]) {
          const entry = filteredMetadata.entries[hash];
          errors.push({
            hash,
            sourceText: entry?.sourceText || "",
            error: "Translator doesn't return translation",
          });
        }
      }
    }

    // Step 5: Update cache with successful translations (skip for pseudo)
    if (Object.keys(newTranslations).length > 0) {
      try {
        await this.cache.update(locale, newTranslations);
      } catch (error) {
        this.logger.error(`Failed to update cache:`, error);
        // Don't fail the request if cache update fails
      }
    }

    // Step 6: Merge and return
    const allTranslations = { ...cachedTranslations, ...newTranslations };
    const result = this.pickTranslations(allTranslations, workingHashes);

    const endTime = performance.now();
    this.logger.debug(
      `Translation completed for ${locale}: ${Object.keys(newTranslations).length} new, ${cachedCount} cached, ${errors.length} errors in ${(endTime - startTime).toFixed(2)}ms`,
    );

    return {
      translations: result,
      errors,
      stats: {
        total: workingHashes.length,
        cached: cachedCount,
        translated: Object.keys(newTranslations).length,
        failed: errors.length,
      },
    };
  }

  /**
   * Prepare metadata entries for translation
   */
  private prepareEntries(
    metadata: MetadataSchema,
    hashes: string[],
  ): Record<string, TranslatableEntry> {
    const entries: Record<string, TranslatableEntry> = {};

    for (const hash of hashes) {
      const entry = metadata.entries[hash];
      if (entry) {
        entries[hash] = {
          text: entry.sourceText,
          context: entry.context || {},
        };
      }
    }

    return entries;
  }

  /**
   * Pick only requested translations from the full set
   */
  // TODO (AleksandrSl 14/12/2025): SHould I use this in the build somehow?
  private pickTranslations(
    allTranslations: Record<string, string>,
    requestedHashes: string[],
  ): Record<string, string> {
    const result: Record<string, string> = {};

    for (const hash of requestedHashes) {
      if (allTranslations[hash]) {
        result[hash] = allTranslations[hash];
      }
    }

    return result;
  }
}
