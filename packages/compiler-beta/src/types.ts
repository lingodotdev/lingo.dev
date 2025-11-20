/**
 * Core types for the compiler-beta translation system
 */

import type { TranslatorConfig } from "./translate";

/**
 * Configuration for the translation loader
 */
export interface LoaderConfig {
  /**
   * Root directory of the source code
   */
  sourceRoot: string;

  /**
   * Directory for lingo files (.lingo/)
   */
  lingoDir: string;

  /**
   * Source locale (e.g., 'en')
   */
  sourceLocale: string;

  /**
   * Whether to require 'use i18n' directive
   */
  useDirective?: boolean;

  /**
   * Whether running in development mode
   */
  isDev?: boolean;

  /**
   * Skip transformation for specific patterns
   */
  skipPatterns?: RegExp[];

  /**
   * Translation provider to use
   */
  translator?: TranslatorConfig;
}

/**
 * Context information for a translatable text
 */
export interface TranslationContext {
  /**
   * Name of the React component
   */
  componentName: string;

  /**
   * Relative file path from sourceRoot
   */
  filePath: string;

  /**
   * Line number in the source file
   */
  line?: number;

  /**
   * Column number in the source file
   */
  column?: number;
}

/**
 * A single translation entry
 */
export interface TranslationEntry {
  /**
   * Original source text
   */
  sourceText: string;

  /**
   * Context information
   */
  context: TranslationContext;

  /**
   * Hash of the entry (sourceText + componentName + filePath)
   */
  hash: string;

  /**
   * When this entry was first added
   */
  addedAt: string;

  /**
   * Last time this entry was seen during compilation
   */
  lastSeenAt?: string;
}

/**
 * Metadata file schema (.lingo/metadata.json)
 */
export interface MetadataSchema {
  /**
   * Schema version
   */
  version: string;

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

/**
 * Dictionary schema for translated content
 * Maps hash -> translated text
 */
export type DictionarySchema = Record<string, string>;

/**
 * Result of a transformation
 */
export interface TransformResult {
  /**
   * Transformed code
   */
  code: string;

  /**
   * Source map (optional)
   */
  map?: any;

  /**
   * New entries discovered during transformation
   */
  newEntries?: TranslationEntry[];

  /**
   * Whether transformation was applied
   */
  transformed: boolean;
}

/**
 * Component type detection
 */
export enum ComponentType {
  /** Client Component ('use client') */
  CLIENT = "client",

  /** Server Component (async function) */
  SERVER = "server",

  /** Unknown or not a React component */
  UNKNOWN = "unknown",
}

/**
 * Options for the Babel transformation
 */
export interface BabelTransformOptions {
  /**
   * Source code to transform
   */
  code: string;

  /**
   * File path being transformed
   */
  filePath: string;

  /**
   * Loader configuration
   */
  config: LoaderConfig;

  /**
   * Current metadata
   */
  metadata: MetadataSchema;

  /**
   * Port of the translation server (if running)
   */
  serverPort?: number | null;
}
