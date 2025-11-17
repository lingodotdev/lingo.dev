export const version = "0.0.0";

// Export types
export type {
  LoaderConfig,
  TranslationContext,
  TranslationEntry,
  MetadataSchema,
  DictionarySchema,
  TransformResult,
  BabelTransformOptions,
  ComponentType,
} from "./types";

// Export metadata management
export {
  loadMetadata,
  saveMetadata,
  upsertEntry,
  upsertEntries,
  getEntry,
  hasEntry,
  getMetadataPath,
} from "./metadata/manager";

// Export transformation
export { transformComponent, shouldTransformFile } from "./transform";

// Export loader (default export for webpack/turbopack)
export { default as loader } from "./loader";

// Export utilities
export {
  generateTranslationHash,
  isValidHash,
  generateShortHash,
} from "./utils/hash";

/**
 * Initialize the compiler-beta
 * This is mainly for testing/debugging purposes
 */
export function init() {
  console.log("Lingo.dev Compiler Beta v" + version);
}
