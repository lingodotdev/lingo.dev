import { readdir, stat } from "fs/promises";
import { join, extname } from "path";
import { ConfigService } from "./ConfigService.js";

/**
 * FileScannerService - Handles file system scanning and filtering
 * Recursively scans directories and filters files by supported extensions
 */
export class FileScannerService {
  private config: ConfigService;

  constructor() {
    this.config = ConfigService.getInstance();
  }

  /**
   * Scan a path (file or directory) and return all supported files
   * @param targetPath - Absolute path to scan
   * @returns Array of absolute file paths
   */
  public async scan(targetPath: string): Promise<string[]> {
    try {
      const stats = await stat(targetPath);

      if (stats.isFile()) {
        // If it's a file, check if it's supported
        return this.isSupportedFile(targetPath) ? [targetPath] : [];
      } else if (stats.isDirectory()) {
        // If it's a directory, scan recursively
        return await this.scanDirectory(targetPath);
      }

      return [];
    } catch (error) {
      throw new Error(`Failed to scan path: ${targetPath}. ${error}`);
    }
  }

  /**
   * Recursively scan a directory for supported files
   * @param dirPath - Directory path to scan
   * @returns Array of absolute file paths
   */
  private async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];

    try {
      const entries = await readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subFiles = await this.scanDirectory(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          // Check if file is supported
          if (this.isSupportedFile(fullPath)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(
        `⚠️  Warning: Could not read directory ${dirPath}: ${error}`,
      );
    }

    return files;
  }

  /**
   * Check if a file has a supported extension
   * @param filePath - File path to check
   * @returns True if file is supported
   */
  private isSupportedFile(filePath: string): boolean {
    const ext = extname(filePath);
    return this.config.isSupportedExtension(ext);
  }

  /**
   * Get file extension
   * @param filePath - File path
   * @returns File extension (e.g., '.md')
   */
  public getFileExtension(filePath: string): string {
    return extname(filePath);
  }
}
