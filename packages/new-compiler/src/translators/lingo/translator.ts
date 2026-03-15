import { generateText } from "ai";
import { LingoDotDevEngine } from "lingo.dev/sdk";
import { dictionaryFrom, type DictionarySchema, type TranslatableEntry, type Translator, } from "../api";
import { getSystemPrompt } from "./prompt";
import { obj2xml, parseXmlFromResponseText } from "../parse-xml";
import { shots } from "./shots";
import { createAiModel, getLocaleModel, validateAndGetApiKeys, type ValidatedApiKeys, } from "./model-factory";
import { Logger } from "../../utils/logger";
import { DEFAULT_TIMEOUTS, withTimeout } from "../../utils/timeout";
import type { LocaleCode } from "lingo.dev/spec";

/**
 * Lingo Translator configuration
 */
export interface LingoTranslatorConfig {
  models: "lingo.dev" | Record<string, string>;
  sourceLocale: LocaleCode;
  prompt?: string;
}

/**
 * Lingo translator using AI models
 */
export class LingoTranslator implements Translator<LingoTranslatorConfig> {
  private readonly validatedKeys: ValidatedApiKeys;

  constructor(
    readonly config: LingoTranslatorConfig,
    private logger: Logger,
  ) {
    this.logger.info("Validating API keys for translation...");
    this.validatedKeys = validateAndGetApiKeys(config.models);
    this.logger.info("✅ API keys validated successfully");
  }

  /**
   * Translate multiple entries
   */
  async translate(
    locale: LocaleCode,
    entriesMap: Record<string, TranslatableEntry>,
  ): Promise<Record<string, string>> {
    this.logger.debug(
      `translate() called for ${locale} with ${Object.keys(entriesMap).length} entries`,
    );

    const sourceDictionary: DictionarySchema = dictionaryFrom(
      this.config.sourceLocale,
      Object.fromEntries(
        Object.entries(entriesMap).map(([hash, entry]) => [hash, entry.text]),
      ),
    );

    this.logger.debug(
      `Created source dictionary with ${Object.keys(sourceDictionary.entries).length} entries`,
    );
    const translated = await this.translateDictionary(sourceDictionary, locale);

    return translated.entries || {};
  }

  /**
   * Translate a complete dictionary
   */
  private async translateDictionary(
    sourceDictionary: DictionarySchema,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    const chunks = this.chunkDictionary(sourceDictionary);
    this.logger.debug(
      `Split dictionary with ${Object.keys(sourceDictionary.entries).length} into ${chunks.length} chunks`,
    );

    const translatedChunks: DictionarySchema[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      this.logger.debug(
        `Translating chunk ${i + 1}/${chunks.length} with ${Object.keys(chunk.entries).length} entries`,
      );
      const chunkStartTime = performance.now();

      const translatedChunk = await this.translateChunk(chunk, targetLocale);

      const chunkEndTime = performance.now();
      this.logger.debug(
        `Chunk ${i + 1}/${chunks.length} completed in ${(chunkEndTime - chunkStartTime).toFixed(2)}ms`,
      );

      translatedChunks.push(translatedChunk);
    }

    const result = this.mergeDictionaries(translatedChunks);
    this.logger.debug(
      `Merge completed, final dictionary has ${Object.keys(result.entries).length} entries`,
    );

    return result;
  }

  /**
   * Translate a single chunk
   */
  private async translateChunk(
    sourceDictionary: DictionarySchema,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    if (this.config.models === "lingo.dev") {
      return this.translateWithLingoDotDev(sourceDictionary, targetLocale);
    } else {
      return this.translateWithLLM(sourceDictionary, targetLocale);
    }
  }

  /**
   * Translate using Lingo.dev Engine
   * Times out after 60 seconds to prevent indefinite hangs
   */
  private async translateWithLingoDotDev(
    sourceDictionary: DictionarySchema,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    const apiKey = this.validatedKeys["lingo.dev"];
    if (!apiKey) {
      throw new Error(
        "Internal error: Lingo.dev API key not found after validation. Please restart the service.",
      );
    }

    this.logger.debug(
      `Using Lingo.dev Engine to localize from "${this.config.sourceLocale}" to "${targetLocale}"`,
    );

    const engine = new LingoDotDevEngine({ apiKey });

    try {
      const result = await withTimeout(
        engine.localizeObject(sourceDictionary, {
          sourceLocale: this.config.sourceLocale,
          targetLocale: targetLocale,
        }),
        DEFAULT_TIMEOUTS.AI_API,
        `Lingo.dev API translation to ${targetLocale}`,
      );

      return result as DictionarySchema;
    } catch (error) {
      this.logger.error(`translateWithLingoDotDev() failed:`, error);
      throw new Error(
        `Lingo.dev translation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Translate using generic LLM
   * Times out after 60 seconds to prevent indefinite hangs
   */
  private async translateWithLLM(
    sourceDictionary: DictionarySchema,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    const localeModel = getLocaleModel(
      this.config.models as Record<string, string>,
      this.config.sourceLocale,
      targetLocale,
    );

    if (!localeModel) {
      throw new Error(
        `No model configured for translation from ${this.config.sourceLocale} to ${targetLocale}`,
      );
    }

    this.logger.debug(
      `Using LLM ("${localeModel.provider}":"${localeModel.name}") to translate from "${this.config.sourceLocale}" to "${targetLocale}"`,
    );

    const aiModel = createAiModel(localeModel, this.validatedKeys);

    try {
      const response = await withTimeout(
        generateText({
          model: aiModel,
          messages: [
            {
              role: "system",
              content: getSystemPrompt({
                sourceLocale: this.config.sourceLocale,
                targetLocale,
                prompt: this.config.prompt,
              }),
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
              content: obj2xml(sourceDictionary),
            },
          ],
        }),
        DEFAULT_TIMEOUTS.AI_API,
        `${localeModel.provider} LLM translation to ${targetLocale}`,
      );

      return parseXmlFromResponseText<DictionarySchema>(response.text);
    } catch (error) {
      throw new Error(
        `LLM translation failed with ${localeModel.provider}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Split dictionary into chunks for processing
   */
  private chunkDictionary(dictionary: DictionarySchema): DictionarySchema[] {
    const MAX_ENTRIES_PER_CHUNK = 100;
    const { entries, ...rest } = dictionary;
    const chunks: DictionarySchema[] = [];

    const entryPairs = Object.entries(entries);

    // Split entries into chunks of MAX_ENTRIES_PER_CHUNK
    for (let i = 0; i < entryPairs.length; i += MAX_ENTRIES_PER_CHUNK) {
      const chunkEntries = entryPairs.slice(i, i + MAX_ENTRIES_PER_CHUNK);
      chunks.push({
        ...rest,
        entries: Object.fromEntries(chunkEntries),
      });
    }

    return chunks;
  }

  /**
   * Merge multiple dictionaries into one
   */
  private mergeDictionaries(
    dictionaries: DictionarySchema[],
  ): DictionarySchema {
    if (dictionaries.length === 0) {
      return dictionaryFrom(this.config.sourceLocale, {});
    }

    // Merge all entries from all dictionaries
    const mergedEntries: Record<string, string> = {};
    for (const dict of dictionaries) {
      Object.assign(mergedEntries, dict.entries);
    }

    return {
      version: dictionaries[0].version,
      locale: dictionaries[0].locale,
      entries: mergedEntries,
    };
  }
}
