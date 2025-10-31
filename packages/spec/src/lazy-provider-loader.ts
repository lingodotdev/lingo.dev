/**
 * Lazy Loading Provider Configuration Manager
 * Implements on-demand loading of provider-specific configurations
 * to reduce initial load time and memory footprint
 */

import { EventEmitter } from 'events';

export type ProviderId = 'openai' | 'anthropic' | 'google' | 'groq' | 'mistral' | 'cohere' | 'lingodotdev';

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  apiKey?: string;
  apiUrl?: string;
  models?: string[];
  defaultModel?: string;
  maxTokens?: number;
  temperature?: number;
  customSettings?: Record<string, any>;
}

export interface LazyLoadOptions {
  preloadProviders?: ProviderId[];
  loadTimeout?: number;
  retryAttempts?: number;
  cacheLoadedConfigs?: boolean;
}

/**
 * Lazy loading manager for provider configurations
 */
export class LazyProviderConfigLoader extends EventEmitter {
  private loadedConfigs: Map<ProviderId, ProviderConfig> = new Map();
  private loadingPromises: Map<ProviderId, Promise<ProviderConfig>> = new Map();
  private configLoaders: Map<ProviderId, () => Promise<ProviderConfig>> = new Map();
  private accessCount: Map<ProviderId, number> = new Map();
  private lastAccess: Map<ProviderId, number> = new Map();
  private readonly options: Required<LazyLoadOptions>;

  constructor(options: LazyLoadOptions = {}) {
    super();
    this.options = {
      preloadProviders: options.preloadProviders ?? [],
      loadTimeout: options.loadTimeout ?? 5000,
      retryAttempts: options.retryAttempts ?? 3,
      cacheLoadedConfigs: options.cacheLoadedConfigs ?? true,
    };

    // Register default config loaders
    this.registerDefaultLoaders();

    // Preload specified providers
    if (this.options.preloadProviders.length > 0) {
      this.preloadProviders();
    }
  }

  /**
   * Register a custom loader for a provider
   */
  registerLoader(providerId: ProviderId, loader: () => Promise<ProviderConfig>): void {
    this.configLoaders.set(providerId, loader);
  }

  /**
   * Get provider configuration (lazy loaded)
   */
  async getConfig(providerId: ProviderId): Promise<ProviderConfig> {
    // Track access for analytics and optimization
    this.trackAccess(providerId);

    // Return cached config if available
    if (this.loadedConfigs.has(providerId)) {
      this.emit('config:cache-hit', providerId);
      return this.loadedConfigs.get(providerId)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(providerId)) {
      this.emit('config:wait-loading', providerId);
      return this.loadingPromises.get(providerId)!;
    }

    // Start loading
    const loadPromise = this.loadProviderConfig(providerId);
    this.loadingPromises.set(providerId, loadPromise);

    try {
      const config = await loadPromise;
      
      // Cache the loaded config
      if (this.options.cacheLoadedConfigs) {
        this.loadedConfigs.set(providerId, config);
      }
      
      this.emit('config:loaded', providerId, config);
      return config;
    } finally {
      this.loadingPromises.delete(providerId);
    }
  }

  /**
   * Preload multiple provider configurations
   */
  async preloadProviders(providerIds?: ProviderId[]): Promise<void> {
    const providers = providerIds ?? this.options.preloadProviders;
    const promises = providers.map(id => this.getConfig(id).catch(err => {
      console.warn(`Failed to preload provider ${id}:`, err);
      return null;
    }));
    
    await Promise.all(promises);
    this.emit('preload:complete', providers);
  }

  /**
   * Unload provider configuration to free memory
   */
  unloadConfig(providerId: ProviderId): void {
    this.loadedConfigs.delete(providerId);
    this.emit('config:unloaded', providerId);
  }

  /**
   * Auto-unload least recently used configs
   */
  autoUnloadLRU(maxConfigs: number = 5): void {
    if (this.loadedConfigs.size <= maxConfigs) return;

    // Sort by last access time
    const sorted = Array.from(this.lastAccess.entries())
      .filter(([id]) => this.loadedConfigs.has(id))
      .sort((a, b) => a[1] - b[1]);

    // Unload least recently used
    const toUnload = sorted.slice(0, this.loadedConfigs.size - maxConfigs);
    toUnload.forEach(([id]) => this.unloadConfig(id));
  }

