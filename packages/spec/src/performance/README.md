# Performance Optimizations for Lingo.dev Spec Package

This implementation provides comprehensive performance optimizations for the lingo.dev configuration system, including caching mechanisms, lazy loading for provider configurations, and optimized parsing with validation.

## Features

### 1. **Configuration Cache Manager** (`config-cache-manager.ts`)

- **In-memory caching** with TTL (Time To Live) support
- **File-based caching** for persistence across restarts
- **LRU eviction** to manage memory usage
- **Cache statistics** for monitoring and optimization
- **Hash-based validation** to detect configuration changes

### 2. **Lazy Provider Configuration Loader** (`lazy-provider-loader.ts`)

- **On-demand loading** of provider-specific configurations
- **Concurrent loading protection** to prevent duplicate requests
- **Automatic retry logic** with exponential backoff
- **LRU unloading** to free memory
- **Event-driven architecture** for monitoring
- **Preloading support** for critical providers

### 3. **Optimized Configuration Parser** (`optimized-config-parser.ts`)

- **Fast parsing** with Zod schema validation
- **Memoized parsing** for repeated configurations
- **Stream parsing** for large configuration files
- **Configuration merging** with deep merge support
- **Pattern optimization** for model matching
- **Warning generation** for potential issues

### 4. **Integrated Performance System** (`performance-optimized-config.ts`)

- Combines all optimizations into a unified system
- Batch loading support for multiple configurations
- File streaming for large configurations
- Comprehensive statistics and monitoring
- Cache warmup for frequently used configurations

## Installation

```bash
# Install required dependencies
npm install zod lodash
npm install --save-dev @types/node @types/lodash jest @jest/globals
```

## Usage Examples

### Basic Configuration Loading

```typescript
import { createOptimizedConfigSystem } from "./performance-optimized-config";

const configSystem = createOptimizedConfigSystem({
  enableCache: true,
  enableLazyLoading: true,
  cacheTTL: 1000 * 60 * 30, // 30 minutes
  maxCachedConfigs: 50,
});

// Load configuration with automatic caching
const config = await configSystem.loadConfig({
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
  models: {
    "en:es": "gpt-4",
    "*:fr": "claude-3",
    "*:*": "groq:mixtral-8x7b",
  },
});
```

### Lazy Loading Provider Configurations

```typescript
import { providerConfigLoader } from "./lazy-provider-loader";

// Configure preloading for frequently used providers
await providerConfigLoader.preloadProviders(["openai", "anthropic"]);

// Load provider config on-demand (cached after first load)
const openaiConfig = await providerConfigLoader.getConfig("openai");

// Monitor loading events
providerConfigLoader.on("config:loaded", (providerId, config) => {
  console.log(`Loaded provider: ${providerId}`);
});

// Auto-unload least recently used configs to free memory
providerConfigLoader.autoUnloadLRU(5); // Keep max 5 configs in memory
```

### Optimized Configuration Parsing

```typescript
import { configParser } from "./optimized-config-parser";

// Parse with validation and optimization
const result = configParser.parse({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
  models: {
    "en:es": "model1",
    "*:fr": "model2",
    "*:*": "default",
  },
});

if (result.errors) {
  console.error("Validation errors:", result.errors);
} else {
  console.log("Parse time:", result.parseTime, "ms");
  console.log("Validation time:", result.validationTime, "ms");
  console.log("Warnings:", result.warnings);
}

// Fast parse without full validation
const quickConfig = configParser.fastParse(jsonString);

// Merge multiple configurations
const merged = configParser.merge(baseConfig, overrides, environmentConfig);
```

### Cache Management

```typescript
import { globalConfigCache } from "./config-cache-manager";

// Set configuration in cache with custom TTL
await globalConfigCache.set("my-config", configData, 60000); // 1 minute TTL

// Get cached configuration
const cached = await globalConfigCache.get("my-config");

// Get cache statistics
const stats = globalConfigCache.getStats();
console.log(`Cache entries: ${stats.memoryEntries}`);
console.log(`Total hits: ${stats.totalHits}`);
console.log(`Cache size: ${stats.cacheSize} bytes`);

// Invalidate specific entry
await globalConfigCache.invalidate("my-config");

// Clear entire cache
await globalConfigCache.clear();
```

### Batch Loading and File Streaming

