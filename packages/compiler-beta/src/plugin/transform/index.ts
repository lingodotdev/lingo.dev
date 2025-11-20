import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import path from "path";
import type {
  BabelTransformOptions,
  LoaderConfig,
  TransformResult,
} from "../../types";
import { createBabelVisitors } from "./babel-plugin";

/**
 * Transform component code to inject translation calls
 */
export function transformComponent(
  options: BabelTransformOptions,
): TransformResult {
  const { code, filePath, config, metadata, serverPort } = options;

  // Get relative file path for consistent hashing
  const relativeFilePath = path
    .relative(path.resolve(config.sourceRoot), filePath)
    .split(path.sep)
    .join("/"); // Always normalize for cross-platform consistency

  try {
    // Parse the code with TypeScript and JSX support
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    // Create visitor state
    const visitorState = {
      componentName: null as string | null,
      componentType: "unknown" as any,
      needsTranslationImport: false,
      hasUseI18nDirective: false,
      newEntries: [] as any[],
      config,
      metadata,
      filePath: relativeFilePath,
      serverPort,
    };

    // Apply our translation transformation
    const visitors = createBabelVisitors(
      config,
      metadata,
      relativeFilePath,
      visitorState,
      serverPort,
    );
    traverse(ast, visitors);

    // Generate code from AST
    const output = generate(
      ast,
      {
        sourceMaps: true,
        retainLines: false,
      },
      code,
    );

    return {
      code: output.code,
      map: output.map,
      newEntries: visitorState.newEntries,
      transformed: visitorState.newEntries.length > 0,
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
