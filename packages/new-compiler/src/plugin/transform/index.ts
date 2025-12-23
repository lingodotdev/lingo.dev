import * as parser from "@babel/parser";
import path from "path";
import type { LingoConfig, TranslationEntry } from "../../types";
import { processFile } from "./process-file";
import { logger } from "../../utils/logger";
import { generate } from "./babel-compat";

export interface TransformResult {
  code: string;
  map?: any;
  newEntries?: TranslationEntry[];
  transformed: boolean;
}

export interface BabelTransformOptions {
  code: string;
  filePath: string;
  config: LingoConfig;
}

/**
 * Transform component code to inject translation calls
 */
export function transformComponent({
  code,
  filePath,
  config,
}: BabelTransformOptions): TransformResult {
  // Get relative file path for consistent hashing
  const relativeFilePath = path
    .relative(path.resolve(config.sourceRoot), filePath)
    .split(path.sep)
    // '/' is used as a cross-platform path separator
    .join("/");

  try {
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    logger.debug(`Transforming ${filePath}`);

    const translationEntries = processFile(ast, {
      relativeFilePath,
      needsDirective: config.useDirective,
    });

    const output = generate(
      ast,
      {
        sourceMaps: true,
      },
      code,
    );

    logger.debug(`Transformed ${filePath}. Code: ${output.code}`);

    return {
      code: output.code,
      map: output.map,
      newEntries: translationEntries,
      transformed: translationEntries.length > 0,
    };
  } catch (error) {
    // TODO (AleksandrSl 08/12/2025): Should also log the message
    logger.error(`Failed to transform ${filePath}:`, error);
    // Return original code on error
    return {
      code,
      transformed: false,
    };
  }
}
