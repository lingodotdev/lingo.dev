import { InteractiveCommand, InteractiveOption } from "interactive-commander";
import Ora from "ora";
import fs from "fs/promises";
import { getConfig } from "../utils/config";
import { glob } from "glob";

const BOM = "\uFEFF";

export default new InteractiveCommand()
  .command("fix")
  .description("Automatically repair common issues in source files")
  .argument("[files...]", "Optional list of files to fix")
  .addOption(
    new InteractiveOption(
      "--dry-run",
      "Preview changes without writing to files",
    )
      .prompt(undefined)
      .default(false),
  )
  .addOption(
    new InteractiveOption(
      "--fix-bom",
      "Removes UTF-8 BOM characters from a file's start",
    )
      .prompt(undefined)
      .default(true),
  )
  .action(async (files: string[], options) => {
    const spinner = Ora().start("Searching for files to fix...");
    let filesToProcess: string[] = [];

    if (files && files.length > 0) {
      filesToProcess = files;
      spinner.succeed(`Found ${filesToProcess.length} files. Analyzing...`);
    } else {
      interface Bucket {
        include: string[];
      }
      interface Config {
        locale: { source: string; targets: string[] };
        buckets: Record<string, Bucket>;
      }

      const config = (await getConfig()) as Config | undefined;
      if (!config) {
        spinner.fail("Configuration file (i18n.json) not found.");
        return;
      }

      const allLocales = [config.locale.source, ...config.locale.targets];
      const basePatterns = Object.values(config.buckets).flatMap(
        (bucket: Bucket) => bucket.include,
      );

      const allPatterns = basePatterns.flatMap((pattern) => {
        if (pattern.includes("[locale]")) {
          return allLocales.map((locale) =>
            pattern.replace("[locale]", locale),
          );
        }
        return pattern;
      });

      const configFiles = await glob(allPatterns, {
        ignore: "node_modules/**",
        nodir: true,
      });

      if (!configFiles.length) {
        spinner.warn("No files found matching the patterns in your i18n.json.");
        return;
      }

      filesToProcess = configFiles;
      spinner.succeed(
        `Found ${filesToProcess.length} files from i18n.json. Analyzing...`,
      );
    }

    let filesFixed = 0;
    const fixes: { [key: string]: string[] } = {};

    for (const file of filesToProcess) {
      const fileContent = await fs.readFile(file, "utf-8");
      let fixedContent = fileContent;
      const appliedFixes: string[] = [];

      if (options.fixBom && fixedContent.startsWith(BOM)) {
        fixedContent = fixedContent.substring(BOM.length);
        appliedFixes.push("Removed BOM");
      }

      if (appliedFixes.length > 0) {
        filesFixed++;
        fixes[file] = appliedFixes;

        if (options.dryRun) {
          console.log(
            `[DRY RUN] Would fix ${file}: ${appliedFixes.join(", ")}`,
          );
        } else {
          await fs.writeFile(file, fixedContent, "utf-8");
        }
      }
    }

    if (filesFixed > 0) {
      spinner.succeed(`Fixed ${filesFixed} files.`);
      if (!options.dryRun) {
        for (const [file, applied] of Object.entries(fixes)) {
          console.log(`  ✓ ${file}: ${applied.join(", ")}`);
        }
      }
    } else {
      spinner.succeed("All files look good. No fixes needed.");
    }
  });
