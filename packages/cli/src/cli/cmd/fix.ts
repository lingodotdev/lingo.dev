import { Command } from "interactive-commander";
import Ora from "ora";
import path from "path";
import fs from "fs";
import fixers from "../utils/fixers";

const DEFAULT_EXTS = [
  ".json",
  ".json5",
  ".jsonc",
  ".yml",
  ".yaml",
  ".js",
];

export default new Command()
  .command("fix [paths...]")
  .description("Automatically repair common issues in source files before processing")
  .helpOption("-h, --help", "Show help")
  .option("--dry-run", "Preview changes without writing files")
  .option("--fix-numeric-keys", "Convert numeric-keyed objects to arrays when appropriate")
  .option("--fix-trailing-commas", "Remove trailing commas and common JSON syntax errors")
  .option("--fix-quotes", "Normalize quote style (uses Prettier if available)")
  .option("--fix-bom", "Remove Byte Order Mark (BOM) characters")
  .option("--fix-yaml-indentation", "Normalize YAML indentation and formatting")
  .option("--fix-unicode", "Escape or normalize invalid Unicode sequences")
  .action(async function (options: any, paths: string[] = []) {
    const ora = Ora();

    try {
      ora.start("Collecting files...");

      let targets: string[] = [];
      if (!paths || paths.length === 0) {
        targets = [process.cwd()];
      } else {
        targets = paths;
      }

      // Expand directories
      let files: string[] = [];
      for (const p of targets) {
        const abs = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
        try {
          const stat = fs.statSync(abs);
          if (stat.isDirectory()) {
            const collected = await fixers.collectFiles([abs]);
            files.push(...collected);
          } else if (stat.isFile()) {
            files.push(abs);
          }
        } catch (err) {
          // skip missing
        }
      }

      // Filter to known extensions
      files = files.filter((f) => DEFAULT_EXTS.includes(path.extname(f).toLowerCase()));

      if (files.length === 0) {
        ora.succeed("No target files found to fix.");
        return;
      }

      ora.succeed(`Found ${files.length} files`);

      const results: any[] = [];

      for (const f of files) {
        const res = await fixers.fixFile(f, {
          fixNumericKeys: options.fixNumericKeys,
          fixTrailingCommas: options.fixTrailingCommas,
          fixQuotes: options.fixQuotes,
          fixBom: options.fixBom,
          fixYamlIndentation: options.fixYamlIndentation,
          fixUnicode: options.fixUnicode,
          dryRun: options.dryRun,
        });

        results.push(res);

        // Print diffs if any
        if (res.diffs) {
          console.log(`\n--- ${f} (diff) ---`);
          console.log(res.diffs);
        }
      }

      // Summary
      console.log("\nSummary of fixes:");
      for (const r of results) {
        const sums = Object.entries(r.summary)
          .filter(([, v]) => typeof v === "number" && (v as number) > 0)
          .map(([k, v]) => `  ✓ ${k}: ${v}`)
          .join("\n");
        console.log(`${path.relative(process.cwd(), r.filePath)}:`);
        console.log(sums || "  ✓ No changes needed");
      }

      if (options.dryRun) {
        console.log("\nDry-run mode: no files were modified.");
      }

      ora.succeed("Fix completed");
    } catch (error: any) {
      ora.fail(error.message);
      process.exit(1);
    }
  });
