import {
  DictionaryFile,
  DictionarySchema,
  LCPSchema,
  LCPScope,
} from "./schema";
import _ from "lodash";
import { LCPCache } from "./cache";
import { LCPAPI } from "./api";

export type LCPServerParams = {
  lcp: LCPSchema;
  sourceLocale: string;
  targetLocales: string[];
  sourceRoot: string;
  lingoDir: string;
  models: "lingo.dev" | Record<string, string>;
};

export type LCPServerParamsForLocale = {
  lcp: LCPSchema;
  sourceLocale: string;
  targetLocale: string;
  sourceRoot: string;
  lingoDir: string;
  models: "lingo.dev" | Record<string, string>;
};

export class LCPServer {
  private static dictionariesCache: Record<string, DictionarySchema> | null =
    null;
  private static inFlightPromise: Promise<
    Record<string, DictionarySchema>
  > | null = null;

  static async loadDictionaries(
    params: LCPServerParams,
  ): Promise<Record<string, DictionarySchema>> {
    // Return cached dictionaries if available
    if (this.dictionariesCache) {
      return this.dictionariesCache;
    }

    // If a load is already in progress, await it
    if (this.inFlightPromise) {
      return this.inFlightPromise;
    }

    // Otherwise start a new load restricted by the limiter
    this.inFlightPromise = (async () => {
      try {
        const targetLocales = _.uniq([
          ...params.targetLocales,
          params.sourceLocale,
        ]);

        const dictionaries = await Promise.all(
          targetLocales.map((targetLocale) =>
            this.loadDictionaryForLocale({ ...params, targetLocale }),
          ),
        );

        const result = _.fromPairs(
          targetLocales.map((targetLocale, index) => [
            targetLocale,
            dictionaries[index],
          ]),
        );

        // Cache for subsequent requests within the same process
        this.dictionariesCache = result;

        return result;
      } finally {
        // Clear inFlightPromise regardless of success/failure
        this.inFlightPromise = null;
      }
    })();

    return this.inFlightPromise;
  }

  static async loadDictionaryForLocale(
    params: LCPServerParamsForLocale,
  ): Promise<DictionarySchema> {
    const sourceDictionary = this._extractSourceDictionary(
      params.lcp,
      params.sourceLocale,
      params.targetLocale,
    );

    const cacheParams = {
      lcp: params.lcp,
      sourceLocale: params.sourceLocale,
      lingoDir: params.lingoDir,
      sourceRoot: params.sourceRoot,
    };

    if (this._countDictionaryEntries(sourceDictionary) === 0) {
      console.log(
        "Source dictionary is empty, returning empty dictionary for target locale",
      );
      return { ...sourceDictionary, locale: params.targetLocale };
    }

    const cache = LCPCache.readLocaleDictionary(
      params.targetLocale,
      cacheParams,
    );

    const uncachedSourceDictionary = this._getDictionaryDiff(
      sourceDictionary,
      cache,
    );
    let targetDictionary: DictionarySchema;
    let newTranslations: DictionarySchema | undefined;
    if (this._countDictionaryEntries(uncachedSourceDictionary) === 0) {
      targetDictionary = cache;
    } else if (params.targetLocale === params.sourceLocale) {
      console.log(
        "ℹ️  Lingo.dev returns source dictionary - source and target locales are the same",
      );
      // cache source dictionary for convenience when editing the dictionary.js file
      await LCPCache.writeLocaleDictionary(sourceDictionary, cacheParams);
      return sourceDictionary;
    } else {
      newTranslations = await LCPAPI.translate(
        params.models,
        uncachedSourceDictionary,
        params.sourceLocale,
        params.targetLocale,
      );

      // we merge new translations with cache, so that we can cache empty strings
      targetDictionary = this._mergeDictionaries(newTranslations, cache);
      await LCPCache.writeLocaleDictionary(targetDictionary, cacheParams);
    }

    const targetDictionaryWithFallback = this._mergeDictionaries(
      targetDictionary,
      sourceDictionary,
      true,
    );

    const result = this._addOverridesToDictionary(
      targetDictionaryWithFallback,
      params.lcp,
      params.targetLocale,
    );

    if (newTranslations) {
      console.log(
        `ℹ️  Lingo.dev dictionary for ${params.targetLocale}:\n- %d entries\n- %d cached\n- %d uncached\n- %d translated\n- %d overrides`,
        this._countDictionaryEntries(result),
        this._countDictionaryEntries(cache),
        this._countDictionaryEntries(uncachedSourceDictionary),
        newTranslations ? this._countDictionaryEntries(newTranslations) : 0,
        this._countDictionaryEntries(result) -
          this._countDictionaryEntries(targetDictionary),
      );
    }

    // console.log("Generated object", JSON.stringify(result, null, 2));
    return result;
  }

