import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOllama } from "ollama-ai-provider";
import { generateText } from "ai";
import { LingoDotDevEngine } from "@lingo.dev/_sdk";
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
  getOpenRouterKey,
  getOpenRouterKeyFromEnv,
  getLingoDotDevKeyFromEnv,
  getLingoDotDevKey,
} from "../../../utils/llm-api-key";
import dedent from "dedent";
import { isRunningInCIOrDocker } from "../../../utils/env";
import { LanguageModel } from "ai";
import { providerDetails } from "./provider-details";

export class LCPAPI {
  static async translate(
    models: "lingo.dev" | Record<string, string>,
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

  private static _createLingoDotDevEngine() {
    // Specific check for CI/CD or Docker missing GROQ key
    if (isRunningInCIOrDocker()) {
      const apiKeyFromEnv = getLingoDotDevKeyFromEnv();
      if (!apiKeyFromEnv) {
        this._failMissingLLMKeyCi("lingo.dev");
      }
    }
    const apiKey = getLingoDotDevKey();
    if (!apiKey) {
      throw new Error(
        "⚠️  Lingo.dev API key not found. Please set LINGODOTDEV_API_KEY environment variable or configure it user-wide.",
      );
    }
    console.log(`Creating Lingo.dev client`);
    return new LingoDotDevEngine({
      apiKey,
    });
  }

  private static async _translateChunk(
    models: "lingo.dev" | Record<string, string>,
    sourceDictionary: DictionarySchema,
    sourceLocale: string,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    if (models === "lingo.dev") {
      try {
        const lingoDotDevEngine = this._createLingoDotDevEngine();

        console.log(
          `✨ Using Lingo.dev Engine to localize from "${sourceLocale}" to "${targetLocale}"`,
        );

        const result = await lingoDotDevEngine.localizeObject(
          sourceDictionary,
          {
            sourceLocale: sourceLocale,
            targetLocale: targetLocale,
          },
        );

        return result as DictionarySchema;
      } catch (error) {
        this._failLLMFailureLocal(
          "lingo.dev",
          targetLocale,
          error instanceof Error ? error.message : "Unknown error",
        );
        // This throw is unreachable because the failure method exits,
        // but it helps satisfy the TypeScript compiler.
        throw error;
      }
    } else {
      const { provider, model } = getLocaleModel(
        models,
        sourceLocale,
        targetLocale,
      );

      if (!provider || !model) {
        throw new Error(
          dedent`
            🚫  Lingo.dev Localization Engine Not Configured!

            The "models" parameter is missing or incomplete in your Lingo.dev configuration.

            👉 To fix this, set the "models" parameter to either:
               • "lingo.dev" (for the default engine)
               • a map of locale-to-model, e.g. { "models": { "en:es": "openai:gpt-3.5-turbo" } }

            Example:
              {
                // ...
                "models": "lingo.dev"
              }

            For more details, see: https://lingo.dev/compiler
            To get help, join our Discord: https://lingo.dev/go/discord
            `,
        );
      }

      try {
        const aiModel = this._createAiModel(provider, model, targetLocale);

        console.log(
          `ℹ️ Using raw LLM API ("${provider}":"${model}") to translate from "${sourceLocale}" to "${targetLocale}"`,
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
        this._failLLMFailureLocal(
          provider,
          targetLocale,
          error instanceof Error ? error.message : "Unknown error",
        );
        // This throw is unreachable because the failure method exits,
        // but it helps satisfy the TypeScript compiler.
        throw error;
      }
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
      case "groq": {
        // Specific check for CI/CD or Docker missing GROQ key
        if (isRunningInCIOrDocker()) {
          const groqFromEnv = getGroqKeyFromEnv();
          if (!groqFromEnv) {
            this._failMissingLLMKeyCi(providerId);
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
      }

      case "google": {
        // Specific check for CI/CD or Docker missing Google key
        if (isRunningInCIOrDocker()) {
          const googleFromEnv = getGoogleKeyFromEnv();
          if (!googleFromEnv) {
            this._failMissingLLMKeyCi(providerId);
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
      }
      case "openrouter": {
        // Specific check for CI/CD or Docker missing OpenRouter key
        if (isRunningInCIOrDocker()) {
          const openRouterFromEnv = getOpenRouterKeyFromEnv();
          if (!openRouterFromEnv) {
            this._failMissingLLMKeyCi(providerId);
          }
        }
        const openRouterKey = getOpenRouterKey();
        if (!openRouterKey) {
          throw new Error(
            "⚠️  OpenRouter API key not found. Please set OPENROUTER_API_KEY environment variable or configure it user-wide.",
          );
        }
        console.log(
          `Creating OpenRouter client for ${targetLocale} using model ${modelId}`,
        );
        return createOpenRouter({
          apiKey: openRouterKey,
        })(modelId);
      }

      case "ollama": {
        // No API key check needed for Ollama
        console.log(
          `Creating Ollama client for ${targetLocale} using model ${modelId} at default Ollama address`,
        );
        return createOllama()(modelId);
      }

      default: {
        throw new Error(
          `⚠️  Provider "${providerId}" for locale "${targetLocale}" is not supported. Only "groq" and "google" providers are supported at the moment.`,
        );
      }
    }
  }

  /**
   * Show an actionable error message and exit the process when the compiler
   * is running in CI/CD without a required LLM API key.
   * The message explains why this situation is unusual and how to fix it.
   * @param providerId The ID of the LLM provider whose key is missing.
   */
  private static _failMissingLLMKeyCi(providerId: string): void {
    let details = providerDetails[providerId];
    if (!details) {
      // Fallback for unsupported provider in failure message logic
      console.error(
        `Internal Error: Missing details for provider "${providerId}" when reporting missing key in CI/CD. You might be using an unsupported provider.`,
      );
      process.exit(1);
    }

    console.log(
      dedent`
        \n
        💡 You're using Lingo.dev Localization Compiler, and it detected unlocalized components in your app.

        The compiler needs a ${details.name} API key to translate missing strings, but ${details.apiKeyEnvVar} is not set in the environment.

        This is unexpected: typically you run a full build locally, commit the generated translation files, and push them to CI/CD.

        However, If you want CI/CD to translate the new strings, provide the key with:
        • Session-wide: export ${details.apiKeyEnvVar}=<your-api-key>
        • Project-wide / CI: add ${details.apiKeyEnvVar}=<your-api-key> to your pipeline environment variables

        ⭐️ Also:
        1. If you don't yet have a ${details.name} API key, get one for free at ${details.getKeyLink}
        2. If you want to use a different LLM, update your configuration. Refer to documentation for help: https://lingo.dev/compiler
        3. If the model you want to use isn't supported yet, raise an issue in our open-source repo: https://lingo.dev/go/gh

        ✨
      `,
    );
    process.exit(1);
  }

  /**
   * Show an actionable error message and exit the process when an LLM API call
   * fails during local compilation.
   * @param providerId The ID of the LLM provider that failed.
   * @param targetLocale The target locale being translated to.
   * @param errorMessage The error message received from the API.
   */
  private static _failLLMFailureLocal(
    providerId: string,
    targetLocale: string,
    errorMessage: string,
  ): void {
    const details = providerDetails[providerId];
    if (!details) {
      // Fallback
      console.error(
        `Internal Error: Missing details for provider "${providerId}" when reporting local failure.`,
      );
      console.error(`Original Error: ${errorMessage}`);
      process.exit(1);
    }

    const isInvalidApiKey = errorMessage.match("Invalid API Key"); // TODO: This may change per-provider, so might update this later

    if (isInvalidApiKey) {
      console.log(dedent`
          \n
          ⚠️  Lingo.dev Compiler requires a valid ${details.name} API key to translate your application.

          It looks like you set ${details.name} API key but it is not valid. Please check your API key and try again.

          Error details from ${details.name} API: ${errorMessage}

          👉 You can set the API key in one of the following ways:
          1. User-wide: Run npx lingo.dev@latest config set ${details.apiKeyConfigKey} <your-api-key>
          2. Project-wide: Add ${details.apiKeyEnvVar}=<your-api-key> to .env file in every project that uses Lingo.dev Localization Compiler
          3 Session-wide: Run export ${details.apiKeyEnvVar}=<your-api-key> in your terminal before running the compiler to set the API key for the current session

          ⭐️ Also:
          1. If you don't yet have a ${details.name} API key, get one for free at ${details.getKeyLink}
          2. If you want to use a different LLM, raise an issue in our open-source repo: https://lingo.dev/go/gh
          3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

          ✨
        `);
    } else {
      console.log(
        dedent`
        \n
        ⚠️  Lingo.dev Compiler tried to translate your application to "${targetLocale}" locale via ${
          details.name
        } but it failed.

        Error details from ${details.name} API: ${errorMessage}

        This error comes from the ${
          details.name
        } API, please check their documentation for more details: ${
          details.docsLink
        }

        ⭐️ Also:
        1. Did you set ${
          details.apiKeyEnvVar
            ? `${details.apiKeyEnvVar}`
            : "the provider API key"
        } environment variable correctly ${
          !details.apiKeyEnvVar ? "(if required)" : ""
        }?
        2. Did you reach any limits of your ${details.name} account?
        3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

        ✨
      `,
      );
    }
    process.exit(1);
  }
}
