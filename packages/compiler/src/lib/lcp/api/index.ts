import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { DictionarySchema } from "../schema";
import _ from "lodash";
import { getLocaleModel } from "../../../utils/locales";
import getSystemPrompt from "./prompt";
import { obj2xml, xml2obj } from "./xml2obj";
import shots from "./shots";
import {
  getGroqKey,
  getGroqKeyFromEnv,
  getGoogleKey,
  getGoogleKeyFromEnv,
} from "../../../utils/llm-api-key";
import dedent from "dedent";
import { isRunningInCIOrDocker } from "../../../utils/env";
import { LanguageModel } from "ai";

export class LCPAPI {
  static async translate(
    models: Record<string, string>,
    sourceDictionary: DictionarySchema,
    sourceLocale: string,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    const timeLabel = `LCPAPI.translate: ${targetLocale}`;
    console.time(timeLabel);
    const chunks = this._chunkDictionary(sourceDictionary);
    const translatedChunks = [];
    for (const chunk of chunks) {
      const translatedChunk = await this._translateChunk(
        models,
        chunk,
        sourceLocale,
        targetLocale,
      );
      translatedChunks.push(translatedChunk);
    }
    const result = this._mergeDictionaries(translatedChunks);
    console.timeEnd(timeLabel);
    return result;
  }

