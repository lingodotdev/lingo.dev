import type { LocaleCode } from "lingo.dev/spec";

export type TranslatableEntry = { text: string; context: Record<string, any> };

export interface Translator<Config> {
  config: Config;

  translate: (
    locale: LocaleCode,
    entriesMap: Record<string, TranslatableEntry>,
  ) => Promise<Record<string, string>>;
}

/**
 * Dictionary schema for translation
 * Simple flat structure with direct access to translations
 */
export interface DictionarySchema {
  version: number;
  locale: LocaleCode;
  entries: Record<string, string>;
}

export function dictionaryFrom(
  locale: LocaleCode,
  entries: DictionarySchema["entries"],
) {
  return {
    // TODO (AleksandrSl 14/12/2025): We do not use version anywhere.
    //  We should either get rid of it, or start cheking it, e.g. if we updated the hash function we should nuke the caches. However, in this case we can tie version to the hash somewhat automatically by using hash function name
    version: 0.1,
    locale,
    entries,
  };
}
