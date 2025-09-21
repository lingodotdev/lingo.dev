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
    "Run localization pipeline",
  )
  .helpOption("-h, --help", "Show help")
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
    "Filter bucket pathPattern values by substring match. Examples: messages.json or locale/. Repeat to add multiple filters",
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
    "--api-key <api-key>",
    "Override API key from settings or environment variables",
  )
  .option(
    "--debug",
    "Pause before processing to allow attaching a debugger.",
  )
  .option(
    "--concurrency <concurrency>",
    "Number of translation jobs to run concurrently. Higher values can speed up large translation batches but may increase memory usage. Defaults to 10 (maximum 10)",
    (val: string) => parseInt(val),
  )
  .option(
    "--watch",
    "Watch source locale files continuously and retranslate automatically when files change",
  )
  .option(
    "--debounce <milliseconds>",
    "Delay in milliseconds after file changes before retranslating in watch mode. Defaults to 5000",
    (val: string) => parseInt(val),
  )
  .option(
    "--sound",
    "Play audio feedback when translations complete (success or failure sounds)",
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
