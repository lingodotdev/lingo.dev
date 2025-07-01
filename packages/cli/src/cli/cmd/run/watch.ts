import * as chokidar from "chokidar";
import chalk from "chalk";
import { minimatch } from "minimatch";
import { colors } from "../../constants";
import { CmdRunContext } from "./_types";
import plan from "./plan";
import execute from "./execute";
import { renderSummary } from "../../utils/ui";
import { getBuckets } from "../../utils/buckets";

interface WatchState {
  isRunning: boolean;
  pendingChanges: Set<string>;
  debounceTimer?: NodeJS.Timeout;
}

export default async function watch(ctx: CmdRunContext) {
  const debounceDelay = ctx.flags.debounce || 5000; // Use configured debounce or 5s default

  console.log(chalk.hex(colors.orange)("[Watch Mode]"));
  console.log(
    `👀 Watching for changes... (Press ${chalk.yellow("Ctrl+C")} to stop)`,
  );
  console.log(chalk.dim(`   Debounce delay: ${debounceDelay}ms`));
  console.log("");

  const state: WatchState = {
    isRunning: false,
    pendingChanges: new Set(),
  };

  // Get all source file patterns to watch
  const watchPatterns = await getWatchPatterns(ctx);

  if (watchPatterns.length === 0) {
    console.log(chalk.yellow("⚠️  No source files found to watch"));
    return;
  }

  console.log(chalk.dim(`Watching ${watchPatterns.length} file pattern(s):`));
  watchPatterns.forEach((pattern) => {
    console.log(chalk.dim(`  • ${pattern}`));
  });
  console.log("");

  // Initialize file watcher
  const watcher = chokidar.watch(watchPatterns, {
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100,
    },
  });

  // Handle file changes
  watcher.on("change", (path) => {
    handleFileChange(path, state, ctx);
  });

  watcher.on("add", (path) => {
    handleFileChange(path, state, ctx);
  });

  watcher.on("unlink", (path) => {
    handleFileChange(path, state, ctx);
  });

  watcher.on("error", (error) => {
    console.error(
      chalk.red(
        `Watch error: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  });

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n\n🛑 Stopping watch mode..."));
    watcher.close();
    process.exit(0);
  });

  // Keep the process running
  await new Promise(() => {}); // Never resolves, keeps process alive
}

async function getWatchPatterns(ctx: CmdRunContext): Promise<string[]> {
  if (!ctx.config) return [];

  const buckets = getBuckets(ctx.config);
  const patterns: string[] = [];

  for (const bucket of buckets) {
    // Skip if specific buckets are filtered
    if (ctx.flags.bucket && !ctx.flags.bucket.includes(bucket.type)) {
      continue;
    }

    for (const bucketPath of bucket.paths) {
      // Skip if specific files are filtered
      if (ctx.flags.file) {
        if (!ctx.flags.file.some((f) => minimatch(bucketPath.pathPattern, f))) {
          continue;
        }
      }

      // Get the source locale pattern (replace [locale] with source locale)
      const sourceLocale = ctx.flags.sourceLocale || ctx.config.locale.source;
      const sourcePattern = bucketPath.pathPattern.replace(
        "[locale]",
        sourceLocale,
      );

      patterns.push(sourcePattern);
    }
  }

  return patterns;
}

function handleFileChange(
  filePath: string,
  state: WatchState,
  ctx: CmdRunContext,
) {
  const debounceDelay = ctx.flags.debounce || 5000; // Use configured debounce or 5s default

  state.pendingChanges.add(filePath);

  console.log(chalk.dim(`📝 File changed: ${filePath}`));

  // Clear existing debounce timer
  if (state.debounceTimer) {
    clearTimeout(state.debounceTimer);
  }

  // Set new debounce timer
  state.debounceTimer = setTimeout(async () => {
    if (state.isRunning) {
      console.log(
        chalk.yellow("⏳ Translation already in progress, skipping..."),
      );
      return;
    }

    await triggerRetranslation(state, ctx);
  }, debounceDelay);
}

async function triggerRetranslation(state: WatchState, ctx: CmdRunContext) {
  if (state.isRunning) return;

  state.isRunning = true;

  try {
    const changedFiles = Array.from(state.pendingChanges);
    state.pendingChanges.clear();

    console.log(chalk.hex(colors.green)("\n🔄 Triggering retranslation..."));
    console.log(chalk.dim(`Changed files: ${changedFiles.join(", ")}`));
    console.log("");

    // Create a new context for this run (preserve original flags but reset tasks/results)
    const runCtx: CmdRunContext = {
      ...ctx,
      tasks: [],
      results: new Map(),
    };

    // Re-run the translation pipeline
    await plan(runCtx);

    if (runCtx.tasks.length === 0) {
      console.log(chalk.dim("✨ No translation tasks needed"));
    } else {
      await execute(runCtx);
      await renderSummary(runCtx.results);
    }

    console.log(chalk.hex(colors.green)("✅ Retranslation completed"));
    console.log(chalk.dim("👀 Continuing to watch for changes...\n"));
  } catch (error: any) {
    console.error(chalk.red(`❌ Retranslation failed: ${error.message}`));
    console.log(chalk.dim("👀 Continuing to watch for changes...\n"));
  } finally {
    state.isRunning = false;
  }
}