```typescript
// Batch load multiple configurations
const configs = await configSystem.batchLoadConfigs([
  { source: config1, key: "app-config" },
  { source: config2, key: "user-config" },
  { source: config3, key: "env-config" },
]);

// Load large configuration file with streaming
const largeConfig = await configSystem.loadConfigFromFile(
  "./large-config.json",
);

// Warmup cache with frequently used configurations
await configSystem.warmup([
  "./configs/production.json",
  "./configs/development.json",
  "./configs/staging.json",
]);
```

## Integration with Lingo.dev

To integrate these optimizations into the lingo.dev spec package:

1. **Replace existing config loading**:

```typescript
// packages/spec/src/config.ts
import { configSystem } from "./performance/performance-optimized-config";

export async function loadConfig(
  source: string | object,
): Promise<LingoConfig> {
  return configSystem.loadConfig(source);
}
```

2. **Add to provider initialization**:

```typescript
// packages/spec/src/providers.ts
import { providerConfigLoader } from "./performance/lazy-provider-loader";

export async function getProviderConfig(providerId: string) {
  return providerConfigLoader.getConfig(providerId);
}
```

3. **Update build process**:

```typescript
// packages/spec/src/build.ts
import { configParser } from "./performance/optimized-config-parser";

export function validateBuildConfig(config: unknown): boolean {
  return configParser.validate(config).success;
}
```

## Configuration Options

### Cache Options

- `ttl`: Time to live in milliseconds (default: 1 hour)
- `cacheDir`: Directory for file-based cache (default: `.lingo-cache`)
- `inMemory`: Enable in-memory caching (default: true)
- `compression`: Enable compression for cached data (default: false)

### Lazy Loading Options

- `preloadProviders`: Array of provider IDs to preload
- `loadTimeout`: Timeout for loading providers (default: 5000ms)
- `retryAttempts`: Number of retry attempts (default: 3)
- `cacheLoadedConfigs`: Cache loaded configurations (default: true)

### System Options

- `enableCache`: Enable caching system (default: true)
- `enableLazyLoading`: Enable lazy loading (default: true)
- `cacheTTL`: Cache time to live (default: 30 minutes)
- `maxCachedConfigs`: Maximum cached configurations (default: 50)

## Monitoring and Debugging

### Event Listeners

```typescript
// Monitor cache events
configSystem.on("cache:hit", (key) => {
  console.log(`Cache hit: ${key}`);
});

configSystem.on("cache:miss", (key) => {
  console.log(`Cache miss: ${key}`);
});

// Monitor provider loading
providerConfigLoader.on("config:loading", (providerId, attempt) => {
  console.log(`Loading ${providerId}, attempt ${attempt}`);
});

providerConfigLoader.on("config:load-error", (providerId, error) => {
  console.error(`Failed to load ${providerId}:`, error);
});
```

### Statistics and Metrics

```typescript
const stats = configSystem.getStats();

console.log("System Statistics:", {
  cacheEntries: stats.cache.memoryEntries,
  cacheHits: stats.cache.totalHits,
  cacheSize: stats.cache.cacheSize,
  loadedProviders: stats.lazyLoader.loadedCount,
  averageParseTime: stats.performance.averageParseTime,
  cacheHitRate: stats.performance.cacheHitRate,
});
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test performance-optimization.test.ts

# Run benchmarks only
npm test -- --testNamePattern="Performance Benchmarks"
```

## Contributing

When contributing to these optimizations:

1. **Maintain backward compatibility** - Ensure existing APIs continue to work
2. **Add comprehensive tests** - Cover both positive and negative scenarios
3. **Document performance impacts** - Include benchmarks for significant changes
4. **Follow the coding standards** - Use TypeScript, proper error handling, and clear naming
5. **Consider memory usage** - Balance performance with memory consumption

## License

This implementation is provided as an open-source contribution to the lingo.dev project under the Apache-2.0 license.

## Next Steps

1. **Submit PR to lingo.dev** - Create a pull request with these optimizations
2. **Gather feedback** - Discuss with maintainers on Discord
3. **Benchmark in production** - Test with real-world configurations
4. **Add metrics collection** - Integrate with monitoring systems
5. **Optimize further** - Consider adding compression, indexed storage, etc.

## Support

For questions or issues:

- Open an issue on the [lingo.dev GitHub repository](https://github.com/lingodotdev/lingo.dev)
- Join the [lingo.dev Discord](https://lingo.dev/go/discord)
- Reference this implementation in discussions
