import Z from "zod";
import { localeCodeSchema } from "./locales";
import { bucketTypeSchema } from "./formats";

// common
export const localeSchema = Z.object({
  source: localeCodeSchema,
  targets: Z.array(localeCodeSchema),
});

// factories
type ConfigDefinition<T extends Z.ZodRawShape, P extends Z.ZodRawShape> = {
  schema: Z.ZodObject<T>;
  defaultValue: Z.infer<Z.ZodObject<T>>;
  parse: (rawConfig: unknown) => Z.infer<Z.ZodObject<T>>;
};
const createConfigDefinition = <
  T extends Z.ZodRawShape,
  P extends Z.ZodRawShape,
>(
  definition: ConfigDefinition<T, P>,
) => definition;

type ConfigDefinitionExtensionParams<
  T extends Z.ZodRawShape,
  P extends Z.ZodRawShape,
> = {
  createSchema: (baseSchema: Z.ZodObject<P>) => Z.ZodObject<T>;
  createDefaultValue: (
    baseDefaultValue: Z.infer<Z.ZodObject<P>>,
  ) => Z.infer<Z.ZodObject<T>>;
  createUpgrader: (
    config: Z.infer<Z.ZodObject<P>>,
    schema: Z.ZodObject<T>,
    defaultValue: Z.infer<Z.ZodObject<T>>,
  ) => Z.infer<Z.ZodObject<T>>;
};
const extendConfigDefinition = <
  T extends Z.ZodRawShape,
  P extends Z.ZodRawShape,
>(
  definition: ConfigDefinition<P, any>,
  params: ConfigDefinitionExtensionParams<T, P>,
) => {
  const schema = params.createSchema(definition.schema);
  const defaultValue = params.createDefaultValue(definition.defaultValue);
  const upgrader = (config: Z.infer<Z.ZodObject<P>>) =>
    params.createUpgrader(config, schema, defaultValue);

  return createConfigDefinition({
    schema,
    defaultValue,
    parse: (rawConfig) => {
      const safeResult = schema.safeParse(rawConfig);
      if (safeResult.success) {
        return safeResult.data;
      }

      const localeErrors = safeResult.error.errors
        .filter((issue) => issue.message.includes("Invalid locale code"))
        .map((issue) => {
          let unsupportedLocale = "";
          const path = issue.path;

          const config = rawConfig as { locale?: { [key: string]: any } };

          if (config.locale) {
            unsupportedLocale = path.reduce<any>((acc, key) => {
              if (acc && typeof acc === "object" && key in acc) {
                return acc[key];
              }
              return acc;
            }, config.locale);
          }

          return `Unsupported locale: ${unsupportedLocale}`;
        });

      if (localeErrors.length > 0) {
        throw new Error(`\n${localeErrors.join("\n")}`);
      }

      const baseConfig = definition.parse(rawConfig);
      const result = upgrader(baseConfig);
      return result;
    },
  });
};

// any -> v0
const configV0Schema = Z.object({
  version: Z.number().default(0),
});
export const configV0Definition = createConfigDefinition({
  schema: configV0Schema,
  defaultValue: { version: 0 },
  parse: (rawConfig) => {
    return configV0Schema.parse(rawConfig);
  },
});

// v0 -> v1
export const configV1Definition = extendConfigDefinition(configV0Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      locale: localeSchema,
      buckets: Z.record(Z.string(), bucketTypeSchema).default({}).optional(),
    }),
  createDefaultValue: () => ({
    version: 1,
    locale: {
      source: "en" as const,
      targets: ["es" as const],
    },
    buckets: {},
  }),
  createUpgrader: () => ({
    version: 1,
    locale: {
      source: "en" as const,
      targets: ["es" as const],
    },
    buckets: {},
  }),
});

// v1 -> v1.1
export const configV1_1Definition = extendConfigDefinition(configV1Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      buckets: Z.record(
        bucketTypeSchema,
        Z.object({
          include: Z.array(Z.string()).default([]),
          exclude: Z.array(Z.string()).default([]).optional(),
        }),
      ).default({}),
    }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: 1.1,
    buckets: {},
  }),
  createUpgrader: (oldConfig, schema) => {
    const upgradedConfig: Z.infer<typeof schema> = {
      ...oldConfig,
      version: 1.1,
      buckets: {},
    };

    // Transform buckets from v1 to v1.1 format
    if (oldConfig.buckets) {
      for (const [bucketPath, bucketType] of Object.entries(
        oldConfig.buckets,
      )) {
        if (!upgradedConfig.buckets[bucketType]) {
          upgradedConfig.buckets[bucketType] = {
            include: [],
          };
        }
        upgradedConfig.buckets[bucketType]?.include.push(bucketPath);
      }
    }

    return upgradedConfig;
  },
});

