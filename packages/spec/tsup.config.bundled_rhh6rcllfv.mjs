// tsup.config.ts
import { defineConfig } from "tsup";

// src/json-schema.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { zodToJsonSchema } from "zod-to-json-schema";

// src/config.ts
import Z3 from "zod";

// src/locales.ts
import Z from "zod";
import { isValidLocale } from "@lingo.dev/_locales";
var localeMap = {
  // Urdu (Pakistan)
  ur: ["ur-PK"],
  // Vietnamese (Vietnam)
  vi: ["vi-VN"],
  // Turkish (Turkey)
  tr: ["tr-TR"],
  // Tamil (India)
  ta: [
    "ta-IN",
    // India
    "ta-SG",
    // Singapore
  ],
  // Serbian
  sr: [
    "sr-RS",
    // Serbian (Latin)
    "sr-Latn-RS",
    // Serbian (Latin)
    "sr-Cyrl-RS",
    // Serbian (Cyrillic)
  ],
  // Hungarian (Hungary)
  hu: ["hu-HU"],
  // Hebrew (Israel)
  he: ["he-IL"],
  // Estonian (Estonia)
  et: ["et-EE"],
  // Greek
  el: [
    "el-GR",
    // Greece
    "el-CY",
    // Cyprus
  ],
  // Danish (Denmark)
  da: ["da-DK"],
  // Azerbaijani (Azerbaijan)
  az: ["az-AZ"],
  // Thai (Thailand)
  th: ["th-TH"],
  // Swedish (Sweden)
  sv: ["sv-SE"],
  // English
  en: [
    "en-US",
    // United States
    "en-GB",
    // United Kingdom
    "en-AU",
    // Australia
    "en-CA",
    // Canada
    "en-SG",
    // Singapore
    "en-IE",
    // Ireland
  ],
  // Spanish
  es: [
    "es-ES",
    // Spain
    "es-419",
    // Latin America
    "es-MX",
    // Mexico
    "es-AR",
    // Argentina
  ],
  // French
  fr: [
    "fr-FR",
    // France
    "fr-CA",
    // Canada
    "fr-BE",
    // Belgium
    "fr-LU",
    // Luxembourg
  ],
  // Catalan (Spain)
  ca: ["ca-ES"],
  // Japanese (Japan)
  ja: ["ja-JP"],
  // Kazakh (Kazakhstan)
  kk: ["kk-KZ"],
  // German
  de: [
    "de-DE",
    // Germany
    "de-AT",
    // Austria
    "de-CH",
    // Switzerland
  ],
  // Portuguese
  pt: [
    "pt-PT",
    // Portugal
    "pt-BR",
    // Brazil
  ],
  // Italian
  it: [
    "it-IT",
    // Italy
    "it-CH",
    // Switzerland
  ],
  // Russian
  ru: [
    "ru-RU",
    // Russia
    "ru-BY",
    // Belarus
  ],
  // Ukrainian (Ukraine)
  uk: ["uk-UA"],
  // Belarusian (Belarus)
  be: ["be-BY"],
  // Hindi (India)
  hi: ["hi-IN"],
  // Chinese
  zh: [
    "zh-CN",
    // Simplified Chinese (China)
    "zh-TW",
    // Traditional Chinese (Taiwan)
    "zh-HK",
    // Traditional Chinese (Hong Kong)
    "zh-SG",
    // Simplified Chinese (Singapore)
    "zh-Hans",
    // Simplified Chinese
    "zh-Hant",
    // Traditional Chinese
    "zh-Hant-HK",
    // Traditional Chinese (Hong Kong)
    "zh-Hant-TW",
    // Traditional Chinese (Taiwan)
    "zh-Hant-CN",
    // Traditional Chinese (China)
    "zh-Hans-HK",
    // Simplified Chinese (Hong Kong)
    "zh-Hans-TW",
    // Simplified Chinese (China)
    "zh-Hans-CN",
    // Simplified Chinese (China)
  ],
  // Korean (South Korea)
  ko: ["ko-KR"],
  // Arabic
  ar: [
    "ar-EG",
    // Egypt
    "ar-SA",
    // Saudi Arabia
    "ar-AE",
    // United Arab Emirates
    "ar-MA",
    // Morocco
  ],
  // Bulgarian (Bulgaria)
  bg: ["bg-BG"],
  // Czech (Czech Republic)
  cs: ["cs-CZ"],
  // Welsh (Wales)
  cy: ["cy-GB"],
  // Dutch
  nl: [
    "nl-NL",
    // Netherlands
    "nl-BE",
    // Belgium
  ],
  // Polish (Poland)
  pl: ["pl-PL"],
  // Indonesian (Indonesia)
  id: ["id-ID"],
  is: ["is-IS"],
  // Malay (Malaysia)
  ms: ["ms-MY"],
  // Finnish (Finland)
  fi: ["fi-FI"],
  // Basque (Spain)
  eu: ["eu-ES"],
  // Croatian (Croatia)
  hr: ["hr-HR"],
  // Hebrew (Israel) - alternative code
  iw: ["iw-IL"],
  // Khmer (Cambodia)
  km: ["km-KH"],
  // Latvian (Latvia)
  lv: ["lv-LV"],
  // Lithuanian (Lithuania)
  lt: ["lt-LT"],
  // Norwegian
  no: [
    "no-NO",
    // Norway (legacy)
    "nb-NO",
    // Norwegian Bokmål
    "nn-NO",
    // Norwegian Nynorsk
  ],
  // Romanian (Romania)
  ro: ["ro-RO"],
  // Slovak (Slovakia)
  sk: ["sk-SK"],
  // Swahili
  sw: [
    "sw-TZ",
    // Tanzania
    "sw-KE",
    // Kenya
    "sw-UG",
    // Uganda
    "sw-CD",
    // Democratic Republic of Congo
    "sw-RW",
    // Rwanda
  ],
  // Persian (Iran)
  fa: ["fa-IR"],
  // Filipino (Philippines)
  fil: ["fil-PH"],
  // Punjabi
  pa: [
    "pa-IN",
    // India
    "pa-PK",
    // Pakistan
  ],
  // Bengali
  bn: [
    "bn-BD",
    // Bangladesh
    "bn-IN",
    // India
  ],
  // Irish (Ireland)
  ga: ["ga-IE"],
  // Galician (Spain)
  gl: ["gl-ES"],
  // Maltese (Malta)
  mt: ["mt-MT"],
  // Slovenian (Slovenia)
  sl: ["sl-SI"],
  // Albanian (Albania)
  sq: ["sq-AL"],
  // Bavarian (Germany)
  bar: ["bar-DE"],
  // Neapolitan (Italy)
  nap: ["nap-IT"],
  // Afrikaans (South Africa)
  af: ["af-ZA"],
  // Uzbek (Latin)
  uz: ["uz-Latn"],
  // Somali (Somalia)
  so: ["so-SO"],
  // Tigrinya (Ethiopia)
  ti: ["ti-ET"],
  // Standard Moroccan Tamazight (Morocco)
  zgh: ["zgh-MA"],
  // Tagalog (Philippines)
  tl: ["tl-PH"],
  // Telugu (India)
  te: ["te-IN"],
  // Kinyarwanda (Rwanda)
  rw: ["rw-RW"],
  // Georgian (Georgia)
  ka: ["ka-GE"],
  // Malayalam (India)
  ml: ["ml-IN"],
  // Armenian (Armenia)
  hy: ["hy-AM"],
  // Macedonian (Macedonia)
  mk: ["mk-MK"],
};
var localeCodesShort = Object.keys(localeMap);
var localeCodesFull = Object.values(localeMap).flat();
var localeCodesFullUnderscore = localeCodesFull.map((value) =>
  value.replace("-", "_"),
);
var localeCodesFullExplicitRegion = localeCodesFull.map((value) => {
  const chunks = value.split("-");
  const result = [chunks[0], "-r", chunks.slice(1).join("-")].join("");
  return result;
});
var localeCodes = [
  ...localeCodesShort,
  ...localeCodesFull,
  ...localeCodesFullUnderscore,
  ...localeCodesFullExplicitRegion,
];
var localeCodeSchema = Z.string().refine(
  (value) => {
    const normalized = normalizeLocale(value);
    return isValidLocale(normalized);
  },
  {
    message: "Invalid locale code",
  },
);
function normalizeLocale(locale) {
  return locale.replaceAll("_", "-").replace(/([a-z]{2,3}-)r/, "$1");
}

// src/formats.ts
import Z2 from "zod";
var bucketTypes = [
  "android",
  "csv",
  "ejs",
  "flutter",
  "html",
  "json",
  "json5",
  "jsonc",
  "markdown",
  "markdoc",
  "mdx",
  "xcode-strings",
  "xcode-stringsdict",
  "xcode-xcstrings",
  "xcode-xcstrings-v2",
  "yaml",
  "yaml-root-key",
  "properties",
  "po",
  "xliff",
  "xml",
  "srt",
  "dato",
  "compiler",
  "vtt",
  "php",
  "po",
  "vue-json",
  "typescript",
  "txt",
  "json-dictionary",
];
var bucketTypeSchema = Z2.enum(bucketTypes);

