import _ from "lodash";
import path from "path";
import { glob } from "glob";
import { minimatch } from "minimatch";
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
  const getUniqKey = (item: {
    pathPattern: string;
    delimiter?: LocaleDelimiter;
  }) => `${item.pathPattern}::${item.delimiter ?? ""}`;
  const uniqueIncludedPatterns = _.uniqBy(includedPatterns, getUniqKey);
  const excludedPatterns = exclude?.flatMap((pattern) =>
    expandPlaceholderedGlob(
      pattern.path,
      resolveOverriddenLocale(sourceLocale, pattern.delimiter),
    ).map((pathPattern) => ({
      pathPattern,
      delimiter: pattern.delimiter,
    })),
  );
  const uniqueExcludedPatterns = excludedPatterns
    ? _.uniqBy(excludedPatterns, getUniqKey)
    : [];
  const result = _.differenceBy(
    uniqueIncludedPatterns,
    uniqueExcludedPatterns,
    getUniqKey,
  );
  return result;
}

// Windows path normalization helper function
function normalizePath(filepath: string): string {
  const normalized = path.normalize(filepath);
  // Ensure case consistency on Windows
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

// Path expansion
function expandPlaceholderedGlob(
  _pathPattern: string,
  sourceLocale: string,
): string[] {
  const absolutePathPattern = path.resolve(_pathPattern);
  const pathPattern = normalizePath(
    path.relative(process.cwd(), absolutePathPattern),
  );
  if (pathPattern.startsWith("..")) {
    throw new CLIError({
      message: `Invalid path pattern: ${pathPattern}. Path pattern must be within the current working directory.`,
      docUrl: "invalidPathPattern",
    });
  }

  // Break down path pattern into parts
  const pathPatternChunks = pathPattern.split(path.sep);
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
  const normalizedLocale =
    process.platform === "win32" ? sourceLocale.toLowerCase() : sourceLocale;
  // substitute [locale] in pathPattern with normalized locale
  const sourcePathPattern = pathPattern.replaceAll(
    /\[locale\]/g,
    normalizedLocale,
  );
  // Convert to Unix-style for Windows compatibility
  const unixStylePattern = sourcePathPattern.replace(/\\/g, "/");

  // get all files that match the sourcePathPattern
  const sourcePaths = glob
    .sync(unixStylePattern, {
      follow: true,
      withFileTypes: true,
      windowsPathsNoEscape: true, // Windows path support
    })
    .filter((file) => file.isFile() || file.isSymbolicLink())
    .map((file) => file.fullpath())
    .map((fullpath) => normalizePath(path.relative(process.cwd(), fullpath)));

  // transform each source file path back to [locale] placeholder paths
  const placeholderedPaths = sourcePaths.map((sourcePath) => {
    // Normalize path returned by glob for platform compatibility
    const normalizedSourcePath = normalizePath(
      sourcePath.replace(/\//g, path.sep),
    );
    const sourcePathChunks = normalizedSourcePath.split(path.sep);
    const mapping = mapPatternToSource(
      pathPatternChunks,
      sourcePathChunks,
      normalizedLocale,
    );
    localeSegmentIndexes.forEach((localeSegmentIndex) => {
      const sourceIndex = mapping.patToSrc[localeSegmentIndex];
      if (sourceIndex >= 0) {
        sourcePathChunks[sourceIndex] = buildLocalePlaceholderSegment(
          pathPatternChunks[localeSegmentIndex],
          sourcePathChunks[sourceIndex],
          normalizedLocale,
        );
      }
    });
    return sourcePathChunks.join(path.sep);
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

function mapPatternToSource(
  pattern: string[],
  source: string[],
  locale: string,
): { patToSrc: number[] } {
  const patternLength = pattern.length;
  const sourceLength = source.length;
  const memo = new Map<string, boolean>();
  const parent = new Map<string, { i2: number; j2: number }>();
  const isDoubleStar = (segment: string) => segment === "**";
  const segmentMatches = (patternSegment: string, sourceSegment: string) => {
    const concrete = patternSegment.replaceAll("[locale]", locale);
    return minimatch(sourceSegment, concrete, { dot: true });
  };
  const key = (i: number, j: number) => `${i}|${j}`;
  const dfs = (i: number, j: number): boolean => {
    const memoKey = key(i, j);
    if (memo.has(memoKey)) {
      return memo.get(memoKey)!;
    }
    if (i === patternLength) {
      const done = j === sourceLength;
      memo.set(memoKey, done);
      return done;
    }
    let matched = false;
    if (isDoubleStar(pattern[i])) {
      for (let k = j; k <= sourceLength; k += 1) {
        if (dfs(i + 1, k)) {
          parent.set(memoKey, { i2: i + 1, j2: k });
          matched = true;
          break;
        }
      }
    } else if (j < sourceLength && segmentMatches(pattern[i], source[j])) {
      if (dfs(i + 1, j + 1)) {
        parent.set(memoKey, { i2: i + 1, j2: j + 1 });
        matched = true;
      }
    }
    memo.set(memoKey, matched);
    return matched;
  };

  if (!dfs(0, 0)) {
    return {
      patToSrc: pattern.map((_, index) => (index < source.length ? index : -1)),
    };
  }

  const patToSrc = Array(patternLength).fill(-1) as number[];
  let i = 0;
  let j = 0;
  while (i < patternLength) {
    const step = parent.get(key(i, j));
    if (!step) {
      break;
    }
    if (!isDoubleStar(pattern[i])) {
      patToSrc[i] = j;
    }
    i = step.i2;
    j = step.j2;
  }

  return { patToSrc };
}

function buildLocalePlaceholderSegment(
  patternChunk: string,
  sourceChunk: string,
  locale: string,
): string {
  const placeholder = "[locale]";
  const placeholderIndex = patternChunk.indexOf(placeholder);
  if (placeholderIndex === -1) {
    return sourceChunk;
  }

  const leftGlob = patternChunk.slice(0, placeholderIndex);
  const rightGlob = patternChunk.slice(placeholderIndex + placeholder.length);
  const leftMatches = (value: string) =>
    leftGlob ? minimatch(value, leftGlob, { dot: true }) : value.length === 0;
  const rightMatches = (value: string) =>
    rightGlob ? minimatch(value, rightGlob, { dot: true }) : value.length === 0;

  let position = -1;
  while ((position = sourceChunk.indexOf(locale, position + 1)) !== -1) {
    const prefix = sourceChunk.slice(0, position);
    const suffix = sourceChunk.slice(position + locale.length);
    if (leftMatches(prefix) && rightMatches(suffix)) {
      return `${prefix}${placeholder}${suffix}`;
    }
  }

  return patternChunk;
}
