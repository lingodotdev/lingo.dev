import { Command } from "interactive-commander";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";
import setup from "./setup";
import plan from "./plan";
import execute from "./execute";
// Watch functionality now handled by WatchManager - imported dynamically when needed
import { CmdRunContext, flagsSchema } from "./_types";
import frozen from "./frozen";
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
import { WATCH_MODE_EXAMPLES, WATCH_MODE_DETAILED_HELP } from "./help-text";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function playSound(type: "success" | "failure") {
  const platform = os.platform();

  return new Promise<void>((resolve) => {
    const assetDir = path.join(__dirname, "../assets");
    const soundFiles = [path.join(assetDir, `${type}.mp3`)];

    let command = "";

    if (platform === "linux") {
      command = soundFiles
        .map(
          (file) =>
            `mpg123 -q "${file}" 2>/dev/null || aplay "${file}" 2>/dev/null`,
        )
        .join(" || ");
    } else if (platform === "darwin") {
      command = soundFiles.map((file) => `afplay "${file}"`).join(" || ");
    } else if (platform === "win32") {
      command = `powershell -c "try { (New-Object Media.SoundPlayer '${soundFiles[1]}').PlaySync() } catch { Start-Process -FilePath '${soundFiles[0]}' -WindowStyle Hidden -Wait }"`;
    } else {
      command = soundFiles
        .map(
          (file) =>
            `aplay "${file}" 2>/dev/null || afplay "${file}" 2>/dev/null`,
        )
        .join(" || ");
    }

    exec(command, () => {
      resolve();
    });
    setTimeout(resolve, 3000);
  });
}

