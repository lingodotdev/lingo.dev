import { writeFile, access } from "fs/promises";
import { dirname, basename, extname, join } from "path";
import { mkdir } from "fs/promises";

/**
 * FileWriterService - Handles writing translated files
 * Generates localized filenames and safely writes content
 */
export class FileWriterService {
  /**
   * Write translated content to a new file
   * @param originalPath - Original file path
   * @param content - Translated content
   * @param targetLanguage - Target language code
   * @returns Path to the written file
   */
  public async write(
    originalPath: string,
    content: string,
    targetLanguage: string,
  ): Promise<string> {
    const outputPath = this.generateOutputPath(originalPath, targetLanguage);

    try {
      // Ensure directory exists
      const dir = dirname(outputPath);
      await this.ensureDirectoryExists(dir);

      // Check if file already exists
      const exists = await this.fileExists(outputPath);
      if (exists) {
        console.warn(
          `⚠️  Warning: File already exists, skipping: ${outputPath}`,
        );
        throw new Error(`File already exists: ${outputPath}`);
      }

      // Write file
      await writeFile(outputPath, content, "utf-8");

      return outputPath;
    } catch (error) {
      throw new Error(`Failed to write file ${outputPath}: ${error}`);
    }
  }

  /**
   * Generate output file path with language suffix
   * @param originalPath - Original file path
   * @param targetLanguage - Target language code
   * @returns New file path with language suffix
   *
   * Examples:
   *   file.md → file.en.md
   *   data.json → data.en.json
   */
  private generateOutputPath(
    originalPath: string,
    targetLanguage: string,
  ): string {
    const dir = dirname(originalPath);
    const ext = extname(originalPath);
    const name = basename(originalPath, ext);

    const newFileName = `${name}.${targetLanguage}${ext}`;
    return join(dir, newFileName);
  }

  /**
   * Check if a file exists
   * @param filePath - File path to check
   * @returns True if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   * @param dirPath - Directory path
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Ignore error if directory already exists
      if ((error as any).code !== "EEXIST") {
        throw error;
      }
    }
  }
}
