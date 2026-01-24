
// #!/usr/bin/env node


import { Command } from "commander";
import { executeHelpCommand } from "./executor";
import { getFromCache, saveToCache, clearCache } from "./cache";
import { translateLargeText } from "./translator";
import { stripAnsi, translateWithFormatting } from "./formatter";
import { runStreamingTranslation, getSectionCount } from "./streamer";

const program = new Command();

program
  .name("mani")
  .description("Translate man pages and command help using Lingo.dev AI")
  .version("1.0.0")
  .argument("<command...>", "Command to get help for (e.g., git commit)")
  .option("-l, --lang <locale>", "Target language locale", process.env.LINGO_TARGET_LANG || "hi")
  .option("-f, --force", "Force re-translation (bypass cache)", false)
  .option("--no-cache", "Disable caching entirely")
  .option("--clear-cache", "Clear all cached translations and exit")
  .option("-p, --progress", "Show translation progress", false)
  .action(async (commandArgs: string[], options) => {
    try {
      // Handle cache clear
      if (options.clearCache) {
        clearCache();
        console.log("✓ Cache cleared successfully");
        return;
      }


      const { lang, force, cache, progress } = options;

      console.log(`🔍 Getting help for: ${commandArgs.join(" ")}`);

      // Step 1: Execute the command to get help text
      const result = executeHelpCommand(commandArgs);

      if (!result.success) {
        console.error(`\n❌ ${result.output}`);
        process.exit(1);
      }

      console.log(`✓ Got help from: ${result.command}`);

      // Step 2: Check cache (if enabled and not forcing)
      const commandKey = commandArgs.join("-");
      if (cache && !force) {
        const cached = getFromCache(commandKey, lang, result.output);
        if (cached) {
          console.log(`✓ Using cached translation (${lang})\n`);
          console.log(cached);
          return;
        }
      }

      console.log(`🌐 Translating to ${lang}...`);

      // Step 3: Translate the content
      const plainText = stripAnsi(result.output);
      
      // Streaming mode - translate and display in chunks
      
        console.log(`📊 Total sections: ${getSectionCount(plainText)}`);
        await runStreamingTranslation(plainText, lang);
        return; // Streaming mode handles its own exit
      
      let translatedText: string;
 
      // Step 4: Save to cache (if enabled)
      if (cache) {
        saveToCache(commandKey, lang, result.output, translatedText);
        console.log(`✓ Translation cached`);
      }

      // Step 5: Display translated output
      console.log(`\n${"─".repeat(60)}\n`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`\n❌ Error: ${error.message}`);
      } else {
        console.error("\n❌ An unexpected error occurred");
      }
      process.exit(1);
    }
  });

program.parse();
