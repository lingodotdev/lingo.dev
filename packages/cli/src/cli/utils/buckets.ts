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

export type TemplateSegmentPart =
  | { kind: "literal"; value: string }
  | { kind: "glob"; value: string }
  | { kind: "placeholder"; name: string };

export type TemplateSegment =
  | { kind: "globstar"; original: "**" }
  | {
      kind: "segment";
      original: string;
      parts: TemplateSegmentPart[];
      hasPlaceholder: boolean;
      hasGlob: boolean;
    };

const LOCALE_PLACEHOLDER = "[locale]";
const GLOB_CHARS_REGEX = /[\*\?\[\]\{\}\(\)!+@,]/;

function isGlobPattern(value: string) {
  return GLOB_CHARS_REGEX.test(value);
}

function flushBuffer(
  parts: TemplateSegmentPart[],
  buffer: string,
): string {
  if (!buffer) {
    return "";
  }
  if (isGlobPattern(buffer)) {
    parts.push({ kind: "glob", value: buffer });
  } else {
    parts.push({ kind: "literal", value: buffer });
  }
  return "";
}

export function parsePatternTemplate(pattern: string): TemplateSegment[] {
  const normalized = pattern.replace(/\\/g, "/");
  const rawSegments = normalized.split("/");

  return rawSegments.map<TemplateSegment>((segment) => {
    if (segment === "**") {
      return { kind: "globstar", original: "**" };
    }

    const parts: TemplateSegmentPart[] = [];
    let buffer = "";
    let index = 0;
    while (index < segment.length) {
      if (segment.startsWith(LOCALE_PLACEHOLDER, index)) {
        buffer = flushBuffer(parts, buffer);
        parts.push({ kind: "placeholder", name: "locale" });
        index += LOCALE_PLACEHOLDER.length;
        continue;
      }
      buffer += segment[index];
      index += 1;
    }
    flushBuffer(parts, buffer);

    const hasPlaceholder = parts.some((part) => part.kind === "placeholder");
    const hasGlob = parts.some((part) => part.kind === "glob");

    return {
      kind: "segment",
      original: segment,
      parts,
      hasPlaceholder,
      hasGlob,
    };
  });
}

function segmentToConcretePattern(
  segment: Extract<TemplateSegment, { kind: "segment" }>,
  locale: string,
): string {
  if (!segment.hasPlaceholder) {
    return segment.original;
  }
  return segment.original.split(LOCALE_PLACEHOLDER).join(locale);
}

function segmentMatchesSource(
  segment: Extract<TemplateSegment, { kind: "segment" }>,
  source: string,
  locale: string,
): boolean {
  if (!segment.hasPlaceholder && !segment.hasGlob) {
    return source === segment.original;
  }
  const concrete = segmentToConcretePattern(segment, locale);
  return minimatch(source, concrete, { dot: true });
}

function renderSegment(
  segment: Extract<TemplateSegment, { kind: "segment" }>,
  source: string,
  locale: string,
): string | null {
  const memo = new Map<string, string | null>();

  const dfs = (partIndex: number, position: number): string | null => {
    const memoKey = `${partIndex}|${position}`;
    if (memo.has(memoKey)) {
      return memo.get(memoKey)!;
    }
    if (partIndex === segment.parts.length) {
      const result = position === source.length ? "" : null;
      memo.set(memoKey, result);
      return result;
    }

    const part = segment.parts[partIndex];

    if (part.kind === "literal") {
      if (source.startsWith(part.value, position)) {
        const rest = dfs(partIndex + 1, position + part.value.length);
        if (rest !== null) {
          const result = part.value + rest;
          memo.set(memoKey, result);
          return result;
        }
      }
      memo.set(memoKey, null);
      return null;
    }

    if (part.kind === "placeholder") {
      if (source.startsWith(locale, position)) {
        const rest = dfs(partIndex + 1, position + locale.length);
        if (rest !== null) {
          const result = `${LOCALE_PLACEHOLDER}${rest}`;
          memo.set(memoKey, result);
          return result;
        }
      }
      memo.set(memoKey, null);
      return null;
    }

    for (let length = 0; position + length <= source.length; length += 1) {
      const fragment = source.slice(position, position + length);
      if (!minimatch(fragment, part.value, { dot: true })) {
        continue;
      }
      const rest = dfs(partIndex + 1, position + length);
      if (rest !== null) {
        const result = fragment + rest;
        memo.set(memoKey, result);
        return result;
      }
    }

    memo.set(memoKey, null);
    return null;
  };

  return dfs(0, 0);
}

function buildOutputSegment(
  segment: Extract<TemplateSegment, { kind: "segment" }>,
  source: string,
  locale: string,
): string {
  if (segment.hasPlaceholder) {
    return renderSegment(segment, source, locale) ?? segment.original;
  }
  if (segment.hasGlob) {
    return source;
  }
  return segment.original;
}

function matchTemplateToSource(
  template: TemplateSegment[],
  sourceSegments: string[],
  locale: string,
): string[] | null {
  const memo = new Map<string, string[] | null>();

  const dfs = (templateIndex: number, sourceIndex: number): string[] | null => {
    const memoKey = `${templateIndex}|${sourceIndex}`;
    if (memo.has(memoKey)) {
      return memo.get(memoKey)!;
    }
    if (templateIndex === template.length) {
      const result = sourceIndex === sourceSegments.length ? [] : null;
      memo.set(memoKey, result);
      return result;
    }

    const segment = template[templateIndex];

    if (segment.kind === "globstar") {
      for (let consume = 0; consume <= sourceSegments.length - sourceIndex; consume += 1) {
        const rest = dfs(templateIndex + 1, sourceIndex + consume);
        if (rest) {
          const consumed = sourceSegments.slice(sourceIndex, sourceIndex + consume);
          const combined = [...consumed, ...rest];
          memo.set(memoKey, combined);
          return combined;
        }
      }
      memo.set(memoKey, null);
      return null;
    }

    if (sourceIndex >= sourceSegments.length) {
      memo.set(memoKey, null);
      return null;
    }

    if (!segmentMatchesSource(segment, sourceSegments[sourceIndex], locale)) {
      memo.set(memoKey, null);
      return null;
    }

    const rest = dfs(templateIndex + 1, sourceIndex + 1);
    if (!rest) {
      memo.set(memoKey, null);
      return null;
    }

    const current = buildOutputSegment(
      segment,
      sourceSegments[sourceIndex],
      locale,
    );
    const combined = [current, ...rest];
    memo.set(memoKey, combined);
    return combined;
  };

  return dfs(0, 0);
}

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

  const template = parsePatternTemplate(pathPattern.split(path.sep).join("/"));
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
    const matchedSegments = matchTemplateToSource(
      template,
      sourcePathChunks,
      normalizedLocale,
    );
    if (!matchedSegments) {
      throw new CLIError({
        message: `Pattern "${_pathPattern}" does not map cleanly to matched path "${sourcePath}". Adjust the glob so the placeholder segments can be restored without ambiguity.`,
        docUrl: "invalidPlaceholderMapping",
      });
    }
    return matchedSegments.join(path.sep);
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
