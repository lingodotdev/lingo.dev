import { Command } from "interactive-commander";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
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

function resolveAssetsDir() {
  // Works in src and in built output:
  // src:   packages/cli/src/cli/cmd/run -> ../../../../assets
  // build: packages/cli/build/cli/cmd/run -> ../../../../assets
  return path.join(__dirname, "../../../../assets");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function generateToneWav(filePath: string, freqHz: number, durationMs: number) {
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const volume = 0.2; // 0..1

  const samples = Math.floor((durationMs / 1000) * sampleRate);
  const data = Buffer.alloc(samples * 2); // 16-bit mono

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * freqHz * t);
    const val = Math.floor(clamp(sample * volume, -1, 1) * 0x7fff);
    data.writeInt16LE(val, i * 2);
  }

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = data.length;
  const riffSize = 36 + dataSize;

  const header = Buffer.alloc(44);
  header.write("RIFF", 0, 4, "ascii");
  header.writeUInt32LE(riffSize, 4);
  header.write("WAVE", 8, 4, "ascii");
  header.write("fmt ", 12, 4, "ascii");
  header.writeUInt32LE(16, 16); // PCM header size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36, 4, "ascii");
  header.writeUInt32LE(dataSize, 40);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.concat([header, data]));
}

function ensureCachedWav(kind: "success" | "failure"): string {
  const dir = path.join(os.tmpdir(), "lingo.dev", "sounds");
  const file = path.join(dir, `${kind}.wav`);
  if (!fs.existsSync(file)) {
    const freq = kind === "success" ? 880 : 330;
    const duration = kind === "success" ? 180 : 280;
    generateToneWav(file, freq, duration);
  }
  return file;
}

function playSound(type: "success" | "failure") {
  const platform = os.platform();

  return new Promise<void>((resolve) => {
    let command = "";

    if (platform === "linux") {
      const assetDir = resolveAssetsDir();
      const file = path.join(assetDir, `${type}.mp3`);
      command = `mpg123 -q "${file}" 2>/dev/null || aplay "${file}" 2>/dev/null`;
    } else if (platform === "darwin") {
      const assetDir = resolveAssetsDir();
      const file = path.join(assetDir, `${type}.mp3`);
      command = `afplay "${file}"`;
    } else if (platform === "win32") {
      const wavPath = ensureCachedWav(type).replace(/`/g, "``");
      command = `powershell -NoProfile -Command "$p='${wavPath.replace(/'/g, "''")}'; try { [System.Media.SoundPlayer]::new($p).PlaySync() } catch { [console]::beep(${type === "success" ? 800 : 300}, ${type === "success" ? 180 : 280}) }"`;
    } else {
      const assetDir = resolveAssetsDir();
      const file = path.join(assetDir, `${type}.mp3`);
      command = `aplay "${file}" 2>/dev/null || afplay "${file}" 2>/dev/null`;
    }

    if (!command) return resolve();

    exec(command, () => resolve());
    setTimeout(resolve, 3000);
  });
}

export default new Command()
  .command("run")
  .description("Run localization pipeline")
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
