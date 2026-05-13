import _ from "lodash";
import path from "path";
import * as pkg from "glob";
const { glob } = pkg;
import { minimatch } from "minimatch";
import { CLIError } from "./errors";

// WHY: a bare `**/[locale].json` would otherwise descend into vendored trees
// and produce thousands of spurious matches plus locale-restoration failures.
// User-supplied `exclude` entries are applied on top of this list.
const DEFAULT_GLOB_IGNORE = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/.turbo/**",
];
import {
  I18nConfig,
  resolveOverriddenLocale,
  BucketItem,
  LocaleDelimiter,
} from "@lingo.dev/_spec";
import { bucketTypeSchema } from "@lingo.dev/_spec";
import Z from "zod";

// Track bucket types we've already warned about for misplaced `keyColumn`,
// so the warning fires only once per CLI invocation (getBuckets is called
// from multiple command stages).
const warnedKeyColumnTypes = new Set<string>();

type BucketConfig = {
  type: Z.infer<typeof bucketTypeSchema>;
  paths: Array<{ pathPattern: string; delimiter?: LocaleDelimiter }>;
  injectLocale?: string[];
  lockedKeys?: string[];
  lockedPatterns?: string[];
  ignoredKeys?: string[];
  preservedKeys?: string[];
  localizableKeys?: string[];
  keyColumn?: string;
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
      if (bucketEntry.preservedKeys) {
        config.preservedKeys = bucketEntry.preservedKeys;
      }
      if (bucketEntry.localizableKeys) {
        config.localizableKeys = bucketEntry.localizableKeys;
      }
      if (bucketEntry.keyColumn) {
        if (bucketType !== "csv") {
          if (!warnedKeyColumnTypes.has(bucketType)) {
            warnedKeyColumnTypes.add(bucketType);
            console.warn(
              `Warning: "keyColumn" is only supported on "csv" buckets, but was set on "${bucketType}". ` +
                `The setting will be ignored. Remove it from this bucket's config to silence this warning.`,
            );
          }
        } else {
          config.keyColumn = bucketEntry.keyColumn;
        }
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
  // WHY: with recursive ** support a broad pattern can subsume narrower ones
  // (e.g. "src/**/[locale].json" + "src/[locale].json"), so we dedupe by the
  // (pathPattern, delimiter) pair before returning.
  const uniqKey = (item: {
    pathPattern: string;
    delimiter?: LocaleDelimiter;
  }) => `${item.pathPattern}::${item.delimiter ?? ""}`;
  const includedPatterns = _.uniqBy(
    include.flatMap((pattern) =>
      expandPlaceholderedGlob(
        pattern.path,
        resolveOverriddenLocale(sourceLocale, pattern.delimiter),
      ).map((pathPattern) => ({
        pathPattern,
        delimiter: pattern.delimiter,
      })),
    ),
    uniqKey,
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
    uniqKey,
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

  const pathPatternChunks = pathPattern.split(path.sep);
  const localeSegmentIndexes = pathPatternChunks.reduce(
    (indexes, segment, index) => {
      if (segment.includes("[locale]")) {
        indexes.push(index);
      }
      return indexes;
    },
    [] as number[],
  );
  // Case-insensitive on Windows: normalizePath lowercases matched paths while
  // sourceLocale retains original casing (e.g. en-US).
  const normalizedLocale =
    process.platform === "win32" ? sourceLocale.toLowerCase() : sourceLocale;
  const sourcePathPattern = pathPattern.replaceAll(
    /\[locale\]/g,
    normalizedLocale,
  );
  const unixStylePattern = sourcePathPattern.replace(/\\/g, "/");

  // WHY: only narrow the search for ** patterns — for single-segment globs
  // and concrete paths the previous behavior (full traversal, follow symlinks)
  // is preserved so existing configs do not change matched files.
  const isRecursive = unixStylePattern.includes("**");
  const sourcePaths = glob
    .sync(unixStylePattern, {
      follow: !isRecursive,
      withFileTypes: true,
      windowsPathsNoEscape: true,
      ignore: isRecursive ? DEFAULT_GLOB_IGNORE : undefined,
    })
    .filter((file) => file.isFile() || file.isSymbolicLink())
    .map((file) => file.fullpath())
    .map((fullpath) => normalizePath(path.relative(process.cwd(), fullpath)));

  const placeholderedPaths = sourcePaths.map((sourcePath) => {
    const normalizedSourcePath = normalizePath(
      sourcePath.replace(/\//g, path.sep),
    );
    const sourcePathChunks = normalizedSourcePath.split(path.sep);
    const mapping = mapPatternToSource(
      pathPatternChunks,
      sourcePathChunks,
      normalizedLocale,
      pathPattern,
      normalizedSourcePath,
    );
    localeSegmentIndexes.forEach((localeSegmentIndex) => {
      const sourceIndex = mapping.patToSrc[localeSegmentIndex];
      if (sourceIndex < 0) {
        throw new CLIError({
          message: `Pattern "${pathPattern}" matched file "${normalizedSourcePath}" via glob, but the [locale] segment could not be mapped back. Adjust the pattern so [locale] sits in an unambiguous segment.`,
          docUrl: "ambiguousPathPattern",
        });
      }
      sourcePathChunks[sourceIndex] = buildLocalePlaceholderSegment(
        pathPatternChunks[localeSegmentIndex],
        sourcePathChunks[sourceIndex],
        normalizedLocale,
        pathPattern,
        normalizedSourcePath,
      );
    });
    return sourcePathChunks.join(path.sep);
  });
  return placeholderedPaths;
}

// Aligns each pattern segment to a source-path segment, accounting for "**"
// segments that consume a variable number of source segments. Implemented as
// DFS with memoization (O(N*M) instead of exponential backtracking).
//
// Returns the first valid mapping. To guard against silently picking the wrong
// [locale] segment when ** admits multiple valid alignments, the caller must
// validate uniqueness via `hasAmbiguousLocaleMapping` below.
function mapPatternToSource(
  pattern: string[],
  source: string[],
  locale: string,
  fullPattern: string,
  fullSource: string,
): { patToSrc: number[] } {
  const result = alignPatternToSource(pattern, source, locale);

  if (!result) {
    throw new CLIError({
      message: `Pattern "${fullPattern}" matched file "${fullSource}" via glob, but pattern segments could not be aligned with source segments. This is usually caused by ambiguous wildcard placement.`,
      docUrl: "ambiguousPathPattern",
    });
  }

  // For every [locale]-bearing pattern segment, verify there is no alternative
  // alignment that maps it to a different source index. Multiple valid
  // alignments that agree on [locale] positions (e.g. "**/**" against "a/b")
  // are fine; alignments that disagree are not, because the downstream
  // placeholder restoration would produce a different output path.
  for (let i = 0; i < pattern.length; i += 1) {
    if (!pattern[i].includes("[locale]")) continue;
    const chosen = result.patToSrc[i];
    const alternative = alignPatternToSource(pattern, source, locale, {
      forbid: { patternIndex: i, sourceIndex: chosen },
    });
    if (alternative) {
      throw new CLIError({
        message: `Pattern "${fullPattern}" matched file "${fullSource}" via glob, but the [locale] segment "${pattern[i]}" can be aligned to multiple positions in the source path. Anchor the pattern with literal directory names so [locale] has a unique placement.`,
        docUrl: "ambiguousPathPattern",
      });
    }
  }

  return { patToSrc: result.patToSrc };
}

// Runs the alignment DFS once and returns the first patToSrc found, or null if
// none exists. The optional `forbid` constraint disallows assigning a given
// patternIndex to a given sourceIndex, which lets us probe for alternative
// [locale] placements.
function alignPatternToSource(
  pattern: string[],
  source: string[],
  locale: string,
  options?: { forbid?: { patternIndex: number; sourceIndex: number } },
): { patToSrc: number[] } | null {
  const patternLength = pattern.length;
  const sourceLength = source.length;
  const memo = new Map<string, boolean>();
  const parent = new Map<string, { i2: number; j2: number }>();
  const isDoubleStar = (segment: string) => segment === "**";
  const segmentMatches = (patternSegment: string, sourceSegment: string) => {
    const concrete = patternSegment.replaceAll("[locale]", locale);
    return minimatch(sourceSegment, concrete, { dot: true, nocase: true });
  };
  const forbid = options?.forbid;
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
      const blocked =
        forbid && forbid.patternIndex === i && forbid.sourceIndex === j;
      if (!blocked && dfs(i + 1, j + 1)) {
        parent.set(memoKey, { i2: i + 1, j2: j + 1 });
        matched = true;
      }
    }
    memo.set(memoKey, matched);
    return matched;
  };

  if (!dfs(0, 0)) {
    return null;
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

// Within a single pattern segment that contains "[locale]" (e.g. "app-[locale].json"),
// finds where the locale value sits in the matched source segment and replaces it
// with the literal "[locale]" placeholder, preserving the rest of the file name.
function buildLocalePlaceholderSegment(
  patternChunk: string,
  sourceChunk: string,
  locale: string,
  fullPattern: string,
  fullSource: string,
): string {
  const placeholder = "[locale]";
  if (!patternChunk.includes(placeholder)) {
    return sourceChunk;
  }

  // Recursively restore every [locale] occurrence in the segment. At each
  // step we consume one literal block (everything up to the next
  // [locale] token), then locate the locale value in the remaining source,
  // and recurse on what is left of pattern and source. This supports
  // patterns like "app-[locale]-[locale].json" against "app-en-en.json".
  const restored = restoreLocaleInSegment(patternChunk, sourceChunk, locale);
  if (restored !== null) {
    return restored;
  }

  throw new CLIError({
    message: `Pattern "${fullPattern}" matched file "${fullSource}", but the [locale] position inside segment "${patternChunk}" could not be unambiguously restored from "${sourceChunk}". Adjust the pattern so [locale] is surrounded by literal characters or a unique wildcard.`,
    docUrl: "ambiguousPathPattern",
  });
}

function restoreLocaleInSegment(
  pattern: string,
  source: string,
  locale: string,
): string | null {
  const placeholder = "[locale]";
  const placeholderIndex = pattern.indexOf(placeholder);
  if (placeholderIndex === -1) {
    // No more placeholders — the remaining source must satisfy the
    // remaining pattern as a literal/glob suffix.
    if (pattern.length === 0) {
      return source.length === 0 ? "" : null;
    }
    return minimatch(source, pattern, { dot: true, nocase: true })
      ? source
      : null;
  }

  const leftGlob = pattern.slice(0, placeholderIndex);
  const remainingPattern = pattern.slice(placeholderIndex + placeholder.length);

  // WHY: case-insensitive probe. On macOS/Windows the filesystem is
  // case-insensitive, so glob can return a path whose locale segment differs
  // in case from the configured `source` (e.g. configured `en-US`, file on
  // disk `en-us.json`). The pre-`**` implementation used a regex with the /i
  // flag and tolerated this; preserve that semantic. The returned prefix
  // keeps the original casing from `source` so the restored path round-trips
  // exactly to what glob produced.
  const sourceLower = source.toLowerCase();
  const localeLower = locale.toLowerCase();
  let position = -1;
  while ((position = sourceLower.indexOf(localeLower, position + 1)) !== -1) {
    const prefix = source.slice(0, position);
    const leftOk = leftGlob
      ? minimatch(prefix, leftGlob, { dot: true, nocase: true })
      : prefix.length === 0;
    if (!leftOk) continue;
    const restSource = source.slice(position + locale.length);
    const restRestored = restoreLocaleInSegment(
      remainingPattern,
      restSource,
      locale,
    );
    if (restRestored !== null) {
      return `${prefix}${placeholder}${restRestored}`;
    }
  }

  return null;
}

function resolveBucketItem(bucketItem: string | BucketItem): BucketItem {
  if (typeof bucketItem === "string") {
    return { path: bucketItem, delimiter: null };
  }
  return bucketItem;
}
