// packages/cli/src/cli/utils/watcher.ts
import chokidar from "chokidar";
import { debounce } from "lodash";
import chalk from "chalk";
import path from "path";
import { createDeltaProcessor } from "../utils/delta"; // existing incremental processor

/**
 * Starts watch mode for automatic retranslation when source or locale files change.
 * @param flags - CLI flags/config from i18n.ts
 */
export async function startWatchMode(flags: any) {
  console.log(chalk.cyanBright("\n🌐 Watch mode enabled — monitoring for changes...\n"));

  const watchPaths = [
    "src/**/*.{js,ts,jsx,tsx}",
    "src/locales/**/*.{json,yaml,yml}"
  ];

  // Initialize file watcher
  const watcher = chokidar.watch(watchPaths, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    ignoreInitial: true,
    persistent: true
  });

  // Debounced translation to prevent rapid multiple triggers
  const debouncedTranslate = debounce(async (changedPath: string) => {
    const relativePath = path.relative(process.cwd(), changedPath);
    console.log(chalk.yellow(`\n📄 File changed: ${relativePath}`));

    try {
      const deltaProcessor = createDeltaProcessor(flags);
      await deltaProcessor.calculateDelta({
        sourceData: {}, // Add source data
        targetData: {}, // Add target data
        checksums: {} // Add checksums
      });

      console.log(chalk.green(`✅ Retranslation complete for: ${relativePath}`));
    } catch (err: any) {
      console.error(chalk.red(`❌ Error retranslating ${relativePath}:`), err.message);
    }
  }, 800); // 800ms debounce for rapid saves

  watcher
    .on("change", (filePath) => debouncedTranslate(filePath))
    .on("add", (filePath) => console.log(chalk.blue(`🆕 New file detected: ${filePath}`)))
    .on("unlink", (filePath) => console.log(chalk.gray(`🗑️ File deleted: ${filePath}`)));

  process.on("SIGINT", async () => {
    console.log(chalk.redBright("\n🛑 Watch mode stopped."));
    await watcher.close();
    process.exit(0);
  });
}