import { readFile } from "fs/promises";
import { CLIService } from "./services/CLIService.js";
import { FileScannerService } from "./services/FileScannerService.js";
import { TranslationService } from "./services/TranslationService.js";
import { FileWriterService } from "./services/FileWriterService.js";
import { ConfigService } from "./services/ConfigService.js";

/**
 * Translation statistics
 */
interface TranslationStats {
  total: number;
  translated: number;
  skipped: number;
  failed: number;
  errors: Array<{ file: string; error: string }>;
}

/**
 * Main application orchestrator
 */
export class App {
  private cliService: CLIService;
  private scannerService: FileScannerService;
  private translationService: TranslationService;
  private writerService: FileWriterService;
  private configService: ConfigService;

  constructor() {
    this.cliService = new CLIService();
    this.scannerService = new FileScannerService();
    this.translationService = new TranslationService();
    this.writerService = new FileWriterService();
    this.configService = ConfigService.getInstance();
  }

  /**
   * Run the translation pipeline
   * @param args - Command-line arguments
   */
  public async run(args: string[]): Promise<void> {
    try {
      // Check for help or version flags
      if (args.includes("--help") || args.includes("-h")) {
        this.cliService.showUsage();
        return;
      }

      if (args.includes("--version") || args.includes("-v")) {
        this.cliService.showVersion();
        return;
      }

      if (args.includes("--languages") || args.includes("-l")) {
        this.cliService.showLanguages();
        return;
      }

      if (args.includes("--set-key")) {
        const keyIndex = args.indexOf("--set-key") + 1;
        const key = args[keyIndex];
        if (key) {
          this.configService.saveApiKey(key);
          return;
        } else {
          console.error("❌ Error: Please provide an API key");
          console.error("   Usage: translate --set-key <your_api_key>");
          process.exit(1);
        }
      }

      if (args.includes("--reset-key")) {
        this.configService.resetApiKey();
        return;
      }

      // Validate configuration
      if (!this.configService.validateConfig()) {
        console.error("❌ Error: LINGO_API_KEY not configured");
        console.error("   Please create a .env file with your API key");
        console.error("   See .env.example for reference");
        process.exit(1);
      }

      // Parse arguments
      const { path, sourceLanguage, targetLanguage } =
        this.cliService.parseArgs(args);

      console.log("🚀 Starting translation pipeline...\n");
      console.log(`📁 Path: ${path}`);
      console.log(`🌍 Translation: ${sourceLanguage} → ${targetLanguage}\n`);

      // Scan for files
      console.log("🔍 Scanning for files...");
      const files = await this.scannerService.scan(path);

      if (files.length === 0) {
        console.log("⚠️  No supported files found");
        console.log(
          `   Supported extensions: ${this.configService.supportedExtensions.join(", ")}`,
        );
        return;
      }

      console.log(`✓ Found ${files.length} file(s) to translate\n`);

      // Initialize statistics
      const stats: TranslationStats = {
        total: files.length,
        translated: 0,
        skipped: 0,
        failed: 0,
        errors: [],
      };

      // Process each file
      for (const filePath of files) {
        await this.processFile(filePath, sourceLanguage, targetLanguage, stats);
      }

      // Show summary
      this.showSummary(stats);
    } catch (error) {
      console.error(
        `\n❌ Error: ${error instanceof Error ? error.message : error}`,
      );
      process.exit(1);
    }
  }

  /**
   * Process a single file
   * @param filePath - File path to process
   * @param sourceLanguage - Source language
   * @param targetLanguage - Target language
   * @param stats - Statistics object to update
   */
  private async processFile(
    filePath: string,
    sourceLanguage: string,
    targetLanguage: string,
    stats: TranslationStats,
  ): Promise<void> {
    try {
      console.log(`📄 Processing: ${filePath}`);

      // Read file content
      const content = await readFile(filePath, "utf-8");

      // Get file type
      const fileType = this.scannerService.getFileExtension(filePath);

      // Translate content
      const translatedContent = await this.translationService.translate(
        content,
        fileType,
        sourceLanguage,
        targetLanguage,
      );

      // Write translated file
      const outputPath = await this.writerService.write(
        filePath,
        translatedContent,
        targetLanguage,
      );

      console.log(`   ✓ Saved to: ${outputPath}\n`);
      stats.translated++;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Check if it's a "file exists" error
      if (errorMessage.includes("already exists")) {
        console.log(`   ⚠️  Skipped (file exists)\n`);
        stats.skipped++;
      } else {
        console.log(`   ❌ Failed: ${errorMessage}\n`);
        stats.failed++;
        stats.errors.push({ file: filePath, error: errorMessage });
      }
    }
  }

  /**
   * Show translation summary
   * @param stats - Translation statistics
   */
  private showSummary(stats: TranslationStats): void {
    console.log("\n" + "═".repeat(60));
    console.log("📊 Translation Summary");
    console.log("═".repeat(60));
    console.log(`✔  ${stats.translated} file(s) translated`);

    if (stats.skipped > 0) {
      console.log(`⚠  ${stats.skipped} file(s) skipped`);
    }

    if (stats.failed > 0) {
      console.log(`❌ ${stats.failed} file(s) failed`);

      if (stats.errors.length > 0) {
        console.log("\nErrors:");
        stats.errors.forEach(({ file, error }) => {
          console.log(`  • ${file}`);
          console.log(`    ${error}`);
        });
      }
    }

    console.log("═".repeat(60) + "\n");
  }
}
