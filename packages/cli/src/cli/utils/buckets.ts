import _ from "lodash";
import path from "path";
import { glob } from "glob";
import micromatch from "micromatch";
import picomatch from "picomatch";
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

  const sourcePathPattern = pathPattern.replaceAll(/\[locale\]/g, sourceLocale);

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
    return restorePlaceholderPath(
      pathPattern,
      normalizedSourcePath,
      sourceLocale,
    );
  });
}

function restorePlaceholderPath(
  pattern: string,
  actualPath: string,
  sourceLocale: string,
): string {
  const placeholderToken = "__lingo_locale__";
  const patternPosix = pattern.split(path.sep).join("/");
  const actualPosix = actualPath.split(path.sep).join("/");
  const sanitizedPattern = patternPosix.replaceAll("[locale]", placeholderToken);
  const sourcePattern = sanitizedPattern.replaceAll(
    placeholderToken,
    sourceLocale,
  );

  const mmOptions = {
    dot: true,
    nocase: process.platform === "win32",
    matchBase: false,
  } as const;

  const captures = micromatch.capture(sourcePattern, actualPosix, mmOptions);
  if (captures === undefined) {
    return actualPath;
  }

  const tokens = picomatch.parse(sanitizedPattern, {
    capture: true,
    windows: process.platform === "win32",
  }).tokens;

  let captureIndex = 0;
  let position = 0;
  let resultPosix = "";

  for (const token of tokens) {
    switch (token.type) {
      case "bos":
      case "eos":
        continue;
      case "slash": {
        if (actualPosix[position] === "/") {
          resultPosix += "/";
          position += 1;
        }
        break;
      }
      case "text": {
        const value = token.value ?? "";
        const literal = value.replaceAll(placeholderToken, sourceLocale);
        if (
          literal &&
          actualPosix.slice(position, position + literal.length) !== literal
        ) {
          return actualPath;
        }
        resultPosix += value.replaceAll(placeholderToken, "[locale]");
        position += literal.length;
        break;
      }
      case "star":
      case "globstar":
      case "plus":
      case "paren": {
        const captured = captures[captureIndex++] ?? "";
        resultPosix += captured;
        position += captured.length;
        break;
      }
      case "qmark":
      case "range":
      case "bracket": {
        const char = actualPosix[position];
        if (char === undefined) {
          return actualPath;
        }
        resultPosix += char;
        position += 1;
        break;
      }
      default: {
        const value = token.value ?? "";
        const literal = value.replaceAll(placeholderToken, sourceLocale);
        if (
          literal &&
          actualPosix.slice(position, position + literal.length) !== literal
        ) {
          return actualPath;
        }
        resultPosix += value.replaceAll(placeholderToken, "[locale]");
        position += literal.length;
      }
    }
  }

  if (position < actualPosix.length) {
    resultPosix += actualPosix.slice(position);
  }

  const systemPath = resultPosix.split("/").join(path.sep);
  return normalizePath(systemPath);
}

function resolveBucketItem(bucketItem: string | BucketItem): BucketItem {
  if (typeof bucketItem === "string") {
    return { path: bucketItem, delimiter: null };
  }
  return bucketItem;
}