// src/config.ts
var localeSchema = Z3.object({
  source: localeCodeSchema.describe(
    "Primary source locale code of your content (e.g. 'en', 'en-US', 'pt_BR', or 'pt-rBR'). Must be one of the supported locale codes \u2013 either a short ISO-639 language code or a full locale identifier using '-', '_' or Android '-r' notation.",
  ),
  targets: Z3.array(localeCodeSchema).describe(
    "List of target locale codes to translate to.",
  ),
}).describe("Locale configuration block.");
var createConfigDefinition = (definition) => definition;
var extendConfigDefinition = (definition, params) => {
  const schema = params.createSchema(definition.schema);
  const defaultValue = params.createDefaultValue(definition.defaultValue);
  const upgrader = (config) =>
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
          const path2 = issue.path;
          const config = rawConfig;
          if (config.locale) {
            unsupportedLocale = path2.reduce((acc, key) => {
              if (acc && typeof acc === "object" && key in acc) {
                return acc[key];
              }
              return acc;
            }, config.locale);
          }
          return `Unsupported locale: ${unsupportedLocale}`;
        });
      if (localeErrors.length > 0) {
        throw new Error(`
${localeErrors.join("\n")}`);
      }
      const baseConfig = definition.parse(rawConfig);
      const result = upgrader(baseConfig);
      return result;
    },
  });
};
var configV0Schema = Z3.object({
  version: Z3.union([Z3.number(), Z3.string()])
    .default(0)
    .describe("The version number of the schema."),
});
var configV0Definition = createConfigDefinition({
  schema: configV0Schema,
  defaultValue: { version: 0 },
  parse: (rawConfig) => {
    return configV0Schema.parse(rawConfig);
  },
});
var configV1Definition = extendConfigDefinition(configV0Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      locale: localeSchema,
      buckets: Z3.record(Z3.string(), bucketTypeSchema)
        .default({})
        .describe(
          "Mapping of source file paths (glob patterns) to bucket types.",
        )
        .optional(),
    }),
  createDefaultValue: () => ({
    version: 1,
    locale: {
      source: "en",
      targets: ["es"],
    },
    buckets: {},
  }),
  createUpgrader: () => ({
    version: 1,
    locale: {
      source: "en",
      targets: ["es"],
    },
    buckets: {},
  }),
});
var configV1_1Definition = extendConfigDefinition(configV1Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      buckets: Z3.record(
        bucketTypeSchema,
        Z3.object({
          include: Z3.array(Z3.string())
            .default([])
            .describe(
              "File paths or glob patterns to include for this bucket.",
            ),
          exclude: Z3.array(Z3.string())
            .default([])
            .optional()
            .describe(
              "File paths or glob patterns to exclude from this bucket.",
            ),
        }),
      ).default({}),
    }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: 1.1,
    buckets: {},
  }),
  createUpgrader: (oldConfig, schema) => {
    const upgradedConfig = {
      ...oldConfig,
      version: 1.1,
      buckets: {},
    };
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
var configV1_2Definition = extendConfigDefinition(configV1_1Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      locale: localeSchema.extend({
        extraSource: localeCodeSchema
          .optional()
          .describe(
            "Optional extra source locale code used as fallback during translation.",
          ),
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
});
var bucketItemSchema = Z3.object({
  path: Z3.string().describe("Path pattern containing a [locale] placeholder."),
  delimiter: Z3.union([Z3.literal("-"), Z3.literal("_"), Z3.literal(null)])
    .optional()
    .describe(
      "Delimiter that replaces the [locale] placeholder in the path (default: no delimiter).",
    ),
}).describe(
  "Bucket path item. Either a string path or an object specifying path and delimiter.",
);
var bucketValueSchemaV1_3 = Z3.object({
  include: Z3.array(Z3.union([Z3.string(), bucketItemSchema]))
    .default([])
    .describe("Glob patterns or bucket items to include for this bucket."),
  exclude: Z3.array(Z3.union([Z3.string(), bucketItemSchema]))
    .default([])
    .optional()
    .describe("Glob patterns or bucket items to exclude from this bucket."),
  injectLocale: Z3.array(Z3.string())
    .optional()
    .describe(
      "Keys within files where the current locale should be injected or removed.",
    ),
}).describe("Configuration options for a translation bucket.");
var configV1_3Definition = extendConfigDefinition(configV1_2Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      buckets: Z3.record(bucketTypeSchema, bucketValueSchemaV1_3).default({}),
    }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: 1.3,
  }),
  createUpgrader: (oldConfig) => ({
    ...oldConfig,
    version: 1.3,
  }),
});
var configSchema = "https://lingo.dev/schema/i18n.json";
var configV1_4Definition = extendConfigDefinition(configV1_3Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      $schema: Z3.string().default(configSchema),
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
});
var providerSchema = Z3.object({
  id: Z3.enum([
    "openai",
    "anthropic",
    "google",
    "ollama",
    "openrouter",
    "mistral",
  ]).describe("Identifier of the translation provider service."),
  model: Z3.string().describe("Model name to use for translations."),
  prompt: Z3.string().describe(
    "Prompt template used when requesting translations.",
  ),
  baseUrl: Z3.string()
    .optional()
    .describe("Custom base URL for the provider API (optional)."),
}).describe("Configuration for the machine-translation provider.");
var configV1_5Definition = extendConfigDefinition(configV1_4Definition, {
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
});
var bucketValueSchemaV1_6 = bucketValueSchemaV1_3.extend({
  lockedKeys: Z3.array(Z3.string())
    .default([])
    .optional()
    .describe(
      "Keys that must remain unchanged and should never be overwritten by translations.",
    ),
});
var configV1_6Definition = extendConfigDefinition(configV1_5Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      buckets: Z3.record(bucketTypeSchema, bucketValueSchemaV1_6).default({}),
    }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: 1.6,
  }),
  createUpgrader: (oldConfig) => ({
    ...oldConfig,
    version: 1.6,
  }),
});
var bucketValueSchemaV1_7 = bucketValueSchemaV1_6.extend({
  lockedPatterns: Z3.array(Z3.string())
    .default([])
    .optional()
    .describe(
      "Regular expression patterns whose matched content should remain locked during translation.",
    ),
});
var configV1_7Definition = extendConfigDefinition(configV1_6Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      buckets: Z3.record(bucketTypeSchema, bucketValueSchemaV1_7).default({}),
    }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: 1.7,
  }),
  createUpgrader: (oldConfig) => ({
    ...oldConfig,
    version: 1.7,
  }),
});
var bucketValueSchemaV1_8 = bucketValueSchemaV1_7.extend({
  ignoredKeys: Z3.array(Z3.string())
    .default([])
    .optional()
    .describe(
      "Keys that should be completely ignored by translation processes.",
    ),
});
var configV1_8Definition = extendConfigDefinition(configV1_7Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      buckets: Z3.record(bucketTypeSchema, bucketValueSchemaV1_8).default({}),
    }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: 1.8,
  }),
  createUpgrader: (oldConfig) => ({
    ...oldConfig,
    version: 1.8,
  }),
});
var configV1_9Definition = extendConfigDefinition(configV1_8Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      formatter: Z3.enum(["prettier", "biome"])
        .optional()
        .describe(
          "Code formatter to use for all buckets. Defaults to 'prettier' if not specified and a prettier config is found.",
        ),
    }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: 1.9,
  }),
  createUpgrader: (oldConfig) => ({
    ...oldConfig,
    version: 1.9,
  }),
});
var modelSettingsSchema = Z3.object({
  temperature: Z3.number()
    .min(0)
    .max(2)
    .optional()
    .describe(
      "Controls randomness in model outputs (0=deterministic, 2=very random). Some models like GPT-5 require temperature=1.",
    ),
})
  .optional()
  .describe("Model-specific settings for translation requests.");
var providerSchemaV1_10 = Z3.object({
  id: Z3.enum([
    "openai",
    "anthropic",
    "google",
    "ollama",
    "openrouter",
    "mistral",
  ]).describe("Identifier of the translation provider service."),
  model: Z3.string().describe("Model name to use for translations."),
  prompt: Z3.string().describe(
    "Prompt template used when requesting translations.",
  ),
  baseUrl: Z3.string()
    .optional()
    .describe("Custom base URL for the provider API (optional)."),
  settings: modelSettingsSchema,
}).describe("Configuration for the machine-translation provider.");
var configV1_10Definition = extendConfigDefinition(configV1_9Definition, {
  createSchema: (baseSchema) =>
    baseSchema.extend({
      provider: providerSchemaV1_10.optional(),
    }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: "1.10",
  }),
  createUpgrader: (oldConfig) => ({
    ...oldConfig,
    version: "1.10",
  }),
});
var LATEST_CONFIG_DEFINITION = configV1_10Definition;
var defaultConfig = LATEST_CONFIG_DEFINITION.defaultValue;

// src/json-schema.ts
var __injected_import_meta_url__ =
  "file:///C:/Users/TUF%20GAMING/OneDrive/Desktop/lingo.dev%20opensource/lingo.dev/packages/spec/src/json-schema.ts";
function buildJsonSchema() {
  const configSchema2 = zodToJsonSchema(LATEST_CONFIG_DEFINITION.schema);
  const currentDir = path.dirname(fileURLToPath(__injected_import_meta_url__));
  fs.writeFileSync(
    `${currentDir}/../build/i18n.schema.json`,
    JSON.stringify(configSchema2, null, 2),
  );
}

