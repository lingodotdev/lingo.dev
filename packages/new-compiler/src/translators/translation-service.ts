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
import type { MetadataSchema } from "../types";
import {
  type PluralizationConfig,
  PluralizationService,
} from "./pluralization";
import type { Logger } from "../utils/logger";
import type { LocaleCode } from "lingo.dev/spec";
import { PseudoTranslator } from "./pseudotranslator";

export interface TranslationServiceConfig {
  /**
   * Source locale (e.g., "en")
   */
  sourceLocale: LocaleCode;

  /**
   * Pluralization configuration
   * If provided, enables automatic pluralization of source messages
   */
  pluralization: Omit<PluralizationConfig, "sourceLocale">;
}

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
  private useCache = true;
  private pluralizationService?: PluralizationService;

  constructor(
    private translator: Translator<any>,
    private cache: TranslationCache,
    private config: TranslationServiceConfig,
    private logger: Logger,
  ) {
    const isPseudo = this.translator instanceof PseudoTranslator;
    this.useCache = !isPseudo;

    // Initialize pluralization service if enabled
    // Do this once at construction to avoid repeated API key validation and model creation
    if (this.config.pluralization?.enabled !== false && !isPseudo) {
      this.logger.info("Initializing pluralization service...");
      this.pluralizationService = new PluralizationService(
        {
          ...this.config.pluralization,
          sourceLocale: this.config.sourceLocale,
        },
        this.logger,
      );
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

    this.logger.info(
      `Translation requested for ${workingHashes.length} hashes in locale: ${locale}`,
    );

    // Step 2: Check cache first (same for all locales, including source)
    this.logger.debug(`[TRACE] Checking cache for locale: ${locale}`);
    const cacheStartTime = performance.now();
    const cachedTranslations = this.useCache
      ? await this.cache.get(locale)
      : {};
    const cacheEndTime = performance.now();
    this.logger.debug(
      `[TRACE] Cache check completed in ${(cacheEndTime - cacheStartTime).toFixed(2)}ms, found ${Object.keys(cachedTranslations).length} entries`,
    );

    // Step 3: Determine what needs translation/pluralization
    const uncachedHashes = workingHashes.filter(
      (hash) => !cachedTranslations[hash],
    );
    this.logger.debug(
      `[TRACE] ${uncachedHashes.length} hashes need processing, ${workingHashes.length - uncachedHashes.length} are cached`,
    );

    const cachedCount = workingHashes.length - uncachedHashes.length;

    if (uncachedHashes.length === 0) {
      // All cached!
      const endTime = performance.now();
      this.logger.info(
        `Cache hit for all ${workingHashes.length} hashes in ${locale} in ${(endTime - startTime).toFixed(2)}ms`,
      );

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

    this.logger.info(
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
      this.logger.info(
        `Processing pluralization for ${Object.keys(filteredMetadata.entries).length} entries...`,
      );
      const pluralStats =
        await this.pluralizationService.process(filteredMetadata);
      this.logger.info(
        `Pluralization stats: ${pluralStats.pluralized} pluralized, ${pluralStats.rejected} rejected, ${pluralStats.failed} failed`,
      );
    }

    // Step 6: Separate overridden entries from entries that need translation
    const overriddenTranslations: Record<string, string> = {};
    const hashesNeedingTranslation: string[] = [];

    this.logger.debug(
      `[TRACE] Checking for overrides in ${uncachedHashes.length} entries`,
    );

    for (const hash of uncachedHashes) {
      const entry = filteredMetadata.entries[hash];
      if (!entry) continue;

      // Check if this entry has an override for the current locale
      if (entry.overrides && entry.overrides[locale]) {
        overriddenTranslations[hash] = entry.overrides[locale];
        this.logger.debug(
          `[TRACE] Using override for ${hash} in locale ${locale}: "${entry.overrides[locale]}"`,
        );
      } else {
        hashesNeedingTranslation.push(hash);
      }
    }

    const overrideCount = Object.keys(overriddenTranslations).length;
    if (overrideCount > 0) {
      this.logger.info(
        `Found ${overrideCount} override(s) for locale ${locale}, skipping AI translation for these entries`,
      );
    }

    // Step 7: Prepare entries for translation (excluding overridden ones)
    this.logger.debug(
      `[TRACE] Preparing ${hashesNeedingTranslation.length} entries for translation (after overrides)`,
    );
    const entriesToTranslate = this.prepareEntries(
      filteredMetadata,
      hashesNeedingTranslation,
    );
    this.logger.debug(
      `[TRACE] Prepared ${Object.keys(entriesToTranslate).length} entries`,
    );

    // Step 8: Translate or return source text
    let newTranslations: Record<string, string> = { ...overriddenTranslations };
    const errors: TranslationError[] = [];

    if (locale === this.config.sourceLocale) {
      // For source locale, just return the (possibly pluralized) sourceText
      this.logger.debug(
        `[TRACE] Source locale detected, returning sourceText for ${hashesNeedingTranslation.length} entries`,
      );
      for (const [hash, entry] of Object.entries(entriesToTranslate)) {
        newTranslations[hash] = entry.text;
      }
    } else if (Object.keys(entriesToTranslate).length > 0) {
      // For other locales, translate only entries without overrides
      try {
        this.logger.debug(
          `[TRACE] Calling translator.translate() for ${locale} with ${Object.keys(entriesToTranslate).length} entries`,
        );
        this.logger.debug(`[TRACE] About to await translator.translate()...`);
        const translateStartTime = performance.now();
        this.logger.debug(`[TRACE] Executing translator.translate() NOW`);
        const translatedTexts = await this.translator.translate(
          locale,
          entriesToTranslate,
        );
        this.logger.debug(`[TRACE] translator.translate() returned`);

        // Merge translated texts with overridden translations
        newTranslations = { ...overriddenTranslations, ...translatedTexts };

        const translateEndTime = performance.now();
        this.logger.debug(
          `[TRACE] translator.translate() completed in ${(translateEndTime - translateStartTime).toFixed(2)}ms`,
        );
        this.logger.debug(
          `[TRACE] Received ${Object.keys(translatedTexts).length} translations (+ ${overrideCount} overrides)`,
        );
      } catch (error) {
        // Complete failure - log and return what we have from cache
        this.logger.error(`Translation failed completely:`, error);

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
            error: "Translation not returned by translator",
          });
        }
      }
    }

    // Step 5: Update cache with successful translations (skip for pseudo)
    if (this.useCache && Object.keys(newTranslations).length > 0) {
      try {
        this.logger.debug(
          `[TRACE] Updating cache with ${Object.keys(newTranslations).length} translations for ${locale}`,
        );
        const updateStartTime = performance.now();
        await this.cache.update(locale, newTranslations);
        const updateEndTime = performance.now();
        this.logger.debug(
          `[TRACE] Cache update completed in ${(updateEndTime - updateStartTime).toFixed(2)}ms`,
        );
        this.logger.info(
          `Updated cache with ${Object.keys(newTranslations).length} translations for ${locale}`,
        );
      } catch (error) {
        this.logger.error(`Failed to update cache:`, error);
        // Don't fail the request if cache update fails
      }
    }

    // Step 6: Merge and return
    const allTranslations = { ...cachedTranslations, ...newTranslations };
    const result = this.pickTranslations(allTranslations, workingHashes);

    const endTime = performance.now();
    this.logger.info(
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
