import createPrettierLoader, { PrettierLoaderOptions } from "./prettier";
import createBiomeLoader from "./biome";
import { ILoader } from "../_types";
import { Options } from "prettier";

export type FormatterType = "prettier" | "biome" | undefined;
export type ParserType = Options["parser"];

export function createFormatterLoader(
  formatterType: FormatterType,
  parser: ParserType,
  bucketPathPattern: string,
): ILoader<string, string> {
  // If explicitly set to undefined, auto-detect (prefer prettier for backward compatibility)
  if (formatterType === undefined) {
    return createPrettierLoader({ parser, bucketPathPattern });
  }

  if (formatterType === "prettier") {
    return createPrettierLoader({ parser, bucketPathPattern });
  }

  if (formatterType === "biome") {
    return createBiomeLoader({ bucketPathPattern });
  }

  throw new Error(`Unknown formatter: ${formatterType}`);
}

// Re-export for direct access if needed
export { createPrettierLoader, createBiomeLoader };
export type { PrettierLoaderOptions };
export type { BiomeLoaderOptions } from "./biome";
