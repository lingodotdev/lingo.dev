import { z } from "zod";

/**
 * Zod schema based on Lingo.dev i18n.json spec v1.10
 * See: https://lingo.dev/en/cli/fundamentals/i18n-json-config
 */

// Bucket item schema - supports both string paths and objects with delimiter
const bucketItemSchema = z.object({
  path: z.string().describe("Path pattern containing a [locale] placeholder."),
  delimiter: z.union([z.literal("-"), z.literal("_"), z.literal(null)])
    .optional()
    .describe("Delimiter that replaces the [locale] placeholder in the path."),
});

// Bucket configuration schema
const bucketSchema = z.object({
  include: z.array(z.union([z.string(), bucketItemSchema]))
    .describe("Glob patterns or bucket items to include for this bucket."),
  exclude: z.array(z.union([z.string(), bucketItemSchema]))
    .optional()
    .describe("Glob patterns or bucket items to exclude from this bucket."),
  lockedKeys: z.array(z.string())
    .optional()
    .describe("Keys that must remain unchanged during translation."),
  lockedPatterns: z.array(z.string())
    .optional()
    .describe("Regex patterns whose matched content should remain locked."),
  ignoredKeys: z.array(z.string())
    .optional()
    .describe("Keys that should be completely ignored by translation processes."),
  injectLocale: z.array(z.string())
    .optional()
    .describe("Keys where the current locale should be injected or removed."),
});

// Locale schema
const localeSchema = z.object({
  source: z.string().describe("Primary source locale code (e.g. 'en', 'en-US')."),
  targets: z.array(z.string()).min(1).describe("List of target locale codes to translate to."),
  extraSource: z.string().optional().describe("Optional extra source locale used as fallback."),
});

// Provider schema
const providerSchema = z.object({
  id: z.enum(["openai", "anthropic", "google", "ollama", "openrouter", "mistral"])
    .describe("Identifier of the translation provider service."),
  model: z.string().describe("Model name to use for translations."),
  prompt: z.string().describe("Prompt template used when requesting translations."),
  baseUrl: z.string().optional().describe("Custom base URL for the provider API."),
  settings: z.object({
    temperature: z.number().min(0).max(2).optional()
      .describe("Controls randomness in model outputs (0=deterministic, 2=very random)."),
  }).optional().describe("Model-specific settings for translation requests."),
});

// Main i18n config schema
export const i18nSchema = z.object({
  $schema: z.string().optional().describe("JSON Schema reference."),
  version: z.union([z.string(), z.number()]).optional().describe("Schema version."),
  locale: localeSchema.describe("Locale configuration block."),
  provider: providerSchema.optional().describe("Translation provider configuration."),
  formatter: z.enum(["prettier", "biome"]).optional()
    .describe("Code formatter to use for all buckets."),
  buckets: z.record(z.string(), bucketSchema).optional()
    .describe("Mapping of bucket names to their configurations."),
});

export type I18nConfig = z.infer<typeof i18nSchema>;
export type BucketItem = z.infer<typeof bucketItemSchema>;
export type BucketConfig = z.infer<typeof bucketSchema>;
export type LocaleConfig = z.infer<typeof localeSchema>;
export type ProviderConfig = z.infer<typeof providerSchema>;
