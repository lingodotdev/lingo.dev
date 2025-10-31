/**
 * Tests for Performance Optimized Configuration System
 * Comprehensive test suite covering all optimization features
 */

import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { ConfigCacheManager } from "./config-cache-manager";
import { LazyProviderConfigLoader, ProviderId } from "./lazy-provider-loader";
import { OptimizedConfigParser, LingoConfig } from "./optimized-config-parser";
import { PerformanceOptimizedConfigSystem } from "./performance-optimized-config";

describe("ConfigCacheManager", () => {
  let cache: ConfigCacheManager<any>;

  beforeEach(() => {
    cache = new ConfigCacheManager({
      ttl: 1000,
      inMemory: true,
      cacheDir: ".test-cache",
    });
  });

  afterEach(async () => {
    await cache.clear();
  });

  test("should cache and retrieve data", async () => {
    const testData = { foo: "bar", nested: { value: 42 } };
    await cache.set("test-key", testData);
    const retrieved = await cache.get("test-key");
    expect(retrieved).toEqual(testData);
  });

  test("should return null for expired entries", async () => {
    const testData = { foo: "bar" };
    await cache.set("test-key", testData, 100);
    await new Promise((resolve) => setTimeout(resolve, 150));
    const retrieved = await cache.get("test-key");
    expect(retrieved).toBeNull();
  });

  test("should invalidate specific cache entries", async () => {
    await cache.set("key1", { value: 1 });
    await cache.set("key2", { value: 2 });
    await cache.invalidate("key1");
    expect(await cache.get("key1")).toBeNull();
    expect(await cache.get("key2")).toEqual({ value: 2 });
  });

  test("should track cache statistics", async () => {
    await cache.set("key1", { value: 1 });
    await cache.get("key1");
    await cache.get("key1");
    const stats = cache.getStats();
    expect(stats.memoryEntries).toBe(1);
    expect(stats.totalHits).toBeGreaterThanOrEqual(2);
  });

  test("should handle file cache operations", async () => {
    const fileCache = new ConfigCacheManager({
      inMemory: false,
      cacheDir: ".test-file-cache",
    });
    const testData = { test: "file-cache" };
    await fileCache.set("file-test", testData);
    const retrieved = await fileCache.get("file-test");
    expect(retrieved).toEqual(testData);
    await fileCache.clear();
  });
});

describe("LazyProviderConfigLoader", () => {
  let loader: LazyProviderConfigLoader;

  beforeEach(() => {
    loader = new LazyProviderConfigLoader({
      preloadProviders: [],
      loadTimeout: 1000,
      retryAttempts: 2,
    });
  });

  test("should lazy load provider configurations", async () => {
    const config = await loader.getConfig("openai");
    expect(config).toBeDefined();
    expect(config.id).toBe("openai");
    expect(config.name).toBe("OpenAI");
    expect(config.models).toContain("gpt-4");
  });

  test("should cache loaded configurations", async () => {
    const config1 = await loader.getConfig("anthropic");
    const config2 = await loader.getConfig("anthropic");
    expect(config1).toBe(config2);
  });

  test("should handle concurrent loading", async () => {
    const promises = [
      loader.getConfig("google"),
      loader.getConfig("google"),
      loader.getConfig("google"),
    ];
    const configs = await Promise.all(promises);
    expect(configs[0]).toBe(configs[1]);
    expect(configs[1]).toBe(configs[2]);
  });

  test("should preload multiple providers", async () => {
    await loader.preloadProviders(["openai", "anthropic", "google"]);
    const stats = loader.getStats();
    expect(stats.loadedCount).toBeGreaterThanOrEqual(3);
  });

  test("should unload configurations to free memory", async () => {
    await loader.getConfig("mistral");
    let stats = loader.getStats();
    expect(stats.loadedCount).toBeGreaterThan(0);
    loader.unloadConfig("mistral");
    stats = loader.getStats();
    const mistralStats = stats.providerStats.find(
      (s) => s.provider === "mistral",
    );
    expect(mistralStats?.loaded).toBe(false);
  });

  test("should auto-unload least recently used configs", async () => {
    await loader.getConfig("openai");
    await loader.getConfig("anthropic");
    await loader.getConfig("google");
    await loader.getConfig("groq");
    await loader.getConfig("mistral");
    await loader.getConfig("cohere");
    await loader.getConfig("openai");
    await loader.getConfig("anthropic");
    loader.autoUnloadLRU(3);
    const stats = loader.getStats();
    expect(stats.loadedCount).toBeLessThanOrEqual(3);
  });

  test("should handle custom loader registration", async () => {
    const customConfig = {
      id: "custom" as ProviderId,
      name: "Custom Provider",
      apiUrl: "https://custom.api",
      models: ["custom-model"],
    };
    loader.registerLoader("custom" as ProviderId, async () => customConfig);
    const loaded = await loader.getConfig("custom" as ProviderId);
    expect(loaded).toEqual(customConfig);
  });

  test("should emit events during loading", async () => {
    const events: string[] = [];
    loader.on("config:loading", (providerId) =>
      events.push(`loading:${providerId}`),
    );
    loader.on("config:loaded", (providerId) =>
      events.push(`loaded:${providerId}`),
    );
    await loader.getConfig("lingodotdev");
    expect(events).toContain("loading:lingodotdev");
    expect(events).toContain("loaded:lingodotdev");
  });
});

describe("OptimizedConfigParser", () => {
  let parser: OptimizedConfigParser;

  beforeEach(() => {
    parser = new OptimizedConfigParser();
  });

  afterEach(() => {
    parser.clearCache();
  });

  test("should parse valid configuration", () => {
    const config = {
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      sourceRoot: "src",
      lingoDir: "lingo",
      rsc: false,
      debug: false,
    };
    const result = parser.parse(config);
    expect(result.data).toBeDefined();
    expect(result.data.sourceLocale).toBe("en");
  });

  test("should validate configuration schema", () => {
    const invalidConfig = { sourceLocale: 123, targetLocales: "invalid" };
    const result = parser.validate(invalidConfig);
    expect(result.success).toBe(false);
  });

  test("should handle JSON string input", () => {
    const configString = JSON.stringify({
      sourceLocale: "en",
      targetLocales: ["es"],
    });
    const result = parser.parse(configString);
    expect(result.data.sourceLocale).toBe("en");
  });

  test("should cache parsed results", () => {
    const config = { sourceLocale: "en", targetLocales: ["es"] };
    const result1 = parser.parse(JSON.stringify(config));
    const result2 = parser.parse(JSON.stringify(config));
    expect(result2.parseTime).toBe(0);
  });
});

describe("PerformanceOptimizedConfigSystem", () => {
  let system: PerformanceOptimizedConfigSystem;

  beforeEach(() => {
    system = new PerformanceOptimizedConfigSystem({
      enableCache: true,
      enableLazyLoading: true,
      cacheTTL: 1000,
      maxCachedConfigs: 10,
    });
  });

  afterEach(async () => {
    await system.clearAll();
  });

  test("should load configuration with caching", async () => {
    const config = { sourceLocale: "en", targetLocales: ["es", "fr"] };
    const loaded1 = await system.loadConfig(config, "test-config");
    const loaded2 = await system.loadConfig(config, "test-config");
    expect(loaded1).toEqual(loaded2);
  });
});
