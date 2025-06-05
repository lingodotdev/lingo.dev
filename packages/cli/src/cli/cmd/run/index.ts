import { Command } from "interactive-commander";
import setup from "./setup";
import plan from "./plan";
import execute from "./execute";
import { CmdRunContext, flagsSchema } from "./_types";
import {
  renderClear,
  renderSpacer,
  renderBanner,
  renderHero,
  pauseIfDebug,
  renderSummary,
} from "./_render";
import chalk from "chalk";

export default new Command()
  .command("run")
  .description("Run Lingo.dev localization engine")
  .helpOption("-h, --help", "Show help")
  .option(
    "--source-locale <source-locale>",
    "Locale to use as source locale. Defaults to i18n.json locale.source",
    (val: string, prev: string) => {
      if (!val) return prev;
      if (!process.argv.includes("--target-locale")) {
        console.error(
          `\n❌ ${chalk.red("Error")}: --source-locale must be used together with --target-locale\n`,
        );
        process.exit(1);
      }
      return val;
    },
  )
  .option(
    "--target-locale <target-locale>",
    "Locale to use as target locale. Defaults to i18n.json locale.targets",
    (val: string, prev: string[]) => {
      if (!val) return prev;
      if (!process.argv.includes("--source-locale")) {
        console.error(
          `\n❌ ${chalk.red("Error")}: --target-locale must be used together with --source-locale\n`,
        );
        process.exit(1);
      }
      return prev ? [...prev, val] : [val];
    },
  )
  .option(
    "--bucket <bucket>",
    "Bucket to process",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--file <file>",
    "File to process. Process only files that include this string in their path. Useful if you have a lot of files and want to focus on a specific one. Specify more files separated by commas or spaces.",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--key <key>",
    "Key to process. Process only a specific translation key, useful for updating a single entry",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--force",
    "Ignore lockfile and process all keys, useful for full re-translation",
  )
  .option(
    "--api-key <api-key>",
    "Explicitly set the API key to use, override the default API key from settings",
  )
  .option(
    "--debug",
    "Pause execution at start for debugging purposes, waits for user confirmation before proceeding",
  )
  .option(
    "--concurrency <concurrency>",
    "Number of concurrent tasks to run",
    (val: string) => parseInt(val),
  )
  .action(async (args) => {
    try {
      const ctx: CmdRunContext = {
        flags: flagsSchema.parse(args),
        config: null,
        results: new Map(),
        tasks: [],
        localizer: null,
      };

      await pauseIfDebug(ctx.flags.debug);
      await renderClear();
      await renderSpacer();
      await renderBanner();
      await renderHero();
      await renderSpacer();

      await setup(ctx);
      await renderSpacer();

      await plan(ctx);
      await renderSpacer();

      await execute(ctx);
      await renderSpacer();

      await renderSummary(ctx);
      await renderSpacer();
    } catch (error: any) {
      process.exit(1);
    }
  });