  private static _extractSourceDictionary(
    lcp: LCPSchema,
    sourceLocale: string,
    targetLocale: string,
  ): DictionarySchema {
    const dictionary: DictionarySchema = {
      version: 0.1,
      locale: sourceLocale,
      files: {},
    };

    for (const [fileKey, fileData] of Object.entries(lcp.files || {})) {
      for (const [scopeKey, scopeData] of Object.entries(
        fileData.scopes || {},
      )) {
        if (scopeData.skip) {
          continue;
        }
        if (this._getScopeLocaleOverride(scopeData, targetLocale)) {
          continue;
        }

        _.set(
          dictionary,
          [
            "files" satisfies keyof DictionarySchema,
            fileKey,
            "entries" satisfies keyof DictionaryFile,
            scopeKey,
          ],
          scopeData.content,
        );
      }
    }

    return dictionary;
  }

  private static _addOverridesToDictionary(
    dictionary: DictionarySchema,
    lcp: LCPSchema,
    targetLocale: string,
  ) {
    for (const [fileKey, fileData] of Object.entries(lcp.files || {})) {
      for (const [scopeKey, scopeData] of Object.entries(
        fileData.scopes || {},
      )) {
        const override = this._getScopeLocaleOverride(scopeData, targetLocale);
        if (!override) {
          continue;
        }
        _.set(
          dictionary,
          [
            "files" satisfies keyof DictionarySchema,
            fileKey,
            "entries" satisfies keyof DictionaryFile,
            scopeKey,
          ],
          override,
        );
      }
    }
    return dictionary;
  }

  private static _getScopeLocaleOverride(scopeData: LCPScope, locale: string) {
    return _.get(scopeData.overrides, locale) ?? null;
  }

  private static _getDictionaryDiff(
    sourceDictionary: DictionarySchema,
    targetDictionary: DictionarySchema,
  ) {
    if (this._countDictionaryEntries(targetDictionary) === 0) {
      return sourceDictionary;
    }

    const files = _(sourceDictionary.files)
      .mapValues((file, fileName) => ({
        ...file,
        entries: _(file.entries)
          .mapValues((entry, entryName) => {
            const targetEntry = _.get(targetDictionary.files, [
              fileName,
              "entries",
              entryName,
            ]);
            if (targetEntry !== undefined) {
              return undefined;
            }
            return entry;
          })
          .pickBy((value) => value !== undefined)
          .value(),
      }))
      .pickBy((value) => Object.keys(value.entries).length > 0)
      .value();
    const dictionary = {
      version: sourceDictionary.version,
      locale: sourceDictionary.locale,
      files,
    };
    return dictionary;
  }

  private static _mergeDictionaries(
    sourceDictionary: DictionarySchema,
    targetDictionary: DictionarySchema,
    removeEmptyEntries = false,
  ) {
    const fileNames = _.uniq([
      ...Object.keys(sourceDictionary.files),
      ...Object.keys(targetDictionary.files),
    ]);
    const files = _(fileNames)
      .map((fileName) => {
        const sourceFile = _.get(sourceDictionary.files, fileName);
        const targetFile = _.get(targetDictionary.files, fileName);
        const entries = removeEmptyEntries
          ? _.pickBy(
              sourceFile?.entries || {},
              (value) => String(value || "")?.trim?.()?.length > 0,
            )
          : sourceFile?.entries || {};
        return [
          fileName,
          {
            ...targetFile,
            entries: _.merge({}, targetFile?.entries || {}, entries),
          },
        ];
      })
      .fromPairs()
      .value();
    const dictionary = {
      version: sourceDictionary.version,
      locale: sourceDictionary.locale,
      files,
    };
    return dictionary;
  }

  private static _countDictionaryEntries(dict: DictionarySchema) {
    return Object.values(dict.files).reduce(
      (sum, file) => sum + Object.keys(file.entries).length,
      0,
    );
  }
}
