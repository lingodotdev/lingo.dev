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
  const sourcePathPattern = pathPattern.replaceAll(/\[locale\]/g, sourceLocale);
  const sourcePatternChunks = pathPatternChunks.map((chunk) =>
    chunk.replaceAll(/\[locale\]/g, sourceLocale),
  );

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

  return sourcePaths.map((sourcePath) => {
    const normalizedSourcePath = normalizePath(
      sourcePath.replace(/\//g, path.sep),
    );
    const sourcePathChunks = normalizedSourcePath.split(path.sep);
    const placeholderSegments = matchPatternToPathSegments(
      pathPatternChunks,
      sourcePatternChunks,
      sourcePathChunks,
      sourceLocale,
    );

    if (!placeholderSegments) {
      return normalizedSourcePath;
    }

    return placeholderSegments.join(path.sep);
  });
}

function matchPatternToPathSegments(
  patternSegments: string[],
  sourcePatternSegments: string[],
  pathSegments: string[],
  sourceLocale: string,
): string[] | null {
  const memo = new Map<string, string[] | null>();

  const helper = (pi: number, si: number): string[] | null => {
    const memoKey = `${pi}:${si}`;
    if (memo.has(memoKey)) {
      return memo.get(memoKey)!;
    }

    if (pi === patternSegments.length && si === pathSegments.length) {
      memo.set(memoKey, []);
      return [];
    }

    if (pi === patternSegments.length) {
      memo.set(memoKey, null);
      return null;
    }

    const patternSegment = patternSegments[pi];

    if (patternSegment === "**") {
      for (let skip = si; skip <= pathSegments.length; skip++) {
        const remainder = helper(pi + 1, skip);
        if (remainder) {
          const consumed = pathSegments.slice(si, skip);
          const result = consumed.concat(remainder);
          memo.set(memoKey, result);
          return result;
        }
      }
      memo.set(memoKey, null);
      return null;
    }

    if (si >= pathSegments.length) {
      memo.set(memoKey, null);
      return null;
    }

    const segmentPattern = sourcePatternSegments[pi];
    if (!segmentMatches(segmentPattern, pathSegments[si])) {
      memo.set(memoKey, null);
      return null;
    }

    const placeholderSegment =
      buildSegmentPlaceholder(patternSegments[pi], pathSegments[si], sourceLocale) ??
      pathSegments[si];

    const remainder = helper(pi + 1, si + 1);
    if (remainder) {
      const result = [placeholderSegment, ...remainder];
      memo.set(memoKey, result);
      return result;
    }

    memo.set(memoKey, null);
    return null;
  };

  return helper(0, 0);
}

function segmentMatches(pattern: string, candidate: string) {
  if (pattern === candidate) {
    return true;
  }
  return minimatch(candidate, pattern, {
    dot: true,
    nocase: process.platform === "win32",
    nocomment: true,
    matchBase: false,
  });
}

type SegmentToken =
  | { type: "literal"; value: string }
  | { type: "placeholder" }
  | { type: "star" }
  | { type: "question" }
  | { type: "charClass"; regex: RegExp };

function buildSegmentPlaceholder(
  patternSegment: string,
  actualSegment: string,
  sourceLocale: string,
): string | null {
  if (!patternSegment.includes("[locale]")) {
    return actualSegment;
  }

  const tokens = parseSegmentTokens(patternSegment);
  const memo = new Map<string, string | null>();

  const helper = (ti: number, si: number): string | null => {
    const memoKey = `${ti}:${si}`;
    if (memo.has(memoKey)) {
      return memo.get(memoKey)!;
    }

    if (ti === tokens.length && si === actualSegment.length) {
      memo.set(memoKey, "");
      return "";
    }

    if (ti === tokens.length || si > actualSegment.length) {
      memo.set(memoKey, null);
      return null;
    }

    const token = tokens[ti];
    let result: string | null = null;

    switch (token.type) {
      case "literal": {
        if (actualSegment.startsWith(token.value, si)) {
          const rest = helper(ti + 1, si + token.value.length);
          if (rest !== null) {
            result = token.value + rest;
          }
        }
        break;
      }
      case "placeholder": {
        if (actualSegment.startsWith(sourceLocale, si)) {
          const rest = helper(ti + 1, si + sourceLocale.length);
          if (rest !== null) {
            result = "[locale]" + rest;
          }
        }
        break;
      }
      case "star": {
        for (let len = 0; si + len <= actualSegment.length; len++) {
          const rest = helper(ti + 1, si + len);
          if (rest !== null) {
            result = actualSegment.slice(si, si + len) + rest;
            break;
          }
        }
        break;
      }
      case "question": {
        if (si < actualSegment.length) {
          const rest = helper(ti + 1, si + 1);
          if (rest !== null) {
            result = actualSegment[si] + rest;
          }
        }
        break;
      }
      case "charClass": {
        if (
          si < actualSegment.length &&
          token.regex.test(actualSegment[si])
        ) {
          const rest = helper(ti + 1, si + 1);
          if (rest !== null) {
            result = actualSegment[si] + rest;
          }
        }
        break;
      }
      default:
        result = null;
    }

    memo.set(memoKey, result);
    return result;
  };

  return helper(0, 0);
}

function parseSegmentTokens(segment: string): SegmentToken[] {
  const tokens: SegmentToken[] = [];
  let buffer = "";
  let index = 0;

  const flushLiteral = () => {
    if (buffer.length) {
      tokens.push({ type: "literal", value: buffer });
      buffer = "";
    }
  };

  while (index < segment.length) {
    if (segment.startsWith("[locale]", index)) {
      flushLiteral();
      tokens.push({ type: "placeholder" });
      index += "[locale]".length;
      continue;
    }

    const char = segment[index];

    if (char === "\\") {
      if (index + 1 < segment.length) {
        buffer += segment[index + 1];
        index += 2;
      } else {
        buffer += char;
        index += 1;
      }
      continue;
    }

    if (char === "*") {
      flushLiteral();
      tokens.push({ type: "star" });
      index += 1;
      continue;
    }

    if (char === "?") {
      flushLiteral();
      tokens.push({ type: "question" });
      index += 1;
      continue;
    }

    if (char === "[") {
      const closingIndex = findClosingBracket(segment, index + 1);
      if (closingIndex !== -1) {
        flushLiteral();
        const classExpression = segment.slice(index + 1, closingIndex);
        const isNegated =
          classExpression.startsWith("!") || classExpression.startsWith("^");
        const content = isNegated
          ? classExpression.slice(1)
          : classExpression;
        const regex = new RegExp(
          `[${isNegated ? "^" : ""}${content}]`,
          process.platform === "win32" ? "i" : "",
        );
        tokens.push({ type: "charClass", regex });
        index = closingIndex + 1;
        continue;
      }
    }

    buffer += char;
    index += 1;
  }

  flushLiteral();
  return tokens;
}

function findClosingBracket(segment: string, startIndex: number): number {
  let index = startIndex;
  if (index >= segment.length) {
    return -1;
  }

  while (index < segment.length) {
    if (segment[index] === "\\") {
      index += 2;
      continue;
    }
    if (segment[index] === "]") {
      return index;
    }
    index += 1;
  }

  return -1;
}

function resolveBucketItem(bucketItem: string | BucketItem): BucketItem {
  if (typeof bucketItem === "string") {
    return { path: bucketItem, delimiter: null };
  }
  return bucketItem;
}
