/**
 * Configuration Cache Manager
 * Implements caching mechanisms for lingo.dev configuration
 * to improve performance and reduce parsing overhead
 */

import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  cacheDir?: string; // Directory for file-based cache
  inMemory?: boolean; // Enable in-memory caching
  compression?: boolean; // Enable compression for cached data
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hash: string;
  hits: number;
  ttl?: number;
}

/**
 * Generic cache manager for configuration data
 */
export class ConfigCacheManager<T = any> {
  private memoryCache: Map<string, CacheEntry<T>> = new Map();
  private readonly options: Required<CacheOptions>;
  private readonly DEFAULT_TTL = 1000 * 60 * 60; // 1 hour
  private readonly DEFAULT_CACHE_DIR = ".lingo-cache";

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? this.DEFAULT_TTL,
      cacheDir: options.cacheDir ?? this.DEFAULT_CACHE_DIR,
      inMemory: options.inMemory ?? true,
      compression: options.compression ?? false,
    };

    // Ensure cache directory exists
    if (this.options.cacheDir) {
      this.ensureCacheDir();
    }
  }

  /**
   * Get cached configuration or null if not found/expired
   */
  async get(key: string): Promise<T | null> {
    // Check in-memory cache first
    if (this.options.inMemory) {
      const memEntry = this.memoryCache.get(key);
      if (memEntry) {
        if (this.isExpired(memEntry)) {
          this.memoryCache.delete(key); // remove expired entry
          return null;
        } else {
          memEntry.hits++;
          return memEntry.data;
        }
      }
    }

    // Check file-based cache
    const fileEntry = await this.getFromFileCache(key);
    if (fileEntry) {
      if (this.isExpired(fileEntry)) {
        await this.removeFromFileCache(key); // remove expired file
        return null;
      } else {
        // rehydrate memory cache for performance
        if (this.options.inMemory) {
          this.memoryCache.set(key, fileEntry);
        }
        fileEntry.hits++;
        return fileEntry.data;
      }
    }

    // nothing found
    return null;
  }

  /**
   * Set configuration in cache
   */
  async set(key: string, data: T, customTtl?: number): Promise<void> {
    const hash = this.generateHash(data);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      hash,
      hits: 0,
      ttl: customTtl ?? this.options.ttl, // respect custom TTL
    };

    if (this.options.inMemory) {
      this.memoryCache.set(key, entry);
    }

    await this.saveToFileCache(key, entry);
  }

  /**
   * Invalidate cache entry
   */
  async invalidate(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await this.removeFromFileCache(key);
  }

  /**
   * Clear entire cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    await this.clearFileCache();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memoryEntries: number;
    totalHits: number;
    averageHits: number;
    cacheSize: number;
  } {
    let totalHits = 0;
    let cacheSize = 0;

    this.memoryCache.forEach((entry) => {
      totalHits += entry.hits;
      cacheSize += this.estimateSize(entry.data);
    });

    return {
      memoryEntries: this.memoryCache.size,
      totalHits,
      averageHits:
        this.memoryCache.size > 0 ? totalHits / this.memoryCache.size : 0,
      cacheSize,
    };
  }

  /**
   * Implement LRU eviction when cache size exceeds limit
   */
  private evictLRU(maxEntries: number = 100): void {
    if (this.memoryCache.size <= maxEntries) return;

    // Sort by hits (least recently used first)
    const entries = Array.from(this.memoryCache.entries()).sort(
      (a, b) => a[1].hits - b[1].hits,
    );

    // Remove least recently used entries
    const toRemove = entries.slice(0, this.memoryCache.size - maxEntries);
    toRemove.forEach(([key]) => this.memoryCache.delete(key));
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    const ttl = entry.ttl ?? this.options.ttl;
    return Date.now() - entry.timestamp > ttl;
  }

  private generateHash(data: T): string {
    const str = JSON.stringify(data);
    return createHash("sha256").update(str).digest("hex").substring(0, 16);
  }

  private async ensureCacheDir(): Promise<void> {
    try {
      await fs.mkdir(this.options.cacheDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create cache directory:", error);
    }
  }

  private getCacheFilePath(key: string): string {
    const safeKey = key.replace(/[^a-z0-9]/gi, "_");
    return path.join(this.options.cacheDir, `${safeKey}.json`);
  }

  private async getFromFileCache(key: string): Promise<CacheEntry<T> | null> {
    try {
      const filePath = this.getCacheFilePath(key);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  private async saveToFileCache(
    key: string,
    entry: CacheEntry<T>,
  ): Promise<void> {
    try {
      const filePath = this.getCacheFilePath(key);
      const content = JSON.stringify(entry, null, 2);
      await fs.writeFile(filePath, content, "utf-8");
    } catch (error) {
      console.error("Failed to save to file cache:", error);
    }
  }

  private async removeFromFileCache(key: string): Promise<void> {
    try {
      const filePath = this.getCacheFilePath(key);
      await fs.unlink(filePath);
    } catch {
      // File might not exist, ignore
    }
  }

  private async clearFileCache(): Promise<void> {
    try {
      const files = await fs.readdir(this.options.cacheDir);
      await Promise.all(
        files.map(
          (file: string): Promise<void> =>
            fs.unlink(path.join(this.options.cacheDir, file)),
        ),
      );
    } catch {
      // Directory might not exist, ignore
    }
  }

  private estimateSize(data: T): number {
    const str = JSON.stringify(data);
    return new Blob([str]).size;
  }
}

/**
 * Singleton instance for global configuration cache
 */
export const globalConfigCache = new ConfigCacheManager({
  ttl: 1000 * 60 * 30, // 30 minutes
  inMemory: true,
  cacheDir: ".lingo-cache/config",
});
