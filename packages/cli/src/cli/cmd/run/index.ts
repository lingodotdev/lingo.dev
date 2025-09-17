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
  .description(
    "Translate the configured buckets with optional concurrency, watch mode, and detailed progress output",
  )
  .helpOption("-h, --help", "Show help")
  .option(
    "--source-locale <source-locale>",
    "Override the source locale from i18n.json for this run",
  )
  .option(
    "--target-locale <target-locale>",
    "Limit processing to the listed target locale codes. Repeat the flag to queue multiple locales",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--bucket <bucket>",
    "Restrict work to the named bucket type(s) from i18n.json",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--file <file>",
    "Filter pathPattern entries by substring or glob (for example **/messages.json). Repeat to add more filters",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--key <key>",
    "Only translate keys that match this glob-style pattern (repeat for multiple patterns)",
    (val: string, prev: string[]) => (prev ? [...prev, val] : [val]),
  )
  .option(
    "--force",
    "Ignore lockfile diffs and retranslate every key",
  )
  .option(
    "--api-key <api-key>",
    "Use this API key instead of the one sourced from settings or env",
  )
  .option(
    "--debug",
    "Pause before planning tasks so you can attach a debugger",
  )
  .option(
    "--concurrency <concurrency>",
    "Maximum number of translation tasks to run in parallel (capped at 10)",
    (val: string) => parseInt(val),
  )
  .option(
    "--watch",
    "Watch the source locale files and rerun the pipeline when they change",
  )
  .option(
    "--debounce <milliseconds>",
    "Custom debounce window in milliseconds for watch mode (default 5000)",
    (val: string) => parseInt(val),
  )
  .option(
    "--sound",
    "Play success or failure sounds when a run finishes",
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

      await trackEvent(authId, "cmd.run.start", {
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
        await playSound("success");
      }

      // If watch mode is enabled, start watching for changes
      if (ctx.flags.watch) {
        await watch(ctx);
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
