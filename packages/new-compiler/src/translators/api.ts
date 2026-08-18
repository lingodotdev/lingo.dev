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
 * Thrown when a translation run fails partway through.
 *
 * Carries the entries that already came back so the caller can persist them.
 * Those entries have been paid for; discarding them makes the next build
 * request and pay for identical source text again.
 */
export class PartialTranslationError extends Error {
  constructor(
    readonly partialTranslations: Record<string, string>,
    override readonly cause: unknown,
  ) {
    super(cause instanceof Error ? cause.message : String(cause));
    this.name = "PartialTranslationError";
  }
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
