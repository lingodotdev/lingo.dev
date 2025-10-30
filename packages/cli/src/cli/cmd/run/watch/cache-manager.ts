import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hash?: string;
  size?: number;
}

/**
 * Cache statistics
 */
export interface CacheStatistics {
  totalEntries: number;
  totalSize: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  evictionCount: number;
  oldestEntry: number;
  newestEntry: number;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /** Maximum number of entries */
  maxEntries: number;
  /** Default TTL in milliseconds */
  defaultTtl: number;
  /** Maximum cache size in bytes */
  maxSize: number;
  /** Enable persistent cache to disk */
  enablePersistence: boolean;
  /** Cache file path for persistence */
  cacheFilePath?: string;
  /** Enable automatic cleanup */
  enableAutoCleanup: boolean;
  /** Cleanup interval in milliseconds */
  cleanupInterval: number;
}

/**
 * CacheManager provides intelligent caching for file patterns, metadata, and other
 * frequently accessed data to improve performance in large repositories.
 */
export class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  private statistics: CacheStatistics;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private currentSize: number = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxEntries: 1000,
      defaultTtl: 300000, // 5 minutes
      maxSize: 50 * 1024 * 1024, // 50MB
      enablePersistence: false,
      enableAutoCleanup: true,
      cleanupInterval: 60000, // 1 minute
      ...config,
    };

    this.statistics = {
      totalEntries: 0,
      totalSize: 0,
      hitCount: 0,
      missCount: 0,
      hitRate: 0,
      evictionCount: 0,
      oldestEntry: 0,
      newestEntry: 0,
    };

    this.initialize();
  }

  /**
   * Initialize the cache manager
   */
  private async initialize(): Promise<void> {
    // Load persistent cache if enabled
    if (this.config.enablePersistence) {
      await this.loadPersistentCache();
    }

    // Start automatic cleanup if enabled
    if (this.config.enableAutoCleanup) {
      this.startAutoCleanup();
    }
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.statistics.missCount++;
      this.updateHitRate();
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.currentSize -= entry.size || 0;
      this.statistics.missCount++;
      this.updateHitRate();
      return null;
    }

    this.statistics.hitCount++;
    this.updateHitRate();
    return entry.value;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const entryTtl = ttl || this.config.defaultTtl;
    const serializedValue = JSON.stringify(value);
    const size = Buffer.byteLength(serializedValue, "utf8");
    const hash = this.generateHash(serializedValue);

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      ttl: entryTtl,
      hash,
      size,
    };

    // Check if we need to evict entries
    this.ensureCapacity(size);

    // Remove existing entry if it exists
    const existingEntry = this.cache.get(key);
    if (existingEntry) {
      this.currentSize -= existingEntry.size || 0;
    }

    // Add new entry
    this.cache.set(key, entry);
    this.currentSize += size;
    this.updateStatistics();
  }

  /**
   * Check if key exists in cache and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.currentSize -= entry.size || 0;
      return false;
    }

    return true;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size || 0;
      return this.cache.delete(key);
    }
    return false;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.statistics.totalEntries = 0;
    this.statistics.totalSize = 0;
    this.statistics.evictionCount = 0;
  }

  /**
   * Get cache statistics
   */
  getStatistics(): CacheStatistics {
    return { ...this.statistics };
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size in bytes
   */
  getSize(): number {
    return this.currentSize;
  }

  /**
   * Get number of entries
   */
  getEntryCount(): number {
    return this.cache.size;
  }

  /**
   * Ensure cache capacity by evicting old entries if necessary
   */
  private ensureCapacity(newEntrySize: number): void {
    // Check entry count limit
    while (this.cache.size >= this.config.maxEntries) {
      this.evictOldestEntry();
    }

    // Check size limit
    while (this.currentSize + newEntrySize > this.config.maxSize) {
      this.evictOldestEntry();
    }
  }

  /**
   * Evict the oldest entry from cache
   */
  private evictOldestEntry(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey);
      if (entry) {
        this.currentSize -= entry.size || 0;
        this.cache.delete(oldestKey);
        this.statistics.evictionCount++;
      }
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.currentSize -= entry.size || 0;
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    this.updateStatistics();
    return cleanedCount;
  }

  /**
   * Start automatic cleanup timer
   */
  private startAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      const cleaned = this.cleanup();
      if (cleaned > 0) {
        console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
      }
    }, this.config.cleanupInterval);
  }

  /**
   * Stop automatic cleanup timer
   */
  private stopAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Update cache statistics
   */
  private updateStatistics(): void {
    this.statistics.totalEntries = this.cache.size;
    this.statistics.totalSize = this.currentSize;

    // Update oldest and newest entry timestamps
    let oldest = Date.now();
    let newest = 0;

    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldest) {
        oldest = entry.timestamp;
      }
      if (entry.timestamp > newest) {
        newest = entry.timestamp;
      }
    }

    this.statistics.oldestEntry = oldest;
    this.statistics.newestEntry = newest;
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const totalRequests = this.statistics.hitCount + this.statistics.missCount;
    this.statistics.hitRate =
      totalRequests > 0 ? (this.statistics.hitCount / totalRequests) * 100 : 0;
  }

  /**
   * Generate hash for cache entry
   */
  private generateHash(data: string): string {
    return crypto.createHash("md5").update(data).digest("hex");
  }

  /**
   * Load persistent cache from disk
   */
  private async loadPersistentCache(): Promise<void> {
    if (!this.config.cacheFilePath) {
      return;
    }

    try {
      const cacheData = await fs.promises.readFile(
        this.config.cacheFilePath,
        "utf8",
      );
      const parsedData = JSON.parse(cacheData);

      if (parsedData.entries && Array.isArray(parsedData.entries)) {
        for (const entry of parsedData.entries) {
          // Only load non-expired entries
          const now = Date.now();
          if (now - entry.timestamp <= entry.ttl) {
            this.cache.set(entry.key, entry);
            this.currentSize += entry.size || 0;
          }
        }
      }

      console.log(`📁 Loaded ${this.cache.size} entries from persistent cache`);
    } catch (error) {
      // Cache file doesn't exist or is corrupted, start fresh
      console.log("📁 No persistent cache found, starting fresh");
    }
  }

  /**
   * Save persistent cache to disk
   */
  async savePersistentCache(): Promise<void> {
    if (!this.config.enablePersistence || !this.config.cacheFilePath) {
      return;
    }

    try {
      const cacheData = {
        timestamp: Date.now(),
        entries: Array.from(this.cache.values()),
      };

      const cacheDir = path.dirname(this.config.cacheFilePath);
      await fs.promises.mkdir(cacheDir, { recursive: true });
      await fs.promises.writeFile(
        this.config.cacheFilePath,
        JSON.stringify(cacheData, null, 2),
      );

      console.log(`💾 Saved ${this.cache.size} entries to persistent cache`);
    } catch (error) {
      console.warn(`Failed to save persistent cache: ${error}`);
    }
  }

  /**
   * Get cache entry metadata
   */
  getEntryMetadata(key: string): Omit<CacheEntry<any>, "value"> | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    return {
      key: entry.key,
      timestamp: entry.timestamp,
      ttl: entry.ttl,
      hash: entry.hash,
      size: entry.size,
    };
  }

  /**
   * Update cache configuration
   */
  updateConfiguration(config: Partial<CacheConfig>): void {
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...config };

    // Restart auto cleanup if interval changed
    if (
      config.cleanupInterval !== undefined &&
      config.cleanupInterval !== oldConfig.cleanupInterval
    ) {
      if (this.config.enableAutoCleanup) {
        this.startAutoCleanup();
      }
    }

    // Enable/disable auto cleanup
    if (config.enableAutoCleanup !== undefined) {
      if (config.enableAutoCleanup) {
        this.startAutoCleanup();
      } else {
        this.stopAutoCleanup();
      }
    }

    // Ensure capacity if limits changed
    if (config.maxEntries !== undefined || config.maxSize !== undefined) {
      this.ensureCapacity(0);
    }
  }

  /**
   * Export cache data for debugging
   */
  exportCacheData(): any {
    return {
      config: this.config,
      statistics: this.statistics,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        size: entry.size,
        hash: entry.hash,
        expired: Date.now() - entry.timestamp > entry.ttl,
      })),
    };
  }

  /**
   * Clean up resources and save persistent cache
   */
  async destroy(): Promise<void> {
    this.stopAutoCleanup();

    if (this.config.enablePersistence) {
      await this.savePersistentCache();
    }

    this.clear();
  }
}
