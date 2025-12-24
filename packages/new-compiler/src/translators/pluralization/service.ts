/**
 * Pluralization service with batching and caching
 */

import type { LanguageModel } from "ai";
import { generateText } from "ai";
import type {
  ICUGenerationResult,
  PluralCandidate,
  PluralizationBatch,
  PluralizationConfig,
  PluralizationResponse,
  PluralizationStats,
} from "./types";
import {
  createAiModel,
  parseModelString,
  validateAndGetApiKeys,
} from "../lingo/model-factory";
import { Logger } from "../../utils/logger";
import { DEFAULT_TIMEOUTS, withTimeout } from "../../utils/timeout";
import { getSystemPrompt } from "./prompt";
import { obj2xml, parseXmlFromResponseText } from "../parse-xml";
import { shots } from "./shots";
import type { MetadataSchema } from "../../types";
import { detectPluralCandidates } from "./pattern-detector";
import { validateICU } from "./icu-validator";

/**
 * Pluralization service with batching and model reuse
 */
export class PluralizationService {
  private readonly languageModel: LanguageModel;
  private readonly modelName: string;
  private cache = new Map<string, ICUGenerationResult>();
  private readonly prompt: string;
  private readonly sourceLocale: string;

  constructor(
    config: PluralizationConfig,
    private logger: Logger,
  ) {
    const localeModel = parseModelString(config.model);
    if (!localeModel) {
      throw new Error(`Invalid model format: "${config.model}"`);
    }

    // Validate and fetch API keys for the pluralization provider
    // We need to create a models config that validateAndFetchApiKeys can use
    const modelsConfig: Record<string, string> = {
      "*:*": config.model, // Single model for pluralization
    };

    this.logger.info("Validating API keys for pluralization...");
    const validatedKeys = validateAndGetApiKeys(modelsConfig);
    this.logger.info("✅ API keys validated for pluralization");

    this.languageModel = createAiModel(localeModel, validatedKeys);
    this.modelName = `${localeModel.provider}:${localeModel.name}`;
    this.sourceLocale = config.sourceLocale;
    this.prompt = getSystemPrompt({ sourceLocale: config.sourceLocale });

    this.logger.info(
      `Initialized pluralization service with ${this.modelName}`,
    );
  }

  /**
   * Generate ICU formats for multiple candidates in a single batch
   *
   * @param candidates Array of plural candidates
   * @param batchSize Maximum candidates per batch (default: 10)
   * @returns Map of hash -> ICU generation result
   */
  async generateBatch(
    candidates: PluralCandidate[],
    batchSize: number = 10,
  ): Promise<Map<string, ICUGenerationResult>> {
    const results = new Map<string, ICUGenerationResult>();

    // Check cache first
    const uncachedCandidates = candidates.filter((c) => {
      const cached = this.cache.get(c.hash);
      if (cached) {
        results.set(c.hash, cached);
        return false;
      }
      return true;
    });

    if (uncachedCandidates.length === 0) {
      this.logger.debug(
        `All ${candidates.length} candidates found in cache, skipping LLM call`,
      );
      return results;
    }

    this.logger.info(
      `Processing ${uncachedCandidates.length} candidates (${candidates.length - uncachedCandidates.length} cached)`,
    );

    // Process in batches
    for (let i = 0; i < uncachedCandidates.length; i += batchSize) {
      const batch = uncachedCandidates.slice(i, i + batchSize);

      this.logger.info(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(uncachedCandidates.length / batchSize)} (${batch.length} candidates)`,
      );

      const batchResults = await this.processBatch(batch);

      // Store results and cache them
      for (const [hash, result] of batchResults) {
        results.set(hash, result);
        this.cache.set(hash, result);
      }
    }

    return results;
  }

  /**
   * Process a single batch of candidates
   */
  private async processBatch(
    candidates: PluralCandidate[],
  ): Promise<Map<string, ICUGenerationResult>> {
    const results = new Map<string, ICUGenerationResult>();

    try {
      // Prepare batch request in XML format
      const batchRequest: PluralizationBatch = {
        version: 0.1,
        sourceLocale: this.sourceLocale,
        candidates: {
          candidate: candidates.map((c) => ({
            hash: c.hash,
            text: c.sourceText,
          })),
        },
      };

      // Call LLM with XML format and few-shot examples
      const response = await withTimeout(
        generateText({
          model: this.languageModel,
          messages: [
            {
              role: "system",
              content: this.prompt,
            },
            // Add few-shot examples
            ...shots.flatMap((shotsTuple) => [
              {
                role: "user" as const,
                content: obj2xml(shotsTuple[0]),
              },
              {
                role: "assistant" as const,
                content: obj2xml(shotsTuple[1]),
              },
            ]),
            {
              role: "user",
              content: obj2xml(batchRequest),
            },
          ],
        }),
        DEFAULT_TIMEOUTS.AI_API * 2, // Double timeout for batch
        `Pluralization with ${this.modelName}`,
      );

      const responseText = response.text.trim();
      this.logger.debug(
        `LLM XML response: ${responseText.substring(0, 200)}...`,
      );
      // Parse XML response
      const parsed =
        parseXmlFromResponseText<PluralizationResponse>(responseText);

      // Process results
      const resultArray = Array.isArray(parsed.results.result)
        ? parsed.results.result
        : [parsed.results.result];

      for (const result of resultArray) {
        const candidate = candidates.find((c) => c.hash === result.hash);
        if (!candidate) {
          this.logger.warn(`No candidate found for hash: ${result.hash}`);
          continue;
        }

        if (result.shouldPluralize && result.icuText) {
          this.logger.debug(
            `✓ ICU format generated for "${candidate.sourceText}": "${result.icuText}"`,
          );
          results.set(result.hash, {
            success: true,
            icuText: result.icuText,
            reasoning: result.reasoning,
          });
        } else {
          this.logger.debug(
            `✗ Pluralization not appropriate for "${candidate.sourceText}": ${result.reasoning}`,
          );
          results.set(result.hash, {
            success: false,
            reasoning: result.reasoning,
          });
        }
      }

      // Handle missing results (LLM didn't return result for some candidates)
      for (const candidate of candidates) {
        if (!results.has(candidate.hash)) {
          this.logger.warn(
            `No result returned for candidate: ${candidate.sourceText}`,
          );
          results.set(candidate.hash, {
            success: false,
            error: "No result returned by LLM",
          });
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Failed to process batch: ${errorMsg}`);

      // Mark all candidates as failed
      for (const candidate of candidates) {
        results.set(candidate.hash, {
          success: false,
          error: errorMsg,
        });
      }
    }

