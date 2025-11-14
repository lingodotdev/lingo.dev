import * as fs from "fs";
import * as path from "path";
import { minimatch } from "minimatch";
import { FileChangeEvent } from "./types";
import { CacheManager } from "./cache-manager";

/**
 * Configuration for performance optimization
 */
export interface PerformanceOptimizerConfig {
  /** Enable intelligent file filtering */
  enableIntelligentFiltering: boolean;
  /** Enable pattern resolution caching */
  enablePatternCaching: boolean;
  /** Enable file metadata caching */
  enableMetadataCaching: boolean;
  /** Maximum number of files to watch simultaneously */
  maxWatchedFiles: number;
  /** Cache TTL in milliseconds */
  cacheTtl: number;
  /** Enable adaptive filtering based on repository size */
  enableAdaptiveFiltering: boolean;
  /** Threshold for large repository detection (number of files) */
  largeRepositoryThreshold: number;
}

/**
 * Cached file metadata
 */
interface CachedFileMetadata {
  path: string;
  size: number;
  mtime: number;
  isDirectory: boolean;
  exists: boolean;
  timestamp: number;
}

/**
 * File filtering statistics
 */
export interface FilteringStatistics {
  totalFilesScanned: number;
  filteredFiles: number;
  cacheHits: number;
  cacheMisses: number;
  averageFilterTime: number;
  largeRepositoryMode: boolean;
}

/**
 * Intelligent file filter result
 */
interface FilterResult {
  shouldWatch: boolean;
  reason: string;
  priority: "high" | "medium" | "low";
}

/**
 * PerformanceOptimizer provides intelligent file filtering, caching, and optimization
 * for large repositories to reduce watch overhead and improve performance.
 */
export class PerformanceOptimizer {
  private config: PerformanceOptimizerConfig;

  private filteringStats: FilteringStatistics;
  private repositorySize: number = 0;
  private isLargeRepository: boolean = false;
  private lastRepositoryScan: number = 0;
  private repositoryScanInterval: number = 300000; // 5 minutes
  private cacheManager: CacheManager;

  constructor(config: Partial<PerformanceOptimizerConfig> = {}) {
    this.config = {
      enableIntelligentFiltering: true,
      enablePatternCaching: true,
      enableMetadataCaching: true,
      maxWatchedFiles: 1000,
      cacheTtl: 300000, // 5 minutes
      enableAdaptiveFiltering: true,
      largeRepositoryThreshold: 5000,
      ...config,
    };

    this.filteringStats = {
      totalFilesScanned: 0,
      filteredFiles: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageFilterTime: 0,
      largeRepositoryMode: false,
    };

    // Initialize cache manager with performance-optimized settings
    this.cacheManager = new CacheManager({
      maxEntries: this.config.maxWatchedFiles,
      defaultTtl: this.config.cacheTtl,
      maxSize: 10 * 1024 * 1024, // 10MB
      enablePersistence: true,
      cacheFilePath: path.join(
        process.cwd(),
        ".kiro",
        "cache",
        "watch-performance.json",
      ),
      enableAutoCleanup: true,
      cleanupInterval: 120000, // 2 minutes
    });

    this.initializeOptimizer();
  }

  /**
   * Initialize the performance optimizer
   */
  private async initializeOptimizer(): Promise<void> {
    if (this.config.enableAdaptiveFiltering) {
      await this.analyzeRepositorySize();
    }
  }

  /**
   * Analyze repository size to determine if adaptive filtering should be enabled
   */
  private async analyzeRepositorySize(): Promise<void> {
    const now = Date.now();

    // Skip if we've scanned recently
    if (now - this.lastRepositoryScan < this.repositoryScanInterval) {
      return;
    }

    try {
      const startTime = Date.now();
      this.repositorySize = await this.countRepositoryFiles();
      this.isLargeRepository =
        this.repositorySize > this.config.largeRepositoryThreshold;
      this.filteringStats.largeRepositoryMode = this.isLargeRepository;
      this.lastRepositoryScan = now;

      const scanTime = Date.now() - startTime;
      console.log(
        `📊 Repository analysis: ${this.repositorySize} files (${scanTime}ms)`,
      );

      if (this.isLargeRepository) {
        console.log(
          `🚀 Large repository detected, enabling performance optimizations`,
        );
        this.enableLargeRepositoryOptimizations();
      }
    } catch (error) {
      console.warn(`Failed to analyze repository size: ${error}`);
    }
  }

