import { minimatch } from "minimatch";
import { glob } from "glob";
import { CmdRunContext } from "../_types";
import { getBuckets } from "../../../utils/buckets";
import {
  PatternResolver as IPatternResolver,
  ResolvedPatterns,
  ValidationResult,
} from "./types";

/**
 * PatternResolver handles conversion of bucket configurations to file watch patterns,
 * glob pattern expansion, and pattern validation.
 */
export class PatternResolver implements IPatternResolver {
  /**
   * Resolve watch patterns from the current context configuration
   */
  async resolveWatchPatterns(ctx: CmdRunContext): Promise<ResolvedPatterns> {
    if (!ctx.config) {
      return {
        include: [],
        exclude: [],
        resolved: [],
      };
    }

    const buckets = getBuckets(ctx.config);
    let includePatterns: string[] = [];
    let excludePatterns: string[] = [];

    // Extract patterns from buckets
    for (const bucket of buckets) {
      // Skip if specific buckets are filtered
      if (ctx.flags.bucket && !ctx.flags.bucket.includes(bucket.type)) {
        continue;
      }

      for (const bucketPath of bucket.paths) {
        // Skip if specific files are filtered
        if (ctx.flags.file) {
          if (
            !ctx.flags.file.some(
              (f: string) =>
                bucketPath.pathPattern.includes(f) ||
                minimatch(bucketPath.pathPattern, f),
            )
          ) {
            continue;
          }
        }

        // Get the source locale pattern with enhanced locale placeholder replacement
        const sourceLocale = ctx.flags.sourceLocale || ctx.config.locale.source;
        const sourcePattern = this.replaceLocalePlaceholders(
          [bucketPath.pathPattern],
          sourceLocale,
        )[0];

        includePatterns.push(sourcePattern);
      }
    }

    // Add CLI-specified include/exclude patterns
    if (ctx.flags.watchInclude) {
      const sourceLocale = ctx.flags.sourceLocale || ctx.config.locale.source;
      const cliIncludePatterns = this.replaceLocalePlaceholders(
        ctx.flags.watchInclude,
        sourceLocale,
      );
      includePatterns.push(...cliIncludePatterns);
    }

    if (ctx.flags.watchExclude) {
      excludePatterns.push(...ctx.flags.watchExclude);
    }

    // Add default exclude patterns
    excludePatterns.push(
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/build/**",
      "**/*.tmp",
      "**/*.temp",
      "**/.DS_Store",
      "**/*.swp",
      "**/*.swo",
      "**/*~",
      "**/.#*",
    );

    // Normalize patterns for cross-platform compatibility
    includePatterns = this.normalizePaths(includePatterns);
    excludePatterns = this.normalizePaths(excludePatterns);

    // Validate patterns before expansion
    const validation = this.validatePatterns([
      ...includePatterns,
      ...excludePatterns,
    ]);
    if (!validation.isValid) {
      console.warn(
        "Pattern validation warnings:",
        validation.errors.join(", "),
      );
    }

    // Expand glob patterns to actual file paths
    const resolvedFiles = await this.expandGlobPatterns(includePatterns);

    // Apply exclude filters to resolved files
    const filteredFiles = this.applyFilters(resolvedFiles, [], excludePatterns);

    return {
      include: includePatterns,
      exclude: excludePatterns,
      resolved: filteredFiles,
    };
  }

