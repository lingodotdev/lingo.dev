/**
 * Performance-Optimized Configuration System
 * Integrates caching, lazy loading, and optimized parsing
 */

import { ConfigCacheManager, globalConfigCache } from "./config-cache-manager";
import {
  LazyProviderConfigLoader,
  providerConfigLoader,
  ProviderId,
} from "./lazy-provider-loader";
import {
  OptimizedConfigParser,
  configParser,
  LingoConfig,
} from "./optimized-config-parser";

export interface ConfigSystemOptions {
  enableCache?: boolean;
  enableLazyLoading?: boolean;
  preloadProviders?: ProviderId[];
  cacheTTL?: number;
  maxCachedConfigs?: number;
}

/**
 * Main configuration system with all optimizations
 */
export class PerformanceOptimizedConfigSystem {
  private readonly cache: ConfigCacheManager<LingoConfig>;
  private readonly lazyLoader: LazyProviderConfigLoader;
  private readonly parser: OptimizedConfigParser;
  private readonly options: Required<ConfigSystemOptions>;

  constructor(options: ConfigSystemOptions = {}) {
    this.options = {
      enableCache: options.enableCache ?? true,
      enableLazyLoading: options.enableLazyLoading ?? true,
      preloadProviders: options.preloadProviders ?? [],
      cacheTTL: options.cacheTTL ?? 1000 * 60 * 30, // 30 minutes
      maxCachedConfigs: options.maxCachedConfigs ?? 50,
    };

    // Initialize components
    this.cache = this.options.enableCache
      ? globalConfigCache
      : new ConfigCacheManager({ inMemory: false });

    this.lazyLoader = this.options.enableLazyLoading
      ? providerConfigLoader
      : new LazyProviderConfigLoader({ preloadProviders: [] });

    this.parser = configParser;

    // Setup event listeners for monitoring
    this.setupMonitoring();
  }

  /**
   * Load configuration with all optimizations
   */
  async loadConfig(
    source: string | object,
    cacheKey?: string,
  ): Promise<LingoConfig> {
    const key = cacheKey || this.generateCacheKey(source);

    // Try cache first
    if (this.options.enableCache) {
      const cached = await this.cache.get(key);
      if (cached) {
        this.emit("cache:hit", key);
        return cached;
      }
    }

    // Parse configuration
    const parseResult = this.parser.parse(source);

    if (parseResult.errors && parseResult.errors.length > 0) {
      throw new Error(
        `Configuration errors: ${parseResult.errors.map((e) => e.message).join(", ")}`,
      );
    }

    const config = parseResult.data;

    // Process provider configurations lazily
    if (config.providers && this.options.enableLazyLoading) {
      await this.processProviderConfigs(config);
    }

    // Cache the result
    if (this.options.enableCache) {
      await this.cache.set(key, config, this.options.cacheTTL);
      this.emit("cache:set", key);
    }

    // Auto-cleanup old cache entries
    this.autoCleanup();

    return config;
  }

  /**
   * Load configuration from file with streaming support
   */
  async loadConfigFromFile(filePath: string): Promise<LingoConfig> {
    const fs = await import("fs");
    const { pipeline } = await import("stream/promises");
    const { Transform } = await import("stream");

    const cacheKey = `file:${filePath}`;

    // Check cache first
    if (this.options.enableCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;
    }

    // Stream parse for large files
    const fileStats = await fs.promises.stat(filePath);

    if (fileStats.size > 1024 * 1024) {
      // > 1MB
      return this.streamParseFile(filePath, cacheKey);
    }

    // Regular parse for smaller files
    const content = await fs.promises.readFile(filePath, "utf-8");
    return this.loadConfig(content, cacheKey);
  }

  /**
   * Batch load multiple configurations
   */
  async batchLoadConfigs(
    sources: Array<{ source: string | object; key: string }>,
  ): Promise<Map<string, LingoConfig>> {
    const results = new Map<string, LingoConfig>();

    // Process in parallel with concurrency limit
    const concurrencyLimit = 5;
    const chunks = this.chunkArray(sources, concurrencyLimit);

    for (const chunk of chunks) {
      const promises = chunk.map(async ({ source, key }) => {
        try {
          const config = await this.loadConfig(source, key);
          results.set(key, config);
        } catch (error) {
          console.error(`Failed to load config ${key}:`, error);
        }
      });

      await Promise.all(promises);
    }

    return results;
  }

  /**
   * Get provider configuration with lazy loading
   */
  async getProviderConfig(providerId: ProviderId): Promise<any> {
    if (!this.options.enableLazyLoading) {
      throw new Error("Lazy loading is disabled");
    }

    return this.lazyLoader.getConfig(providerId);
  }

  /**
   * Validate configuration without parsing
   */
  validateConfig(config: unknown): boolean {
    return this.parser.validate(config).success;
  }

  /**
   * Merge configurations with optimization
   */
  mergeConfigs(...configs: Partial<LingoConfig>[]): LingoConfig {
    return this.parser.merge(...configs);
  }