  /**
   * Count total files in repository (excluding common ignore patterns)
   */
  private async countRepositoryFiles(
    dir: string = process.cwd(),
  ): Promise<number> {
    let count = 0;
    const commonIgnorePatterns = [
      "node_modules/**",
      ".git/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.log",
      "*.tmp",
    ];

    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(process.cwd(), fullPath);

        // Skip if matches ignore patterns
        if (
          commonIgnorePatterns.some((pattern) =>
            minimatch(relativePath, pattern),
          )
        ) {
          continue;
        }

        if (entry.isDirectory()) {
          count += await this.countRepositoryFiles(fullPath);
        } else {
          count++;
        }

        // Limit scanning time for very large repositories
        if (count > this.config.largeRepositoryThreshold * 2) {
          break;
        }
      }
    } catch (error) {
      // Directory access error, skip
    }

    return count;
  }

  /**
   * Enable optimizations specific to large repositories
   */
  private enableLargeRepositoryOptimizations(): void {
    // Reduce cache TTL for more frequent cleanup
    this.config.cacheTtl = Math.min(this.config.cacheTtl, 180000); // 3 minutes max

    // Reduce max watched files
    this.config.maxWatchedFiles = Math.min(this.config.maxWatchedFiles, 500);

    // Enable all caching mechanisms
    this.config.enablePatternCaching = true;
    this.config.enableMetadataCaching = true;
    this.config.enableIntelligentFiltering = true;
  }

  /**
   * Resolve watch patterns with caching and optimization
   */
  async resolveWatchPatterns(patterns: string[]): Promise<string[]> {
    const startTime = Date.now();
    const resolvedFiles: string[] = [];

    // Create cache key for the entire pattern set
    const patternsKey = `patterns:${this.generatePatternsHash(patterns)}`;

    // Try to get cached result for all patterns
    if (this.config.enablePatternCaching) {
      const cachedResult = this.cacheManager.get<string[]>(patternsKey);
      if (cachedResult) {
        this.filteringStats.cacheHits++;
        const filterTime = Date.now() - startTime;
        this.updateFilteringStatistics(
          cachedResult.length,
          cachedResult.length,
          filterTime,
        );
        return cachedResult;
      }
    }

    this.filteringStats.cacheMisses++;

    for (const pattern of patterns) {
      const patternKey = `pattern:${pattern}`;
      const cachedResult = this.config.enablePatternCaching
        ? this.cacheManager.get<string[]>(patternKey)
        : null;

      if (cachedResult) {
        this.filteringStats.cacheHits++;
        resolvedFiles.push(...cachedResult);
      } else {
        this.filteringStats.cacheMisses++;
        const resolved = await this.resolvePattern(pattern);

        if (this.config.enablePatternCaching) {
          this.cacheManager.set(patternKey, resolved, this.config.cacheTtl);
        }

        resolvedFiles.push(...resolved);
      }
    }

    // Apply intelligent filtering
    const filteredFiles = this.config.enableIntelligentFiltering
      ? await this.applyIntelligentFiltering(resolvedFiles)
      : resolvedFiles;

    // Cache the final result
    if (this.config.enablePatternCaching) {
      this.cacheManager.set(patternsKey, filteredFiles, this.config.cacheTtl);
    }

    // Update statistics
    const filterTime = Date.now() - startTime;
    this.updateFilteringStatistics(
      resolvedFiles.length,
      filteredFiles.length,
      filterTime,
    );

    return filteredFiles;
  }

  /**
   * Resolve a single pattern to actual file paths
   */
  private async resolvePattern(pattern: string): Promise<string[]> {
    const files: string[] = [];

    try {
      // Simple glob resolution - in a real implementation, you'd use a proper glob library
      if (pattern.includes("*")) {
        files.push(...(await this.expandGlobPattern(pattern)));
      } else {
        // Direct file path
        if (await this.fileExists(pattern)) {
          files.push(pattern);
        }
      }
    } catch (error) {
      console.warn(`Failed to resolve pattern ${pattern}: ${error}`);
    }

    return files;
  }

  /**
   * Expand glob pattern to actual file paths
   */
  private async expandGlobPattern(pattern: string): Promise<string[]> {
    const files: string[] = [];
    const baseDir = this.getPatternBaseDir(pattern);

    try {
      await this.walkDirectory(baseDir, (filePath) => {
        if (minimatch(filePath, pattern)) {
          files.push(filePath);
        }
      });
    } catch (error) {
      // Directory walk failed
    }

    return files;
  }

  /**
   * Get base directory for a glob pattern
   */
  private getPatternBaseDir(pattern: string): string {
    const parts = pattern.split("/");
    const baseParts: string[] = [];

    for (const part of parts) {
      if (part.includes("*") || part.includes("?") || part.includes("[")) {
        break;
      }
      baseParts.push(part);
    }

    return baseParts.length > 0 ? baseParts.join("/") : ".";
  }

  /**
   * Walk directory and call callback for each file
   */
  private async walkDirectory(
    dir: string,
    callback: (filePath: string) => void,
  ): Promise<void> {
    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await this.walkDirectory(fullPath, callback);
        } else {
          callback(fullPath);
        }
      }
    } catch (error) {
      // Directory access error, skip
    }
  }

  /**
   * Apply intelligent filtering to reduce watch overhead
   */
  private async applyIntelligentFiltering(files: string[]): Promise<string[]> {
    const filteredFiles: string[] = [];

    for (const file of files) {
      const filterResult = await this.shouldWatchFile(file);

      if (filterResult.shouldWatch) {
        filteredFiles.push(file);
      }

      // Stop if we've reached the maximum number of files
      if (filteredFiles.length >= this.config.maxWatchedFiles) {
        console.warn(
          `⚠️  Reached maximum watched files limit (${this.config.maxWatchedFiles})`,
        );
        break;
      }
    }

    return filteredFiles;
  }

  /**
   * Determine if a file should be watched based on intelligent filtering
   */
  private async shouldWatchFile(filePath: string): Promise<FilterResult> {
    // Get cached metadata
    const metadata = await this.getFileMetadata(filePath);

    if (!metadata.exists) {
      return {
        shouldWatch: false,
        reason: "File does not exist",
        priority: "low",
      };
    }

    if (metadata.isDirectory) {
      return {
        shouldWatch: false,
        reason: "Is directory",
        priority: "low",
      };
    }

    // Skip very large files in large repository mode
    if (this.isLargeRepository && metadata.size > 1024 * 1024) {
      // 1MB
      return {
        shouldWatch: false,
        reason: "File too large for large repository mode",
        priority: "low",
      };
    }

    // Prioritize translation-related files
    const isTranslationFile = this.isTranslationRelatedFile(filePath);
    if (isTranslationFile) {
      return {
        shouldWatch: true,
        reason: "Translation-related file",
        priority: "high",
      };
    }

    // Skip common non-translation files in large repository mode
    if (this.isLargeRepository && this.isNonTranslationFile(filePath)) {
      return {
        shouldWatch: false,
        reason: "Non-translation file in large repository mode",
        priority: "low",
      };
    }

    return {
      shouldWatch: true,
      reason: "Default inclusion",
      priority: "medium",
    };
  }

  /**
   * Check if file is translation-related
   */
  private isTranslationRelatedFile(filePath: string): boolean {
    const translationExtensions = [
      ".json",
      ".yaml",
      ".yml",
      ".po",
      ".pot",
      ".xliff",
      ".properties",
    ];
    const translationDirs = [
      "locales",
      "translations",
      "i18n",
      "lang",
      "languages",
    ];

    const ext = path.extname(filePath).toLowerCase();
    const dir = path.dirname(filePath).toLowerCase();

    return (
      translationExtensions.includes(ext) ||
      translationDirs.some((transDir) => dir.includes(transDir))
    );
  }

  /**
   * Check if file is typically not related to translations
   */
  private isNonTranslationFile(filePath: string): boolean {
    const nonTranslationExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".svg",
      ".ico",
      ".mp4",
      ".avi",
      ".mov",
      ".mp3",
      ".wav",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".zip",
      ".tar",
      ".gz",
      ".rar",
      ".exe",
      ".dll",
      ".so",
      ".dylib",
    ];

    const ext = path.extname(filePath).toLowerCase();
    return nonTranslationExtensions.includes(ext);
  }

  /**
   * Get file metadata with caching
   */
  private async getFileMetadata(filePath: string): Promise<CachedFileMetadata> {
    const metadataKey = `metadata:${filePath}`;

    if (this.config.enableMetadataCaching) {
      const cached = this.cacheManager.get<CachedFileMetadata>(metadataKey);
      if (cached) {
        return cached;
      }
    }

    let metadata: CachedFileMetadata;

    try {
      const stats = await fs.promises.stat(filePath);
      metadata = {
        path: filePath,
        size: stats.size,
        mtime: stats.mtime.getTime(),
        isDirectory: stats.isDirectory(),
        exists: true,
        timestamp: Date.now(),
      };
    } catch (error) {
      metadata = {
        path: filePath,
        size: 0,
        mtime: 0,
        isDirectory: false,
        exists: false,
        timestamp: Date.now(),
      };
    }

    if (this.config.enableMetadataCaching) {
      // Use shorter TTL for metadata as files can change frequently
      const metadataTtl = Math.min(this.config.cacheTtl, 60000); // Max 1 minute
      this.cacheManager.set(metadataKey, metadata, metadataTtl);
    }

    return metadata;
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create hash for pattern caching
   */
  private hashPattern(pattern: string): string {
    // Simple hash function - in production, use a proper hash function
    let hash = 0;
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Update filtering statistics
   */
  private updateFilteringStatistics(
    totalFiles: number,
    filteredFiles: number,
    filterTime: number,
  ): void {
    this.filteringStats.totalFilesScanned += totalFiles;
    this.filteringStats.filteredFiles += filteredFiles;

    // Update average filter time
    const totalOperations =
      this.filteringStats.cacheHits + this.filteringStats.cacheMisses;
    if (totalOperations > 0) {
      this.filteringStats.averageFilterTime =
        (this.filteringStats.averageFilterTime * (totalOperations - 1) +
          filterTime) /
        totalOperations;
    } else {
      this.filteringStats.averageFilterTime = filterTime;
    }
  }

  /**
   * Optimize file change detection for large file sets
   */
  optimizeFileChangeDetection(changes: FileChangeEvent[]): FileChangeEvent[] {
    if (!this.isLargeRepository || changes.length < 10) {
      return changes;
    }

    // Group changes by directory
    const changesByDir = new Map<string, FileChangeEvent[]>();

    for (const change of changes) {
      const dir = path.dirname(change.path);
      if (!changesByDir.has(dir)) {
        changesByDir.set(dir, []);
      }
      changesByDir.get(dir)!.push(change);
    }

    // Prioritize translation-related directories
    const optimizedChanges: FileChangeEvent[] = [];

    for (const [dir, dirChanges] of changesByDir.entries()) {
      const isTranslationDir = this.isTranslationRelatedFile(dir);

      if (isTranslationDir) {
        // Include all changes from translation directories
        optimizedChanges.push(...dirChanges);
      } else {
        // Limit changes from non-translation directories
        optimizedChanges.push(...dirChanges.slice(0, 5));
      }
    }

    return optimizedChanges;
  }

  /**
   * Get performance statistics
   */
  getStatistics(): FilteringStatistics & {
    cacheManager: any;
    repositoryInfo: {
      size: number;
      isLarge: boolean;
      lastScan: number;
    };
  } {
    return {
      ...this.filteringStats,
      cacheManager: this.cacheManager.getStatistics(),
      repositoryInfo: {
        size: this.repositorySize,
        isLarge: this.isLargeRepository,
        lastScan: this.lastRepositoryScan,
      },
    };
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    this.cacheManager.clear();
    console.log("🧹 Performance optimizer caches cleared");
  }

  /**
   * Update configuration
   */
  updateConfiguration(config: Partial<PerformanceOptimizerConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.enableAdaptiveFiltering !== undefined) {
      this.initializeOptimizer();
    }
  }

  /**
   * Generate hash for patterns
   */
  private generatePatternsHash(patterns: string[]): string {
    const sortedPatterns = [...patterns].sort();
    const patternsString = sortedPatterns.join("|");

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < patternsString.length; i++) {
      const char = patternsString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Clean up resources
   */
  async destroy(): Promise<void> {
    await this.cacheManager.destroy();
    this.clearCaches();
  }
}
