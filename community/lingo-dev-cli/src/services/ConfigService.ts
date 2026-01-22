import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { homedir } from "os";

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../.env") });

/**
 * ConfigService - Centralized configuration management
 */
export class ConfigService {
  private static instance: ConfigService;

  private readonly apiKey: string;
  private readonly configPath: string;
  private readonly defaultTargetLanguage: string = "en";
  private readonly defaultSourceLanguage: string = "auto";

  // Supported file extensions
  public readonly supportedExtensions: string[] = [".md", ".json", ".txt"];

  // Supported languages (ISO 639-1 codes)
  public readonly supportedLanguages: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    hi: "Hindi",
    bn: "Bengali",
    pa: "Punjabi",
    te: "Telugu",
    mr: "Marathi",
    ta: "Tamil",
    ur: "Urdu",
    gu: "Gujarati",
    kn: "Kannada",
    ml: "Malayalam",
    nl: "Dutch",
    pl: "Polish",
    tr: "Turkish",
    vi: "Vietnamese",
    th: "Thai",
    id: "Indonesian",
    ms: "Malay",
    fa: "Persian",
    he: "Hebrew",
    sv: "Swedish",
    no: "Norwegian",
    da: "Danish",
    fi: "Finnish",
    cs: "Czech",
    hu: "Hungarian",
    ro: "Romanian",
    uk: "Ukrainian",
    el: "Greek",
  };

  private constructor() {
    this.configPath = join(homedir(), ".lingo-cli");

    // Try to load from env vars first, then global config
    this.apiKey =
      process.env.LINGODOTDEV_API_KEY || this.loadApiKeyFromConfig();

    if (!this.apiKey) {
      console.warn("⚠️  Warning: LINGODOTDEV_API_KEY not found");
      console.warn("   You can set it by running:");
      console.warn("   translate --set-key your_api_key_here");
      console.warn("");
    }
  }

  private loadApiKeyFromConfig(): string {
    if (existsSync(this.configPath)) {
      try {
        const config = JSON.parse(readFileSync(this.configPath, "utf-8"));
        return config.apiKey || "";
      } catch (e) {
        return "";
      }
    }
    return "";
  }

  public saveApiKey(key: string): void {
    const config = { apiKey: key };
    writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    console.log(`✓ API key saved to ${this.configPath}`);
  }

  public resetApiKey(): void {
    if (existsSync(this.configPath)) {
      unlinkSync(this.configPath);
      console.log(`✓ API key removed from ${this.configPath}`);
    } else {
      console.log("ℹ️  No API key configuration found to reset.");
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Get API key
   */
  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Get default target language
   */
  public getDefaultTargetLanguage(): string {
    return this.defaultTargetLanguage;
  }

  /**
   * Get default source language
   */
  public getDefaultSourceLanguage(): string {
    return this.defaultSourceLanguage;
  }

  /**
   * Check if file extension is supported
   */
  public isSupportedExtension(extension: string): boolean {
    return this.supportedExtensions.includes(extension.toLowerCase());
  }

  /**
   * Validate API configuration
   */
  public validateConfig(): boolean {
    return this.apiKey.length > 0;
  }
}
