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
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

const REGEX_PATH_SEP = path.sep === "\\" ? "\\\\" : path.sep;
const NO_PATH_SEP_CLASS = `[^${REGEX_PATH_SEP}]`;
const ESCAPED_GLOB_STAR = /\\\*/g;

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

  const rawSegments = pathPattern.split(path.sep).filter((segment) => segment);
  const patternSegments: string[] = [];
  for (const segment of rawSegments) {
    const prev = patternSegments[patternSegments.length - 1];
    if (segment === "**" && prev === "**") {
      continue;
    }
    patternSegments.push(segment);
  }

  const localeSegmentIndexes = patternSegments.reduce((indexes, segment, idx) => {
    if (segment.includes("[locale]")) {
      indexes.push(idx);
    }
    return indexes;
  }, [] as number[]);

  const collapsedPattern =
    patternSegments.length > 0 ? patternSegments.join(path.sep) : pathPattern;
  const sourcePathPattern = collapsedPattern.replaceAll(/\[locale\]/g, sourceLocale);
  const unixStylePattern = sourcePathPattern.replace(/\\/g, "/");

  const sourcePaths = glob
    .sync(unixStylePattern, {
      follow: true,
      withFileTypes: true,
      windowsPathsNoEscape: true,
    })
    .filter((file) => file.isFile() || file.isSymbolicLink())
    .map((file) => file.fullpath())
    .map((fullpath) => normalizePath(path.relative(process.cwd(), fullpath)));

  const placeholderedPaths: string[] = [];

  sourcePaths.forEach((sourcePath) => {
    const normalizedSourcePath = normalizePath(
      sourcePath.replace(/\//g, path.sep),
    );
    const sourceSegments = normalizedSourcePath.split(path.sep).filter((segment) => segment);
    const segmentMap = alignPatternToPath(patternSegments, sourceSegments, sourceLocale);
    if (!segmentMap) {
      return;
    }

    const placeholderSegments = sourceSegments.slice();
    localeSegmentIndexes.forEach((patternIdx) => {
      const mappedIdx = segmentMap[patternIdx];
      if (mappedIdx === undefined) {
        return;
      }
      const projectionRegex = segmentRegexForLocale(
        patternSegments[patternIdx],
        sourceLocale,
      );
      if (!projectionRegex) {
        return;
      }
      const match = placeholderSegments[mappedIdx]?.match(projectionRegex);
      if (!match) {
        return;
      }
      const prefix = match[1] ?? "";
      const suffix = match[2] ?? "";
      placeholderSegments[mappedIdx] = `${prefix}[locale]${suffix}`;
    });

    placeholderedPaths.push(placeholderSegments.join(path.sep));
  });

  return placeholderedPaths;
}

function resolveBucketItem(bucketItem: string | BucketItem): BucketItem {
  if (typeof bucketItem === "string") {
    return { path: bucketItem, delimiter: null };
  }
  return bucketItem;
}

function alignPatternToPath(
  patternSegments: string[],
  sourceSegments: string[],
  sourceLocale: string,
): Record<number, number> | null {
  const segmentMap: Record<number, number> = {};

  let patternIdx = 0;
  let sourceIdx = 0;
  while (
    patternIdx < patternSegments.length &&
    patternSegments[patternIdx] !== "**"
  ) {
    if (
      sourceIdx >= sourceSegments.length ||
      !segmentMatches(patternSegments[patternIdx], sourceSegments[sourceIdx], sourceLocale)
    ) {
      return null;
    }
    segmentMap[patternIdx] = sourceIdx;
    patternIdx += 1;
    sourceIdx += 1;
  }

  let leftSourceIndex = sourceIdx;

  patternIdx = patternSegments.length - 1;
  sourceIdx = sourceSegments.length - 1;
  while (patternIdx >= 0 && patternSegments[patternIdx] !== "**") {
    if (
      sourceIdx < 0 ||
      !segmentMatches(patternSegments[patternIdx], sourceSegments[sourceIdx], sourceLocale)
    ) {
      return null;
    }
    segmentMap[patternIdx] = sourceIdx;
    patternIdx -= 1;
    sourceIdx -= 1;
  }

  let rightSourceIndex = sourceIdx;

  const globstarIndexes: number[] = [];
  for (let idx = 0; idx < patternSegments.length; idx += 1) {
    if (patternSegments[idx] === "**") {
      globstarIndexes.push(idx);
    }
  }

  for (let idx = 0; idx < globstarIndexes.length - 1; idx += 1) {
    const start = globstarIndexes[idx];
    const end = globstarIndexes[idx + 1];
    const blockLength = end - start - 1;
    if (blockLength <= 0) {
      continue;
    }
    const block = patternSegments.slice(start + 1, end);
    let found = false;
    for (
      let candidate = leftSourceIndex;
      candidate + blockLength <= rightSourceIndex + 1;
      candidate += 1
    ) {
      let matches = true;
      for (let offset = 0; offset < blockLength; offset += 1) {
        if (
          candidate + offset >= sourceSegments.length ||
          !segmentMatches(
            block[offset],
            sourceSegments[candidate + offset],
            sourceLocale,
          )
        ) {
          matches = false;
          break;
        }
      }
      if (matches) {
        for (let offset = 0; offset < blockLength; offset += 1) {
          segmentMap[start + 1 + offset] = candidate + offset;
        }
        leftSourceIndex = candidate + blockLength;
        found = true;
        break;
      }
    }
    if (!found) {
      return null;
    }
  }

  return segmentMap;
}

function segmentMatches(
  patternSegment: string,
  sourceSegment: string,
  locale: string,
): boolean {
  if (patternSegment === "**") {
    return true;
  }
  const sentinel = "__LOCALE_PLACEHOLDER__";
  const withSentinel = patternSegment.replace(/\[locale\]/g, sentinel);
  const escaped = escapeRegex(withSentinel).replace(
    ESCAPED_GLOB_STAR,
    `${NO_PATH_SEP_CLASS}*`,
  );
  const regexSource = escaped.split(sentinel).join(escapeRegex(locale));
  const matcher = new RegExp(`^${regexSource}$`);
  return matcher.test(sourceSegment);
}

function segmentRegexForLocale(
  patternSegment: string,
  locale: string,
): RegExp | null {
  if (!patternSegment.includes("[locale]")) {
    return null;
  }
  const parts = patternSegment.split("[locale]");
  if (parts.length !== 2) {
    return null;
  }
  const prefix = escapeRegex(parts[0]).replace(
    ESCAPED_GLOB_STAR,
    `${NO_PATH_SEP_CLASS}*`,
  );
  const suffix = escapeRegex(parts[1]).replace(
    ESCAPED_GLOB_STAR,
    `${NO_PATH_SEP_CLASS}*`,
  );
  return new RegExp(`^(${prefix})${escapeRegex(locale)}(${suffix})$`);
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
}
