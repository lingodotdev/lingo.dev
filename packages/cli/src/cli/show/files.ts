import { Command } from "commander";
import _ from "lodash";
import Ora from 'ora';
import Z from 'zod';
import { getConfig } from "../../utils/config";
import { bucketTypeSchema } from "@replexica/spec";
// import { expandPlaceholderedGlob } from "../../workers/bucket";
import { ReplexicaCLIError } from "../../utils/errors";

export function expandPlaceholderedGlob(placeholderedGlob: string, locale: string) {
  return placeholderedGlob.replace(/\[locale\]/g, locale);
}

export default new Command()
  .command("files")
  .description("Print out the list of files managed by Replexica")
  .helpOption("-h, --help", "Show help")
  .action(async (type) => {
    const ora = Ora();
    try {
      const i18nConfig = await getConfig();

      if (!i18nConfig) {
        throw new ReplexicaCLIError({
          message: 'i18n.json not found. Please run `replexica init` to initialize the project.',
          docUrl: "i18nNotFound"
        });
      }

      // Expand the placeholdered globs into actual (placeholdered) paths
      const placeholderedPathsTuples: [Z.infer<typeof bucketTypeSchema>, string][] = [];
      try {
        for (const [bucketType, bucketTypeParams] of Object.entries(i18nConfig.buckets)) {
          const includedPlaceholderedPaths = bucketTypeParams.include
            .map((placeholderedGlob) => expandPlaceholderedGlob(placeholderedGlob, i18nConfig.locale.source))
            .flat();
          const excludedPlaceholderedPaths = bucketTypeParams.exclude
            ?.map((placeholderedGlob) => expandPlaceholderedGlob(placeholderedGlob, i18nConfig.locale.source))
            .flat() || [];
          const finalPlaceholderedPaths = includedPlaceholderedPaths.filter((path) => !excludedPlaceholderedPaths.includes(path));
          for (const placeholderedPath of finalPlaceholderedPaths) {
            placeholderedPathsTuples.push([
              bucketType as Z.infer<typeof bucketTypeSchema>,
              placeholderedPath
            ]);
          }
        }
      } catch (error: any) {
        throw new ReplexicaCLIError({
          message: `Failed to expand placeholdered globs: ${error.message}`,
          docUrl: "placeHolderFailed"
        });
      }

      const files: string[] = [];
      for (const [, placeholderedPath] of placeholderedPathsTuples) {
        const allLocales = [i18nConfig.locale.source, ...i18nConfig.locale.targets];
        for (const locale of allLocales) {
          const file = placeholderedPath.replace(/\[locale\]/g, locale);
          files.push(file);
        }
      }

      files.forEach((file) => console.log(file));
    } catch (error: any) {
      ora.fail(error.message);
      process.exit(1);
    }
  });
