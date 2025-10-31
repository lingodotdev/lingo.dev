/**
 * Optimized Configuration Parser
 * Implements fast parsing and validation with memoization
 * and schema validation using Zod
 */

import { z } from "zod";
import { memoize } from "lodash";

// Provider configuration schema
const ProviderModelConfigSchema = z.object({
  provider: z.string(),
  model: z.string(),
  apiKey: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
});

const LocalePatternSchema = z.union([
  z.literal("*:*"),
  z.string().regex(/^[a-z]{2}:[a-z]{2}$/), // e.g., "en:es"
  z.string().regex(/^\*:[a-z]{2}$/), // e.g., "*:fr"
  z.string().regex(/^[a-z]{2}:\*$/), // e.g., "en:*"
]);

// Main configuration schema
export const LingoConfigSchema = z.object({
  sourceLocale: z.string().min(2).max(10).default("en"),
  targetLocales: z.array(z.string().min(2).max(10)),
  sourceRoot: z.string().default("src"),
  lingoDir: z.string().default("lingo"),
  rsc: z.boolean().default(false),
  debug: z.boolean().default(false),
  models: z.record(LocalePatternSchema, z.string()).optional(),
  prompt: z.string().optional(),
  cache: z
    .object({
      enabled: z.boolean().default(true),
      ttl: z.number().positive().optional(),
      directory: z.string().optional(),
    })
    .optional(),
  validation: z
    .object({
      checkPlurals: z.boolean().default(true),
      validateVariables: z.boolean().default(true),
      ensureCompleteness: z.boolean().default(true),
    })
    .optional(),
  providers: z.record(z.string(), ProviderModelConfigSchema).optional(),
});

export type LingoConfig = z.infer<typeof LingoConfigSchema>;

/**
 * Parser result with metadata
 */
export interface ParseResult<T> {
  data: T;
  parseTime: number;
  validationTime: number;
  errors?: z.ZodIssue[];
  warnings?: string[];
}

/**
 * Optimized configuration parser
 */
export class OptimizedConfigParser {
  private readonly parseCache = new Map<string, ParseResult<LingoConfig>>();
  private readonly schemaCache = new Map<string, z.ZodSchema>();

  // Memoized parsing functions for better performance
  private readonly memoizedParse = memoize(
    this.parseInternal.bind(this),
    (input: string | object) => {
      return typeof input === "string" ? input : JSON.stringify(input);
    },
  );

  /**
   * Parse and validate configuration with performance tracking
   */
  parse(input: string | object): ParseResult<LingoConfig> {
    const startTime = performance.now();

    // Check cache for string inputs
    if (typeof input === "string") {
      const cached = this.parseCache.get(input);
      if (cached) {
        return { ...cached, parseTime: 0 }; // Indicate cache hit with 0 parse time
      }
    }

    const result = this.memoizedParse(input);

    // Cache the result for string inputs
    if (typeof input === "string") {
      this.parseCache.set(input, result);
    }

    result.parseTime = performance.now() - startTime;
    return result;
  }

  /**
   * Fast parse without full validation (for quick checks)
   */
  fastParse(input: string | object): LingoConfig | null {
    try {
      const data = typeof input === "string" ? JSON.parse(input) : input;

      // Quick structural validation
      if (!data.targetLocales || !Array.isArray(data.targetLocales)) {
        return null;
      }

      return data as LingoConfig;
    } catch {
      return null;
    }
  }

  /**
   * Stream parse for large configuration files
   */
  async *streamParse(
    stream: AsyncIterable<string>,
  ): AsyncGenerator<Partial<LingoConfig>> {
    let buffer = "";
    let depth = 0;
    let inString = false;
    let escaped = false;

    for await (const chunk of stream) {
      buffer += chunk;

      // Simple JSON depth tracking
      for (const char of chunk) {
        if (!escaped) {
          if (char === '"' && !inString) inString = true;
          else if (char === '"' && inString) inString = false;
          else if (char === "\\") escaped = true;
          else if (!inString) {
            if (char === "{" || char === "[") depth++;
            else if (char === "}" || char === "]") depth--;
          }
        } else {
          escaped = false;
        }

        // When we have a complete object at depth 1
        if (depth === 1 && (char === "," || char === "}")) {
          try {
            // Extract and parse the current property
            const partial = this.extractPartialConfig(buffer);
            if (partial) {
              yield partial;
            }
          } catch {
            // Continue parsing
          }
        }
      }
    }

    // Parse remaining buffer
    if (buffer.trim()) {
      const final = this.fastParse(buffer);
      if (final) {
        yield final;
      }
    }
  }

  /**
   * Validate configuration against schema
   */
  validate(config: unknown): z.SafeParseReturnType<unknown, LingoConfig> {
    const startTime = performance.now();
    const result = LingoConfigSchema.safeParse(config);
    const validationTime = performance.now() - startTime;

    if (result.success) {
      return {
        ...result,
        data: { ...result.data, _validationTime: validationTime } as any,
      };
    }

    return result;
  }

