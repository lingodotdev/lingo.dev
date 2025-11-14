import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { CmdRunContext } from '../_types';
import { 
  ConfigurationManager as IConfigurationManager,
  WatchConfiguration,
  ValidationResult
} from './types';

// Zod schemas for configuration validation
const watchPatternsSchema = z.object({
  include: z.array(z.string()).default([]),
  exclude: z.array(z.string()).default([])
});

const debounceConfigSchema = z.object({
  delay: z.number().positive().min(100).max(60000), // 100ms to 60s
  maxWait: z.number().positive().optional()
}).refine(
  (data: { delay: number; maxWait?: number }) => !data.maxWait || data.maxWait > data.delay,
  {
    message: "maxWait must be greater than delay",
    path: ["maxWait"]
  }
);

const monitoringConfigSchema = z.object({
  enableProgressIndicators: z.boolean().default(true),
  enableNotifications: z.boolean().default(false),
  logLevel: z.enum(['silent', 'minimal', 'verbose']).default('minimal')
});

const performanceConfigSchema = z.object({
  batchSize: z.number().positive().min(1).max(1000).default(50),
  rateLimitDelay: z.number().min(0).max(5000).default(100)
});

export const watchConfigurationSchema = z.object({
  patterns: watchPatternsSchema,
  debounce: debounceConfigSchema,
  monitoring: monitoringConfigSchema,
  performance: performanceConfigSchema
});

// Type for configuration file format
const configFileSchema = z.object({
  watch: watchConfigurationSchema.partial().optional()
}).passthrough(); // Allow other properties in config file

/**
 * ConfigurationManager handles loading, validation, and merging of watch configuration
 * from CLI flags, config files, and default values.
 */
export class ConfigurationManager implements IConfigurationManager {
  