  /**
   * Validate patterns for syntax correctness and potential issues
   */
  validatePatterns(patterns: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const pattern of patterns) {
      // Check for empty patterns
      if (!pattern || pattern.trim().length === 0) {
        errors.push("Empty pattern found");
        continue;
      }

      // Check for invalid glob syntax
      try {
        // Test the pattern with minimatch to validate syntax
        minimatch("test", pattern);
      } catch (error) {
        errors.push(
          `Invalid glob pattern '${pattern}': ${error instanceof Error ? error.message : String(error)}`,
        );
        continue;
      }

      // Check for potentially problematic patterns
      if (pattern.includes("**/**/**")) {
        warnings.push(
          `Pattern '${pattern}' may be overly broad and could impact performance`,
        );
      }

      // Platform-specific path warnings
      if (pattern.startsWith("/") && process.platform === "win32") {
        warnings.push(
          `Pattern '${pattern}' uses absolute path which may not work on Windows`,
        );
      }

      if (pattern.includes("\\") && process.platform !== "win32") {
        warnings.push(
          `Pattern '${pattern}' contains backslashes which may not work on Unix systems`,
        );
      }

      // Check for unreplaced placeholders
      if (
        pattern.includes("[locale]") ||
        pattern.includes("{locale}") ||
        pattern.includes("${locale}")
      ) {
        warnings.push(
          `Pattern '${pattern}' contains unreplaced locale placeholder`,
        );
      }

      // Check for security issues
      if (pattern.includes("..")) {
        warnings.push(
          `Pattern '${pattern}' contains parent directory references which may be unsafe`,
        );
      }

      // Check for performance issues
      if (pattern.startsWith("**") && !pattern.includes("/")) {
        warnings.push(
          `Pattern '${pattern}' starts with ** without path separator, may match too broadly`,
        );
      }

      // Check for common mistakes
      if (pattern.endsWith("/")) {
        warnings.push(
          `Pattern '${pattern}' ends with slash, may not match files as expected`,
        );
      }

      // Check for very broad patterns that could cause performance issues
      const globStarCount = (pattern.match(/\*\*/g) || []).length;
      if (globStarCount > 2) {
        warnings.push(
          `Pattern '${pattern}' has many recursive wildcards (${globStarCount}), may impact performance`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Expand glob patterns to actual file paths with enhanced options
   */
  async expandGlobPatterns(patterns: string[]): Promise<string[]> {
    const resolvedFiles: string[] = [];
    const expandPromises: Promise<void>[] = [];

    for (const pattern of patterns) {
      const expandPromise = (async () => {
        try {
          // Normalize the pattern for cross-platform compatibility
          const normalizedPattern = this.normalizePaths([pattern])[0];

          // Use glob to expand the pattern with enhanced options
          const files = await glob(normalizedPattern, {
            ignore: [
              "**/node_modules/**",
              "**/.git/**",
              "**/dist/**",
              "**/build/**",
              "**/*.tmp",
              "**/*.temp",
            ],
            nodir: true, // Only return files, not directories
            dot: false, // Don't match dotfiles by default
            absolute: false, // Return relative paths
            maxDepth: 10, // Limit recursion depth for performance
          });

          // Normalize resolved file paths
          const normalizedFiles = this.normalizePaths(files);
          resolvedFiles.push(...normalizedFiles);
        } catch (error) {
          // Log error but continue with other patterns
          console.warn(
            `Failed to expand pattern '${pattern}': ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      })();

      expandPromises.push(expandPromise);
    }

    // Wait for all pattern expansions to complete
    await Promise.all(expandPromises);

    // Remove duplicates, sort, and return
    return [...new Set(resolvedFiles)].sort();
  }

  /**
   * Apply include/exclude filters to a list of files with enhanced matching
   */
  applyFilters(
    files: string[],
    includePatterns: string[],
    excludePatterns: string[],
  ): string[] {
    let filteredFiles = [...files]; // Create a copy to avoid mutation

    // Normalize all file paths for consistent matching
    filteredFiles = this.normalizePaths(filteredFiles);
    const normalizedIncludePatterns = this.normalizePaths(includePatterns);
    const normalizedExcludePatterns = this.normalizePaths(excludePatterns);

    // Apply include filters (if any)
    if (normalizedIncludePatterns.length > 0) {
      filteredFiles = filteredFiles.filter((file) => {
        const normalizedFile = this.normalizePaths([file])[0];
        return normalizedIncludePatterns.some((pattern) => {
          // Try both exact match and glob match
          return minimatch(normalizedFile, pattern, {
            dot: true, // Match dotfiles
            nocase: process.platform === "win32", // Case insensitive on Windows
          });
        });
      });
    }

    // Apply exclude filters
    if (normalizedExcludePatterns.length > 0) {
      filteredFiles = filteredFiles.filter((file) => {
        const normalizedFile = this.normalizePaths([file])[0];
        return !normalizedExcludePatterns.some((pattern) => {
          return minimatch(normalizedFile, pattern, {
            dot: true, // Match dotfiles for exclusion
            nocase: process.platform === "win32", // Case insensitive on Windows
          });
        });
      });
    }

    return filteredFiles;
  }

  /**
   * Replace locale placeholders in patterns with enhanced support
   */
  replaceLocalePlaceholders(patterns: string[], locale: string): string[] {
    return patterns.map((pattern) => {
      // Replace [locale] placeholder
      let result = pattern.replace(/\[locale\]/g, locale);

      // Support additional locale-based placeholders
      result = result.replace(/\$\{locale\}/g, locale);
      result = result.replace(/\{locale\}/g, locale);

      // Support locale variants (e.g., en-US -> en_US)
      const localeUnderscore = locale.replace(/-/g, "_");
      result = result.replace(/\[locale_underscore\]/g, localeUnderscore);
      result = result.replace(/\{locale_underscore\}/g, localeUnderscore);

      // Support locale parts (e.g., en-US -> en)
      const localeBase = locale.split("-")[0];
      result = result.replace(/\[locale_base\]/g, localeBase);
      result = result.replace(/\{locale_base\}/g, localeBase);

      return result;
    });
  }

  /**
   * Normalize file paths for cross-platform compatibility
   */
  normalizePaths(paths: string[]): string[] {
    return paths.map((path) => {
      // Convert to forward slashes for consistency
      let normalized = path.replace(/\\/g, "/");

      // Remove duplicate slashes
      normalized = normalized.replace(/\/+/g, "/");

      // Remove trailing slash (except for root)
      if (normalized.length > 1 && normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
      }

      // Handle relative path normalization
      if (normalized.startsWith("./")) {
        normalized = normalized.slice(2);
      }

      return normalized;
    });
  }

  /**
   * Check if a file matches any of the given patterns
   */
  matchesPatterns(filePath: string, patterns: string[]): boolean {
    return patterns.some((pattern) => minimatch(filePath, pattern));
  }

  /**
   * Check if a file should be watched based on patterns
   */
  shouldWatchFile(
    filePath: string,
    includePatterns: string[],
    excludePatterns: string[],
  ): boolean {
    const normalizedPath = this.normalizePaths([filePath])[0];
    const normalizedIncludePatterns = this.normalizePaths(includePatterns);
    const normalizedExcludePatterns = this.normalizePaths(excludePatterns);

    // Check if file matches any exclude pattern first (for performance)
    if (normalizedExcludePatterns.length > 0) {
      const isExcluded = normalizedExcludePatterns.some((pattern) =>
        minimatch(normalizedPath, pattern, {
          dot: true,
          nocase: process.platform === "win32",
        }),
      );
      if (isExcluded) {
        return false;
      }
    }

    // If no include patterns, watch all non-excluded files
    if (normalizedIncludePatterns.length === 0) {
      return true;
    }

    // Check if file matches any include pattern
    return normalizedIncludePatterns.some((pattern) =>
      minimatch(normalizedPath, pattern, {
        dot: true,
        nocase: process.platform === "win32",
      }),
    );
  }

  /**
   * Get file extension from a path
   */
  getFileExtension(filePath: string): string {
    const lastDot = filePath.lastIndexOf(".");
    const lastSlash = Math.max(
      filePath.lastIndexOf("/"),
      filePath.lastIndexOf("\\"),
    );

    if (lastDot > lastSlash && lastDot !== -1) {
      return filePath.slice(lastDot + 1).toLowerCase();
    }

    return "";
  }

  /**
   * Check if a pattern is likely to match many files (performance warning)
   */
  isPatternBroad(pattern: string): boolean {
    // Patterns that start with ** or contain multiple ** are considered broad
    if (pattern.startsWith("**") || (pattern.match(/\*\*/g) || []).length > 1) {
      return true;
    }

    // Patterns with many wildcards are considered broad
    if ((pattern.match(/\*/g) || []).length > 3) {
      return true;
    }

    return false;
  }

  /**
   * Get statistics about pattern resolution
   */
  getPatternStatistics(resolved: ResolvedPatterns): {
    totalIncludePatterns: number;
    totalExcludePatterns: number;
    resolvedFileCount: number;
    averageFilesPerPattern: number;
    broadPatternCount: number;
  } {
    const broadPatternCount = resolved.include.filter((pattern) =>
      this.isPatternBroad(pattern),
    ).length;

    return {
      totalIncludePatterns: resolved.include.length,
      totalExcludePatterns: resolved.exclude.length,
      resolvedFileCount: resolved.resolved.length,
      averageFilesPerPattern:
        resolved.include.length > 0
          ? Math.round(resolved.resolved.length / resolved.include.length)
          : 0,
      broadPatternCount,
    };
  }
}
