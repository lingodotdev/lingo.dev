import type { LingoConfig } from "../types";
import { transformComponent } from "./transform";
import { logger } from "../utils/logger";
import { MetadataManager } from "../metadata/manager";

/**
 * Turbopack/Webpack loader for automatic translation
 *
 * This loader transforms React components to inject translation calls automatically.
 *
 * For production builds, translations are generated after compilation completes
 * via Next.js's runAfterProductionCompile hook (see next.ts plugin).
 */
export default async function nextCompilerLoader(
  this: any,
  source: string,
): Promise<void> {
  // TODO (AleksandrSl 14/12/2025): Webpack doesn't like callback usage in async function.
  //  But async function can return only code, so we have to use promises which is sad. It actually errors only when we catch an error, so it's not an urgent problem

  // Ensure we're running in loader context
  if (typeof this.async !== "function") {
    throw new Error("This module must be run as a loader");
  }
  const callback = this.async();

  try {
    const config: LingoConfig & { metadataFilePath: string } =
      this.getOptions();

    const metadataManager = new MetadataManager(config.metadataFilePath);

    logger.debug(`[Turbopack Loader] Processing: ${this.resourcePath}`);

    // Transform the component
    const result = transformComponent({
      code: source,
      filePath: this.resourcePath,
      config,
    });

    // If no transformation occurred, return original source
    if (!result.transformed) {
      return callback(null, source);
    }

    // Update metadata with new entries
    if (result.newEntries && result.newEntries.length > 0) {
      await metadataManager.saveMetadataWithEntries(result.newEntries);

      logger.debug(
        `[Turbopack Loader] Found ${result.newEntries.length} translatable text(s) in ${this.resourcePath}`,
      );
    }

    // Validate source map before passing to webpack
    // Webpack crashes if sources array contains undefined values
    const validMap =
      result.map &&
      result.map.sources &&
      Array.isArray(result.map.sources) &&
      result.map.sources.every((s: any) => typeof s === "string")
        ? result.map
        : undefined;

    callback(null, result.code, validMap);
  } catch (error) {
    logger.error(`Compiler failed for ${this.resourcePath}:`);
    logger.error(
      "Details:",
      error,
      typeof error === "object" && error && "message" in error
        ? error.message
        : error,
      error instanceof Error ? error.stack : undefined,
    );
    callback(error as Error);
  }
}
