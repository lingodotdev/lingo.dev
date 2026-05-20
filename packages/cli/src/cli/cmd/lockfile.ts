import { Command } from "interactive-commander";
import Z from "zod";
import Ora from "ora";
import { createLockfileHelper } from "../utils/lockfile";
import { bucketTypeSchema, resolveOverriddenLocale } from "@lingo.dev/_spec";
import { getConfig } from "../utils/config";
import createBucketLoader from "../loaders";
import { getBuckets } from "../utils/buckets";

export default new Command()
  .command("lockfile")
  .description(
    "Generate or refresh i18n.lock based on the current source locale content",
  )
  .helpOption("-h, --help", "Show help")
  .option(
    "-f, --force",
    "Overwrite existing lockfile to reset translation tracking",
  )
  .action(async (options) => {
    const flags = flagsSchema.parse(options);
    const ora = Ora();

    const lockfileHelper = createLockfileHelper();
    const lockExisted = lockfileHelper.isLockfileExists();
    const i18nConfig = getConfig();
    const buckets = getBuckets(i18nConfig!);

    let addedCount = 0;
    let skippedCount = 0;
    let replacedCount = 0;

    for (const bucket of buckets) {
      for (const bucketConfig of bucket.paths) {
        const pathPattern = bucketConfig.pathPattern;

        if (!flags.force && lockfileHelper.hasSourceData(pathPattern)) {
          console.log(`  skipped (already populated): ${pathPattern}`);
          skippedCount++;
          continue;
        }

        const sourceLocale = resolveOverriddenLocale(
          i18nConfig!.locale.source,
          bucketConfig.delimiter,
        );
        const bucketLoader = createBucketLoader(
          bucket.type,
          pathPattern,
          {
            defaultLocale: sourceLocale,
            formatter: i18nConfig!.formatter,
            keyColumn: bucket.keyColumn,
          },
          bucket.lockedKeys,
          bucket.lockedPatterns,
          bucket.ignoredKeys,
          bucket.preservedKeys,
          bucket.localizableKeys,
        );
        bucketLoader.setDefaultLocale(sourceLocale);

        const sourceData = await bucketLoader.pull(sourceLocale);
        const sectionExisted = lockfileHelper.hasSourceData(pathPattern);
        lockfileHelper.registerSourceData(pathPattern, sourceData);

        if (sectionExisted) {
          console.log(`  replaced (--force): ${pathPattern}`);
          replacedCount++;
        } else {
          console.log(`  added: ${pathPattern}`);
          addedCount++;
        }
      }
    }

    const summary = [
      addedCount > 0 ? `added ${addedCount}` : null,
      replacedCount > 0 ? `replaced ${replacedCount}` : null,
      skippedCount > 0 ? `skipped ${skippedCount}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    if (!lockExisted) {
      ora.succeed(`Lockfile created (${summary || "no sections"})`);
    } else if (flags.force) {
      ora.succeed(`Lockfile rebuilt (${summary || "no sections"})`);
    } else if (addedCount > 0) {
      ora.succeed(`Lockfile updated (${summary})`);
    } else {
      ora.succeed(`Lockfile is up to date (${summary || "no sections"})`);
    }
  });

const flagsSchema = Z.object({
  force: Z.boolean().prefault(false),
});