  /**
   * Get loading statistics
   */
  getStats(): {
    loadedCount: number;
    totalAccessCount: number;
    providerStats: Array<{
      provider: ProviderId;
      accessCount: number;
      lastAccess: Date | null;
      loaded: boolean;
    }>;
  } {
    const providerStats = Array.from(this.configLoaders.keys()).map(provider => ({
      provider,
      accessCount: this.accessCount.get(provider) ?? 0,
      lastAccess: this.lastAccess.has(provider) 
        ? new Date(this.lastAccess.get(provider)!) 
        : null,
      loaded: this.loadedConfigs.has(provider),
    }));

    const totalAccessCount = Array.from(this.accessCount.values())
      .reduce((sum, count) => sum + count, 0);

    return {
      loadedCount: this.loadedConfigs.size,
      totalAccessCount,
      providerStats,
    };
  }

  /**
   * Load provider configuration with retry logic
   */
  private async loadProviderConfig(providerId: ProviderId): Promise<ProviderConfig> {
    const loader = this.configLoaders.get(providerId);
    if (!loader) {
      throw new Error(`No loader registered for provider: ${providerId}`);
    }

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.options.retryAttempts; attempt++) {
      try {
        this.emit('config:loading', providerId, attempt);
        
        // Apply timeout to loader
        const config = await this.withTimeout(
          loader(),
          this.options.loadTimeout,
          `Loading ${providerId} config timed out`
        );
        
        return config;
      } catch (error) {
        lastError = error as Error;
        this.emit('config:load-error', providerId, error, attempt);
        
        if (attempt < this.options.retryAttempts) {
          // Exponential backoff
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error(`Failed to load config for ${providerId}`);
  }

  /**
   * Register default configuration loaders
   */
  private registerDefaultLoaders(): void {
    // OpenAI loader
    this.registerLoader('openai', async () => ({
      id: 'openai',
      name: 'OpenAI',
      apiUrl: 'https://api.openai.com/v1',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      defaultModel: 'gpt-4',
      maxTokens: 4096,
      temperature: 0.7,
    }));

    // Anthropic loader
    this.registerLoader('anthropic', async () => ({
      id: 'anthropic',
      name: 'Anthropic',
      apiUrl: 'https://api.anthropic.com/v1',
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
      defaultModel: 'claude-3-sonnet',
      maxTokens: 4096,
      temperature: 0.7,
    }));

    // Google loader
    this.registerLoader('google', async () => ({
      id: 'google',
      name: 'Google AI',
      apiUrl: 'https://generativelanguage.googleapis.com/v1',
      models: ['gemini-pro', 'gemini-pro-vision'],
      defaultModel: 'gemini-pro',
      maxTokens: 2048,
      temperature: 0.7,
    }));

    // Groq loader
    this.registerLoader('groq', async () => ({
      id: 'groq',
      name: 'Groq',
      apiUrl: 'https://api.groq.com/openai/v1',
      models: ['mixtral-8x7b-32768', 'llama2-70b-4096'],
      defaultModel: 'mixtral-8x7b-32768',
      maxTokens: 32768,
      temperature: 0.7,
    }));

    // Mistral loader
    this.registerLoader('mistral', async () => ({
      id: 'mistral',
      name: 'Mistral AI',
      apiUrl: 'https://api.mistral.ai/v1',
      models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
      defaultModel: 'mistral-medium-latest',
      maxTokens: 4096,
      temperature: 0.7,
    }));

    // Cohere loader
    this.registerLoader('cohere', async () => ({
      id: 'cohere',
      name: 'Cohere',
      apiUrl: 'https://api.cohere.ai',
      models: ['command', 'command-light'],
      defaultModel: 'command',
      maxTokens: 4096,
      temperature: 0.7,
    }));

    // Lingo.dev loader
    this.registerLoader('lingodotdev', async () => ({
      id: 'lingodotdev',
      name: 'Lingo.dev Engine',
      apiUrl: 'https://api.lingo.dev/v1',
      models: ['lingo-translate-v1'],
      defaultModel: 'lingo-translate-v1',
      maxTokens: 8192,
      temperature: 0.3, // Lower temperature for translations
    }));
  }

  /**
   * Track access for analytics and LRU
   */
  private trackAccess(providerId: ProviderId): void {
    const current = this.accessCount.get(providerId) ?? 0;
    this.accessCount.set(providerId, current + 1);
    this.lastAccess.set(providerId, Date.now());
  }

  /**
   * Promise with timeout
   */
  private withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutError: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(timeoutError)), timeoutMs)
      ),
    ]);
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Singleton instance for global lazy loading
 */
export const providerConfigLoader = new LazyProviderConfigLoader({
  preloadProviders: ['lingodotdev'], // Preload only the default provider
  cacheLoadedConfigs: true,
  loadTimeout: 5000,
  retryAttempts: 3,
});