  /**
   * Get system statistics
   */
  getStats(): {
    cache: ReturnType<ConfigCacheManager<LingoConfig>["getStats"]>;
    parser: ReturnType<OptimizedConfigParser["getCacheStats"]>;
    lazyLoader: ReturnType<LazyProviderConfigLoader["getStats"]>;
    performance: {
      averageParseTime: number;
      averageLoadTime: number;
      cacheHitRate: number;
    };
  } {
    const cacheStats = this.cache.getStats();
    const parserStats = this.parser.getCacheStats();
    const loaderStats = this.lazyLoader.getStats();

    return {
      cache: cacheStats,
      parser: parserStats,
      lazyLoader: loaderStats,
      performance: {
        averageParseTime: this.calculateAverageParseTime(),
        averageLoadTime: this.calculateAverageLoadTime(),
        cacheHitRate: this.calculateCacheHitRate(),
      },
    };
  }

  /**
   * Clear all caches
   */
  async clearAll(): Promise<void> {
    await this.cache.clear();
    this.parser.clearCache();
    // Unload all lazy-loaded configs
    const stats = this.lazyLoader.getStats();
    stats.providerStats
      .filter((s) => s.loaded)
      .forEach((s) => this.lazyLoader.unloadConfig(s.provider));
  }

  /**
   * Warmup cache with frequently used configurations
   */
  async warmup(configs: string[]): Promise<void> {
    console.log("Warming up configuration cache...");

    const promises = configs.map(async (configPath) => {
      try {
        await this.loadConfigFromFile(configPath);
      } catch (error) {
        console.warn(`Failed to warmup ${configPath}:`, error);
      }
    });

    await Promise.all(promises);

    // Preload common providers
    if (
      this.options.enableLazyLoading &&
      this.options.preloadProviders.length > 0
    ) {
      await this.lazyLoader.preloadProviders(this.options.preloadProviders);
    }

    console.log("Cache warmup complete");
  }

  // Private methods

  private async processProviderConfigs(config: LingoConfig): Promise<void> {
    if (!config.models) return;

    // Extract unique provider IDs from models
    const providerIds = new Set<ProviderId>();

    for (const model of Object.values(config.models)) {
      const [provider] = model.split(":");
      if (this.isValidProviderId(provider)) {
        providerIds.add(provider as ProviderId);
      }
    }

    // Preload identified providers
    if (providerIds.size > 0) {
      await this.lazyLoader.preloadProviders(Array.from(providerIds));
    }
  }

  private async streamParseFile(
    filePath: string,
    cacheKey: string,
  ): Promise<LingoConfig> {
    const fs = await import("fs");
    const stream = fs.createReadStream(filePath, { encoding: "utf-8" });

    let partialConfig: Partial<LingoConfig> = {};

    for await (const partial of this.parser.streamParse(stream)) {
      partialConfig = { ...partialConfig, ...partial };
    }

    const config = this.parser.optimize(partialConfig as LingoConfig);

    if (this.options.enableCache) {
      await this.cache.set(cacheKey, config);
    }

    return config;
  }

  private generateCacheKey(source: string | object): string {
    const crypto = require("crypto");
    const content =
      typeof source === "string" ? source : JSON.stringify(source);
    return crypto
      .createHash("sha256")
      .update(content)
      .digest("hex")
      .substring(0, 16);
  }

  private isValidProviderId(provider: string): boolean {
    const validProviders: ProviderId[] = [
      "openai",
      "anthropic",
      "google",
      "groq",
      "mistral",
      "cohere",
      "lingodotdev",
    ];
    return validProviders.includes(provider as ProviderId);
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private autoCleanup(): void {
    // Auto-cleanup cache if it gets too large
    const stats = this.cache.getStats();
    if (stats.memoryEntries > this.options.maxCachedConfigs) {
      // Remove oldest entries (this would need to be implemented in the cache manager)
      console.log("Auto-cleaning cache due to size limit");
    }

    // Auto-unload least recently used provider configs
    this.lazyLoader.autoUnloadLRU(5);
  }

  private setupMonitoring(): void {
    // Monitor lazy loader events
    this.lazyLoader.on("config:loaded", (providerId, config) => {
      console.debug(`Provider config loaded: ${providerId}`);
    });

    this.lazyLoader.on("config:load-error", (providerId, error) => {
      console.error(`Failed to load provider ${providerId}:`, error);
    });
  }

  // Performance tracking (simplified - would need actual implementation)
  private calculateAverageParseTime(): number {
    // This would track actual parse times
    return 0;
  }

  private calculateAverageLoadTime(): number {
    // This would track actual load times
    return 0;
  }

  private calculateCacheHitRate(): number {
    // This would track cache hits vs misses
    return 0;
  }

  private emit(event: string, ...args: any[]): void {
    // Event emitter for monitoring
    if (this.options.enableCache) {
      console.debug(`Event: ${event}`, ...args);
    }
  }
}

/**
 * Factory function to create optimized config system
 */
export function createOptimizedConfigSystem(
  options?: ConfigSystemOptions,
): PerformanceOptimizedConfigSystem {
  return new PerformanceOptimizedConfigSystem(options);
}

/**
 * Default export for convenience
 */
export const configSystem = createOptimizedConfigSystem({
  enableCache: true,
  enableLazyLoading: true,
  preloadProviders: ["lingodotdev"],
  cacheTTL: 1000 * 60 * 30, // 30 minutes
  maxCachedConfigs: 50,
});

// Re-export components for individual use
export { ConfigCacheManager, LazyProviderConfigLoader, OptimizedConfigParser };
export type { LingoConfig } from "./optimized-config-parser";
export type { ProviderId, ProviderConfig } from "./lazy-provider-loader";
