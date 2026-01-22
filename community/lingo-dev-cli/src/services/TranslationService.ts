import { LingoDotDevEngine } from "lingo.dev/sdk";
import { ConfigService } from "./ConfigService.js";

/**
 * File type enum for different translation strategies
 */
export enum FileType {
  MARKDOWN = ".md",
  JSON = ".json",
  TEXT = ".txt",
}

/**
 * TranslationService - Wrapper around lingo.dev SDK
 * Handles translation logic with format preservation
 */
export class TranslationService {
  private config: ConfigService;
  private lingoEngine: LingoDotDevEngine;

  constructor() {
    this.config = ConfigService.getInstance();

    // Initialize lingo.dev SDK
    this.lingoEngine = new LingoDotDevEngine({
      apiKey: this.config.getApiKey(),
    });
  }

  /**
   * Translate content based on file type
   * @param content - Content to translate
   * @param fileType - File extension (.md, .json, .txt)
   * @param sourceLanguage - Source language code or 'auto'
   * @param targetLanguage - Target language code
   * @returns Translated content
   */
  public async translate(
    content: string,
    fileType: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    // Validate configuration
    if (!this.config.validateConfig()) {
      throw new Error("Invalid API configuration. Please check your .env file");
    }

    switch (fileType.toLowerCase()) {
      case FileType.MARKDOWN:
        return await this.translateMarkdown(
          content,
          sourceLanguage,
          targetLanguage,
        );

      case FileType.JSON:
        return await this.translateJson(
          content,
          sourceLanguage,
          targetLanguage,
        );

      case FileType.TEXT:
        return await this.translateText(
          content,
          sourceLanguage,
          targetLanguage,
        );

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  /**
   * Translate markdown content while preserving formatting
   * Uses lingo.dev's localizeText for markdown content
   * @param content - Markdown content
   * @param sourceLanguage - Source language
   * @param targetLanguage - Target language
   * @returns Translated markdown
   */
  private async translateMarkdown(
    content: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    // For markdown, we use localizeText which should preserve basic formatting
    // The SDK handles text translation while we preserve structure
    const result = await this.lingoEngine.localizeText(content, {
      sourceLocale: sourceLanguage === "auto" ? null : sourceLanguage,
      targetLocale: targetLanguage,
    });

    return result;
  }

  /**
   * Translate JSON content (only values, not keys)
   * Uses lingo.dev's localizeObject which translates values while preserving keys
   * @param content - JSON content
   * @param sourceLanguage - Source language
   * @param targetLanguage - Target language
   * @returns Translated JSON
   */
  private async translateJson(
    content: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    try {
      const parsed = JSON.parse(content);

      // Use lingo.dev's localizeObject which automatically handles nested objects
      // and translates only string values while preserving keys
      const translated = await this.lingoEngine.localizeObject(parsed, {
        sourceLocale: sourceLanguage === "auto" ? null : sourceLanguage,
        targetLocale: targetLanguage,
      });

      return JSON.stringify(translated, null, 2);
    } catch (error) {
      throw new Error(`Invalid JSON content: ${error}`);
    }
  }

  /**
   * Translate plain text content
   * Uses lingo.dev's localizeText for simple text translation
   * @param content - Text content
   * @param sourceLanguage - Source language
   * @param targetLanguage - Target language
   * @returns Translated text
   */
  private async translateText(
    content: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    const result = await this.lingoEngine.localizeText(content, {
      sourceLocale: sourceLanguage === "auto" ? null : sourceLanguage,
      targetLocale: targetLanguage,
    });

    return result;
  }
}
