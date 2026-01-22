import { resolve, isAbsolute } from "path";
import { ConfigService } from "./ConfigService.js";

/**
 * Parsed CLI arguments
 */
export interface CLIArgs {
  path: string;
  sourceLanguage: string;
  targetLanguage: string;
}

/**
 * CLIService - Handles command-line argument parsing and validation
 */
export class CLIService {
  private config: ConfigService;

  constructor() {
    this.config = ConfigService.getInstance();
  }

  /**
   * Parse command-line arguments
   * @param args - Process arguments (process.argv)
   * @returns Parsed and validated arguments
   *
   * Command format: translate <path> [sourceLanguage] [targetLanguage]
   *
   * Examples:
   *   translate .
   *   translate . hi
   *   translate . hi en
   *   translate ./docs fr en
   *   translate ./readme.md es en
   */
  public parseArgs(args: string[]): CLIArgs {
    // Remove 'node' and script name from args
    const userArgs = args.slice(2);

    if (userArgs.length === 0) {
      this.showUsage();
      process.exit(1);
    }

    // Parse arguments
    const path = userArgs[0];

    if (!path) {
      throw new Error("Path argument is required");
    }

    const sourceLanguage =
      userArgs[1] || this.config.getDefaultSourceLanguage();
    const targetLanguage =
      userArgs[2] || this.config.getDefaultTargetLanguage();

    // Validate and resolve path
    const resolvedPath = this.resolvePath(path);

    // Validate language codes
    this.validateLanguageCode(sourceLanguage, "source");
    this.validateLanguageCode(targetLanguage, "target");

    return {
      path: resolvedPath,
      sourceLanguage,
      targetLanguage,
    };
  }

  /**
   * Resolve path to absolute path
   * Handles "." as current working directory
   * @param path - Input path
   * @returns Absolute path
   */
  private resolvePath(path: string): string {
    if (!path) {
      throw new Error("Path is required");
    }

    // Handle "." as current directory
    if (path === ".") {
      return process.cwd();
    }

    // Convert to absolute path
    if (isAbsolute(path)) {
      return path;
    }

    return resolve(process.cwd(), path);
  }

  /**
   * Validate language code
   * @param code - Language code
   * @param type - Type of language (source/target)
   */
  private validateLanguageCode(code: string, type: "source" | "target"): void {
    if (!code) {
      throw new Error(`${type} language code is required`);
    }

    // Allow 'auto' for source language
    if (type === "source" && code === "auto") {
      return;
    }

    // Basic validation: 2-3 letter codes
    const languageCodeRegex = /^[a-z]{2,3}$/i;
    if (!languageCodeRegex.test(code)) {
      throw new Error(
        `Invalid ${type} language code: ${code}. ` +
          `Expected 2-3 letter code (e.g., 'en', 'hi', 'fr')${
            type === "source" ? " or 'auto'" : ""
          }`,
      );
    }
  }

  /**
   * Show usage information
   */
  public showUsage(): void {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  Lingo CLI Translation Tool                    ║
╚════════════════════════════════════════════════════════════════╝

Usage:
  translate <path> [sourceLanguage] [targetLanguage]

Arguments:
  path             Path to file or directory (use "." for current directory)
  sourceLanguage   Source language code (default: "auto")
  targetLanguage   Target language code (default: "en")

Examples:
  translate .                    # Translate all files in current directory
  translate . hi                 # Auto-detect source, translate to Hindi
  translate . hi en              # Translate from Hindi to English
  translate ./docs fr en         # Translate docs folder from French to English
  translate ./readme.md es en    # Translate single file from Spanish to English

Supported file types:
  .md      Markdown files (preserves formatting)
  .json    JSON files (translates values only)
  .txt     Plain text files

Output:
  Translated files are saved with language suffix:
    file.md      → file.en.md
    data.json    → data.en.json

Flags:
  --help, -h         Show this help message
  --version, -v      Show version information
  --languages, -l    Show supported languages
  --set-key <key>    Save API key to global config
  --reset-key        Remove saved API key

Environment:
  LINGODOTDEV_API_KEY    Your lingo.dev API key (required)

For more information, visit: https://lingo.dev
    `);
  }

  /**
   * Show supported languages
   */
  public showLanguages(): void {
    const config = ConfigService.getInstance();
    const languages = config.supportedLanguages;

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    Supported Languages                         ║
╚════════════════════════════════════════════════════════════════╝

The following language codes are supported for translation:
`);

    // Sort languages alphabetically by name
    const sortedLanguages = Object.entries(languages).sort((a, b) =>
      a[1].localeCompare(b[1]),
    );

    // Display in columns
    const columns = 3;
    const rows = Math.ceil(sortedLanguages.length / columns);

    for (let row = 0; row < rows; row++) {
      let line = "";
      for (let col = 0; col < columns; col++) {
        const index = row + col * rows;
        if (index < sortedLanguages.length) {
          const entry = sortedLanguages[index];
          if (entry) {
            const [code, name] = entry;
            line += `  ${code.padEnd(4)} ${name.padEnd(15)}`;
          }
        }
      }
      console.log(line);
    }

    console.log(`
Total: ${sortedLanguages.length} languages supported

Note: Use "auto" as source language for automatic detection.

Examples:
  translate . auto hi     # Auto-detect source, translate to Hindi
  translate . en fr       # Translate from English to French
  translate . ja en       # Translate from Japanese to English
`);
  }

  /**
   * Show version information
   */
  public showVersion(): void {
    console.log("Lingo CLI v1.0.0");
  }
}
