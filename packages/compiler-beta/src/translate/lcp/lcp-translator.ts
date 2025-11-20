import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOllama } from "ollama-ai-provider";
import { createMistral } from "@ai-sdk/mistral";
import { generateText, type LanguageModel } from "ai";
import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import type { DictionarySchema } from "../../react/server";
import type { TranslatableEntry, Translator } from "../api";
import { getSystemPrompt } from "./prompt";
import { obj2xml, xml2obj } from "./xml2obj";
import { shots } from "./shots";
import { getLocaleModel } from "./locales";
import {
  getGroqKey,
  getGoogleKey,
  getOpenRouterKey,
  getMistralKey,
  getLingoDotDevKey,
} from "./api-keys";

/**
 * LCP Translator configuration
 */
export interface LCPTranslatorConfig {
  models: "lingo.dev" | Record<string, string>;
  sourceLocale: string;
  prompt?: string | null;
}

/**
 * LCP-based translator using AI models
 */
export class LCPTranslator implements Translator<LCPTranslatorConfig> {
  constructor(readonly config: LCPTranslatorConfig) {}

  /**
   * Translate a single entry
   */
  async translate(locale: string, entry: TranslatableEntry): Promise<string> {
    // Create a minimal dictionary with single entry
    const sourceDictionary: DictionarySchema = {
      version: 0.1,
      locale: this.config.sourceLocale,
      files: {
        temp: {
          entries: {
            temp: entry.text,
          },
        },
      },
    };

    const translated = await this.translateDictionary(sourceDictionary, locale);

    return translated.files["temp"]?.entries["temp"] || entry.text;
  }

  /**
   * Batch translate multiple entries
   */
  async batchTranslate(
    locale: string,
    entriesMap: Record<string, TranslatableEntry>,
  ): Promise<Record<string, string>> {
    // Create dictionary from entries map
    const sourceDictionary: DictionarySchema = {
      version: 0.1,
      locale: this.config.sourceLocale,
      files: {
        batch: {
          entries: Object.fromEntries(
            Object.entries(entriesMap).map(([hash, entry]) => [
              hash,
              entry.text,
            ]),
          ),
        },
      },
    };

    const translated = await this.translateDictionary(sourceDictionary, locale);

    return translated.files["batch"]?.entries || {};
  }

