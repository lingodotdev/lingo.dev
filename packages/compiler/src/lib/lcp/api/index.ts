import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { DictionarySchema } from "../schema";
import _ from "lodash";
import { getLocaleModel } from "../../../utils/locales";
import getSystemPrompt from "./prompt";
import { obj2xml, xml2obj } from "./xml2obj";
import shots from "./shots";
import { getGroqKey, getGroqKeyFromEnv } from "../../../utils/groq";
import dedent from "dedent";
import { isRunningInCIOrDocker } from "../../../utils/env";

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
      return await this._translateChunkGroq(
        models,
        sourceDictionary,
        sourceLocale,
        targetLocale,
      );
    } catch (e) {
      console.error(`⚠️  Translation for ${targetLocale} failed:`, e);
      // use empty dictionary if we failed to generate one
      return {
        version: 0.1,
        locale: targetLocale,
        files: {},
      };
    }

    // error message with specific instructions for CI/CD or Docker
    if (isRunningInCIOrDocker()) {
      const groqFromEnv = getGroqKeyFromEnv();
      if (!groqFromEnv) {
        this._failMissingGroqKeyCi();
      }
    }

    throw new Error(
      "⚠️  No API key found. Please set GROQ_API_KEY environment variable. If you dont have one go to https://groq.com/",
    );
  }

  private static async _translateChunkGroq(
    models: Record<string, string>,
    sourceDictionary: DictionarySchema,
    sourceLocale: string,
    targetLocale: string,
  ): Promise<DictionarySchema> {
    const groq = createGroq({ apiKey: getGroqKey() });
    console.log(`Created Groq client for ${targetLocale}`);

    const { provider, model } = getLocaleModel(
      models,
      sourceLocale,
      targetLocale,
    );
    if (!model) {
      throw new Error(
        `⚠️  Locale ${targetLocale} is not configured. Add model for this locale to your config.`,
      );
    }
    if (provider !== "groq") {
      throw new Error(
        `⚠️  Provider ${provider} is not supported. Only "groq" provider is supported at the moment.`,
      );
    }

    console.log(
      `✨ Using model "${model}" from "${provider}" to translate from "${sourceLocale}" to "${targetLocale}"`,
    );

    const groqModel = groq(model);
    console.log(`Created model ${model}`);
    const response = await generateText({
      model: groqModel,
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
    // console.log("Response", response);
    // console.log("Usage:", targetLocale, JSON.stringify(response.usage, null, 2));
    console.log("Response", response.text);
    let responseText = response.text;
    responseText = responseText.substring(
      responseText.indexOf("<"),
      responseText.lastIndexOf(">") + 1,
    );

    return xml2obj(responseText);
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
        2. If you want to use a different LLM, raise an issue in our open-source repo: https://lingo.dev/go/gh
        3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

        ✨
      `,
    );
    process.exit(1);
  }
}
