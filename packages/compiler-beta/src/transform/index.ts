import { transformSync } from "@babel/core";
import path from "path";
import type {
  BabelTransformOptions,
  LoaderConfig,
  MetadataSchema,
  TransformResult,
} from "../types";
import { createBabelPlugin, extractNewEntries } from "./babel-plugin";

/**
 * Transform component code to inject translation calls
 */
export function transformComponent(
  options: BabelTransformOptions,
): TransformResult {
  const { code, filePath, config, metadata } = options;

  // Get relative file path for consistent hashing
  const relativeFilePath = path
    .relative(path.resolve(config.sourceRoot), filePath)
    .split(path.sep)
    .join("/"); // Always normalize for cross-platform consistency

  try {
    // Transform with Babel
    const result = transformSync(code, {
      filename: filePath,
      plugins: [createBabelPlugin(config, metadata, relativeFilePath)],
      presets: ["@babel/preset-react", "@babel/preset-typescript"],
      sourceMaps: true,
      configFile: false, // Don't load external babel config
      babelrc: false, // Don't load .babelrc
    });

    if (!result || !result.code) {
      return {
        code,
        transformed: false,
      };
    }

    // Extract new entries from plugin state
    const newEntries = result.metadata
      ? extractNewEntries(result.metadata)
      : [];

    return {
      code: result.code,
      map: result.map,
      newEntries,
      transformed: newEntries.length > 0,
    };
  } catch (error) {
    console.error(`Failed to transform ${filePath}:`, error);
    // Return original code on error
    return {
      code,
      transformed: false,
    };
  }
}

/**
 * Check if a file should be transformed
 */
export function shouldTransformFile(
  filePath: string,
  config: LoaderConfig,
): boolean {
  // Only transform .tsx and .jsx files
  if (!filePath.match(/\.(tsx|jsx)$/)) {
    return false;
  }

  // Check skip patterns
  if (config.skipPatterns) {
    for (const pattern of config.skipPatterns) {
      if (pattern.test(filePath)) {
        return false;
      }
    }
  }

  return true;
}
