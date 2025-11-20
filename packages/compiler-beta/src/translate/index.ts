/**
 * Translation utilities
 *
 * @module @lingo.dev/_compiler-beta/translate
 */

export type { Translator, TranslatableEntry } from "./api";
export { PseudoTranslator } from "./pseudotranslator";
export {
  createCachedTranslator,
  ServerTranslationCache,
} from "./cached-translator";
export type { ServerCacheConfig } from "./cache-server";
export { LCPTranslator } from "./lcp";
export type { LCPTranslatorConfig } from "./lcp";
export {
  createTranslator,
  createCachedTranslatorFromConfig,
} from "./translator-factory";
export type { TranslatorConfig } from "./translator-factory";
