import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";
import { DictionaryCacheSchema, DictionarySchema, LCPSchema } from "./schema";
import _ from "lodash";
import { LCP_DICTIONARY_FILE_NAME } from "../../_const";

export interface LCPCacheParams {
  sourceRoot: string;
  lingoDir: string;
  lcp: LCPSchema;
}

export class LCPCache {
  // make sure the cache file exists, otherwise imports will fail
  static ensureDictionaryFile(params: {
    sourceRoot: string;
    lingoDir: string;
  }) {
    const cachePath = this._getCachePath(params);
    if (!fs.existsSync(cachePath)) {
      const dir = path.dirname(cachePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(cachePath, "{}");
    }
  }

  // read cache entries for given locale, validate entry hash from LCP schema
  static readLocaleDictionary(
    locale: string,
    params: LCPCacheParams,
  ): DictionarySchema {
    const cache = this._read(params);
    const dictionary = this._extractLocaleDictionary(cache, locale, params.lcp);
    return dictionary;
  }

  // write cache entries for given locale to existing cache file, use hash from LCP schema
  static async writeLocaleDictionary(
    dictionary: DictionarySchema,
    params: LCPCacheParams,
  ): Promise<void> {
    const currentCache = this._read(params);
    const newCache = this._mergeLocaleDictionary(
      currentCache,
      dictionary,
      params.lcp,
    );
    await this._write(newCache, params);
  }

  // merge dictionary with current cache, sort files, entries and locales to minimize diffs
  private static _mergeLocaleDictionary(
    currentCache: DictionaryCacheSchema,
    dictionary: DictionarySchema,
    lcp: LCPSchema,
  ): DictionaryCacheSchema {
    const files = _(dictionary.files)
      .mapValues((file, fileName) => ({
        ...file,
        entries: _(file.entries)
          .mapValues((entry, entryName) => {
            // find if entry exists in current cache, it might contain some locales already
            const cachedEntry =
              _.get(currentCache, ["files", fileName, "entries", entryName]) ??
              {};
            const hash = _.get(lcp, [
              "files",
              fileName,
              "scopes",
              entryName,
              "hash",
            ]);

            // reuse existing cache entry if its hash matches LCP schema, ensures the cache is up to date
            const cachedEntryContent =
              cachedEntry.hash === hash ? cachedEntry.content : {};

            // sorted by keys (locales) to minimize diffs
            const content = _({
              ...cachedEntryContent,
              [dictionary.locale]: entry,
            })
              .toPairs()
              .sortBy([0])
              .fromPairs()
              .value();
            return { content, hash };
          })
          .toPairs()
          .sortBy([0])
          .fromPairs()
          .value(),
      }))
      .toPairs()
      .sortBy([0])
      .fromPairs()
      .value();

    const newCache = {
      version: dictionary.version,
      files,
    };
    return newCache;
  }

  // extract dictionary from cache for given locale, validate entry hash from LCP schema
  private static _extractLocaleDictionary(
    cache: DictionaryCacheSchema,
    locale: string,
    lcp: LCPSchema,
  ): DictionarySchema {
    const findCachedEntry = (hash: string) => {
      const cachedEntry = _(cache.files)
        .flatMap((file) => _.values(file.entries))
        .find((entry) => entry.hash === hash);
      if (cachedEntry) {
        return cachedEntry.content[locale];
      }
      return undefined;
    };

    const files = _(lcp.files)
      .mapValues((file) => {
        return {
          entries: _(file.scopes)
            .mapValues((entry) => {
              return findCachedEntry(entry.hash);
            })
            .pickBy((value) => value !== undefined)
            .value(),
        };
      })
      .pickBy((file) => !_.isEmpty(file.entries))
      .value();

    const dictionary = {
      version: cache.version,
      locale,
      files,
    };
    return dictionary;
  }

  // format with prettier
  private static async _format(
    cachedContent: string,
    cachePath: string,
  ): Promise<string> {
    try {
      const config = await prettier.resolveConfig(cachePath);
      const prettierOptions = {
        ...(config ?? {}),
        parser: config?.parser ? config.parser : "json",
      };
      return await prettier.format(cachedContent, prettierOptions);
    } catch (error) {
      // prettier not configured or formatting failed
    }
    return cachedContent;
  }

  // write cache to file as JSON
  private static async _write(
    dictionaryCache: DictionaryCacheSchema,
    params: LCPCacheParams,
  ) {
    const cachePath = this._getCachePath(params);
    const cache = `${JSON.stringify(dictionaryCache, null, 2)}`;
    const formattedCache = await this._format(cache, cachePath);
    fs.writeFileSync(cachePath, formattedCache);
  }

  // read cache from file as JSON with legacy migration support
  private static _read(params: LCPCacheParams): DictionaryCacheSchema {
    const cachePath = this._getCachePath(params);
    const legacyPath = path.resolve(
      process.cwd(),
      params.sourceRoot,
      params.lingoDir,
      "dictionary.js",
    );
    if (!fs.existsSync(cachePath)) {
      // Fallback to legacy JS file if present
      if (fs.existsSync(legacyPath)) {
        const legacyContent = fs.readFileSync(legacyPath, "utf8");
        const stripped = legacyContent
          .replace(/^export default\s*/, "")
          .replace(/;\s*$/, "");
        try {
          return JSON.parse(stripped);
        } catch (_e) {
          // If parsing fails, treat as empty cache
        }
      }
      return {
        version: 0.1,
        files: {},
      };
    }
    const jsonString = fs.readFileSync(cachePath, "utf8");
    try {
      return JSON.parse(jsonString);
    } catch (_e) {
      // If somehow invalid JSON in new file, fallback to empty
      return {
        version: 0.1,
        files: {},
      };
    }
  }

  // get cache file path
  private static _getCachePath(params: {
    sourceRoot: string;
    lingoDir: string;
  }) {
    return path.resolve(
      process.cwd(),
      params.sourceRoot,
      params.lingoDir,
      LCP_DICTIONARY_FILE_NAME,
    );
  }
}
