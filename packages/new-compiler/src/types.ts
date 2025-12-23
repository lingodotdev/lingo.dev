/**
 * Core types for the compiler-beta translation system
 */

import type { LocaleCode } from "lingo.dev/spec";
import type { PluralizationConfig } from "./translators/pluralization";

/**
 * Cookie configuration for locale persistence
 */
export interface CookieConfig {
  /**
   * Name of the cookie to store the locale
   * @default 'locale'
   */
  name: string;

  /**
   * Maximum age of the cookie in seconds
   * @default 31536000 (1 year)
   */
  maxAge: number;
}

/**
 * Locale persistence configuration
 * Currently only supports cookie-based persistence
 */
export type LocalePersistenceConfig = { type: "cookie"; config: CookieConfig };

/**
 * Field that we require users to fill in the config. The rest could be taken from defaults.
 */
export type LingoConfigRequiredFields = "sourceLocale" | "targetLocales";

export type LingoInternalFields = "environment" | "cacheType";

/**
 * Configuration for the Lingo compiler
 */
export type PartialLingoConfig = Pick<LingoConfig, LingoConfigRequiredFields> &
  Partial<
    Omit<
      LingoConfig,
      LingoConfigRequiredFields | "dev" | LingoInternalFields
    > & {
      dev: Partial<LingoConfig["dev"]>;
    }
  >;

export type LingoEnvironment = "development" | "production";

/**
 * Lingo config with all the defaults applied
 */
export type LingoConfig = {
  /**
   * Root directory of the source code
   */
  sourceRoot: string;

  /**
   * Directory for lingo files (.lingo/)
   */
  lingoDir: string;

  /**
   * Environment mode
   * Determines metadata file naming and translator behavior
   *
   * @default "production"
   * @internal
   */
  environment: LingoEnvironment;

  /**
   * Cache implementation type
   * - "local": Local file system cache (default)
   * - "remote": Remote cache (future)
   *
   * @default "local"
   * @internal Since we do not support more types, there is no need to make it public, but it allows keeping the config in the single place
   */
  cacheType: "local";

  /**
   * The locale to translate from.
   *
   * This must match one of the following formats:
   *
   * - [ISO 639-1 language code](https://en.wikipedia.org/wiki/ISO_639-1) (e.g., `"en"`)
   * - [IETF BCP 47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., `"en-US"`)
   *
   * @default "en"
   */
  sourceLocale: LocaleCode;

  /**
   * The locale(s) to translate to.
   *
   * Each locale must match one of the following formats:
   *
   * - [ISO 639-1 language code](https://en.wikipedia.org/wiki/ISO_639-1) (e.g., `"en"`)
   * - [IETF BCP 47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., `"en-US"`)
   *
   * @default ["es"]
   */
  targetLocales: LocaleCode[];

  /**
   * Whether to require 'use i18n' directive
   */
  useDirective: boolean;

  /**
   * Model configuration for lingo translator
   * - Use "lingo.dev" for Lingo.dev Engine (recommended)
   * - Use locale-pair mapping for direct LLM providers
   *
   * Examples:
   * - "lingo.dev"
   * - { "en:es": "google:gemini-2.0-flash", "*:*": "groq:llama3-8b-8192" }
   *
   * @default "lingo.dev"
   */
  models: "lingo.dev" | Record<string, string>;

  /**
   * Custom translation prompt for lingo translator
   * Use {SOURCE_LOCALE} and {TARGET_LOCALE} placeholders
   */
  prompt?: string;

  /**
   * Pluralization configuration
   * Automatically detects and converts messages to ICU MessageFormat
   */
  pluralization: Omit<PluralizationConfig, "sourceLocale">;

  /**
   * Development-specific settings
   */
  dev: {
    /**
     * Use pseudotranslator in development instead of real translator
     * Useful for:
     * - Testing i18n without API calls
     * - Verifying correct elements are translated
     * - Saving AI tokens during development
     *
     * @default false
     */
    usePseudotranslator?: boolean;

    /**
     * Starting port for the translation server in development mode
     * Server will try this port first, then increment if unavailable
     *
     * @default 60000
     */
    translationServerStartPort: number;

    translationServerUrl?: string;
  };

  /**
   * Locale persistence configuration
   * Defines how locale changes should be persisted
   *
   * @default { type: 'cookie', config: { name: 'locale' } }
   */
  localePersistence: LocalePersistenceConfig;

  /**
   * Build mode for CI/production
   * - "translate": Generate translations at build time, fail if translation fails (default)
   * - "cache-only": Only use cached translations, fail if cache is incomplete
   *
   * Can be overridden by LINGO_BUILD_MODE environment variable
   *
   * @default "translate"
   */
  buildMode: "translate" | "cache-only";
};

/**
 * Config needed for translation middleware and server
 * Extends TranslationConfig with optional fields
 */
export type TranslationMiddlewareConfig = Pick<
  LingoConfig,
  | "sourceRoot"
  | "lingoDir"
  | "sourceLocale"
  | "models"
  | "prompt"
  | "targetLocales"
  | "dev"
  | "pluralization"
  | "environment"
  | "cacheType"
>;

/**
 * Config needed for path operations
 * Includes environment to determine metadata file naming
 */
export type PathConfig = Pick<
  LingoConfig,
  "sourceRoot" | "lingoDir" | "environment"
>;

export type MetadataTranslationEntry = BaseTranslationEntry<
  "metadata",
  {
    filePath: string;
    fieldPath: string;
  }
>;

export type AttributeTranslationEntry = BaseTranslationEntry<
  "attribute",
  {
    filePath: string;
    componentName: string;
    attributeName: string;
    parentComponents?: string[];
  }
>;

export type ContentTranslationEntry = BaseTranslationEntry<
  "content",
  {
    filePath: string;
    componentName: string;
  }
>;

export type TranslationEntry =
  | ContentTranslationEntry
  | AttributeTranslationEntry
  | MetadataTranslationEntry;

/**
 * A single translation entry
 */
export type BaseTranslationEntry<Type, Context> = {
  type: Type;
  sourceText: string;
  context: Context;
  location: {
    filePath: string;
    line?: number;
    column?: number;
  };
  hash: string;
  /**
   * Manual translation overrides for specific locales.
   * When present, these translations are used instead of AI-generated ones.
   * Format: { [locale]: "translated text" }
   * @example { "de": "Klicken Sie hier", "fr": "Cliquez ici" }
   */
  overrides?: Record<string, string>;
};

/**
 * Metadata file schema
 */
export interface MetadataSchema {
  /**
   * All translation entries indexed by hash
   */
  entries: Record<string, TranslationEntry>;

  /**
   * Statistics about the metadata
   */
  stats?: {
    totalEntries: number;
    lastUpdated: string;
  };
}
