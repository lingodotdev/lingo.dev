import { Command } from "interactive-commander";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function playSound(type: 'success' | 'failure') {
  const platform = os.platform();
  
  return new Promise<void>((resolve) => {
    const assetDir = path.join(__dirname, "../assets");
    const soundFiles = [
      path.join(assetDir, `${type}.mp3`),
    ];

    let command = '';
    
    if (platform === 'linux') {
      command = soundFiles.map(file => `mpg123 -q "${file}" 2>/dev/null || aplay "${file}" 2>/dev/null`).join(' || ');
    } else if (platform === 'darwin') {
      command = soundFiles.map(file => `afplay "${file}"`).join(' || ');
    } else if (platform === 'win32') {
      command = `powershell -c "try { (New-Object Media.SoundPlayer '${soundFiles[1]}').PlaySync() } catch { Start-Process -FilePath '${soundFiles[0]}' -WindowStyle Hidden -Wait }"`;
    } else {
      command = soundFiles.map(file => `aplay "${file}" 2>/dev/null || afplay "${file}" 2>/dev/null`).join(' || ');
    }
    
    exec(command, () => {
      resolve();
    });
    setTimeout(resolve, 3000);
  });
}

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
  .option(
    "--sound",
    "Play sound on completion, partially completion and failed of the task"
  )
  .action(async (args) => {
    // log the args in terminal
    console.log("CLI args:", args);

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

      // Play sound after main tasks complete if sound flag is enabled
      if (ctx.flags.sound) {
        await playSound('success');
      }

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
      if (args.sound) {
        await playSound('failure');
      }
      process.exit(1);
    }
  });
