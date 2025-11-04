import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";
import { DictionaryCacheSchema, DictionarySchema, LCPSchema } from "./schema";
import _ from "lodash";
import {
  LCP_DICTIONARY_FILE_NAME,
  LCP_DICTIONARY_LEGACY_FILE_NAME,
} from "../../_const";

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
        parser: "json",
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
    const cache = JSON.stringify(dictionaryCache, null, 2);
    const formattedCache = await this._format(cache, cachePath);
    fs.writeFileSync(cachePath, formattedCache);

    // After successfully writing the new JSON format, remove legacy file if it exists
    this._cleanupLegacyCache(params);
  }

  // read cache from file as JSON with backward compatibility for legacy format
  private static _read(params: LCPCacheParams): DictionaryCacheSchema {
    const cachePath = this._getCachePath(params);
    const legacyCachePath = this._getLegacyCachePath(params);

    // Check if new JSON format exists
    if (fs.existsSync(cachePath)) {
      const content = fs.readFileSync(cachePath, "utf8");
      try {
        return JSON.parse(content);
      } catch (error) {
        console.warn(
          `[lingo.dev] Failed to parse cache file at ${cachePath}, returning empty cache`,
        );
        return {
          version: 0.1,
          files: {},
        };
      }
    }

    // Check if legacy format exists and migrate
    if (fs.existsSync(legacyCachePath)) {
      return this._migrateLegacyCache(legacyCachePath, params);
    }

    // No cache exists
    return {
      version: 0.1,
      files: {},
    };
  }

  // Migrate legacy JS format to JSON
  private static _migrateLegacyCache(
    legacyCachePath: string,
    params: LCPCacheParams,
  ): DictionaryCacheSchema {
    try {
      const jsContent = fs.readFileSync(legacyCachePath, "utf8");

      // Parse legacy format without executing code
      const cache = this._parseLegacyFormat(jsContent);

      // Log migration (can be guarded by debug flag if needed)
      if (process.env.DEBUG) {
        console.log(
          `[lingo.dev] Migrating cache from legacy format (${legacyCachePath}) to JSON format`,
        );
      }

      return cache;
    } catch (error) {
      console.warn(
        `[lingo.dev] Failed to migrate legacy cache file at ${legacyCachePath}, returning empty cache`,
      );
      return {
        version: 0.1,
        files: {},
      };
    }
  }

  // Parse legacy "export default {...};" format safely without Function constructor
  private static _parseLegacyFormat(content: string): DictionaryCacheSchema {
    // Remove 'export default' prefix and trailing semicolon
    let cleaned = content.trim();

    // Remove export default statement
    cleaned = cleaned.replace(/^export\s+default\s+/, "");

    // Remove trailing semicolon
    cleaned = cleaned.replace(/;\s*$/, "");

    // Parse as JSON - the legacy format was already valid JSON inside the export
    try {
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error("Failed to parse legacy cache format");
    }
  }

  // Clean up legacy cache file after successful migration
  private static _cleanupLegacyCache(params: {
    sourceRoot: string;
    lingoDir: string;
  }) {
    const legacyCachePath = this._getLegacyCachePath(params);
    if (fs.existsSync(legacyCachePath)) {
      try {
        fs.unlinkSync(legacyCachePath);
        if (process.env.DEBUG) {
          console.log(
            `[lingo.dev] Removed legacy cache file: ${legacyCachePath}`,
          );
        }
      } catch (error) {
        // Non-critical error, just log it
        console.warn(
          `[lingo.dev] Failed to remove legacy cache file at ${legacyCachePath}`,
        );
      }
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

  // get legacy cache file path
  private static _getLegacyCachePath(params: {
    sourceRoot: string;
    lingoDir: string;
  }) {
    return path.resolve(
      process.cwd(),
      params.sourceRoot,
      params.lingoDir,
      LCP_DICTIONARY_LEGACY_FILE_NAME,
    );
  }
}