  private static _chunkDictionary(
    dictionary: DictionarySchema,
  ): DictionarySchema[] {
    const MAX_ENTRIES_PER_CHUNK = 100;
    const { files, ...rest } = dictionary;
    const chunks: DictionarySchema[] = [];

    let currentChunk: DictionarySchema = {
      ...rest,
      files: {},
    };
    let currentEntryCount = 0;

    Object.entries(files).forEach(([fileName, file]) => {
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
          currentChunk.files[fileName] = currentChunk.files[fileName] || {
            entries: {},
          };
          currentChunk.files[fileName].entries = {
            ...currentChunk.files[fileName].entries,
            ...Object.fromEntries(entriesToAdd),
          };
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
    });

    if (currentEntryCount > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  private static _mergeDictionaries(dictionaries: DictionarySchema[]) {
    const fileNames = _.uniq(
      _.flatMap(dictionaries, (dict) => Object.keys(dict.files)),
    );
    const files = _(fileNames)
      .map((fileName) => {
        const entries = dictionaries.reduce((entries, dict) => {
          const file = dict.files[fileName];
          if (file) {
            entries = _.merge(entries, file.entries);
          }
          return entries;
        }, {});
        return [fileName, { entries }];
      })
      .fromPairs()
      .value();
    const dictionary = {
      version: dictionaries[0].version,
      locale: dictionaries[0].locale,
      files,
    };
    return dictionary;
  }

  private static async _translateChunk(
    models: Record<string, string>,
    sourceDictionary: DictionarySchema,
    sourceLocale: string,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    try {
      const { provider, model } = getLocaleModel(
        models,
        sourceLocale,
        targetLocale,
      );

      if (!provider || !model) {
        // Ensure both provider and model are found
        throw new Error(
          `⚠️  Locale "${targetLocale}" is not configured. Add provider and model for this locale to your config, e.g., "groq:llama3-8b-8192".`,
        );
      }

      const aiModel = this._createAiModel(provider, model, targetLocale);

      console.log(
        `✨ Using model "${model}" from "${provider}" to translate from "${sourceLocale}" to "${targetLocale}"`,
      );

      const response = await generateText({
        model: aiModel,
        messages: [
          {
            role: "system",
            content: getSystemPrompt({ sourceLocale, targetLocale }),
          },
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

      console.log("Response text received for", targetLocale);
      let responseText = response.text;
      // Extract XML content
      responseText = responseText.substring(
        responseText.indexOf("<"),
        responseText.lastIndexOf(">") + 1,
      );

      return xml2obj(responseText);
    } catch (error) {
      this._failGroqFailureLocal(
        targetLocale,
        error instanceof Error ? error.message : "Unknown error",
      );
      // This throw is unreachable because _failGroqFailureLocal exits the process,
      // but it helps satisfy the TypeScript compiler's return type checking.
      throw error;
    }
  }

  /**
   * Instantiates an AI model based on provider and model ID.
   * Includes CI/CD API key checks.
   * @param providerId The ID of the AI provider (e.g., "groq", "google").
   * @param modelId The ID of the specific model (e.g., "llama3-8b-8192", "gemini-2.0-flash").
   * @param targetLocale The target locale being translated to (for logging/error messages).
   * @returns An instantiated AI LanguageModel.
   * @throws Error if the provider is not supported or API key is missing in CI/CD.
   */
  private static _createAiModel(
    providerId: string,
    modelId: string,
    targetLocale: string,
  ): LanguageModel {
    switch (providerId) {
      case "groq":
        // Specific check for CI/CD or Docker missing GROQ key
        if (isRunningInCIOrDocker()) {
          const groqFromEnv = getGroqKeyFromEnv();
          if (!groqFromEnv) {
            this._failMissingGroqKeyCi();
          }
        }
        const groqKey = getGroqKey();
        if (!groqKey) {
          throw new Error(
            "⚠️  GROQ API key not found. Please set GROQ_API_KEY environment variable or configure it user-wide.",
          );
        }
        console.log(
          `Creating Groq client for ${targetLocale} using model ${modelId}`,
        );
        return createGroq({ apiKey: groqKey })(modelId);

      case "google":
        // Specific check for CI/CD or Docker missing Google key
        if (isRunningInCIOrDocker()) {
          const googleFromEnv = getGoogleKeyFromEnv();
          if (!googleFromEnv) {
            this._failMissingGoogleKeyCi();
          }
        }
        const googleKey = getGoogleKey();
        if (!googleKey) {
          throw new Error(
            "⚠️  Google API key not found. Please set GOOGLE_API_KEY environment variable or configure it user-wide.",
          );
        }
        console.log(
          `Creating Google Generative AI client for ${targetLocale} using model ${modelId}`,
        );
        return createGoogleGenerativeAI({ apiKey: googleKey })(modelId);

      default:
        throw new Error(
          `⚠️  Provider "${providerId}" for locale "${targetLocale}" is not supported. Only "groq" and "google" providers are supported at the moment.`,
        );
    }
  }

  /**
   * Show an actionable error message and exit the process when the compiler
   * is running in CI/CD without a GROQ API key.
   * The message explains why this situation is unusual and how to fix it.
   */
  private static _failMissingGroqKeyCi(): void {
    console.log(
      dedent`
        \n
        💡 You're using Lingo.dev Localization Compiler, and it detected unlocalized components in your app.

        The compiler needs a GROQ API key to translate missing strings, but GROQ_API_KEY is not set in the environment.

        This is unexpected: typically you run a full build locally, commit the generated translation files, and push them to CI/CD.

        However, If you want CI/CD to translate the new strings, provide the key with:
        • Session-wide: export GROQ_API_KEY=<your-api-key>
        • Project-wide / CI: add GROQ_API_KEY=<your-api-key> to your pipeline environment variables

        ⭐️ Also:
        1. If you don't yet have a GROQ API key, get one for free at https://groq.com
        2. If you want to use a different LLM (like Google), update your configuration. Refer to documentation for help: https://docs.lingo.dev/
        3. If the model you want to use isn't supported yet, raise an issue in our open-source repo: https://lingo.dev/go/gh

        ✨
      `,
    );
    process.exit(1);
  }

  /**
   * Show an actionable error message and exit the process when the compiler
   * is running in CI/CD without a Google API key.
   * The message explains why this situation is unusual and how to fix it.
   */
  private static _failMissingGoogleKeyCi(): void {
    console.log(
      dedent`
        \n
        💡 You're using Lingo.dev Localization Compiler, and it detected unlocalized components in your app.

        The compiler needs a Google API key to translate missing strings, but GOOGLE_API_KEY is not set in the environment.

        This is unexpected: typically you run a full build locally, commit the generated translation files, and push them to CI/CD.

        However, If you want CI/CD to translate the new strings, provide the key with:
        • Session-wide: export GOOGLE_API_KEY=<your-api-key>
        • Project-wide / CI: add GOOGLE_API_KEY=<your-api-key> to your pipeline environment variables

        ⭐️ Also:
        1. If you don't yet have a Google AI API key, get one for free at https://ai.google.dev/
        2. If you want to use a different LLM (like Groq), update your configuration. Refer to documentation for help: https://docs.lingo.dev/
        3. If the model you want to use isn't supported yet, raise an issue in our open-source repo: https://lingo.dev/go/gh

        ✨
      `,
    );
    process.exit(1);
  }

  private static _failGroqFailureLocal(
    targetLocale: string,
    errorMessage: string,
  ): void {
    const isInvalidApiKey = errorMessage.match("Invalid API Key");
    if (isInvalidApiKey) {
      console.log(dedent`
          \n
          ⚠️  Lingo.dev Compiler requires a valid Groq API key to translate your application.

          It looks like you set Groq API key but it is not valid. Please check your API key and try again.

          Error details from Groq API: ${errorMessage}

          👉 You can set the API key in one of the following ways:
          1. User-wide: Run npx lingo.dev@latest config set llm.groqApiKey <your-api-key>
          2. Project-wide: Add GROQ_API_KEY=<your-api-key> to .env file in every project that uses Lingo.dev Localization Compiler
          3. Session-wide: Run export GROQ_API_KEY=<your-api-key> in your terminal before running the compiler to set the API key for the current session

          ⭐️ Also:
          1. If you don't yet have a GROQ API key, get one for free at https://groq.com
          2. If you want to use a different LLM, raise an issue in our open-source repo: https://lingo.dev/go/gh
          3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

          ✨
        `);
    } else {
      console.log(
        dedent`
        \n
        ⚠️  Lingo.dev Compiler tried to translate your application to "${targetLocale}" locale via Groq but it failed.

        Error details from Groq API: ${errorMessage}

        This error comes from Groq API, please check their documentation for more details: https://console.groq.com/docs/errors

        ⭐️ Also:
        1. Did you set GROQ_API_KEY environment variable?
        2. Did you reach any limits of your Groq account?
        3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

        ✨
      `,
      );
    }
    process.exit(1);
  }
}