  /**
   * Optimize configuration for runtime
   */
  optimize(config: LingoConfig): LingoConfig {
    const optimized = { ...config };

    // Sort target locales for consistent ordering
    optimized.targetLocales = [...config.targetLocales].sort();

    // Optimize model patterns for faster matching
    if (optimized.models) {
      const modelMap = new Map<string, string>();
      const patterns: Array<[RegExp, string]> = [];

      for (const [pattern, model] of Object.entries(optimized.models)) {
        if (pattern === "*:*") {
          // Default pattern - process last
          patterns.push([/.+:.+/, model]);
        } else if (pattern.includes("*")) {
          // Wildcard pattern
          const regex = new RegExp(
            pattern.replace("*", "[a-z]{2,10}").replace(":", ":"),
          );
          patterns.unshift([regex, model]); // More specific patterns first
        } else {
          // Exact match
          modelMap.set(pattern, model);
        }
      }

      // Store optimized lookup structure
      (optimized as any)._modelMap = modelMap;
      (optimized as any)._modelPatterns = patterns;
    }

    return optimized;
  }

  /**
   * Merge multiple configurations with priority
   */
  merge(...configs: Partial<LingoConfig>[]): LingoConfig {
    const merged = configs.reduce((acc, config) => {
      return this.deepMerge(acc, config);
    }, {} as Partial<LingoConfig>);

    const result = this.validate(merged);
    if (!result.success) {
      throw new Error(`Invalid merged configuration: ${result.error.message}`);
    }

    return this.optimize(result.data);
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.parseCache.clear();
    this.schemaCache.clear();
    this.memoizedParse.cache.clear?.();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    parseCacheSize: number;
    schemaCacheSize: number;
    memoizedCacheSize: number;
  } {
    const memoCache = this.memoizedParse.cache as Map<any, any> | undefined;
    return {
      parseCacheSize: this.parseCache.size,
      schemaCacheSize: this.schemaCache.size,
      memoizedCacheSize: memoCache ? memoCache.size : 0,
    };
  }

  /**
   * Internal parse implementation
   */
  private parseInternal(input: string | object): ParseResult<LingoConfig> {
    const parseStart = performance.now();
    let data: unknown;

    try {
      data = typeof input === "string" ? JSON.parse(input) : input;
    } catch (error) {
      return {
        data: {} as LingoConfig,
        parseTime: performance.now() - parseStart,
        validationTime: 0,
        errors: [
          {
            code: "custom",
            path: [],
            message: `Failed to parse JSON: ${(error as Error).message}`,
          },
        ],
      };
    }

    const parseTime = performance.now() - parseStart;
    const validationStart = performance.now();
    const validation = this.validate(data);
    const validationTime = performance.now() - validationStart;

    if (validation.success) {
      return {
        data: this.optimize(validation.data),
        parseTime,
        validationTime,
        warnings: this.generateWarnings(validation.data),
      };
    }

    return {
      data: {} as LingoConfig,
      parseTime,
      validationTime,
      errors: validation.error.issues,
    };
  }

  /**
   * Extract partial configuration from buffer
   */
  private extractPartialConfig(buffer: string): Partial<LingoConfig> | null {
    // Simple extraction logic - can be enhanced
    const match = buffer.match(/"(\w+)":\s*([^,}]+)/);
    if (match) {
      const [, key, value] = match;
      try {
        return { [key]: JSON.parse(value) } as Partial<LingoConfig>;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Deep merge configurations
   */
  private deepMerge(
    target: Partial<LingoConfig>,
    source: Partial<LingoConfig>,
  ): Partial<LingoConfig> {
    const result = { ...target };

    for (const key in source) {
      const sourceValue = source[key as keyof LingoConfig];
      const targetValue = result[key as keyof LingoConfig];

      if (sourceValue === undefined) continue;

      if (
        typeof sourceValue === "object" &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === "object" &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key as keyof LingoConfig] = this.deepMerge(
          targetValue as any,
          sourceValue as any,
        ) as any;
      } else {
        result[key as keyof LingoConfig] = sourceValue as any;
      }
    }

    return result;
  }

  /**
   * Generate warnings for potential issues
   */
  private generateWarnings(config: LingoConfig): string[] {
    const warnings: string[] = [];

    // Check for large number of target locales
    if (config.targetLocales.length > 10) {
      warnings.push(
        `Large number of target locales (${config.targetLocales.length}) may impact performance`,
      );
    }

    // Check for missing cache configuration
    if (!config.cache?.enabled) {
      warnings.push("Caching is disabled, which may impact performance");
    }

    // Check for debug mode in production
    if (config.debug && process.env.NODE_ENV === "production") {
      warnings.push("Debug mode is enabled in production environment");
    }

    return warnings;
  }
}

/**
 * Singleton instance for global use
 */
export const configParser = new OptimizedConfigParser();

/**
 * Helper function for quick parsing
 */
export function parseConfig(input: string | object): LingoConfig {
  const result = configParser.parse(input);
  if (result.errors && result.errors.length > 0) {
    throw new Error(
      `Configuration parsing failed: ${result.errors
        .map((e) => e.message)
        .join(", ")}`,
    );
  }
  return result.data;
}

/**
 * Helper function for validation only
 */
export function validateConfig(config: unknown): boolean {
  return configParser.validate(config).success;
}
