import { Command } from "interactive-commander";
import setup from "./setup";
import plan from "./plan";
import execute from "./execute";
import watch from "./watch";
import { CmdRunContext, flagsSchema } from "./_types";
import {
  renderClear,
  renderSpacer,
  renderBanner,
  renderHero,
  pauseIfDebug,
  renderSummary,
} from "../../utils/ui";
import trackEvent from "../../utils/observability";
import { determineAuthId } from "./_utils";
import { exitGracefully } from "../../utils/exit-gracefully";

export default new Command()
  .command("run")
  .description("Run Lingo.dev localization engine")
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
  .option(
    "--watch",
    "Watch source files for changes and automatically retranslate",
  )
  .option(
    "--debounce <milliseconds>",
    "Debounce delay in milliseconds for watch mode (default: 5000ms)",
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

      trackEvent(authId, "cmd.run.start", {
        config: ctx.config,
        flags: ctx.flags,
      });

      await renderSpacer();

      await plan(ctx);
      await renderSpacer();

      await execute(ctx);
      await renderSpacer();

      await renderSummary(ctx.results);
      await renderSpacer();

      // If watch mode is enabled, start watching for changes
      if (ctx.flags.watch) {
        await watch(ctx);
      }

      trackEvent(authId, "cmd.run.success", {
        config: ctx.config,
        flags: ctx.flags,
      });
      exitGracefully();
    } catch (error: any) {
      trackEvent(authId || "unknown", "cmd.run.error", {});
      process.exit(1);
    }
  });
