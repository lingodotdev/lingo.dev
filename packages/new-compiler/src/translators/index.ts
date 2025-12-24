/**
 * Translation utilities
 *
 * @module @lingo.dev/compiler-beta/translate
 */

// Core API
export type { Translator, TranslatableEntry } from "./api";

// Translators
export { PseudoTranslator } from "./pseudotranslator";
export { Service } from "./lingo";
export type { LingoTranslatorConfig } from "./lingo";
export { createTranslator } from "./translator-factory";

// Translation Service (orchestrator)
export { TranslationService } from "./translation-service";
export type {
  TranslationServiceConfig,
  TranslationResult,
  TranslationError,
} from "./translation-service";

export type { DictionarySchema } from "./api";

// Cache abstractions
export type { TranslationCache, LocalCacheConfig } from "./cache";
export { createCache } from "./cache-factory";
