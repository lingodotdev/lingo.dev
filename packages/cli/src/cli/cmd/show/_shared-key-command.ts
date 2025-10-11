import { resolveOverriddenLocale, I18nConfig } from "@lingo.dev/_spec";
import createBucketLoader from "../../loaders";
import {
  matchesKeyPattern,
  formatDisplayValue,
} from "../../utils/key-matching";

export type KeyFilterType = "lockedKeys" | "ignoredKeys";

export interface KeyCommandOptions {
  bucket?: string;
}

export interface KeyCommandConfig {
  filterType: KeyFilterType;
  displayName: string; // e.g., "locked", "ignored"
}

export async function executeKeyCommand(
  i18nConfig: I18nConfig,
  buckets: any[],
  options: KeyCommandOptions,
  config: KeyCommandConfig,
): Promise<void> {
  let hasAnyKeys = false;

  for (const bucket of buckets) {
    // Filter by bucket name if specified
    if (options.bucket && bucket.type !== options.bucket) {
      continue;
    }

    // Skip buckets without the specified key patterns
    const keyPatterns = bucket[config.filterType];
    if (!keyPatterns || keyPatterns.length === 0) {
      continue;
    }

    hasAnyKeys = true;

    console.log(`\nBucket: ${bucket.type}`);
    console.log(
      `${capitalize(config.displayName)} key patterns: ${keyPatterns.join(", ")}`,
    );

    for (const bucketConfig of bucket.paths) {
      const sourceLocale = resolveOverriddenLocale(
        i18nConfig.locale.source,
        bucketConfig.delimiter,
      );
      const sourcePath = bucketConfig.pathPattern.replace(
        /\[locale\]/g,
        sourceLocale,
      );

      try {
        // Create a loader to read the source file
        const loader = createBucketLoader(
          bucket.type,
          bucketConfig.pathPattern,
          {
            defaultLocale: sourceLocale,
            injectLocale: bucket.injectLocale,
          },
          [], // Don't apply any filtering when reading
          [],
          [],
        );
        loader.setDefaultLocale(sourceLocale);

        // Read the source file content
        const data = await loader.pull(sourceLocale);

        if (!data || Object.keys(data).length === 0) {
          continue;
        }

        // Filter keys that match the patterns
        const matchedEntries = Object.entries(data).filter(([key]) =>
          matchesKeyPattern(key, keyPatterns),
        );

        if (matchedEntries.length > 0) {
          console.log(`\nMatches in ${sourcePath}:`);
          for (const [key, value] of matchedEntries) {
            const displayValue = formatDisplayValue(value);
            console.log(`  - ${key}: ${displayValue}`);
          }
          console.log(
            `Total: ${matchedEntries.length} ${config.displayName} key(s)`,
          );
        }
      } catch (error: any) {
        console.error(`  Error reading ${sourcePath}: ${error.message}`);
      }
    }
  }

  if (!hasAnyKeys) {
    if (options.bucket) {
      console.log(
        `No ${config.displayName} keys configured for bucket: ${options.bucket}`,
      );
    } else {
      console.log(`No ${config.displayName} keys configured in any bucket.`);
    }
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