  /**
   * Translate a complete dictionary
   */
  private async translateDictionary(
    sourceDictionary: DictionarySchema,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    const timeLabel = `LCPTranslator: ${this.config.sourceLocale} -> ${targetLocale}`;
    console.time(timeLabel);

    // Split into chunks if needed
    const chunks = this.chunkDictionary(sourceDictionary);
    const translatedChunks: DictionarySchema[] = [];

    for (const chunk of chunks) {
      const translatedChunk = await this.translateChunk(chunk, targetLocale);
      translatedChunks.push(translatedChunk);
    }

    const result = this.mergeDictionaries(translatedChunks);
    console.timeEnd(timeLabel);
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
   */
  private async translateWithLingoDotDev(
    sourceDictionary: DictionarySchema,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    const apiKey = getLingoDotDevKey();
    if (!apiKey) {
      throw new Error(
        "⚠️  Lingo.dev API key not found. Please set LINGODOTDEV_API_KEY environment variable.",
      );
    }

    console.log(
      `✨ Using Lingo.dev Engine to localize from "${this.config.sourceLocale}" to "${targetLocale}"`,
    );

    const engine = new LingoDotDevEngine({ apiKey });

    try {
      const result = await engine.localizeObject(sourceDictionary, {
        sourceLocale: this.config.sourceLocale,
        targetLocale: targetLocale,
      });

      return result as DictionarySchema;
    } catch (error) {
      throw new Error(
        `Lingo.dev translation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Translate using generic LLM
   */
  private async translateWithLLM(
    sourceDictionary: DictionarySchema,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    const { provider, model } = getLocaleModel(
      this.config.models as Record<string, string>,
      this.config.sourceLocale,
      targetLocale,
    );

    if (!provider || !model) {
      throw new Error(
        `No model configured for translation from ${this.config.sourceLocale} to ${targetLocale}`,
      );
    }

    console.log(
      `ℹ️ Using LLM ("${provider}":"${model}") to translate from "${this.config.sourceLocale}" to "${targetLocale}"`,
    );

    const aiModel = this.createAiModel(provider, model);

    try {
      const response = await generateText({
        model: aiModel,
        messages: [
          {
            role: "system",
            content: getSystemPrompt({
              sourceLocale: this.config.sourceLocale,
              targetLocale,
              prompt: this.config.prompt ?? undefined,
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
      });

      // Extract XML content from response
      let responseText = response.text;
      const xmlStart = responseText.indexOf("<");
      const xmlEnd = responseText.lastIndexOf(">") + 1;

      if (xmlStart !== -1 && xmlEnd > xmlStart) {
        responseText = responseText.substring(xmlStart, xmlEnd);
      }

      return xml2obj<DictionarySchema>(responseText);
    } catch (error) {
      throw new Error(
        `LLM translation failed with ${provider}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Create AI model instance
   */
  private createAiModel(providerId: string, modelId: string): LanguageModel {
    switch (providerId) {
      case "groq": {
        const apiKey = getGroqKey();
        if (!apiKey) {
          throw new Error(
            "⚠️  GROQ API key not found. Please set GROQ_API_KEY environment variable.",
          );
        }
        console.log(`Creating Groq client using model ${modelId}`);
        return createGroq({ apiKey })(modelId);
      }

      case "google": {
        const apiKey = getGoogleKey();
        if (!apiKey) {
          throw new Error(
            "⚠️  Google API key not found. Please set GOOGLE_API_KEY environment variable.",
          );
        }
        console.log(
          `Creating Google Generative AI client using model ${modelId}`,
        );
        return createGoogleGenerativeAI({ apiKey })(modelId);
      }

      case "openrouter": {
        const apiKey = getOpenRouterKey();
        if (!apiKey) {
          throw new Error(
            "⚠️  OpenRouter API key not found. Please set OPENROUTER_API_KEY environment variable.",
          );
        }
        console.log(`Creating OpenRouter client using model ${modelId}`);
        return createOpenRouter({ apiKey })(modelId);
      }

      case "ollama": {
        console.log(
          `Creating Ollama client using model ${modelId} at default address`,
        );
        return createOllama()(modelId);
      }

      case "mistral": {
        const apiKey = getMistralKey();
        if (!apiKey) {
          throw new Error(
            "⚠️  Mistral API key not found. Please set MISTRAL_API_KEY environment variable.",
          );
        }
        console.log(`Creating Mistral client using model ${modelId}`);
        return createMistral({ apiKey })(modelId);
      }

      default: {
        throw new Error(
          `⚠️  Provider "${providerId}" is not supported. Supported providers: groq, google, openrouter, ollama, mistral, lingo.dev`,
        );
      }
    }
  }

  /**
   * Split dictionary into chunks for processing
   */
  private chunkDictionary(dictionary: DictionarySchema): DictionarySchema[] {
    const MAX_ENTRIES_PER_CHUNK = 100;
    const { files, ...rest } = dictionary;
    const chunks: DictionarySchema[] = [];

    let currentChunk: DictionarySchema = {
      ...rest,
      files: {},
    };
    let currentEntryCount = 0;

    for (const [fileName, file] of Object.entries(files)) {
      const entries = file.entries;
      const entryPairs = Object.entries(entries);

      let currentIndex = 0;
      while (currentIndex < entryPairs.length) {
        const remainingSpace = MAX_ENTRIES_PER_CHUNK - currentEntryCount;
        const entriesToAdd = entryPairs.slice(
          currentIndex,
          currentIndex + remainingSpace,
        );

        if (entriesToAdd.length > 0) {
          if (!currentChunk.files[fileName]) {
            currentChunk.files[fileName] = { entries: {} };
          }
          Object.assign(
            currentChunk.files[fileName].entries,
            Object.fromEntries(entriesToAdd),
          );
          currentEntryCount += entriesToAdd.length;
        }

        currentIndex += entriesToAdd.length;

        if (
          currentEntryCount >= MAX_ENTRIES_PER_CHUNK ||
          (currentIndex < entryPairs.length &&
            currentEntryCount + (entryPairs.length - currentIndex) >
              MAX_ENTRIES_PER_CHUNK)
        ) {
          chunks.push(currentChunk);
          currentChunk = { ...rest, files: {} };
          currentEntryCount = 0;
        }
      }
    }

    if (currentEntryCount > 0) {
      chunks.push(currentChunk);
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
      return {
        version: 0.1,
        locale: this.config.sourceLocale,
        files: {},
      };
    }

    const fileNames = Array.from(
      new Set(dictionaries.flatMap((dict) => Object.keys(dict.files))),
    );

    const files: Record<string, { entries: Record<string, string> }> = {};

    for (const fileName of fileNames) {
      const entries: Record<string, string> = {};
      for (const dict of dictionaries) {
        const file = dict.files[fileName];
        if (file) {
          Object.assign(entries, file.entries);
        }
      }
      files[fileName] = { entries };
    }

    return {
      version: dictionaries[0].version,
      locale: dictionaries[0].locale,
      files,
    };
  }
}
