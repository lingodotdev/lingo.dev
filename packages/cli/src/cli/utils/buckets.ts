import _ from "lodash";
import path from "path";
import { glob } from "glob";
import { CLIError } from "./errors";
import {
  I18nConfig,
  resolveOverriddenLocale,
  BucketItem,
  LocaleDelimiter,
} from "@lingo.dev/_spec";
import { bucketTypeSchema } from "@lingo.dev/_spec";
import Z from "zod";

type BucketConfig = {
  type: Z.infer<typeof bucketTypeSchema>;
  paths: Array<{ pathPattern: string; delimiter?: LocaleDelimiter }>;
  injectLocale?: string[];
  lockedKeys?: string[];
  lockedPatterns?: string[];
  ignoredKeys?: string[];
};

export function getBuckets(i18nConfig: I18nConfig) {
  const result = Object.entries(i18nConfig.buckets).map(
    ([bucketType, bucketEntry]) => {
      const includeItems = bucketEntry.include.map((item) =>
        resolveBucketItem(item),
      );
      const excludeItems = bucketEntry.exclude?.map((item) =>
        resolveBucketItem(item),
      );
      const config: BucketConfig = {
        type: bucketType as Z.infer<typeof bucketTypeSchema>,
        paths: extractPathPatterns(
          i18nConfig.locale.source,
          includeItems,
          excludeItems,
        ),
      };
      if (bucketEntry.injectLocale) {
        config.injectLocale = bucketEntry.injectLocale;
      }
      if (bucketEntry.lockedKeys) {
        config.lockedKeys = bucketEntry.lockedKeys;
      }
      if (bucketEntry.lockedPatterns) {
        config.lockedPatterns = bucketEntry.lockedPatterns;
      }
      if (bucketEntry.ignoredKeys) {
        config.ignoredKeys = bucketEntry.ignoredKeys;
      }
      return config;
    },
  );

  return result;
}

function extractPathPatterns(
  sourceLocale: string,
  include: BucketItem[],
  exclude?: BucketItem[],
) {
  const includedPatterns = include.flatMap((pattern) =>
    expandPlaceholderedGlob(
      pattern.path,
      resolveOverriddenLocale(sourceLocale, pattern.delimiter),
    ).map((pathPattern) => ({
      pathPattern,
      delimiter: pattern.delimiter,
    })),
  );
  const excludedPatterns = exclude?.flatMap((pattern) =>
    expandPlaceholderedGlob(
      pattern.path,
      resolveOverriddenLocale(sourceLocale, pattern.delimiter),
    ).map((pathPattern) => ({
      pathPattern,
      delimiter: pattern.delimiter,
    })),
  );
  const result = _.differenceBy(
    includedPatterns,
    excludedPatterns ?? [],
    (item) => item.pathPattern,
  );
  return result;
}

// Windows path normalization helper function
function normalizePath(filepath: string): string {
  const normalized = path.normalize(filepath);
  // Ensure case consistency on Windows
  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}

// Path expansion
function expandPlaceholderedGlob(
  _pathPattern: string,
  sourceLocale: string,
): string[] {
  // Throw if pathPattern is an absolute path
  const absolutePathPattern = path.resolve(_pathPattern);
  const pathPattern = path.relative(process.cwd(), absolutePathPattern);
  // Normalize path for platform compatibility
  const normalizedPathPattern = path.normalize(pathPattern);

  const relativePattern = path.relative(process.cwd(), normalizePath(normalizedPathPattern));
  if (relativePattern.startsWith("..")) {
    throw new CLIError({
      message: `Invalid path pattern: ${normalizedPathPattern}. Path pattern must be within the current working directory.`,
      docUrl: "invalidPathPattern",
    });
  }

  // Throw error if pathPattern contains "**" – we don't support recursive path patterns
  if (normalizedPathPattern.includes("**")) {
    throw new CLIError({
      message: `Invalid path pattern: ${normalizedPathPattern}. Recursive path patterns are not supported.`,
      docUrl: "invalidPathPattern",
    });
  }

  // Break down path pattern into parts
  const pathPatternChunks = normalizedPathPattern.split(path.sep);
  // Find the index of the segment containing "[locale]"
  const localeSegmentIndexes = pathPatternChunks.reduce(
    (indexes, segment, index) => {
      if (segment.includes("[locale]")) {
        indexes.push(index);
      }
      return indexes;
    },
    [] as number[],
  );
  // substitute [locale] in pathPattern with sourceLocale
  const sourcePathPattern = normalizedPathPattern.replaceAll(/\[locale\]/g, sourceLocale);
  // Convert to Unix-style for Windows compatibility
  const unixStylePattern = sourcePathPattern.replace(/\\/g, '/');

  // get all files that match the sourcePathPattern
  const sourcePaths = glob
    .sync(unixStylePattern, {
      follow: true,
      withFileTypes: true,
      windowsPathsNoEscape: true  // Windows path support
    })
    .filter((file) => file.isFile() || file.isSymbolicLink())
    .map((file) => file.fullpath())
    .map((fullpath) => path.normalize(path.relative(process.cwd(), fullpath)));

  // transform each source file path back to [locale] placeholder paths
  const placeholderedPaths = sourcePaths.map((sourcePath) => {
    // Normalize path returned by glob for platform compatibility
    const normalizedSourcePath = path.normalize(sourcePath.replace(/\//g, path.sep));
    const sourcePathChunks = normalizedSourcePath.split(path.sep);
    localeSegmentIndexes.forEach((localeSegmentIndex) => {
      // Find the position of the "[locale]" placeholder within the segment
      const pathPatternChunk = pathPatternChunks[localeSegmentIndex];
      const sourcePathChunk = sourcePathChunks[localeSegmentIndex];
      const regexp = new RegExp(
        "(" +
        pathPatternChunk
          .replaceAll(".", "\\.")
          .replaceAll("*", ".*")
          .replace("[locale]", `)${sourceLocale}(`) +
        ")",
      );
      const match = sourcePathChunk.match(regexp);
      if (match) {
        const [, prefix, suffix] = match;
        const placeholderedSegment = prefix + "[locale]" + suffix;
        sourcePathChunks[localeSegmentIndex] = placeholderedSegment;
      }
    });
    const placeholderedPath = sourcePathChunks.join(path.sep);
    return placeholderedPath;
  });
  // return the placeholdered paths
  return placeholderedPaths;
}

function resolveBucketItem(bucketItem: string | BucketItem): BucketItem {
  if (typeof bucketItem === "string") {
    return { path: bucketItem, delimiter: null };
  }
  return bucketItem;
}
