import { Command } from "interactive-commander";
import setup from "./run/setup";
import plan from "./run/plan";
import { CmdRunContext, flagsSchema } from "./run/_types";
import {
  renderClear,
  renderSpacer,
  renderBanner,
  renderHero,
  pauseIfDebug,
} from "../utils/ui";
import chalk from "chalk";
import trackEvent from "../utils/observability";
import { determineAuthId } from "./run/_utils";
import { colors } from "../constants";

export default new Command()
  .command("check")
  .description("Check if translations need updating without making changes")
  .helpOption("-h, --help", "Show help")
  .option(
    "--source-locale <source-locale>",
    "Locale to use as source locale. Defaults to i18n.json locale.source",
  )
  .option(
    "--target-locale <target-locale>",
    "Locale to use as target locale. Defaults to i18n.json locale.targets",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--bucket <bucket>",
    "Bucket to process",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--file <file>",
    "File to process. Process only files that match this glob pattern in their path. Use quotes around patterns to prevent shell expansion (e.g., --file '**/*.json'). Useful if you have a lot of files and want to focus on a specific one. Specify more files separated by commas or spaces. Accepts glob patterns.",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--key <key>",
    "Key to process. Process only a specific translation key, useful for updating a single entry. Accepts glob patterns.",
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
    let authId: string | null = null;
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

      authId = await determineAuthId(ctx);

      trackEvent(authId, "cmd.check.start", {
        config: ctx.config,
        flags: ctx.flags,
      });

      await renderSpacer();

      await plan(ctx);
      await renderSpacer();

      // Display summary of what needs updating
      if (ctx.tasks.length > 0) {
        console.log(chalk.hex(colors.orange)("[Check Results]"));
        console.log(
          `${chalk.hex(colors.red)("✗")} Translations need updating: ${chalk.hex(
            colors.yellow,
          )(ctx.tasks.length.toString())} task(s) found`,
        );

        // Group tasks by target locale for better readability
        const tasksByTargetLocale = ctx.tasks.reduce(
          (acc, task) => {
            if (!acc[task.targetLocale]) {
              acc[task.targetLocale] = [];
            }
            acc[task.targetLocale].push(task);
            return acc;
          },
          {} as Record<string, typeof ctx.tasks>,
        );

        Object.entries(tasksByTargetLocale).forEach(([locale, tasks]) => {
          console.log(
            `  ${chalk.hex(colors.blue)("→")} ${chalk.hex(colors.blue)(
              locale,
            )}: ${tasks.length} task(s)`,
          );
        });

        console.log(
          `\nRun ${chalk.hex(colors.green)(
            "lingo.dev run",
          )} to update translations.`,
        );
        await renderSpacer();

        trackEvent(authId, "cmd.check.needs_update", {
          config: ctx.config,
          flags: ctx.flags,
          taskCount: ctx.tasks.length,
        });

        process.exit(1);
      } else {
        console.log(chalk.hex(colors.orange)("[Check Results]"));
        console.log(
          `${chalk.hex(colors.green)("✓")} All translations are up-to-date`,
        );
        await renderSpacer();

        trackEvent(authId, "cmd.check.up_to_date", {
          config: ctx.config,
          flags: ctx.flags,
        });

        process.exit(0);
      }
    } catch (error: any) {
      trackEvent(authId || "unknown", "cmd.check.error", {});
      console.error(chalk.red("Error during check:"), error.message);
      process.exit(1);
    }
  });
