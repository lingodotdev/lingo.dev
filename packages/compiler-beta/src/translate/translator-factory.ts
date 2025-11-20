/**
 * Factory for creating translators based on configuration
 */

import type { Translator } from "./api";
import { PseudoTranslator } from "./pseudotranslator";
import { LCPTranslator, type LCPTranslatorConfig } from "./lcp";
import { createCachedTranslator } from "./cached-translator";
import type { ServerCacheConfig } from "./cache-server";

/**
 * Translator configuration types
 */
export type TranslatorConfig =
  | { type: "pseudo" }
  | { type: "lcp"; config: LCPTranslatorConfig };

/**
 * Create a translator instance based on configuration
 */
export function createTranslator(config: TranslatorConfig): Translator<any> {
  switch (config.type) {
    case "pseudo":
      return new PseudoTranslator({});

    case "lcp":
      return new LCPTranslator(config.config);

    default:
      throw new Error(`Unknown translator type: ${(config as any).type}`);
  }
}

/**
 * Create a cached translator based on configuration
 */
export function createCachedTranslatorFromConfig(
  translatorConfig: TranslatorConfig,
  cacheConfig: ServerCacheConfig,
): Translator<any> {
  const translator = createTranslator(translatorConfig);
  return createCachedTranslator(translator, cacheConfig);
}
