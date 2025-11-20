export const version = "0.0.0";

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

export {
  loadMetadata,
  saveMetadata,
  upsertEntry,
  upsertEntries,
  getEntry,
  hasEntry,
  getMetadataPath,
} from "./metadata/manager";

export { default as loader } from "./plugin/loader";

export { generateTranslationHash, isValidHash } from "./utils/hash";

/**
 * Initialize the compiler-beta
 * This is mainly for testing/debugging purposes
 */
export function init() {
  console.log("Lingo.dev Compiler Beta v" + version);
}