    return results;
  }

  /**
   * Process metadata entries for pluralization
   *
   * This is the main entry point that:
   * 1. Detects plural candidates using pattern matching
   * 2. Generates ICU format using LLM (batched)
   * 3. Validates the ICU format
   * 4. Updates metadata entries in-place (modifies sourceText)
   * 5. Returns statistics
   * @param metadata Metadata schema with translation entries

   * @returns Statistics about the pluralization process
   */
  async process(metadata: MetadataSchema): Promise<PluralizationStats> {
    const startTime = performance.now();
    const totalEntries = Object.keys(metadata.entries).length;

    if (totalEntries === 0) {
      return {
        total: 0,
        candidates: 0,
        pluralized: 0,
        rejected: 0,
        failed: 0,
        durationMs: 0,
      };
    }

    this.logger.info(
      `Starting pluralization processing for ${totalEntries} entries`,
    );

    // Step 1: Detect plural candidates using pattern matching
    const entriesMap: Record<string, string> = Object.fromEntries(
      Object.entries(metadata.entries).map(([hash, entry]) => [
        hash,
        entry.sourceText,
      ]),
    );

    const candidates = detectPluralCandidates(entriesMap, this.logger);

    this.logger.info(
      `Found ${candidates.length} plural candidates (${((candidates.length / totalEntries) * 100).toFixed(1)}%)`,
    );

    if (candidates.length === 0) {
      const endTime = performance.now();
      return {
        total: totalEntries,
        candidates: 0,
        pluralized: 0,
        rejected: 0,
        failed: 0,
        durationMs: endTime - startTime,
      };
    }

    // Step 2: Generate ICU formats with batching
    this.logger.debug("Generating ICU formats with batching...");
    const icuResults = await this.generateBatch(candidates, 10);

    // Step 3: Validate and update metadata entries
    this.logger.debug("Validating and updating entries...");
    let pluralized = 0;
    let rejected = 0;
    let failed = 0;

    for (const candidate of candidates) {
      const result = icuResults.get(candidate.hash);
      const entry = metadata.entries[candidate.hash];
      this.logger.debug(`Processing candidate: ${candidate.sourceText}`);
      if (!entry) {
        this.logger.warn(`Entry not found for hash: ${candidate.hash}`);
        failed++;
        continue;
      }

      if (!result) {
        this.logger.warn(`No result for hash: ${candidate.hash}`);
        failed++;
        continue;
      }

      if (result.error) {
        this.logger.warn(
          `Error generating ICU for "${candidate.sourceText}": ${result.error}`,
        );
        failed++;
        continue;
      }

      if (!result.success || !result.icuText) {
        this.logger.debug(
          `Rejected pluralization for "${candidate.sourceText}": ${result.reasoning}`,
        );
        rejected++;
        continue;
      }

      const isValid = validateICU(
        result.icuText,
        candidate.sourceText,
        this.logger,
      );

      if (!isValid) {
        this.logger.warn(
          `Invalid ICU format generated for "${candidate.sourceText}", falling back to original`,
        );
        failed++;
        continue;
      }

      // Update metadata entry in-place
      this.logger.info(
        `Pluralizing: "${entry.sourceText}" -> "${result.icuText}"`,
      );
      entry.sourceText = result.icuText;
      pluralized++;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    this.logger.info(
      `Pluralization completed: ${pluralized} pluralized, ${rejected} rejected, ${failed} failed in ${duration.toFixed(0)}ms`,
    );

    return {
      total: totalEntries,
      candidates: candidates.length,
      pluralized,
      rejected,
      failed,
      durationMs: duration,
    };
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.debug("Pluralization cache cleared");
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hits: number } {
    return {
      size: this.cache.size,
      hits: 0, // We don't track hits currently
    };
  }
}