  /**
   * Load watch configuration from context (CLI flags, config files, etc.)
   */
  async loadConfiguration(ctx: CmdRunContext): Promise<WatchConfiguration> {
    try {
      // Load configuration from config file if specified
      const fileConfig = await this.loadConfigFromFile(ctx.flags.watchConfig);
      
      // Load configuration from CLI flags
      const cliConfig = this.extractConfigFromFlags(ctx);
      
      // Merge configurations with CLI taking precedence over file config
      const mergedConfig = this.mergeConfigurations(fileConfig, cliConfig);
      
      // Merge with defaults and validate
      const finalConfig = this.mergeWithDefaults(mergedConfig);
      
      // Validate the final configuration
      const validation = this.validateConfiguration(finalConfig);
      if (!validation.isValid) {
        throw new Error(`Invalid watch configuration: ${validation.errors.join(', ')}`);
      }
      
      // Log warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Watch configuration warnings:', validation.warnings.join(', '));
      }
      
      return finalConfig;
    } catch (error) {
      console.error('Failed to load watch configuration:', error instanceof Error ? error.message : String(error));
      // Fall back to default configuration
      return this.getDefaultConfiguration();
    }
  }

  /**
   * Validate watch configuration for correctness and completeness
   */
  validateConfiguration(config: WatchConfiguration): ValidationResult {
    try {
      // Use Zod schema for comprehensive validation
      watchConfigurationSchema.parse(config);
      
      const warnings: string[] = [];
      
      // Additional validation checks
      if (config.patterns.include.length === 0) {
        warnings.push('No include patterns specified, will use bucket-based defaults');
      }
      
      // Validate glob patterns syntax
      const patternValidation = this.validateGlobPatterns([
        ...config.patterns.include,
        ...config.patterns.exclude
      ]);
      
      if (patternValidation.length > 0) {
        warnings.push(...patternValidation);
      }
      
      // Performance warnings
      if (config.performance.batchSize > 100) {
        warnings.push('Large batch size may impact performance');
      }
      
      if (config.debounce.delay < 1000) {
        warnings.push('Short debounce delay may cause excessive retranslations');
      }
      
      return {
        isValid: true,
        errors: [],
        warnings
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err: z.ZodIssue) => 
          `${err.path.join('.')}: ${err.message}`
        );
        return {
          isValid: false,
          errors,
          warnings: []
        };
      }
      
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      };
    }
  }

  /**
   * Merge partial configuration with defaults
   */
  mergeWithDefaults(config: Partial<WatchConfiguration>): WatchConfiguration {
    const defaults = this.getDefaultConfiguration();
    
    return {
      patterns: {
        include: config.patterns?.include || defaults.patterns.include,
        exclude: config.patterns?.exclude || defaults.patterns.exclude
      },
      debounce: {
        delay: config.debounce?.delay || defaults.debounce.delay,
        maxWait: config.debounce?.maxWait || defaults.debounce.maxWait
      },
      monitoring: {
        enableProgressIndicators: config.monitoring?.enableProgressIndicators ?? defaults.monitoring.enableProgressIndicators,
        enableNotifications: config.monitoring?.enableNotifications ?? defaults.monitoring.enableNotifications,
        logLevel: config.monitoring?.logLevel || defaults.monitoring.logLevel
      },
      performance: {
        batchSize: config.performance?.batchSize || defaults.performance.batchSize,
        rateLimitDelay: config.performance?.rateLimitDelay || defaults.performance.rateLimitDelay
      }
    };
  }

  /**
   * Get default watch configuration
   */
  private getDefaultConfiguration(): WatchConfiguration {
    return {
      patterns: {
        include: [], // Will be populated from bucket configuration
        exclude: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/build/**',
          '**/*.tmp',
          '**/*.temp',
          '**/.DS_Store'
        ]
      },
      debounce: {
        delay: 5000, // 5 seconds default
        maxWait: 30000 // 30 seconds max wait
      },
      monitoring: {
        enableProgressIndicators: true,
        enableNotifications: false,
        logLevel: 'minimal'
      },
      performance: {
        batchSize: 50,
        rateLimitDelay: 100
      }
    };
  }

  /**
   * Extract watch configuration from CLI flags
   */
  private extractConfigFromFlags(ctx: CmdRunContext): Partial<WatchConfiguration> {
    const config: Partial<WatchConfiguration> = {};

    // Extract pattern settings
    if (ctx.flags.watchInclude || ctx.flags.watchExclude) {
      config.patterns = {
        include: ctx.flags.watchInclude || [],
        exclude: ctx.flags.watchExclude || []
      };
    }

    // Extract debounce settings
    const debounceConfig: any = {};
    if (ctx.flags.debounce) {
      debounceConfig.delay = ctx.flags.debounce;
    }
    if (ctx.flags.maxWait) {
      debounceConfig.maxWait = ctx.flags.maxWait;
    }
    if (Object.keys(debounceConfig).length > 0) {
      config.debounce = debounceConfig;
    }

    // Extract monitoring settings
    const monitoringConfig: any = {};
    if (ctx.flags.quiet !== undefined) {
      monitoringConfig.logLevel = ctx.flags.quiet ? 'silent' : 'minimal';
    }
    if (ctx.flags.verbose !== undefined && ctx.flags.verbose) {
      monitoringConfig.logLevel = 'verbose';
    }
    if (ctx.flags.progress !== undefined) {
      monitoringConfig.enableProgressIndicators = ctx.flags.progress;
    }
    if (ctx.flags.notifications !== undefined) {
      monitoringConfig.enableNotifications = ctx.flags.notifications;
    }
    if (Object.keys(monitoringConfig).length > 0) {
      config.monitoring = monitoringConfig;
    }

    // Extract performance settings
    const performanceConfig: any = {};
    if (ctx.flags.batchSize) {
      performanceConfig.batchSize = ctx.flags.batchSize;
    }
    if (ctx.flags.rateLimitDelay) {
      performanceConfig.rateLimitDelay = ctx.flags.rateLimitDelay;
    }
    if (Object.keys(performanceConfig).length > 0) {
      config.performance = performanceConfig;
    }

    return config;
  }

  /**
   * Load configuration from a config file
   */
  private async loadConfigFromFile(configPath?: string): Promise<Partial<WatchConfiguration>> {
    if (!configPath) {
      return {};
    }

    try {
      const resolvedPath = path.resolve(configPath);
      
      if (!fs.existsSync(resolvedPath)) {
        console.warn(`Watch config file not found: ${resolvedPath}`);
        return {};
      }

      const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
      let parsedConfig: any;

      // Support JSON and YAML formats
      if (configPath.endsWith('.json')) {
        parsedConfig = JSON.parse(fileContent);
      } else if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
        // Import yaml dynamically since it's available in dependencies
        const { parse: parseYaml } = await import('yaml');
        parsedConfig = parseYaml(fileContent);
      } else {
        // Try JSON first, then YAML
        try {
          parsedConfig = JSON.parse(fileContent);
        } catch {
          const { parse: parseYaml } = await import('yaml');
          parsedConfig = parseYaml(fileContent);
        }
      }

      // Validate the config file structure
      const validatedConfig = configFileSchema.parse(parsedConfig);
      
      return validatedConfig.watch || {};
    } catch (error) {
      console.error(`Failed to load watch config from ${configPath}:`, error instanceof Error ? error.message : String(error));
      return {};
    }
  }

  /**
   * Merge multiple configuration objects with precedence
   */
  private mergeConfigurations(...configs: Partial<WatchConfiguration>[]): Partial<WatchConfiguration> {
    const result: Partial<WatchConfiguration> = {};
    
    for (const config of configs) {
      if (config.patterns) {
        result.patterns = {
          include: [...(result.patterns?.include || []), ...(config.patterns.include || [])],
          exclude: [...(result.patterns?.exclude || []), ...(config.patterns.exclude || [])]
        };
      }
      
      if (config.debounce) {
        result.debounce = { ...result.debounce, ...config.debounce };
      }
      
      if (config.monitoring) {
        result.monitoring = { ...result.monitoring, ...config.monitoring };
      }
      
      if (config.performance) {
        result.performance = { ...result.performance, ...config.performance };
      }
    }
    
    return result;
  }

  /**
   * Validate glob patterns for syntax correctness
   */
  private validateGlobPatterns(patterns: string[]): string[] {
    const warnings: string[] = [];
    
    for (const pattern of patterns) {
      if (!pattern || pattern.trim().length === 0) {
        warnings.push('Empty pattern found');
        continue;
      }

      // Check for potentially problematic patterns
      if (pattern.includes('**/**/**')) {
        warnings.push(`Pattern '${pattern}' may be overly broad and could impact performance`);
      }

      if (pattern.startsWith('/') && process.platform === 'win32') {
        warnings.push(`Pattern '${pattern}' uses absolute path which may not work on Windows`);
      }

      // Check for locale placeholder without replacement
      if (pattern.includes('[locale]')) {
        warnings.push(`Pattern '${pattern}' contains unreplaced [locale] placeholder`);
      }

      // Check for common glob mistakes
      if (pattern.includes('\\') && process.platform !== 'win32') {
        warnings.push(`Pattern '${pattern}' contains backslashes which may not work on Unix systems`);
      }
    }
    
    return warnings;
  }
}