// tsup.config.ts
var tsup_config_default = defineConfig({
  clean: true,
  target: "esnext",
  entry: ["src/index.ts"],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  cjsInterop: true,
  splitting: true,
  outExtension: (ctx) => ({
    js: ctx.format === "cjs" ? ".cjs" : ".mjs",
  }),
  onSuccess: async () => {
    buildJsonSchema();
  },
});
export { tsup_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiLCAic3JjL2pzb24tc2NoZW1hLnRzIiwgInNyYy9jb25maWcudHMiLCAic3JjL2xvY2FsZXMudHMiLCAic3JjL2Zvcm1hdHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcVFVGIEdBTUlOR1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXGxpbmdvLmRldiBvcGVuc291cmNlXFxcXGxpbmdvLmRldlxcXFxwYWNrYWdlc1xcXFxzcGVjXFxcXHRzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXFRVRiBHQU1JTkdcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxsaW5nby5kZXYgb3BlbnNvdXJjZVxcXFxsaW5nby5kZXZcXFxccGFja2FnZXNcXFxcc3BlY1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vQzovVXNlcnMvVFVGJTIwR0FNSU5HL09uZURyaXZlL0Rlc2t0b3AvbGluZ28uZGV2JTIwb3BlbnNvdXJjZS9saW5nby5kZXYvcGFja2FnZXMvc3BlYy90c3VwLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ0c3VwXCI7XHJcbmltcG9ydCBidWlsZEpzb25TY2hlbWEgZnJvbSBcIi4vc3JjL2pzb24tc2NoZW1hXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGNsZWFuOiB0cnVlLFxyXG4gIHRhcmdldDogXCJlc25leHRcIixcclxuICBlbnRyeTogW1wic3JjL2luZGV4LnRzXCJdLFxyXG4gIG91dERpcjogXCJidWlsZFwiLFxyXG4gIGZvcm1hdDogW1wiY2pzXCIsIFwiZXNtXCJdLFxyXG4gIGR0czogdHJ1ZSxcclxuICBjanNJbnRlcm9wOiB0cnVlLFxyXG4gIHNwbGl0dGluZzogdHJ1ZSxcclxuICBvdXRFeHRlbnNpb246IChjdHgpID0+ICh7XHJcbiAgICBqczogY3R4LmZvcm1hdCA9PT0gXCJjanNcIiA/IFwiLmNqc1wiIDogXCIubWpzXCIsXHJcbiAgfSksXHJcbiAgb25TdWNjZXNzOiBhc3luYyAoKSA9PiB7XHJcbiAgICBidWlsZEpzb25TY2hlbWEoKTtcclxuICB9LFxyXG59KTtcclxuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcVFVGIEdBTUlOR1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXGxpbmdvLmRldiBvcGVuc291cmNlXFxcXGxpbmdvLmRldlxcXFxwYWNrYWdlc1xcXFxzcGVjXFxcXHNyY1xcXFxqc29uLXNjaGVtYS50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxUVUYgR0FNSU5HXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcbGluZ28uZGV2IG9wZW5zb3VyY2VcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9UVUYlMjBHQU1JTkcvT25lRHJpdmUvRGVza3RvcC9saW5nby5kZXYlMjBvcGVuc291cmNlL2xpbmdvLmRldi9wYWNrYWdlcy9zcGVjL3NyYy9qc29uLXNjaGVtYS50c1wiO2ltcG9ydCBmcyBmcm9tIFwiZnNcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJ1cmxcIjtcclxuaW1wb3J0IHsgem9kVG9Kc29uU2NoZW1hIH0gZnJvbSBcInpvZC10by1qc29uLXNjaGVtYVwiO1xyXG5pbXBvcnQgeyBMQVRFU1RfQ09ORklHX0RFRklOSVRJT04gfSBmcm9tIFwiLi9jb25maWdcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkSnNvblNjaGVtYSgpIHtcclxuICBjb25zdCBjb25maWdTY2hlbWEgPSB6b2RUb0pzb25TY2hlbWEoTEFURVNUX0NPTkZJR19ERUZJTklUSU9OLnNjaGVtYSk7XHJcbiAgY29uc3QgY3VycmVudERpciA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xyXG4gIGZzLndyaXRlRmlsZVN5bmMoXHJcbiAgICBgJHtjdXJyZW50RGlyfS8uLi9idWlsZC9pMThuLnNjaGVtYS5qc29uYCxcclxuICAgIEpTT04uc3RyaW5naWZ5KGNvbmZpZ1NjaGVtYSwgbnVsbCwgMiksXHJcbiAgKTtcclxufVxyXG4iLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxUVUYgR0FNSU5HXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcbGluZ28uZGV2IG9wZW5zb3VyY2VcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXFxcXGNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxUVUYgR0FNSU5HXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcbGluZ28uZGV2IG9wZW5zb3VyY2VcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9UVUYlMjBHQU1JTkcvT25lRHJpdmUvRGVza3RvcC9saW5nby5kZXYlMjBvcGVuc291cmNlL2xpbmdvLmRldi9wYWNrYWdlcy9zcGVjL3NyYy9jb25maWcudHNcIjtpbXBvcnQgWiBmcm9tIFwiem9kXCI7XHJcbmltcG9ydCB7IGxvY2FsZUNvZGVTY2hlbWEgfSBmcm9tIFwiLi9sb2NhbGVzXCI7XHJcbmltcG9ydCB7IGJ1Y2tldFR5cGVTY2hlbWEgfSBmcm9tIFwiLi9mb3JtYXRzXCI7XHJcblxyXG4vLyBjb21tb25cclxuZXhwb3J0IGNvbnN0IGxvY2FsZVNjaGVtYSA9IFoub2JqZWN0KHtcclxuICBzb3VyY2U6IGxvY2FsZUNvZGVTY2hlbWEuZGVzY3JpYmUoXHJcbiAgICBcIlByaW1hcnkgc291cmNlIGxvY2FsZSBjb2RlIG9mIHlvdXIgY29udGVudCAoZS5nLiAnZW4nLCAnZW4tVVMnLCAncHRfQlInLCBvciAncHQtckJSJykuIE11c3QgYmUgb25lIG9mIHRoZSBzdXBwb3J0ZWQgbG9jYWxlIGNvZGVzIFx1MjAxMyBlaXRoZXIgYSBzaG9ydCBJU08tNjM5IGxhbmd1YWdlIGNvZGUgb3IgYSBmdWxsIGxvY2FsZSBpZGVudGlmaWVyIHVzaW5nICctJywgJ18nIG9yIEFuZHJvaWQgJy1yJyBub3RhdGlvbi5cIixcclxuICApLFxyXG4gIHRhcmdldHM6IFouYXJyYXkobG9jYWxlQ29kZVNjaGVtYSkuZGVzY3JpYmUoXHJcbiAgICBcIkxpc3Qgb2YgdGFyZ2V0IGxvY2FsZSBjb2RlcyB0byB0cmFuc2xhdGUgdG8uXCIsXHJcbiAgKSxcclxufSkuZGVzY3JpYmUoXCJMb2NhbGUgY29uZmlndXJhdGlvbiBibG9jay5cIik7XHJcblxyXG4vLyBmYWN0b3JpZXNcclxudHlwZSBDb25maWdEZWZpbml0aW9uPFxyXG4gIFQgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4gIF9QIGV4dGVuZHMgWi5ab2RSYXdTaGFwZSA9IGFueSxcclxuPiA9IHtcclxuICBzY2hlbWE6IFouWm9kT2JqZWN0PFQ+O1xyXG4gIGRlZmF1bHRWYWx1ZTogWi5pbmZlcjxaLlpvZE9iamVjdDxUPj47XHJcbiAgcGFyc2U6IChyYXdDb25maWc6IHVua25vd24pID0+IFouaW5mZXI8Wi5ab2RPYmplY3Q8VD4+O1xyXG59O1xyXG5jb25zdCBjcmVhdGVDb25maWdEZWZpbml0aW9uID0gPFxyXG4gIFQgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4gIF9QIGV4dGVuZHMgWi5ab2RSYXdTaGFwZSA9IGFueSxcclxuPihcclxuICBkZWZpbml0aW9uOiBDb25maWdEZWZpbml0aW9uPFQsIF9QPixcclxuKSA9PiBkZWZpbml0aW9uO1xyXG5cclxudHlwZSBDb25maWdEZWZpbml0aW9uRXh0ZW5zaW9uUGFyYW1zPFxyXG4gIFQgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4gIFAgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4+ID0ge1xyXG4gIGNyZWF0ZVNjaGVtYTogKGJhc2VTY2hlbWE6IFouWm9kT2JqZWN0PFA+KSA9PiBaLlpvZE9iamVjdDxUPjtcclxuICBjcmVhdGVEZWZhdWx0VmFsdWU6IChcclxuICAgIGJhc2VEZWZhdWx0VmFsdWU6IFouaW5mZXI8Wi5ab2RPYmplY3Q8UD4+LFxyXG4gICkgPT4gWi5pbmZlcjxaLlpvZE9iamVjdDxUPj47XHJcbiAgY3JlYXRlVXBncmFkZXI6IChcclxuICAgIGNvbmZpZzogWi5pbmZlcjxaLlpvZE9iamVjdDxQPj4sXHJcbiAgICBzY2hlbWE6IFouWm9kT2JqZWN0PFQ+LFxyXG4gICAgZGVmYXVsdFZhbHVlOiBaLmluZmVyPFouWm9kT2JqZWN0PFQ+PixcclxuICApID0+IFouaW5mZXI8Wi5ab2RPYmplY3Q8VD4+O1xyXG59O1xyXG5jb25zdCBleHRlbmRDb25maWdEZWZpbml0aW9uID0gPFxyXG4gIFQgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4gIFAgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4+KFxyXG4gIGRlZmluaXRpb246IENvbmZpZ0RlZmluaXRpb248UCwgYW55PixcclxuICBwYXJhbXM6IENvbmZpZ0RlZmluaXRpb25FeHRlbnNpb25QYXJhbXM8VCwgUD4sXHJcbikgPT4ge1xyXG4gIGNvbnN0IHNjaGVtYSA9IHBhcmFtcy5jcmVhdGVTY2hlbWEoZGVmaW5pdGlvbi5zY2hlbWEpO1xyXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IHBhcmFtcy5jcmVhdGVEZWZhdWx0VmFsdWUoZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpO1xyXG4gIGNvbnN0IHVwZ3JhZGVyID0gKGNvbmZpZzogWi5pbmZlcjxaLlpvZE9iamVjdDxQPj4pID0+XHJcbiAgICBwYXJhbXMuY3JlYXRlVXBncmFkZXIoY29uZmlnLCBzY2hlbWEsIGRlZmF1bHRWYWx1ZSk7XHJcblxyXG4gIHJldHVybiBjcmVhdGVDb25maWdEZWZpbml0aW9uKHtcclxuICAgIHNjaGVtYSxcclxuICAgIGRlZmF1bHRWYWx1ZSxcclxuICAgIHBhcnNlOiAocmF3Q29uZmlnKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNhZmVSZXN1bHQgPSBzY2hlbWEuc2FmZVBhcnNlKHJhd0NvbmZpZyk7XHJcbiAgICAgIGlmIChzYWZlUmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICByZXR1cm4gc2FmZVJlc3VsdC5kYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBsb2NhbGVFcnJvcnMgPSBzYWZlUmVzdWx0LmVycm9yLmVycm9yc1xyXG4gICAgICAgIC5maWx0ZXIoKGlzc3VlKSA9PiBpc3N1ZS5tZXNzYWdlLmluY2x1ZGVzKFwiSW52YWxpZCBsb2NhbGUgY29kZVwiKSlcclxuICAgICAgICAubWFwKChpc3N1ZSkgPT4ge1xyXG4gICAgICAgICAgbGV0IHVuc3VwcG9ydGVkTG9jYWxlID0gXCJcIjtcclxuICAgICAgICAgIGNvbnN0IHBhdGggPSBpc3N1ZS5wYXRoO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHJhd0NvbmZpZyBhcyB7IGxvY2FsZT86IHsgW2tleTogc3RyaW5nXTogYW55IH0gfTtcclxuXHJcbiAgICAgICAgICBpZiAoY29uZmlnLmxvY2FsZSkge1xyXG4gICAgICAgICAgICB1bnN1cHBvcnRlZExvY2FsZSA9IHBhdGgucmVkdWNlPGFueT4oKGFjYywga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGFjYyAmJiB0eXBlb2YgYWNjID09PSBcIm9iamVjdFwiICYmIGtleSBpbiBhY2MpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY2Nba2V5XTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICAgICAgfSwgY29uZmlnLmxvY2FsZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIGBVbnN1cHBvcnRlZCBsb2NhbGU6ICR7dW5zdXBwb3J0ZWRMb2NhbGV9YDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChsb2NhbGVFcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXFxuJHtsb2NhbGVFcnJvcnMuam9pbihcIlxcblwiKX1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgYmFzZUNvbmZpZyA9IGRlZmluaXRpb24ucGFyc2UocmF3Q29uZmlnKTtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gdXBncmFkZXIoYmFzZUNvbmZpZyk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8gYW55IC0+IHYwXHJcbmNvbnN0IGNvbmZpZ1YwU2NoZW1hID0gWi5vYmplY3Qoe1xyXG4gIHZlcnNpb246IFoudW5pb24oW1oubnVtYmVyKCksIFouc3RyaW5nKCldKVxyXG4gICAgLmRlZmF1bHQoMClcclxuICAgIC5kZXNjcmliZShcIlRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGUgc2NoZW1hLlwiKSxcclxufSk7XHJcbmV4cG9ydCBjb25zdCBjb25maWdWMERlZmluaXRpb24gPSBjcmVhdGVDb25maWdEZWZpbml0aW9uKHtcclxuICBzY2hlbWE6IGNvbmZpZ1YwU2NoZW1hLFxyXG4gIGRlZmF1bHRWYWx1ZTogeyB2ZXJzaW9uOiAwIH0sXHJcbiAgcGFyc2U6IChyYXdDb25maWcpID0+IHtcclxuICAgIHJldHVybiBjb25maWdWMFNjaGVtYS5wYXJzZShyYXdDb25maWcpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gdjAgLT4gdjFcclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxRGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oY29uZmlnVjBEZWZpbml0aW9uLCB7XHJcbiAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgIGJhc2VTY2hlbWEuZXh0ZW5kKHtcclxuICAgICAgbG9jYWxlOiBsb2NhbGVTY2hlbWEsXHJcbiAgICAgIGJ1Y2tldHM6IFoucmVjb3JkKFouc3RyaW5nKCksIGJ1Y2tldFR5cGVTY2hlbWEpXHJcbiAgICAgICAgLmRlZmF1bHQoe30pXHJcbiAgICAgICAgLmRlc2NyaWJlKFxyXG4gICAgICAgICAgXCJNYXBwaW5nIG9mIHNvdXJjZSBmaWxlIHBhdGhzIChnbG9iIHBhdHRlcm5zKSB0byBidWNrZXQgdHlwZXMuXCIsXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5vcHRpb25hbCgpLFxyXG4gICAgfSksXHJcbiAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoKSA9PiAoe1xyXG4gICAgdmVyc2lvbjogMSxcclxuICAgIGxvY2FsZToge1xyXG4gICAgICBzb3VyY2U6IFwiZW5cIiBhcyBjb25zdCxcclxuICAgICAgdGFyZ2V0czogW1wiZXNcIiBhcyBjb25zdF0sXHJcbiAgICB9LFxyXG4gICAgYnVja2V0czoge30sXHJcbiAgfSksXHJcbiAgY3JlYXRlVXBncmFkZXI6ICgpID0+ICh7XHJcbiAgICB2ZXJzaW9uOiAxLFxyXG4gICAgbG9jYWxlOiB7XHJcbiAgICAgIHNvdXJjZTogXCJlblwiIGFzIGNvbnN0LFxyXG4gICAgICB0YXJnZXRzOiBbXCJlc1wiIGFzIGNvbnN0XSxcclxuICAgIH0sXHJcbiAgICBidWNrZXRzOiB7fSxcclxuICB9KSxcclxufSk7XHJcblxyXG4vLyB2MSAtPiB2MS4xXHJcbmV4cG9ydCBjb25zdCBjb25maWdWMV8xRGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oY29uZmlnVjFEZWZpbml0aW9uLCB7XHJcbiAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgIGJhc2VTY2hlbWEuZXh0ZW5kKHtcclxuICAgICAgYnVja2V0czogWi5yZWNvcmQoXHJcbiAgICAgICAgYnVja2V0VHlwZVNjaGVtYSxcclxuICAgICAgICBaLm9iamVjdCh7XHJcbiAgICAgICAgICBpbmNsdWRlOiBaLmFycmF5KFouc3RyaW5nKCkpXHJcbiAgICAgICAgICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgICAgICAgICAuZGVzY3JpYmUoXHJcbiAgICAgICAgICAgICAgXCJGaWxlIHBhdGhzIG9yIGdsb2IgcGF0dGVybnMgdG8gaW5jbHVkZSBmb3IgdGhpcyBidWNrZXQuXCIsXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICBleGNsdWRlOiBaLmFycmF5KFouc3RyaW5nKCkpXHJcbiAgICAgICAgICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgICAgICAuZGVzY3JpYmUoXHJcbiAgICAgICAgICAgICAgXCJGaWxlIHBhdGhzIG9yIGdsb2IgcGF0dGVybnMgdG8gZXhjbHVkZSBmcm9tIHRoaXMgYnVja2V0LlwiLFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICApLmRlZmF1bHQoe30pLFxyXG4gICAgfSksXHJcbiAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgIC4uLmJhc2VEZWZhdWx0VmFsdWUsXHJcbiAgICB2ZXJzaW9uOiAxLjEsXHJcbiAgICBidWNrZXRzOiB7fSxcclxuICB9KSxcclxuICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZywgc2NoZW1hKSA9PiB7XHJcbiAgICBjb25zdCB1cGdyYWRlZENvbmZpZzogWi5pbmZlcjx0eXBlb2Ygc2NoZW1hPiA9IHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjEsXHJcbiAgICAgIGJ1Y2tldHM6IHt9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBUcmFuc2Zvcm0gYnVja2V0cyBmcm9tIHYxIHRvIHYxLjEgZm9ybWF0XHJcbiAgICBpZiAob2xkQ29uZmlnLmJ1Y2tldHMpIHtcclxuICAgICAgZm9yIChjb25zdCBbYnVja2V0UGF0aCwgYnVja2V0VHlwZV0gb2YgT2JqZWN0LmVudHJpZXMoXHJcbiAgICAgICAgb2xkQ29uZmlnLmJ1Y2tldHMsXHJcbiAgICAgICkpIHtcclxuICAgICAgICBpZiAoIXVwZ3JhZGVkQ29uZmlnLmJ1Y2tldHNbYnVja2V0VHlwZV0pIHtcclxuICAgICAgICAgIHVwZ3JhZGVkQ29uZmlnLmJ1Y2tldHNbYnVja2V0VHlwZV0gPSB7XHJcbiAgICAgICAgICAgIGluY2x1ZGU6IFtdLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBncmFkZWRDb25maWcuYnVja2V0c1tidWNrZXRUeXBlXT8uaW5jbHVkZS5wdXNoKGJ1Y2tldFBhdGgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVwZ3JhZGVkQ29uZmlnO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gdjEuMSAtPiB2MS4yXHJcbi8vIENoYW5nZXM6IEFkZCBcImV4dHJhU291cmNlXCIgb3B0aW9uYWwgZmllbGQgdG8gdGhlIGxvY2FsZSBub2RlIG9mIHRoZSBjb25maWdcclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxXzJEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV8xRGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgbG9jYWxlOiBsb2NhbGVTY2hlbWEuZXh0ZW5kKHtcclxuICAgICAgICAgIGV4dHJhU291cmNlOiBsb2NhbGVDb2RlU2NoZW1hXHJcbiAgICAgICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgICAgIC5kZXNjcmliZShcclxuICAgICAgICAgICAgICBcIk9wdGlvbmFsIGV4dHJhIHNvdXJjZSBsb2NhbGUgY29kZSB1c2VkIGFzIGZhbGxiYWNrIGR1cmluZyB0cmFuc2xhdGlvbi5cIixcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICB9KSxcclxuICAgICAgfSksXHJcbiAgICBjcmVhdGVEZWZhdWx0VmFsdWU6IChiYXNlRGVmYXVsdFZhbHVlKSA9PiAoe1xyXG4gICAgICAuLi5iYXNlRGVmYXVsdFZhbHVlLFxyXG4gICAgICB2ZXJzaW9uOiAxLjIsXHJcbiAgICB9KSxcclxuICAgIGNyZWF0ZVVwZ3JhZGVyOiAob2xkQ29uZmlnKSA9PiAoe1xyXG4gICAgICAuLi5vbGRDb25maWcsXHJcbiAgICAgIHZlcnNpb246IDEuMixcclxuICAgIH0pLFxyXG4gIH0sXHJcbik7XHJcblxyXG4vLyB2MS4yIC0+IHYxLjNcclxuLy8gQ2hhbmdlczogU3VwcG9ydCBib3RoIHN0cmluZyBwYXRocyBhbmQge3BhdGgsIGRlbGltaXRlcn0gb2JqZWN0cyBpbiBidWNrZXQgaW5jbHVkZS9leGNsdWRlIGFycmF5c1xyXG5leHBvcnQgY29uc3QgYnVja2V0SXRlbVNjaGVtYSA9IFoub2JqZWN0KHtcclxuICBwYXRoOiBaLnN0cmluZygpLmRlc2NyaWJlKFwiUGF0aCBwYXR0ZXJuIGNvbnRhaW5pbmcgYSBbbG9jYWxlXSBwbGFjZWhvbGRlci5cIiksXHJcbiAgZGVsaW1pdGVyOiBaLnVuaW9uKFtaLmxpdGVyYWwoXCItXCIpLCBaLmxpdGVyYWwoXCJfXCIpLCBaLmxpdGVyYWwobnVsbCldKVxyXG4gICAgLm9wdGlvbmFsKClcclxuICAgIC5kZXNjcmliZShcclxuICAgICAgXCJEZWxpbWl0ZXIgdGhhdCByZXBsYWNlcyB0aGUgW2xvY2FsZV0gcGxhY2Vob2xkZXIgaW4gdGhlIHBhdGggKGRlZmF1bHQ6IG5vIGRlbGltaXRlcikuXCIsXHJcbiAgICApLFxyXG59KS5kZXNjcmliZShcclxuICBcIkJ1Y2tldCBwYXRoIGl0ZW0uIEVpdGhlciBhIHN0cmluZyBwYXRoIG9yIGFuIG9iamVjdCBzcGVjaWZ5aW5nIHBhdGggYW5kIGRlbGltaXRlci5cIixcclxuKTtcclxuZXhwb3J0IHR5cGUgQnVja2V0SXRlbSA9IFouaW5mZXI8dHlwZW9mIGJ1Y2tldEl0ZW1TY2hlbWE+O1xyXG5cclxuLy8gRGVmaW5lIGEgYmFzZSBidWNrZXQgdmFsdWUgc2NoZW1hIHRoYXQgY2FuIGJlIHJldXNlZCBhbmQgZXh0ZW5kZWRcclxuZXhwb3J0IGNvbnN0IGJ1Y2tldFZhbHVlU2NoZW1hVjFfMyA9IFoub2JqZWN0KHtcclxuICBpbmNsdWRlOiBaLmFycmF5KFoudW5pb24oW1ouc3RyaW5nKCksIGJ1Y2tldEl0ZW1TY2hlbWFdKSlcclxuICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgLmRlc2NyaWJlKFwiR2xvYiBwYXR0ZXJucyBvciBidWNrZXQgaXRlbXMgdG8gaW5jbHVkZSBmb3IgdGhpcyBidWNrZXQuXCIpLFxyXG4gIGV4Y2x1ZGU6IFouYXJyYXkoWi51bmlvbihbWi5zdHJpbmcoKSwgYnVja2V0SXRlbVNjaGVtYV0pKVxyXG4gICAgLmRlZmF1bHQoW10pXHJcbiAgICAub3B0aW9uYWwoKVxyXG4gICAgLmRlc2NyaWJlKFwiR2xvYiBwYXR0ZXJucyBvciBidWNrZXQgaXRlbXMgdG8gZXhjbHVkZSBmcm9tIHRoaXMgYnVja2V0LlwiKSxcclxuICBpbmplY3RMb2NhbGU6IFouYXJyYXkoWi5zdHJpbmcoKSlcclxuICAgIC5vcHRpb25hbCgpXHJcbiAgICAuZGVzY3JpYmUoXHJcbiAgICAgIFwiS2V5cyB3aXRoaW4gZmlsZXMgd2hlcmUgdGhlIGN1cnJlbnQgbG9jYWxlIHNob3VsZCBiZSBpbmplY3RlZCBvciByZW1vdmVkLlwiLFxyXG4gICAgKSxcclxufSkuZGVzY3JpYmUoXCJDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIGEgdHJhbnNsYXRpb24gYnVja2V0LlwiKTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWdWMV8zRGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oXHJcbiAgY29uZmlnVjFfMkRlZmluaXRpb24sXHJcbiAge1xyXG4gICAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgICAgYmFzZVNjaGVtYS5leHRlbmQoe1xyXG4gICAgICAgIGJ1Y2tldHM6IFoucmVjb3JkKGJ1Y2tldFR5cGVTY2hlbWEsIGJ1Y2tldFZhbHVlU2NoZW1hVjFfMykuZGVmYXVsdCh7fSksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS4zLFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjMsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuY29uc3QgY29uZmlnU2NoZW1hID0gXCJodHRwczovL2xpbmdvLmRldi9zY2hlbWEvaTE4bi5qc29uXCI7XHJcblxyXG4vLyB2MS4zIC0+IHYxLjRcclxuLy8gQ2hhbmdlczogQWRkICRzY2hlbWEgdG8gdGhlIGNvbmZpZ1xyXG5leHBvcnQgY29uc3QgY29uZmlnVjFfNERlZmluaXRpb24gPSBleHRlbmRDb25maWdEZWZpbml0aW9uKFxyXG4gIGNvbmZpZ1YxXzNEZWZpbml0aW9uLFxyXG4gIHtcclxuICAgIGNyZWF0ZVNjaGVtYTogKGJhc2VTY2hlbWEpID0+XHJcbiAgICAgIGJhc2VTY2hlbWEuZXh0ZW5kKHtcclxuICAgICAgICAkc2NoZW1hOiBaLnN0cmluZygpLmRlZmF1bHQoY29uZmlnU2NoZW1hKSxcclxuICAgICAgfSksXHJcbiAgICBjcmVhdGVEZWZhdWx0VmFsdWU6IChiYXNlRGVmYXVsdFZhbHVlKSA9PiAoe1xyXG4gICAgICAuLi5iYXNlRGVmYXVsdFZhbHVlLFxyXG4gICAgICB2ZXJzaW9uOiAxLjQsXHJcbiAgICAgICRzY2hlbWE6IGNvbmZpZ1NjaGVtYSxcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlVXBncmFkZXI6IChvbGRDb25maWcpID0+ICh7XHJcbiAgICAgIC4uLm9sZENvbmZpZyxcclxuICAgICAgdmVyc2lvbjogMS40LFxyXG4gICAgICAkc2NoZW1hOiBjb25maWdTY2hlbWEsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gdjEuNCAtPiB2MS41XHJcbi8vIENoYW5nZXM6IGFkZCBcInByb3ZpZGVyXCIgZmllbGQgdG8gdGhlIGNvbmZpZ1xyXG5jb25zdCBwcm92aWRlclNjaGVtYSA9IFoub2JqZWN0KHtcclxuICBpZDogWi5lbnVtKFtcclxuICAgIFwib3BlbmFpXCIsXHJcbiAgICBcImFudGhyb3BpY1wiLFxyXG4gICAgXCJnb29nbGVcIixcclxuICAgIFwib2xsYW1hXCIsXHJcbiAgICBcIm9wZW5yb3V0ZXJcIixcclxuICAgIFwibWlzdHJhbFwiLFxyXG4gIF0pLmRlc2NyaWJlKFwiSWRlbnRpZmllciBvZiB0aGUgdHJhbnNsYXRpb24gcHJvdmlkZXIgc2VydmljZS5cIiksXHJcbiAgbW9kZWw6IFouc3RyaW5nKCkuZGVzY3JpYmUoXCJNb2RlbCBuYW1lIHRvIHVzZSBmb3IgdHJhbnNsYXRpb25zLlwiKSxcclxuICBwcm9tcHQ6IFouc3RyaW5nKCkuZGVzY3JpYmUoXHJcbiAgICBcIlByb21wdCB0ZW1wbGF0ZSB1c2VkIHdoZW4gcmVxdWVzdGluZyB0cmFuc2xhdGlvbnMuXCIsXHJcbiAgKSxcclxuICBiYXNlVXJsOiBaLnN0cmluZygpXHJcbiAgICAub3B0aW9uYWwoKVxyXG4gICAgLmRlc2NyaWJlKFwiQ3VzdG9tIGJhc2UgVVJMIGZvciB0aGUgcHJvdmlkZXIgQVBJIChvcHRpb25hbCkuXCIpLFxyXG59KS5kZXNjcmliZShcIkNvbmZpZ3VyYXRpb24gZm9yIHRoZSBtYWNoaW5lLXRyYW5zbGF0aW9uIHByb3ZpZGVyLlwiKTtcclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxXzVEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV80RGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgcHJvdmlkZXI6IHByb3ZpZGVyU2NoZW1hLm9wdGlvbmFsKCksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS41LFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjUsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gdjEuNSAtPiB2MS42XHJcbi8vIENoYW5nZXM6IEFkZCBcImxvY2tlZEtleXNcIiBzdHJpbmcgYXJyYXkgdG8gYnVja2V0IGNvbmZpZ1xyXG5leHBvcnQgY29uc3QgYnVja2V0VmFsdWVTY2hlbWFWMV82ID0gYnVja2V0VmFsdWVTY2hlbWFWMV8zLmV4dGVuZCh7XHJcbiAgbG9ja2VkS2V5czogWi5hcnJheShaLnN0cmluZygpKVxyXG4gICAgLmRlZmF1bHQoW10pXHJcbiAgICAub3B0aW9uYWwoKVxyXG4gICAgLmRlc2NyaWJlKFxyXG4gICAgICBcIktleXMgdGhhdCBtdXN0IHJlbWFpbiB1bmNoYW5nZWQgYW5kIHNob3VsZCBuZXZlciBiZSBvdmVyd3JpdHRlbiBieSB0cmFuc2xhdGlvbnMuXCIsXHJcbiAgICApLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWdWMV82RGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oXHJcbiAgY29uZmlnVjFfNURlZmluaXRpb24sXHJcbiAge1xyXG4gICAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgICAgYmFzZVNjaGVtYS5leHRlbmQoe1xyXG4gICAgICAgIGJ1Y2tldHM6IFoucmVjb3JkKGJ1Y2tldFR5cGVTY2hlbWEsIGJ1Y2tldFZhbHVlU2NoZW1hVjFfNikuZGVmYXVsdCh7fSksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS42LFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjYsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gQ2hhbmdlczogQWRkIFwibG9ja2VkUGF0dGVybnNcIiBzdHJpbmcgYXJyYXkgb2YgcmVnZXggcGF0dGVybnMgdG8gYnVja2V0IGNvbmZpZ1xyXG5leHBvcnQgY29uc3QgYnVja2V0VmFsdWVTY2hlbWFWMV83ID0gYnVja2V0VmFsdWVTY2hlbWFWMV82LmV4dGVuZCh7XHJcbiAgbG9ja2VkUGF0dGVybnM6IFouYXJyYXkoWi5zdHJpbmcoKSlcclxuICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgLm9wdGlvbmFsKClcclxuICAgIC5kZXNjcmliZShcclxuICAgICAgXCJSZWd1bGFyIGV4cHJlc3Npb24gcGF0dGVybnMgd2hvc2UgbWF0Y2hlZCBjb250ZW50IHNob3VsZCByZW1haW4gbG9ja2VkIGR1cmluZyB0cmFuc2xhdGlvbi5cIixcclxuICAgICksXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxXzdEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV82RGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgYnVja2V0czogWi5yZWNvcmQoYnVja2V0VHlwZVNjaGVtYSwgYnVja2V0VmFsdWVTY2hlbWFWMV83KS5kZWZhdWx0KHt9KSxcclxuICAgICAgfSksXHJcbiAgICBjcmVhdGVEZWZhdWx0VmFsdWU6IChiYXNlRGVmYXVsdFZhbHVlKSA9PiAoe1xyXG4gICAgICAuLi5iYXNlRGVmYXVsdFZhbHVlLFxyXG4gICAgICB2ZXJzaW9uOiAxLjcsXHJcbiAgICB9KSxcclxuICAgIGNyZWF0ZVVwZ3JhZGVyOiAob2xkQ29uZmlnKSA9PiAoe1xyXG4gICAgICAuLi5vbGRDb25maWcsXHJcbiAgICAgIHZlcnNpb246IDEuNyxcclxuICAgIH0pLFxyXG4gIH0sXHJcbik7XHJcblxyXG4vLyB2MS43IC0+IHYxLjhcclxuLy8gQ2hhbmdlczogQWRkIFwiaWdub3JlZEtleXNcIiBzdHJpbmcgYXJyYXkgdG8gYnVja2V0IGNvbmZpZ1xyXG5leHBvcnQgY29uc3QgYnVja2V0VmFsdWVTY2hlbWFWMV84ID0gYnVja2V0VmFsdWVTY2hlbWFWMV83LmV4dGVuZCh7XHJcbiAgaWdub3JlZEtleXM6IFouYXJyYXkoWi5zdHJpbmcoKSlcclxuICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgLm9wdGlvbmFsKClcclxuICAgIC5kZXNjcmliZShcclxuICAgICAgXCJLZXlzIHRoYXQgc2hvdWxkIGJlIGNvbXBsZXRlbHkgaWdub3JlZCBieSB0cmFuc2xhdGlvbiBwcm9jZXNzZXMuXCIsXHJcbiAgICApLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWdWMV84RGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oXHJcbiAgY29uZmlnVjFfN0RlZmluaXRpb24sXHJcbiAge1xyXG4gICAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgICAgYmFzZVNjaGVtYS5leHRlbmQoe1xyXG4gICAgICAgIGJ1Y2tldHM6IFoucmVjb3JkKGJ1Y2tldFR5cGVTY2hlbWEsIGJ1Y2tldFZhbHVlU2NoZW1hVjFfOCkuZGVmYXVsdCh7fSksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS44LFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjgsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gdjEuOCAtPiB2MS45XHJcbi8vIENoYW5nZXM6IEFkZCBcImZvcm1hdHRlclwiIGZpZWxkIHRvIHRvcC1sZXZlbCBjb25maWdcclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxXzlEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV84RGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgZm9ybWF0dGVyOiBaLmVudW0oW1wicHJldHRpZXJcIiwgXCJiaW9tZVwiXSlcclxuICAgICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgICAuZGVzY3JpYmUoXHJcbiAgICAgICAgICAgIFwiQ29kZSBmb3JtYXR0ZXIgdG8gdXNlIGZvciBhbGwgYnVja2V0cy4gRGVmYXVsdHMgdG8gJ3ByZXR0aWVyJyBpZiBub3Qgc3BlY2lmaWVkIGFuZCBhIHByZXR0aWVyIGNvbmZpZyBpcyBmb3VuZC5cIixcclxuICAgICAgICAgICksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS45LFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjksXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gdjEuOSAtPiB2MS4xMFxyXG4vLyBDaGFuZ2VzOiBBZGQgXCJzZXR0aW5nc1wiIGZpZWxkIHRvIHByb3ZpZGVyIGNvbmZpZyBmb3IgbW9kZWwtc3BlY2lmaWMgcGFyYW1ldGVyc1xyXG5jb25zdCBtb2RlbFNldHRpbmdzU2NoZW1hID0gWi5vYmplY3Qoe1xyXG4gIHRlbXBlcmF0dXJlOiBaLm51bWJlcigpXHJcbiAgICAubWluKDApXHJcbiAgICAubWF4KDIpXHJcbiAgICAub3B0aW9uYWwoKVxyXG4gICAgLmRlc2NyaWJlKFxyXG4gICAgICBcIkNvbnRyb2xzIHJhbmRvbW5lc3MgaW4gbW9kZWwgb3V0cHV0cyAoMD1kZXRlcm1pbmlzdGljLCAyPXZlcnkgcmFuZG9tKS4gU29tZSBtb2RlbHMgbGlrZSBHUFQtNSByZXF1aXJlIHRlbXBlcmF0dXJlPTEuXCIsXHJcbiAgICApLFxyXG59KVxyXG4gIC5vcHRpb25hbCgpXHJcbiAgLmRlc2NyaWJlKFwiTW9kZWwtc3BlY2lmaWMgc2V0dGluZ3MgZm9yIHRyYW5zbGF0aW9uIHJlcXVlc3RzLlwiKTtcclxuXHJcbmNvbnN0IHByb3ZpZGVyU2NoZW1hVjFfMTAgPSBaLm9iamVjdCh7XHJcbiAgaWQ6IFouZW51bShbXHJcbiAgICBcIm9wZW5haVwiLFxyXG4gICAgXCJhbnRocm9waWNcIixcclxuICAgIFwiZ29vZ2xlXCIsXHJcbiAgICBcIm9sbGFtYVwiLFxyXG4gICAgXCJvcGVucm91dGVyXCIsXHJcbiAgICBcIm1pc3RyYWxcIixcclxuICBdKS5kZXNjcmliZShcIklkZW50aWZpZXIgb2YgdGhlIHRyYW5zbGF0aW9uIHByb3ZpZGVyIHNlcnZpY2UuXCIpLFxyXG4gIG1vZGVsOiBaLnN0cmluZygpLmRlc2NyaWJlKFwiTW9kZWwgbmFtZSB0byB1c2UgZm9yIHRyYW5zbGF0aW9ucy5cIiksXHJcbiAgcHJvbXB0OiBaLnN0cmluZygpLmRlc2NyaWJlKFxyXG4gICAgXCJQcm9tcHQgdGVtcGxhdGUgdXNlZCB3aGVuIHJlcXVlc3RpbmcgdHJhbnNsYXRpb25zLlwiLFxyXG4gICksXHJcbiAgYmFzZVVybDogWi5zdHJpbmcoKVxyXG4gICAgLm9wdGlvbmFsKClcclxuICAgIC5kZXNjcmliZShcIkN1c3RvbSBiYXNlIFVSTCBmb3IgdGhlIHByb3ZpZGVyIEFQSSAob3B0aW9uYWwpLlwiKSxcclxuICBzZXR0aW5nczogbW9kZWxTZXR0aW5nc1NjaGVtYSxcclxufSkuZGVzY3JpYmUoXCJDb25maWd1cmF0aW9uIGZvciB0aGUgbWFjaGluZS10cmFuc2xhdGlvbiBwcm92aWRlci5cIik7XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnVjFfMTBEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV85RGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgcHJvdmlkZXI6IHByb3ZpZGVyU2NoZW1hVjFfMTAub3B0aW9uYWwoKSxcclxuICAgICAgfSksXHJcbiAgICBjcmVhdGVEZWZhdWx0VmFsdWU6IChiYXNlRGVmYXVsdFZhbHVlKSA9PiAoe1xyXG4gICAgICAuLi5iYXNlRGVmYXVsdFZhbHVlLFxyXG4gICAgICB2ZXJzaW9uOiBcIjEuMTBcIixcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlVXBncmFkZXI6IChvbGRDb25maWcpID0+ICh7XHJcbiAgICAgIC4uLm9sZENvbmZpZyxcclxuICAgICAgdmVyc2lvbjogXCIxLjEwXCIsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gZXhwb3J0c1xyXG5leHBvcnQgY29uc3QgTEFURVNUX0NPTkZJR19ERUZJTklUSU9OID0gY29uZmlnVjFfMTBEZWZpbml0aW9uO1xyXG5cclxuZXhwb3J0IHR5cGUgSTE4bkNvbmZpZyA9IFouaW5mZXI8KHR5cGVvZiBMQVRFU1RfQ09ORklHX0RFRklOSVRJT04pW1wic2NoZW1hXCJdPjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUkxOG5Db25maWcocmF3Q29uZmlnOiB1bmtub3duKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IExBVEVTVF9DT05GSUdfREVGSU5JVElPTi5wYXJzZShyYXdDb25maWcpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBwYXJzZSBjb25maWc6ICR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0Q29uZmlnID0gTEFURVNUX0NPTkZJR19ERUZJTklUSU9OLmRlZmF1bHRWYWx1ZTtcclxuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcVFVGIEdBTUlOR1xcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXGxpbmdvLmRldiBvcGVuc291cmNlXFxcXGxpbmdvLmRldlxcXFxwYWNrYWdlc1xcXFxzcGVjXFxcXHNyY1xcXFxsb2NhbGVzLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXFRVRiBHQU1JTkdcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxsaW5nby5kZXYgb3BlbnNvdXJjZVxcXFxsaW5nby5kZXZcXFxccGFja2FnZXNcXFxcc3BlY1xcXFxzcmNcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL1RVRiUyMEdBTUlORy9PbmVEcml2ZS9EZXNrdG9wL2xpbmdvLmRldiUyMG9wZW5zb3VyY2UvbGluZ28uZGV2L3BhY2thZ2VzL3NwZWMvc3JjL2xvY2FsZXMudHNcIjtpbXBvcnQgWiBmcm9tIFwiem9kXCI7XHJcbmltcG9ydCB7IGlzVmFsaWRMb2NhbGUgfSBmcm9tIFwiQGxpbmdvLmRldi9fbG9jYWxlc1wiO1xyXG5cclxuY29uc3QgbG9jYWxlTWFwID0ge1xyXG4gIC8vIFVyZHUgKFBha2lzdGFuKVxyXG4gIHVyOiBbXCJ1ci1QS1wiXSxcclxuICAvLyBWaWV0bmFtZXNlIChWaWV0bmFtKVxyXG4gIHZpOiBbXCJ2aS1WTlwiXSxcclxuICAvLyBUdXJraXNoIChUdXJrZXkpXHJcbiAgdHI6IFtcInRyLVRSXCJdLFxyXG4gIC8vIFRhbWlsIChJbmRpYSlcclxuICB0YTogW1xyXG4gICAgXCJ0YS1JTlwiLCAvLyBJbmRpYVxyXG4gICAgXCJ0YS1TR1wiLCAvLyBTaW5nYXBvcmVcclxuICBdLFxyXG4gIC8vIFNlcmJpYW5cclxuICBzcjogW1xyXG4gICAgXCJzci1SU1wiLCAvLyBTZXJiaWFuIChMYXRpbilcclxuICAgIFwic3ItTGF0bi1SU1wiLCAvLyBTZXJiaWFuIChMYXRpbilcclxuICAgIFwic3ItQ3lybC1SU1wiLCAvLyBTZXJiaWFuIChDeXJpbGxpYylcclxuICBdLFxyXG4gIC8vIEh1bmdhcmlhbiAoSHVuZ2FyeSlcclxuICBodTogW1wiaHUtSFVcIl0sXHJcbiAgLy8gSGVicmV3IChJc3JhZWwpXHJcbiAgaGU6IFtcImhlLUlMXCJdLFxyXG4gIC8vIEVzdG9uaWFuIChFc3RvbmlhKVxyXG4gIGV0OiBbXCJldC1FRVwiXSxcclxuICAvLyBHcmVla1xyXG4gIGVsOiBbXHJcbiAgICBcImVsLUdSXCIsIC8vIEdyZWVjZVxyXG4gICAgXCJlbC1DWVwiLCAvLyBDeXBydXNcclxuICBdLFxyXG4gIC8vIERhbmlzaCAoRGVubWFyaylcclxuICBkYTogW1wiZGEtREtcIl0sXHJcbiAgLy8gQXplcmJhaWphbmkgKEF6ZXJiYWlqYW4pXHJcbiAgYXo6IFtcImF6LUFaXCJdLFxyXG4gIC8vIFRoYWkgKFRoYWlsYW5kKVxyXG4gIHRoOiBbXCJ0aC1USFwiXSxcclxuICAvLyBTd2VkaXNoIChTd2VkZW4pXHJcbiAgc3Y6IFtcInN2LVNFXCJdLFxyXG4gIC8vIEVuZ2xpc2hcclxuICBlbjogW1xyXG4gICAgXCJlbi1VU1wiLCAvLyBVbml0ZWQgU3RhdGVzXHJcbiAgICBcImVuLUdCXCIsIC8vIFVuaXRlZCBLaW5nZG9tXHJcbiAgICBcImVuLUFVXCIsIC8vIEF1c3RyYWxpYVxyXG4gICAgXCJlbi1DQVwiLCAvLyBDYW5hZGFcclxuICAgIFwiZW4tU0dcIiwgLy8gU2luZ2Fwb3JlXHJcbiAgICBcImVuLUlFXCIsIC8vIElyZWxhbmRcclxuICBdLFxyXG4gIC8vIFNwYW5pc2hcclxuICBlczogW1xyXG4gICAgXCJlcy1FU1wiLCAvLyBTcGFpblxyXG4gICAgXCJlcy00MTlcIiwgLy8gTGF0aW4gQW1lcmljYVxyXG4gICAgXCJlcy1NWFwiLCAvLyBNZXhpY29cclxuICAgIFwiZXMtQVJcIiwgLy8gQXJnZW50aW5hXHJcbiAgXSxcclxuICAvLyBGcmVuY2hcclxuICBmcjogW1xyXG4gICAgXCJmci1GUlwiLCAvLyBGcmFuY2VcclxuICAgIFwiZnItQ0FcIiwgLy8gQ2FuYWRhXHJcbiAgICBcImZyLUJFXCIsIC8vIEJlbGdpdW1cclxuICAgIFwiZnItTFVcIiwgLy8gTHV4ZW1ib3VyZ1xyXG4gIF0sXHJcbiAgLy8gQ2F0YWxhbiAoU3BhaW4pXHJcbiAgY2E6IFtcImNhLUVTXCJdLFxyXG4gIC8vIEphcGFuZXNlIChKYXBhbilcclxuICBqYTogW1wiamEtSlBcIl0sXHJcbiAgLy8gS2F6YWtoIChLYXpha2hzdGFuKVxyXG4gIGtrOiBbXCJray1LWlwiXSxcclxuICAvLyBHZXJtYW5cclxuICBkZTogW1xyXG4gICAgXCJkZS1ERVwiLCAvLyBHZXJtYW55XHJcbiAgICBcImRlLUFUXCIsIC8vIEF1c3RyaWFcclxuICAgIFwiZGUtQ0hcIiwgLy8gU3dpdHplcmxhbmRcclxuICBdLFxyXG4gIC8vIFBvcnR1Z3Vlc2VcclxuICBwdDogW1xyXG4gICAgXCJwdC1QVFwiLCAvLyBQb3J0dWdhbFxyXG4gICAgXCJwdC1CUlwiLCAvLyBCcmF6aWxcclxuICBdLFxyXG4gIC8vIEl0YWxpYW5cclxuICBpdDogW1xyXG4gICAgXCJpdC1JVFwiLCAvLyBJdGFseVxyXG4gICAgXCJpdC1DSFwiLCAvLyBTd2l0emVybGFuZFxyXG4gIF0sXHJcbiAgLy8gUnVzc2lhblxyXG4gIHJ1OiBbXHJcbiAgICBcInJ1LVJVXCIsIC8vIFJ1c3NpYVxyXG4gICAgXCJydS1CWVwiLCAvLyBCZWxhcnVzXHJcbiAgXSxcclxuICAvLyBVa3JhaW5pYW4gKFVrcmFpbmUpXHJcbiAgdWs6IFtcInVrLVVBXCJdLFxyXG4gIC8vIEJlbGFydXNpYW4gKEJlbGFydXMpXHJcbiAgYmU6IFtcImJlLUJZXCJdLFxyXG4gIC8vIEhpbmRpIChJbmRpYSlcclxuICBoaTogW1wiaGktSU5cIl0sXHJcbiAgLy8gQ2hpbmVzZVxyXG4gIHpoOiBbXHJcbiAgICBcInpoLUNOXCIsIC8vIFNpbXBsaWZpZWQgQ2hpbmVzZSAoQ2hpbmEpXHJcbiAgICBcInpoLVRXXCIsIC8vIFRyYWRpdGlvbmFsIENoaW5lc2UgKFRhaXdhbilcclxuICAgIFwiemgtSEtcIiwgLy8gVHJhZGl0aW9uYWwgQ2hpbmVzZSAoSG9uZyBLb25nKVxyXG4gICAgXCJ6aC1TR1wiLCAvLyBTaW1wbGlmaWVkIENoaW5lc2UgKFNpbmdhcG9yZSlcclxuICAgIFwiemgtSGFuc1wiLCAvLyBTaW1wbGlmaWVkIENoaW5lc2VcclxuICAgIFwiemgtSGFudFwiLCAvLyBUcmFkaXRpb25hbCBDaGluZXNlXHJcbiAgICBcInpoLUhhbnQtSEtcIiwgLy8gVHJhZGl0aW9uYWwgQ2hpbmVzZSAoSG9uZyBLb25nKVxyXG4gICAgXCJ6aC1IYW50LVRXXCIsIC8vIFRyYWRpdGlvbmFsIENoaW5lc2UgKFRhaXdhbilcclxuICAgIFwiemgtSGFudC1DTlwiLCAvLyBUcmFkaXRpb25hbCBDaGluZXNlIChDaGluYSlcclxuICAgIFwiemgtSGFucy1IS1wiLCAvLyBTaW1wbGlmaWVkIENoaW5lc2UgKEhvbmcgS29uZylcclxuICAgIFwiemgtSGFucy1UV1wiLCAvLyBTaW1wbGlmaWVkIENoaW5lc2UgKENoaW5hKVxyXG4gICAgXCJ6aC1IYW5zLUNOXCIsIC8vIFNpbXBsaWZpZWQgQ2hpbmVzZSAoQ2hpbmEpXHJcbiAgXSxcclxuICAvLyBLb3JlYW4gKFNvdXRoIEtvcmVhKVxyXG4gIGtvOiBbXCJrby1LUlwiXSxcclxuICAvLyBBcmFiaWNcclxuICBhcjogW1xyXG4gICAgXCJhci1FR1wiLCAvLyBFZ3lwdFxyXG4gICAgXCJhci1TQVwiLCAvLyBTYXVkaSBBcmFiaWFcclxuICAgIFwiYXItQUVcIiwgLy8gVW5pdGVkIEFyYWIgRW1pcmF0ZXNcclxuICAgIFwiYXItTUFcIiwgLy8gTW9yb2Njb1xyXG4gIF0sXHJcbiAgLy8gQnVsZ2FyaWFuIChCdWxnYXJpYSlcclxuICBiZzogW1wiYmctQkdcIl0sXHJcbiAgLy8gQ3plY2ggKEN6ZWNoIFJlcHVibGljKVxyXG4gIGNzOiBbXCJjcy1DWlwiXSxcclxuICAvLyBXZWxzaCAoV2FsZXMpXHJcbiAgY3k6IFtcImN5LUdCXCJdLFxyXG4gIC8vIER1dGNoXHJcbiAgbmw6IFtcclxuICAgIFwibmwtTkxcIiwgLy8gTmV0aGVybGFuZHNcclxuICAgIFwibmwtQkVcIiwgLy8gQmVsZ2l1bVxyXG4gIF0sXHJcbiAgLy8gUG9saXNoIChQb2xhbmQpXHJcbiAgcGw6IFtcInBsLVBMXCJdLFxyXG4gIC8vIEluZG9uZXNpYW4gKEluZG9uZXNpYSlcclxuICBpZDogW1wiaWQtSURcIl0sXHJcbiAgaXM6IFtcImlzLUlTXCJdLFxyXG4gIC8vIE1hbGF5IChNYWxheXNpYSlcclxuICBtczogW1wibXMtTVlcIl0sXHJcbiAgLy8gRmlubmlzaCAoRmlubGFuZClcclxuICBmaTogW1wiZmktRklcIl0sXHJcbiAgLy8gQmFzcXVlIChTcGFpbilcclxuICBldTogW1wiZXUtRVNcIl0sXHJcbiAgLy8gQ3JvYXRpYW4gKENyb2F0aWEpXHJcbiAgaHI6IFtcImhyLUhSXCJdLFxyXG4gIC8vIEhlYnJldyAoSXNyYWVsKSAtIGFsdGVybmF0aXZlIGNvZGVcclxuICBpdzogW1wiaXctSUxcIl0sXHJcbiAgLy8gS2htZXIgKENhbWJvZGlhKVxyXG4gIGttOiBbXCJrbS1LSFwiXSxcclxuICAvLyBMYXR2aWFuIChMYXR2aWEpXHJcbiAgbHY6IFtcImx2LUxWXCJdLFxyXG4gIC8vIExpdGh1YW5pYW4gKExpdGh1YW5pYSlcclxuICBsdDogW1wibHQtTFRcIl0sXHJcbiAgLy8gTm9yd2VnaWFuXHJcbiAgbm86IFtcclxuICAgIFwibm8tTk9cIiwgLy8gTm9yd2F5IChsZWdhY3kpXHJcbiAgICBcIm5iLU5PXCIsIC8vIE5vcndlZ2lhbiBCb2ttXHUwMEU1bFxyXG4gICAgXCJubi1OT1wiLCAvLyBOb3J3ZWdpYW4gTnlub3Jza1xyXG4gIF0sXHJcbiAgLy8gUm9tYW5pYW4gKFJvbWFuaWEpXHJcbiAgcm86IFtcInJvLVJPXCJdLFxyXG4gIC8vIFNsb3ZhayAoU2xvdmFraWEpXHJcbiAgc2s6IFtcInNrLVNLXCJdLFxyXG4gIC8vIFN3YWhpbGlcclxuICBzdzogW1xyXG4gICAgXCJzdy1UWlwiLCAvLyBUYW56YW5pYVxyXG4gICAgXCJzdy1LRVwiLCAvLyBLZW55YVxyXG4gICAgXCJzdy1VR1wiLCAvLyBVZ2FuZGFcclxuICAgIFwic3ctQ0RcIiwgLy8gRGVtb2NyYXRpYyBSZXB1YmxpYyBvZiBDb25nb1xyXG4gICAgXCJzdy1SV1wiLCAvLyBSd2FuZGFcclxuICBdLFxyXG4gIC8vIFBlcnNpYW4gKElyYW4pXHJcbiAgZmE6IFtcImZhLUlSXCJdLFxyXG4gIC8vIEZpbGlwaW5vIChQaGlsaXBwaW5lcylcclxuICBmaWw6IFtcImZpbC1QSFwiXSxcclxuICAvLyBQdW5qYWJpXHJcbiAgcGE6IFtcclxuICAgIFwicGEtSU5cIiwgLy8gSW5kaWFcclxuICAgIFwicGEtUEtcIiwgLy8gUGFraXN0YW5cclxuICBdLFxyXG4gIC8vIEJlbmdhbGlcclxuICBibjogW1xyXG4gICAgXCJibi1CRFwiLCAvLyBCYW5nbGFkZXNoXHJcbiAgICBcImJuLUlOXCIsIC8vIEluZGlhXHJcbiAgXSxcclxuICAvLyBJcmlzaCAoSXJlbGFuZClcclxuICBnYTogW1wiZ2EtSUVcIl0sXHJcbiAgLy8gR2FsaWNpYW4gKFNwYWluKVxyXG4gIGdsOiBbXCJnbC1FU1wiXSxcclxuICAvLyBNYWx0ZXNlIChNYWx0YSlcclxuICBtdDogW1wibXQtTVRcIl0sXHJcbiAgLy8gU2xvdmVuaWFuIChTbG92ZW5pYSlcclxuICBzbDogW1wic2wtU0lcIl0sXHJcbiAgLy8gQWxiYW5pYW4gKEFsYmFuaWEpXHJcbiAgc3E6IFtcInNxLUFMXCJdLFxyXG4gIC8vIEJhdmFyaWFuIChHZXJtYW55KVxyXG4gIGJhcjogW1wiYmFyLURFXCJdLFxyXG4gIC8vIE5lYXBvbGl0YW4gKEl0YWx5KVxyXG4gIG5hcDogW1wibmFwLUlUXCJdLFxyXG4gIC8vIEFmcmlrYWFucyAoU291dGggQWZyaWNhKVxyXG4gIGFmOiBbXCJhZi1aQVwiXSxcclxuICAvLyBVemJlayAoTGF0aW4pXHJcbiAgdXo6IFtcInV6LUxhdG5cIl0sXHJcbiAgLy8gU29tYWxpIChTb21hbGlhKVxyXG4gIHNvOiBbXCJzby1TT1wiXSxcclxuICAvLyBUaWdyaW55YSAoRXRoaW9waWEpXHJcbiAgdGk6IFtcInRpLUVUXCJdLFxyXG4gIC8vIFN0YW5kYXJkIE1vcm9jY2FuIFRhbWF6aWdodCAoTW9yb2NjbylcclxuICB6Z2g6IFtcInpnaC1NQVwiXSxcclxuICAvLyBUYWdhbG9nIChQaGlsaXBwaW5lcylcclxuICB0bDogW1widGwtUEhcIl0sXHJcbiAgLy8gVGVsdWd1IChJbmRpYSlcclxuICB0ZTogW1widGUtSU5cIl0sXHJcbiAgLy8gS2lueWFyd2FuZGEgKFJ3YW5kYSlcclxuICBydzogW1wicnctUldcIl0sXHJcbiAgLy8gR2VvcmdpYW4gKEdlb3JnaWEpXHJcbiAga2E6IFtcImthLUdFXCJdLFxyXG4gIC8vIE1hbGF5YWxhbSAoSW5kaWEpXHJcbiAgbWw6IFtcIm1sLUlOXCJdLFxyXG4gIC8vIEFybWVuaWFuIChBcm1lbmlhKVxyXG4gIGh5OiBbXCJoeS1BTVwiXSxcclxuICAvLyBNYWNlZG9uaWFuIChNYWNlZG9uaWEpXHJcbiAgbWs6IFtcIm1rLU1LXCJdLFxyXG59IGFzIGNvbnN0O1xyXG5cclxuZXhwb3J0IHR5cGUgTG9jYWxlQ29kZVNob3J0ID0ga2V5b2YgdHlwZW9mIGxvY2FsZU1hcDtcclxuZXhwb3J0IHR5cGUgTG9jYWxlQ29kZUZ1bGwgPSAodHlwZW9mIGxvY2FsZU1hcClbTG9jYWxlQ29kZVNob3J0XVtudW1iZXJdO1xyXG5leHBvcnQgdHlwZSBMb2NhbGVDb2RlID0gTG9jYWxlQ29kZVNob3J0IHwgTG9jYWxlQ29kZUZ1bGw7XHJcbmV4cG9ydCB0eXBlIExvY2FsZURlbGltaXRlciA9IFwiLVwiIHwgXCJfXCIgfCBudWxsO1xyXG5cclxuZXhwb3J0IGNvbnN0IGxvY2FsZUNvZGVzU2hvcnQgPSBPYmplY3Qua2V5cyhsb2NhbGVNYXApIGFzIExvY2FsZUNvZGVTaG9ydFtdO1xyXG5leHBvcnQgY29uc3QgbG9jYWxlQ29kZXNGdWxsID0gT2JqZWN0LnZhbHVlcyhcclxuICBsb2NhbGVNYXAsXHJcbikuZmxhdCgpIGFzIExvY2FsZUNvZGVGdWxsW107XHJcbmV4cG9ydCBjb25zdCBsb2NhbGVDb2Rlc0Z1bGxVbmRlcnNjb3JlID0gbG9jYWxlQ29kZXNGdWxsLm1hcCgodmFsdWUpID0+XHJcbiAgdmFsdWUucmVwbGFjZShcIi1cIiwgXCJfXCIpLFxyXG4pO1xyXG5leHBvcnQgY29uc3QgbG9jYWxlQ29kZXNGdWxsRXhwbGljaXRSZWdpb24gPSBsb2NhbGVDb2Rlc0Z1bGwubWFwKCh2YWx1ZSkgPT4ge1xyXG4gIGNvbnN0IGNodW5rcyA9IHZhbHVlLnNwbGl0KFwiLVwiKTtcclxuICBjb25zdCByZXN1bHQgPSBbY2h1bmtzWzBdLCBcIi1yXCIsIGNodW5rcy5zbGljZSgxKS5qb2luKFwiLVwiKV0uam9pbihcIlwiKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59KTtcclxuZXhwb3J0IGNvbnN0IGxvY2FsZUNvZGVzID0gW1xyXG4gIC4uLmxvY2FsZUNvZGVzU2hvcnQsXHJcbiAgLi4ubG9jYWxlQ29kZXNGdWxsLFxyXG4gIC4uLmxvY2FsZUNvZGVzRnVsbFVuZGVyc2NvcmUsXHJcbiAgLi4ubG9jYWxlQ29kZXNGdWxsRXhwbGljaXRSZWdpb24sXHJcbl0gYXMgTG9jYWxlQ29kZVtdO1xyXG5cclxuZXhwb3J0IGNvbnN0IGxvY2FsZUNvZGVTY2hlbWEgPSBaLnN0cmluZygpLnJlZmluZShcclxuICAodmFsdWUpID0+IHtcclxuICAgIC8vIE5vcm1hbGl6ZSBsb2NhbGUgYmVmb3JlIHZhbGlkYXRpb25cclxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVMb2NhbGUodmFsdWUpO1xyXG4gICAgcmV0dXJuIGlzVmFsaWRMb2NhbGUobm9ybWFsaXplZCk7XHJcbiAgfSxcclxuICB7XHJcbiAgICBtZXNzYWdlOiBcIkludmFsaWQgbG9jYWxlIGNvZGVcIixcclxuICB9LFxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIFJlc29sdmVzIGEgbG9jYWxlIGNvZGUgdG8gaXRzIGZ1bGwgbG9jYWxlIHJlcHJlc2VudGF0aW9uLlxyXG4gKlxyXG4gKiAgSWYgdGhlIHByb3ZpZGVkIGxvY2FsZSBjb2RlIGlzIGFscmVhZHkgYSBmdWxsIGxvY2FsZSBjb2RlLCBpdCByZXR1cm5zIGFzIGlzLlxyXG4gKiAgSWYgdGhlIHByb3ZpZGVkIGxvY2FsZSBjb2RlIGlzIGEgc2hvcnQgbG9jYWxlIGNvZGUsIGl0IHJldHVybnMgdGhlIGZpcnN0IGNvcnJlc3BvbmRpbmcgZnVsbCBsb2NhbGUuXHJcbiAqICBJZiB0aGUgbG9jYWxlIGNvZGUgaXMgbm90IGZvdW5kLCBpdCB0aHJvd3MgYW4gZXJyb3IuXHJcbiAqXHJcbiAqIEBwYXJhbSB7bG9jYWxlQ29kZXN9IHZhbHVlIC0gVGhlIGxvY2FsZSBjb2RlIHRvIHJlc29sdmUgKGVpdGhlciBzaG9ydCBvciBmdWxsKVxyXG4gKiBAcmV0dXJuIHtMb2NhbGVDb2RlRnVsbH0gVGhlIHJlc29sdmVkIGZ1bGwgbG9jYWxlIGNvZGVcclxuICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBwcm92aWRlZCBsb2NhbGUgY29kZSBpcyBpbnZhbGlkLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHJlc29sdmVMb2NhbGVDb2RlID0gKHZhbHVlOiBzdHJpbmcpOiBMb2NhbGVDb2RlRnVsbCA9PiB7XHJcbiAgY29uc3QgZXhpc3RpbmdGdWxsTG9jYWxlQ29kZSA9IE9iamVjdC52YWx1ZXMobG9jYWxlTWFwKVxyXG4gICAgLmZsYXQoKVxyXG4gICAgLmluY2x1ZGVzKHZhbHVlIGFzIGFueSk7XHJcbiAgaWYgKGV4aXN0aW5nRnVsbExvY2FsZUNvZGUpIHtcclxuICAgIHJldHVybiB2YWx1ZSBhcyBMb2NhbGVDb2RlRnVsbDtcclxuICB9XHJcblxyXG4gIGNvbnN0IGV4aXN0aW5nU2hvcnRMb2NhbGVDb2RlID0gT2JqZWN0LmtleXMobG9jYWxlTWFwKS5pbmNsdWRlcyh2YWx1ZSk7XHJcbiAgaWYgKGV4aXN0aW5nU2hvcnRMb2NhbGVDb2RlKSB7XHJcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nRnVsbExvY2FsZXMgPSBsb2NhbGVNYXBbdmFsdWUgYXMgTG9jYWxlQ29kZVNob3J0XTtcclxuICAgIGNvbnN0IGZhbGxiYWNrRnVsbExvY2FsZSA9IGNvcnJlc3BvbmRpbmdGdWxsTG9jYWxlc1swXTtcclxuICAgIHJldHVybiBmYWxsYmFja0Z1bGxMb2NhbGU7XHJcbiAgfVxyXG5cclxuICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbG9jYWxlIGNvZGU6ICR7dmFsdWV9YCk7XHJcbn07XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyB0aGUgZGVsaW1pdGVyIHVzZWQgaW4gYSBsb2NhbGUgY29kZVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIC0gdGhlIGxvY2FsZSBzdHJpbmcgKGUuZy4sXCJlbl9VU1wiLFwiZW4tR0JcIilcclxuICogQHJldHVybiB7IHN0cmluZyB8IG51bGx9IC0gVGhlIGRlbGltaXRlciAoXCJfXCIgb3IgXCItXCIpIGlmIGZvdW5kLCBvdGhlcndpc2UgYG51bGxgLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRMb2NhbGVDb2RlRGVsaW1pdGVyID0gKGxvY2FsZTogc3RyaW5nKTogTG9jYWxlRGVsaW1pdGVyID0+IHtcclxuICBpZiAobG9jYWxlLmluY2x1ZGVzKFwiX1wiKSkge1xyXG4gICAgcmV0dXJuIFwiX1wiO1xyXG4gIH0gZWxzZSBpZiAobG9jYWxlLmluY2x1ZGVzKFwiLVwiKSkge1xyXG4gICAgcmV0dXJuIFwiLVwiO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUmVwbGFjZXMgdGhlIGRlbGltaXRlciBpbiBhIGxvY2FsZSBzdHJpbmcgd2l0aCB0aGUgc3BlY2lmaWVkIGRlbGltaXRlci5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9bG9jYWxlIC0gVGhlIGxvY2FsZSBzdHJpbmcgKGUuZy4sXCJlbl9VU1wiLCBcImVuLUdCXCIpLlxyXG4gKiBAcGFyYW0ge1wiLVwiIHwgXCJfXCIgfCBudWxsfSBbZGVsaW1pdGVyXSAtIFRoZSBuZXcgZGVsaW1pdGVyIHRvIHJlcGxhY2UgdGhlIGV4aXN0aW5nIG9uZS5cclxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGxvY2FsZSBzdHJpbmcgd2l0aCB0aGUgcmVwbGFjZWQgZGVsaW1pdGVyLCBvciB0aGUgb3JpZ2luYWwgbG9jYWxlIGlmIG5vIGRlbGltaXRlciBpcyBwcm92aWRlZC5cclxuICovXHJcblxyXG5leHBvcnQgY29uc3QgcmVzb2x2ZU92ZXJyaWRkZW5Mb2NhbGUgPSAoXHJcbiAgbG9jYWxlOiBzdHJpbmcsXHJcbiAgZGVsaW1pdGVyPzogTG9jYWxlRGVsaW1pdGVyLFxyXG4pOiBzdHJpbmcgPT4ge1xyXG4gIGlmICghZGVsaW1pdGVyKSB7XHJcbiAgICByZXR1cm4gbG9jYWxlO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY3VycmVudERlbGltaXRlciA9IGdldExvY2FsZUNvZGVEZWxpbWl0ZXIobG9jYWxlKTtcclxuICBpZiAoIWN1cnJlbnREZWxpbWl0ZXIpIHtcclxuICAgIHJldHVybiBsb2NhbGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbG9jYWxlLnJlcGxhY2UoY3VycmVudERlbGltaXRlciwgZGVsaW1pdGVyKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOb3JtYWxpemVzIGEgbG9jYWxlIHN0cmluZyBieSByZXBsYWNpbmcgdW5kZXJzY29yZXMgd2l0aCBoeXBoZW5zXHJcbiAqIGFuZCByZW1vdmluZyB0aGUgXCJyXCIgaW4gY2VydGFpbiByZWdpb25hbCBjb2RlcyAoZS5nLiwgXCJmci1yQ0FcIiBcdTIxOTIgXCJmci1DQVwiKVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIC0gVGhlIGxvY2FsZSBzdHJpbmcgKGUuZy4sXCJlbl9VU1wiLCBcImVuLUdCXCIpLlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBub3JtYWxpemVkIGxvY2FsZSBzdHJpbmcuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShsb2NhbGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGxvY2FsZS5yZXBsYWNlQWxsKFwiX1wiLCBcIi1cIikucmVwbGFjZSgvKFthLXpdezIsM30tKXIvLCBcIiQxXCIpO1xyXG59XHJcbiIsICJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIkM6XFxcXFVzZXJzXFxcXFRVRiBHQU1JTkdcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxsaW5nby5kZXYgb3BlbnNvdXJjZVxcXFxsaW5nby5kZXZcXFxccGFja2FnZXNcXFxcc3BlY1xcXFxzcmNcXFxcZm9ybWF0cy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxUVUYgR0FNSU5HXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcbGluZ28uZGV2IG9wZW5zb3VyY2VcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9UVUYlMjBHQU1JTkcvT25lRHJpdmUvRGVza3RvcC9saW5nby5kZXYlMjBvcGVuc291cmNlL2xpbmdvLmRldi9wYWNrYWdlcy9zcGVjL3NyYy9mb3JtYXRzLnRzXCI7aW1wb3J0IFogZnJvbSBcInpvZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJ1Y2tldFR5cGVzID0gW1xyXG4gIFwiYW5kcm9pZFwiLFxyXG4gIFwiY3N2XCIsXHJcbiAgXCJlanNcIixcclxuICBcImZsdXR0ZXJcIixcclxuICBcImh0bWxcIixcclxuICBcImpzb25cIixcclxuICBcImpzb241XCIsXHJcbiAgXCJqc29uY1wiLFxyXG4gIFwibWFya2Rvd25cIixcclxuICBcIm1hcmtkb2NcIixcclxuICBcIm1keFwiLFxyXG4gIFwieGNvZGUtc3RyaW5nc1wiLFxyXG4gIFwieGNvZGUtc3RyaW5nc2RpY3RcIixcclxuICBcInhjb2RlLXhjc3RyaW5nc1wiLFxyXG4gIFwieGNvZGUteGNzdHJpbmdzLXYyXCIsXHJcbiAgXCJ5YW1sXCIsXHJcbiAgXCJ5YW1sLXJvb3Qta2V5XCIsXHJcbiAgXCJwcm9wZXJ0aWVzXCIsXHJcbiAgXCJwb1wiLFxyXG4gIFwieGxpZmZcIixcclxuICBcInhtbFwiLFxyXG4gIFwic3J0XCIsXHJcbiAgXCJkYXRvXCIsXHJcbiAgXCJjb21waWxlclwiLFxyXG4gIFwidnR0XCIsXHJcbiAgXCJwaHBcIixcclxuICBcInBvXCIsXHJcbiAgXCJ2dWUtanNvblwiLFxyXG4gIFwidHlwZXNjcmlwdFwiLFxyXG4gIFwidHh0XCIsXHJcbiAgXCJqc29uLWRpY3Rpb25hcnlcIixcclxuXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBidWNrZXRUeXBlU2NoZW1hID0gWi5lbnVtKGJ1Y2tldFR5cGVzKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1WixTQUFTLG9CQUFvQjs7O0FDQWYsT0FBTyxRQUFRO0FBQ3BiLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLHVCQUF1Qjs7O0FDSDJYLE9BQU9BLFFBQU87OztBQ0FaLE9BQU8sT0FBTztBQUMzYSxTQUFTLHFCQUFxQjtBQUU5QixJQUFNLFlBQVk7QUFBQTtBQUFBLEVBRWhCLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUk7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUNBO0FBQUE7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxPQUFPO0FBQUE7QUFBQSxFQUVaLElBQUksQ0FBQyxPQUFPO0FBQUEsRUFDWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixLQUFLLENBQUMsUUFBUTtBQUFBO0FBQUEsRUFFZCxJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJ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QyxFQUNMLFNBQVMsRUFDVDtBQUFBLElBQ0M7QUFBQSxFQUNGO0FBQ0osQ0FBQyxFQUNFLFNBQVMsRUFDVCxTQUFTLG1EQUFtRDtBQUUvRCxJQUFNLHNCQUFzQkEsR0FBRSxPQUFPO0FBQUEsRUFDbkMsSUFBSUEsR0FBRSxLQUFLO0FBQUEsSUFDVDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixDQUFDLEVBQUUsU0FBUyxpREFBaUQ7QUFBQSxFQUM3RCxPQUFPQSxHQUFFLE9BQU8sRUFBRSxTQUFTLHFDQUFxQztBQUFBLEVBQ2hFLFFBQVFBLEdBQUUsT0FBTyxFQUFFO0FBQUEsSUFDakI7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTQSxHQUFFLE9BQU8sRUFDZixTQUFTLEVBQ1QsU0FBUyxrREFBa0Q7QUFBQSxFQUM5RCxVQUFVO0FBQ1osQ0FBQyxFQUFFLFNBQVMscURBQXFEO0FBRTFELElBQU0sd0JBQXdCO0FBQUEsRUFDbkM7QUFBQSxFQUNBO0FBQUEsSUFDRSxjQUFjLENBQUMsZUFDYixXQUFXLE9BQU87QUFBQSxNQUNoQixVQUFVLG9CQUFvQixTQUFTO0FBQUEsSUFDekMsQ0FBQztBQUFBLElBQ0gsb0JBQW9CLENBQUMsc0JBQXNCO0FBQUEsTUFDekMsR0FBRztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBLGdCQUFnQixDQUFDLGVBQWU7QUFBQSxNQUM5QixHQUFHO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFDRjtBQUdPLElBQU0sMkJBQTJCO0FBYWpDLElBQU0sZ0JBQWdCLHlCQUF5Qjs7O0FEcmZ1TixJQUFNLCtCQUErQjtBQU1uUyxTQUFSLGtCQUFtQztBQUN4QyxRQUFNRSxnQkFBZSxnQkFBZ0IseUJBQXlCLE1BQU07QUFDcEUsUUFBTSxhQUFhLEtBQUssUUFBUSxjQUFjLDRCQUFlLENBQUM7QUFDOUQsS0FBRztBQUFBLElBQ0QsR0FBRyxVQUFVO0FBQUEsSUFDYixLQUFLLFVBQVVBLGVBQWMsTUFBTSxDQUFDO0FBQUEsRUFDdEM7QUFDRjs7O0FEVkEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLEVBQ1AsUUFBUTtBQUFBLEVBQ1IsT0FBTyxDQUFDLGNBQWM7QUFBQSxFQUN0QixRQUFRO0FBQUEsRUFDUixRQUFRLENBQUMsT0FBTyxLQUFLO0FBQUEsRUFDckIsS0FBSztBQUFBLEVBQ0wsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsY0FBYyxDQUFDLFNBQVM7QUFBQSxJQUN0QixJQUFJLElBQUksV0FBVyxRQUFRLFNBQVM7QUFBQSxFQUN0QztBQUFBLEVBQ0EsV0FBVyxZQUFZO0FBQ3JCLG9CQUFnQjtBQUFBLEVBQ2xCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiWiIsICJaIiwgIloiLCAiWiIsICJwYXRoIiwgImNvbmZpZ1NjaGVtYSJdCn0K
