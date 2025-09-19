import _ from "lodash";
import path from "path";
import micromatch from "micromatch";
import picomatch from "picomatch";
import fg from "fast-glob";
import { CLIError } from "./errors";
import {
  I18nConfig,
  resolveOverriddenLocale,
  BucketItem,
  LocaleDelimiter,
} from "@lingo.dev/_spec";
import { bucketTypeSchema } from "@lingo.dev/_spec";
import Z from "zod";

const PLACEHOLDER_TOKEN = "__lingo_locale__";

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

  const unixStylePattern = sourcePathPattern.split(path.sep).join("/");
  const restore = createPlaceholderRestorer(pathPattern, sourceLocale);

  const sourcePaths = fg.sync(unixStylePattern, {
    cwd: process.cwd(),
    dot: true,
    followSymbolicLinks: true,
    onlyFiles: true,
    unique: true,
    suppressErrors: true,
    caseSensitiveMatch: process.platform !== "win32",
  });

  return sourcePaths.map((sourcePath) => {
    const normalizedSourcePath = normalizePath(
      sourcePath.split("/").join(path.sep),
    );
    return restore(normalizedSourcePath);
  });
}

type PlaceholderOperation =
  | { kind: "literal"; literal: string; output: string }
  | { kind: "capture" }
  | { kind: "single" }
  | { kind: "slash" };

function createPlaceholderRestorer(pattern: string, sourceLocale: string) {
  const patternPosix = pattern.split(path.sep).join("/");
  const sanitizedPattern = patternPosix.replaceAll("[locale]", PLACEHOLDER_TOKEN);
  const sourcePattern = sanitizedPattern.replaceAll(
    PLACEHOLDER_TOKEN,
    sourceLocale,
  );

  const mmOptions = {
    dot: true,
    nocase: process.platform === "win32",
    matchBase: false,
    windows: process.platform === "win32",
  } as const;

  const captureRegex = micromatch.makeRe(sourcePattern, {
    ...mmOptions,
    capture: true,
  });

  const tokens = picomatch.parse(sanitizedPattern, {
    capture: true,
    windows: process.platform === "win32",
  }).tokens;

  const operations: PlaceholderOperation[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "bos":
      case "eos":
        break;
      case "slash":
        operations.push({ kind: "slash" });
        break;
      case "text": {
        const value = token.value ?? "";
        operations.push({
          kind: "literal",
          literal: value.replaceAll(PLACEHOLDER_TOKEN, sourceLocale),
          output: value.replaceAll(PLACEHOLDER_TOKEN, "[locale]"),
        });
        break;
      }
      case "star":
      case "globstar":
      case "plus":
      case "paren":
        operations.push({ kind: "capture" });
        break;
      case "qmark":
      case "range":
      case "bracket":
        operations.push({ kind: "single" });
        break;
      default: {
        const value = token.value ?? "";
        operations.push({
          kind: "literal",
          literal: value.replaceAll(PLACEHOLDER_TOKEN, sourceLocale),
          output: value.replaceAll(PLACEHOLDER_TOKEN, "[locale]"),
        });
      }
    }
  }

  return (actualPath: string) => {
    const actualPosix = actualPath.split(path.sep).join("/");
    captureRegex.lastIndex = 0;
    const match = captureRegex.exec(actualPosix);
    if (!match) {
      return actualPath;
    }

    const captures = match.slice(1);
    let captureIndex = 0;
    let position = 0;
    let resultPosix = "";

    for (const operation of operations) {
      switch (operation.kind) {
        case "literal": {
          const { literal, output } = operation;
          if (
            literal &&
            actualPosix.slice(position, position + literal.length) !== literal
          ) {
            return actualPath;
          }
          resultPosix += output;
          position += literal.length;
          break;
        }
        case "capture": {
          const captured = captures[captureIndex++] ?? "";
          resultPosix += captured;
          position += captured.length;
          break;
        }
        case "single": {
          const char = actualPosix[position];
          if (char === undefined) {
            return actualPath;
          }
          resultPosix += char;
          position += 1;
          break;
        }
        case "slash": {
          if (actualPosix[position] === "/") {
            resultPosix += "/";
            position += 1;
          }
          break;
        }
      }
    }

    if (position < actualPosix.length) {
      resultPosix += actualPosix.slice(position);
    }

    const systemPath = resultPosix.split("/").join(path.sep);
    return normalizePath(systemPath);
  };
}

function resolveBucketItem(bucketItem: string | BucketItem): BucketItem {
  if (typeof bucketItem === "string") {
    return { path: bucketItem, delimiter: null };
  }
  return bucketItem;
}
