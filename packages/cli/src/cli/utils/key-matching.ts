import { minimatch } from "minimatch";

/**
 * Checks if a key matches any of the provided patterns using prefix or glob matching
 */
export function matchesKeyPattern(key: string, patterns: string[]): boolean {
  return patterns.some(
    (pattern) => key.startsWith(pattern) || minimatch(key, pattern),
  );
}

/**
 * Filters entries based on key matching patterns
 */
export function filterEntriesByPattern(
  entries: [string, any][],
  patterns: string[],
): [string, any][] {
  return entries.filter(([key]) => matchesKeyPattern(key, patterns));
}

/**
 * Formats a value for display, truncating long strings
 */
export function formatDisplayValue(value: any, maxLength = 50): string {
  if (typeof value === "string") {
    return value.length > maxLength
      ? `${value.substring(0, maxLength)}...`
      : value;
  }
  return JSON.stringify(value);
}
