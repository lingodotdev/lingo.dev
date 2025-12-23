/**
 * Config factory for creating LoaderConfig instances
 */
import type {
  LingoConfig,
  LingoConfigRequiredFields,
  LingoInternalFields,
  PartialLingoConfig,
} from "../types";

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  sourceRoot: "src",
  lingoDir: "lingo",
  useDirective: false,
  dev: {
    translationServerStartPort: 60000,
  },
  localePersistence: {
    type: "cookie" as const,
    config: {
      name: "locale",
      maxAge: 31536000,
    },
  },
  models: "lingo.dev",
  pluralization: {
    enabled: true,
    model: "groq:llama-3.1-8b-instant",
  },
  buildMode: "translate",
} satisfies Omit<
  LingoConfig,
  // Looks like we can use LingoInternalFields, but it's only a coincidence that the types match, we may want to provide default for internal fields
  LingoConfigRequiredFields | "environment" | "cacheType"
>;

/**
 * Create a LoaderConfig with defaults applied
 *
 * @param options - Partial config to override defaults
 * @returns Complete LoaderConfig with all defaults applied
 *
 */
export function createLingoConfig(
  options: PartialLingoConfig & Partial<Pick<LingoConfig, LingoInternalFields>>,
): LingoConfig {
  return {
    ...DEFAULT_CONFIG,
    ...options,
    environment:
      options.environment ??
      (process.env.NODE_ENV === "development" ? "development" : "production"),
    cacheType: options.cacheType ?? "local",
    dev: {
      ...DEFAULT_CONFIG.dev,
      ...options.dev,
    },
    pluralization: {
      ...DEFAULT_CONFIG.pluralization,
      ...options.pluralization,
    },
    localePersistence: {
      ...DEFAULT_CONFIG.localePersistence,
      ...options.localePersistence,
      config: {
        ...DEFAULT_CONFIG.localePersistence.config,
        ...options.localePersistence?.config,
      },
    },
  };
}
