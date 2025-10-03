import { generateText } from "ai";
import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import { DictionarySchema } from "../schema";
import _ from "lodash";
import { getLocaleModel } from "../../../utils/locales";
import getSystemPrompt from "./prompt";
import { obj2xml, xml2obj } from "./xml2obj";
import shots from "./shots";
import dedent from "dedent";
import { isRunningInCIOrDocker } from "../../../utils/env";
import { LanguageModel } from "ai";
import {
  createProviderClient,
  ProviderKeyMissingError,
  PROVIDER_METADATA,
  type ProviderId,
} from "@lingo.dev/providers";
import * as dotenv from "dotenv";
import path from "path";
import { getRcConfig } from "@lingo.dev/config";

export class LCPAPI {
  static async translate(
    models: "lingo.dev" | Record<string, string>,
    sourceDictionary: DictionarySchema,
    sourceLocale: string,
    targetLocale: string,
    prompt?: string | null,
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
        prompt,
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
    const getEnvWithDotenv = (name: string): string | undefined => {
      if (process.env[name]) return process.env[name];
      const result = dotenv.config({
        path: [
          path.resolve(process.cwd(), ".env"),
          path.resolve(process.cwd(), ".env.local"),
          path.resolve(process.cwd(), ".env.development"),
        ],
      });
      return result?.parsed?.[name];
    };

    if (isRunningInCIOrDocker()) {
      const apiKeyFromEnv = getEnvWithDotenv("LINGODOTDEV_API_KEY");
      if (!apiKeyFromEnv) {
        this._failMissingLLMKeyCi("lingo.dev");
      }
    }
    const apiKey =
      getEnvWithDotenv("LINGODOTDEV_API_KEY") ||
      (() => {
        const rc = getRcConfig();
        const val = _.get(rc, "auth.apiKey");
        return typeof val === "string" ? val : undefined;
      })();
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
    prompt?: string | null,
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
        const aiModel = ((): LanguageModel => {
          try {
            return createProviderClient(provider as ProviderId, model);
          } catch (error: unknown) {
            if (error instanceof ProviderKeyMissingError) {
              if (isRunningInCIOrDocker()) {
                this._failMissingLLMKeyCi(error.providerId);
              } else {
                this._failLLMFailureLocal(
                  provider,
                  targetLocale,
                  error.message,
                );
              }
            }
            throw error as Error;
          }
        })();

        console.log(
          `ℹ️ Using raw LLM API ("${provider}":"${model}") to translate from "${sourceLocale}" to "${targetLocale}"`,
        );

        const response = await generateText({
          model: aiModel,
          messages: [
            {
              role: "system",
              content: getSystemPrompt({
                sourceLocale,
                targetLocale,
                prompt: prompt ?? undefined,
              }),
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

  // details lookup compatible with providers metadata + lingo.dev special-case
  private static _getProviderDetails(providerId: string) {
    if ((PROVIDER_METADATA as any)[providerId]) {
      return (PROVIDER_METADATA as any)[providerId];
    }
    if (providerId === "lingo.dev") {
      return {
        name: "Lingo.dev",
        apiKeyEnvVar: "LINGODOTDEV_API_KEY",
        apiKeyConfigKey: "auth.apiKey",
        getKeyLink: "https://lingo.dev",
        docsLink: "https://lingo.dev/docs",
      };
    }
    return undefined;
  }

  /**
   * Show an actionable error message and exit the process when the compiler
   * is running in CI/CD without a required LLM API key.
   * The message explains why this situation is unusual and how to fix it.
   * @param providerId The ID of the LLM provider whose key is missing.
   */
  private static _failMissingLLMKeyCi(providerId: string): void {
    let details = this._getProviderDetails(providerId);
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
    const details = this._getProviderDetails(providerId);
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