export default new Command()
  .command("run")
  .description("Run localization pipeline")
  .helpOption("-h, --help", "Show help")
  .addHelpText(
    "after",
    `
${WATCH_MODE_EXAMPLES}

For detailed watch mode documentation, use: lingo.dev run --help-watch
  `,
  )
  .option(
    "--source-locale <source-locale>",
    "Override the source locale from i18n.json for this run",
  )
  .option(
    "--target-locale <target-locale>",
    "Limit processing to the listed target locale codes from i18n.json. Repeat the flag to include multiple locales. Defaults to all configured target locales",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--bucket <bucket>",
    "Limit processing to specific bucket types defined in i18n.json (e.g., json, yaml, android). Repeat the flag to include multiple bucket types. Defaults to all configured buckets",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--file <file>",
    "Filter bucket path pattern values by substring match. Examples: messages.json or locale/. Repeat to add multiple filters",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--key <key>",
    "Filter keys by prefix matching on dot-separated paths. Example: auth.login to match all keys starting with auth.login. Repeat for multiple patterns",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--force",
    "Force re-translation of all keys, bypassing change detection. Useful when you want to regenerate translations with updated AI models or translation settings",
  )
  .option(
    "--frozen",
    "Validate translations are up-to-date without making changes - fails if source files, target files, or lockfile are out of sync. Ideal for CI/CD to ensure translation consistency before deployment",
  )
  .option(
    "--api-key <api-key>",
    "Override API key from settings or environment variables",
  )
  .option("--debug", "Pause before processing to allow attaching a debugger.")
  .option(
    "--concurrency <concurrency>",
    "Number of translation jobs to run concurrently. Higher values can speed up large translation batches but may increase memory usage. Defaults to 10 (maximum 10)",
    (val: string) => parseInt(val),
  )
  .option(
    "--watch",
    "Watch source locale files continuously and retranslate automatically when files change. Enables hot reload functionality for translation development. Use additional --watch-* flags for advanced configuration. Example: --watch --debounce 3000",
  )
  .option(
    "--debounce <milliseconds>",
    "Delay in milliseconds after file changes before retranslating in watch mode. Prevents excessive retranslation during rapid file changes. Works with --debounce-strategy. Defaults to 5000. Example: --debounce 3000",
    (val: string) => parseInt(val),
  )
  .option(
    "--sound",
    "Play audio feedback when translations complete (success or failure sounds). Useful for background monitoring of translation status. Works on Windows, macOS, and Linux",
  )
  .option(
    "--watch-include <pattern>",
    "Include file patterns for watch mode. Supports glob patterns like '**/*.json' or 'src/locales/**'. Only files matching these patterns will trigger retranslation. Repeat for multiple patterns. Example: --watch-include '**/*.json' --watch-include 'locales/**'",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--watch-exclude <pattern>",
    "Exclude file patterns from watch mode. Supports glob patterns to ignore specific files or directories. Useful for excluding temporary files, build outputs, or version control files. Repeat for multiple patterns. Example: --watch-exclude '**/node_modules/**' --watch-exclude '**/*.tmp'",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--watch-config <path>",
    "Path to watch configuration file with advanced watch settings. Allows complex watch configurations beyond CLI flags. File should contain JSON with watch options. Example: --watch-config ./watch-config.json",
  )
  .option(
    "--debounce-strategy <strategy>",
    "Debouncing strategy for watch mode: 'simple' (fixed delay), 'adaptive' (adjusts based on change frequency), or 'batch' (groups changes together). Simple is most predictable, adaptive optimizes for different workflows, batch is best for bulk operations. Defaults to 'simple'. Example: --debounce-strategy adaptive",
  )
  .option(
    "--max-wait <milliseconds>",
    "Maximum wait time in milliseconds before forcing retranslation in watch mode, regardless of ongoing file changes. Prevents indefinite delays during continuous file modifications. Only applies to 'adaptive' and 'batch' strategies. Example: --max-wait 30000",
    (val: string) => parseInt(val),
  )
  .option(
    "--quiet",
    "Suppress non-essential output in watch mode. Only shows errors and critical information. Useful for background processes or when running in CI environments. Opposite of --verbose",
  )
  .option(
    "--progress",
    "Show progress indicators during retranslation. Displays real-time progress bars and status updates. Enabled by default in interactive terminals. Use --no-progress to disable. Example: --no-progress for cleaner logs",
  )
  .option(
    "--notifications",
    "Enable desktop notifications for watch mode events. Shows system notifications when retranslation starts, completes, or fails. Useful when working with the terminal in the background. Requires system notification permissions",
  )
  .option(
    "--batch-size <size>",
    "Number of files to process in a single batch during watch mode. Larger batches improve performance but use more memory. Smaller batches provide more responsive feedback. Defaults to 50. Example: --batch-size 25 for smaller projects",
    (val: string) => parseInt(val),
  )
  .option(
    "--rate-limit-delay <milliseconds>",
    "Delay between batches in milliseconds to prevent system overload during bulk file processing. Higher values reduce CPU/memory usage but slow processing. Lower values increase responsiveness. Defaults to 100. Example: --rate-limit-delay 200 for slower systems",
    (val: string) => parseInt(val),
  )
  .option(
    "--help-watch",
    "Show detailed help for watch mode options and examples",
  )
  .action(async (args) => {
    // Handle special help flag for watch mode
    if (args.helpWatch) {
      console.log(WATCH_MODE_DETAILED_HELP);
      process.exit(0);
    }
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

      await trackEvent(authId, "cmd.run.start", {
        config: ctx.config,
        flags: ctx.flags,
      });

      await renderSpacer();

      await plan(ctx);
      await renderSpacer();

      await frozen(ctx);
      await renderSpacer();

      await execute(ctx);
      await renderSpacer();

      await renderSummary(ctx.results);
      await renderSpacer();

      // Play sound after main tasks complete if sound flag is enabled
      if (ctx.flags.sound) {
        await playSound("success");
      }

      // If watch mode is enabled, start watching for changes
      if (ctx.flags.watch) {
        const { WatchManager } = await import("./watch/manager");
        const watchManager = new WatchManager();

        try {
          await watchManager.start(ctx);

          // Keep the process alive - shutdown is handled by signal handlers
          console.log("Press Ctrl+C to stop watching...");

          // Keep the process alive indefinitely
          await new Promise(() => {}); // This will never resolve, keeping process alive
        } catch (error) {
          console.error("Watch mode failed:", error);
          throw error;
        }
      }

      await trackEvent(authId, "cmd.run.success", {
        config: ctx.config,
        flags: ctx.flags,
      });
    } catch (error: any) {
      await trackEvent(authId || "unknown", "cmd.run.error", {});
      // Play sad sound if sound flag is enabled
      if (args.sound) {
        await playSound("failure");
      }
      throw error;
    }
  });
