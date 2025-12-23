/**
 * Shared test utilities and mock factories
 * Prevents duplication of test helper functions across test files
 */

import type { LingoConfig } from "../types";
import { createLingoConfig } from "../utils/config-factory";

/**
 * Create a mock loader config for testing
 *
 * @param overrides - Partial config to override defaults
 * @returns Complete LoaderConfig
 *
 * @example
 * ```typescript
 * const config = createMockConfig({
 *   sourceLocale: "de",
 * });
 * ```
 */
export function createMockConfig(
  overrides?: Partial<LingoConfig>,
): LingoConfig {
  return createLingoConfig({
    sourceLocale: "en",
    sourceRoot: "src",
    targetLocales: ["en", "de"],
    ...overrides,
  });
}