// v1.1 -> v1.2
// Changes: Add "extraSource" optional field to the locale node of the config
export const configV1_2Definition = extendConfigDefinition(
  configV1_1Definition,
  {
    createSchema: (baseSchema) =>
      baseSchema.extend({
        locale: localeSchema.extend({
          extraSource: localeCodeSchema.optional(),
        }),
      }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.2,
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.2,
    }),
  },
);

// v1.2 -> v1.3
// Changes: Support both string paths and {path, delimiter} objects in bucket include/exclude arrays
export const bucketItemSchema = Z.object({
  path: Z.string(),
  delimiter: Z.union([
    Z.literal("-"),
    Z.literal("_"),
    Z.literal(null),
  ]).optional(),
});
export type BucketItem = Z.infer<typeof bucketItemSchema>;

// Define a base bucket value schema that can be reused and extended
export const bucketValueSchemaV1_3 = Z.object({
  include: Z.array(Z.union([Z.string(), bucketItemSchema])).default([]),
  exclude: Z.array(Z.union([Z.string(), bucketItemSchema]))
    .default([])
    .optional(),
  injectLocale: Z.array(Z.string()).optional(),
});

export const configV1_3Definition = extendConfigDefinition(
  configV1_2Definition,
  {
    createSchema: (baseSchema) =>
      baseSchema.extend({
        buckets: Z.record(bucketTypeSchema, bucketValueSchemaV1_3).default({}),
      }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.3,
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.3,
    }),
  },
);

const configSchema = "https://lingo.dev/schema/i18n.json";

// v1.3 -> v1.4
// Changes: Add $schema to the config
export const configV1_4Definition = extendConfigDefinition(
  configV1_3Definition,
  {
    createSchema: (baseSchema) =>
      baseSchema.extend({
        $schema: Z.string().default(configSchema),
      }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.4,
      $schema: configSchema,
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.4,
      $schema: configSchema,
    }),
  },
);

// v1.4 -> v1.5
// Changes: add "provider" field to the config
const providerSchema = Z.object({
  id: Z.enum(["openai", "anthropic", "google", "ollama"]),
  model: Z.string(),
  prompt: Z.string(),
  baseUrl: Z.string().optional(),
});
export const configV1_5Definition = extendConfigDefinition(
  configV1_4Definition,
  {
    createSchema: (baseSchema) =>
      baseSchema.extend({
        provider: providerSchema.optional(),
      }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.5,
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.5,
    }),
  },
);

// v1.5 -> v1.6
// Changes: Add "lockedKeys" string array to bucket config
export const bucketValueSchemaV1_6 = bucketValueSchemaV1_3.extend({
  lockedKeys: Z.array(Z.string()).default([]).optional(),
});

export const configV1_6Definition = extendConfigDefinition(
  configV1_5Definition,
  {
    createSchema: (baseSchema) =>
      baseSchema.extend({
        buckets: Z.record(bucketTypeSchema, bucketValueSchemaV1_6).default({}),
      }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.6,
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.6,
    }),
  },
);

// Changes: Add "lockedPatterns" string array of regex patterns to bucket config
export const bucketValueSchemaV1_7 = bucketValueSchemaV1_6.extend({
  lockedPatterns: Z.array(Z.string()).default([]).optional(),
});

export const configV1_7Definition = extendConfigDefinition(
  configV1_6Definition,
  {
    createSchema: (baseSchema) =>
      baseSchema.extend({
        buckets: Z.record(bucketTypeSchema, bucketValueSchemaV1_7).default({}),
      }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.7,
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.7,
    }),
  },
);

// v1.7 -> v1.8
// Changes: Add "ignoredKeys" string array to bucket config
export const bucketValueSchemaV1_8 = bucketValueSchemaV1_7.extend({
  ignoredKeys: Z.array(Z.string()).default([]).optional(),
});

export const configV1_8Definition = extendConfigDefinition(
  configV1_7Definition,
  {
    createSchema: (baseSchema) =>
      baseSchema.extend({
        buckets: Z.record(bucketTypeSchema, bucketValueSchemaV1_8).default({}),
      }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.8,
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.8,
    }),
  },
);

// exports
export const LATEST_CONFIG_DEFINITION = configV1_8Definition;

export type I18nConfig = Z.infer<(typeof LATEST_CONFIG_DEFINITION)["schema"]>;

export function parseI18nConfig(rawConfig: unknown) {
  try {
    const result = LATEST_CONFIG_DEFINITION.parse(rawConfig);
    return result;
  } catch (error: any) {
    throw new Error(`Failed to parse config: ${error.message}`);
  }
}

export const defaultConfig = LATEST_CONFIG_DEFINITION.defaultValue;
