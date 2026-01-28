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
    enabled: false,
    model: "groq:llama-3.1-8b-instant",
  },
  buildMode: "translate",
} satisfies Omit<
  LingoConfig,
  // Looks like we can use LingoInternalFields, but it's only a coincidence that the types match, we may want to provide default for internal fields
  LingoConfigRequiredFields | "environment" | "cacheType"
>;

function getModelStringForLocales(
  models: Record<string, string>,
  sourceLocale: string,
  targetLocale: string | undefined,
): string | undefined {
  const localeKeys = targetLocale
    ? [
        `${sourceLocale}:${targetLocale}`,
        `*:${targetLocale}`,
        `${sourceLocale}:*`,
        "*:*",
      ]
    : [`${sourceLocale}:*`, "*:*"];

  const modelKey = localeKeys.find((key) => key in models);
  if (modelKey) {
    return models[modelKey];
  }

  const sortedKeys = Object.keys(models).sort();
  if (sortedKeys.length === 0) {
    return undefined;
  }

  return models[sortedKeys[0]];
}

function inferPluralizationModel(
  models: "lingo.dev" | Record<string, string>,
  sourceLocale: string,
  targetLocales: string[],
): string | undefined {
  if (models === "lingo.dev") {
    return undefined;
  }

  return getModelStringForLocales(
    models,
    sourceLocale,
    targetLocales[0],
  );
}

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
  const config: LingoConfig = {
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

  const explicitEnabled = options.pluralization?.enabled;
  const explicitModel = options.pluralization?.model;
  const hasExplicitModel =
    typeof explicitModel === "string" && explicitModel.trim().length > 0;
  const hasExplicitEnabled = typeof explicitEnabled === "boolean";

  const pluralizationEnabled = hasExplicitEnabled
    ? explicitEnabled
    : hasExplicitModel;

  let pluralizationModel = hasExplicitModel
    ? explicitModel!.trim()
    : config.pluralization.model;

  if (pluralizationEnabled && !hasExplicitModel) {
    const inferredModel = inferPluralizationModel(
      config.models,
      config.sourceLocale,
      config.targetLocales,
    );

    if (!inferredModel) {
      throw new Error(
        'Pluralization is enabled but no "pluralization.model" is configured. Please set "pluralization.model" explicitly or use direct LLM models (not "lingo.dev") so the model can be inferred.',
      );
    }

    pluralizationModel = inferredModel;
  }

  config.pluralization = {
    ...config.pluralization,
    enabled: pluralizationEnabled,
    model: pluralizationModel,
  };

  return config;
}
