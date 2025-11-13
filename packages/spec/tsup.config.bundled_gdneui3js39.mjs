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
    "ta-SG"
    // Singapore
  ],
  // Serbian
  sr: [
    "sr-RS",
    // Serbian (Latin)
    "sr-Latn-RS",
    // Serbian (Latin)
    "sr-Cyrl-RS"
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
    "el-CY"
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
    "en-IE"
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
    "es-AR"
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
    "fr-LU"
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
    "de-CH"
    // Switzerland
  ],
  // Portuguese
  pt: [
    "pt-PT",
    // Portugal
    "pt-BR"
    // Brazil
  ],
  // Italian
  it: [
    "it-IT",
    // Italy
    "it-CH"
    // Switzerland
  ],
  // Russian
  ru: [
    "ru-RU",
    // Russia
    "ru-BY"
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
    "zh-Hans-CN"
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
    "ar-MA"
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
    "nl-BE"
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
    "nn-NO"
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
    "sw-RW"
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
    "pa-PK"
    // Pakistan
  ],
  // Bengali
  bn: [
    "bn-BD",
    // Bangladesh
    "bn-IN"
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
  mk: ["mk-MK"]
};
var localeCodesShort = Object.keys(localeMap);
var localeCodesFull = Object.values(
  localeMap
).flat();
var localeCodesFullUnderscore = localeCodesFull.map(
  (value) => value.replace("-", "_")
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
  ...localeCodesFullExplicitRegion
];
var localeCodeSchema = Z.string().refine(
  (value) => localeCodes.includes(value),
  {
    message: "Invalid locale code"
  }
);

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
  "json-dictionary"
];
var bucketTypeSchema = Z2.enum(bucketTypes);

// src/config.ts
var localeSchema = Z3.object({
  source: localeCodeSchema.describe(
    "Primary source locale code of your content (e.g. 'en', 'en-US', 'pt_BR', or 'pt-rBR'). Must be one of the supported locale codes \u2013 either a short ISO-639 language code or a full locale identifier using '-', '_' or Android '-r' notation."
  ),
  targets: Z3.array(localeCodeSchema).describe(
    "List of target locale codes to translate to."
  )
}).describe("Locale configuration block.");
var createConfigDefinition = (definition) => definition;
var extendConfigDefinition = (definition, params) => {
  const schema = params.createSchema(definition.schema);
  const defaultValue = params.createDefaultValue(definition.defaultValue);
  const upgrader = (config) => params.createUpgrader(config, schema, defaultValue);
  return createConfigDefinition({
    schema,
    defaultValue,
    parse: (rawConfig) => {
      const safeResult = schema.safeParse(rawConfig);
      if (safeResult.success) {
        return safeResult.data;
      }
      const localeErrors = safeResult.error.errors.filter((issue) => issue.message.includes("Invalid locale code")).map((issue) => {
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
    }
  });
};
var configV0Schema = Z3.object({
  version: Z3.union([Z3.number(), Z3.string()]).default(0).describe("The version number of the schema.")
});
var configV0Definition = createConfigDefinition({
  schema: configV0Schema,
  defaultValue: { version: 0 },
  parse: (rawConfig) => {
    return configV0Schema.parse(rawConfig);
  }
});
var configV1Definition = extendConfigDefinition(configV0Definition, {
  createSchema: (baseSchema) => baseSchema.extend({
    locale: localeSchema,
    buckets: Z3.record(Z3.string(), bucketTypeSchema).default({}).describe(
      "Mapping of source file paths (glob patterns) to bucket types."
    ).optional()
  }),
  createDefaultValue: () => ({
    version: 1,
    locale: {
      source: "en",
      targets: ["es"]
    },
    buckets: {}
  }),
  createUpgrader: () => ({
    version: 1,
    locale: {
      source: "en",
      targets: ["es"]
    },
    buckets: {}
  })
});
var configV1_1Definition = extendConfigDefinition(configV1Definition, {
  createSchema: (baseSchema) => baseSchema.extend({
    buckets: Z3.record(
      bucketTypeSchema,
      Z3.object({
        include: Z3.array(Z3.string()).default([]).describe(
          "File paths or glob patterns to include for this bucket."
        ),
        exclude: Z3.array(Z3.string()).default([]).optional().describe(
          "File paths or glob patterns to exclude from this bucket."
        )
      })
    ).default({})
  }),
  createDefaultValue: (baseDefaultValue) => ({
    ...baseDefaultValue,
    version: 1.1,
    buckets: {}
  }),
  createUpgrader: (oldConfig, schema) => {
    const upgradedConfig = {
      ...oldConfig,
      version: 1.1,
      buckets: {}
    };
    if (oldConfig.buckets) {
      for (const [bucketPath, bucketType] of Object.entries(
        oldConfig.buckets
      )) {
        if (!upgradedConfig.buckets[bucketType]) {
          upgradedConfig.buckets[bucketType] = {
            include: []
          };
        }
        upgradedConfig.buckets[bucketType]?.include.push(bucketPath);
      }
    }
    return upgradedConfig;
  }
});
var configV1_2Definition = extendConfigDefinition(
  configV1_1Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      locale: localeSchema.extend({
        extraSource: localeCodeSchema.optional().describe(
          "Optional extra source locale code used as fallback during translation."
        )
      })
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.2
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.2
    })
  }
);
var bucketItemSchema = Z3.object({
  path: Z3.string().describe("Path pattern containing a [locale] placeholder."),
  delimiter: Z3.union([Z3.literal("-"), Z3.literal("_"), Z3.literal(null)]).optional().describe(
    "Delimiter that replaces the [locale] placeholder in the path (default: no delimiter)."
  )
}).describe(
  "Bucket path item. Either a string path or an object specifying path and delimiter."
);
var bucketValueSchemaV1_3 = Z3.object({
  include: Z3.array(Z3.union([Z3.string(), bucketItemSchema])).default([]).describe("Glob patterns or bucket items to include for this bucket."),
  exclude: Z3.array(Z3.union([Z3.string(), bucketItemSchema])).default([]).optional().describe("Glob patterns or bucket items to exclude from this bucket."),
  injectLocale: Z3.array(Z3.string()).optional().describe(
    "Keys within files where the current locale should be injected or removed."
  )
}).describe("Configuration options for a translation bucket.");
var configV1_3Definition = extendConfigDefinition(
  configV1_2Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      buckets: Z3.record(bucketTypeSchema, bucketValueSchemaV1_3).default({})
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.3
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.3
    })
  }
);
var configSchema = "https://lingo.dev/schema/i18n.json";
var configV1_4Definition = extendConfigDefinition(
  configV1_3Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      $schema: Z3.string().default(configSchema)
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.4,
      $schema: configSchema
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.4,
      $schema: configSchema
    })
  }
);
var providerSchema = Z3.object({
  id: Z3.enum([
    "openai",
    "anthropic",
    "google",
    "ollama",
    "openrouter",
    "mistral"
  ]).describe("Identifier of the translation provider service."),
  model: Z3.string().describe("Model name to use for translations."),
  prompt: Z3.string().describe(
    "Prompt template used when requesting translations."
  ),
  baseUrl: Z3.string().optional().describe("Custom base URL for the provider API (optional).")
}).describe("Configuration for the machine-translation provider.");
var configV1_5Definition = extendConfigDefinition(
  configV1_4Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      provider: providerSchema.optional()
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.5
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.5
    })
  }
);
var bucketValueSchemaV1_6 = bucketValueSchemaV1_3.extend({
  lockedKeys: Z3.array(Z3.string()).default([]).optional().describe(
    "Keys that must remain unchanged and should never be overwritten by translations."
  )
});
var configV1_6Definition = extendConfigDefinition(
  configV1_5Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      buckets: Z3.record(bucketTypeSchema, bucketValueSchemaV1_6).default({})
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.6
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.6
    })
  }
);
var bucketValueSchemaV1_7 = bucketValueSchemaV1_6.extend({
  lockedPatterns: Z3.array(Z3.string()).default([]).optional().describe(
    "Regular expression patterns whose matched content should remain locked during translation."
  )
});
var configV1_7Definition = extendConfigDefinition(
  configV1_6Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      buckets: Z3.record(bucketTypeSchema, bucketValueSchemaV1_7).default({})
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.7
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.7
    })
  }
);
var bucketValueSchemaV1_8 = bucketValueSchemaV1_7.extend({
  ignoredKeys: Z3.array(Z3.string()).default([]).optional().describe(
    "Keys that should be completely ignored by translation processes."
  )
});
var configV1_8Definition = extendConfigDefinition(
  configV1_7Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      buckets: Z3.record(bucketTypeSchema, bucketValueSchemaV1_8).default({})
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.8
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.8
    })
  }
);
var configV1_9Definition = extendConfigDefinition(
  configV1_8Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      formatter: Z3.enum(["prettier", "biome"]).optional().describe(
        "Code formatter to use for all buckets. Defaults to 'prettier' if not specified and a prettier config is found."
      )
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: 1.9
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: 1.9
    })
  }
);
var modelSettingsSchema = Z3.object({
  temperature: Z3.number().min(0).max(2).optional().describe(
    "Controls randomness in model outputs (0=deterministic, 2=very random). Some models like GPT-5 require temperature=1."
  )
}).optional().describe("Model-specific settings for translation requests.");
var providerSchemaV1_10 = Z3.object({
  id: Z3.enum([
    "openai",
    "anthropic",
    "google",
    "ollama",
    "openrouter",
    "mistral"
  ]).describe("Identifier of the translation provider service."),
  model: Z3.string().describe("Model name to use for translations."),
  prompt: Z3.string().describe(
    "Prompt template used when requesting translations."
  ),
  baseUrl: Z3.string().optional().describe("Custom base URL for the provider API (optional)."),
  settings: modelSettingsSchema
}).describe("Configuration for the machine-translation provider.");
var configV1_10Definition = extendConfigDefinition(
  configV1_9Definition,
  {
    createSchema: (baseSchema) => baseSchema.extend({
      provider: providerSchemaV1_10.optional()
    }),
    createDefaultValue: (baseDefaultValue) => ({
      ...baseDefaultValue,
      version: "1.10"
    }),
    createUpgrader: (oldConfig) => ({
      ...oldConfig,
      version: "1.10"
    })
  }
);
var LATEST_CONFIG_DEFINITION = configV1_10Definition;
var defaultConfig = LATEST_CONFIG_DEFINITION.defaultValue;

// src/json-schema.ts
var __injected_import_meta_url__ = "file:///C:/Users/HP/lingo.dev/packages/spec/src/json-schema.ts";
function buildJsonSchema() {
  const configSchema2 = zodToJsonSchema(LATEST_CONFIG_DEFINITION.schema);
  const currentDir = path.dirname(fileURLToPath(__injected_import_meta_url__));
  fs.writeFileSync(
    `${currentDir}/../build/i18n.schema.json`,
    JSON.stringify(configSchema2, null, 2)
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
    js: ctx.format === "cjs" ? ".cjs" : ".mjs"
  }),
  onSuccess: async () => {
    buildJsonSchema();
  }
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiLCAic3JjL2pzb24tc2NoZW1hLnRzIiwgInNyYy9jb25maWcudHMiLCAic3JjL2xvY2FsZXMudHMiLCAic3JjL2Zvcm1hdHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL0hQL2xpbmdvLmRldi9wYWNrYWdlcy9zcGVjL3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInRzdXBcIjtcclxuaW1wb3J0IGJ1aWxkSnNvblNjaGVtYSBmcm9tIFwiLi9zcmMvanNvbi1zY2hlbWFcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgY2xlYW46IHRydWUsXHJcbiAgdGFyZ2V0OiBcImVzbmV4dFwiLFxyXG4gIGVudHJ5OiBbXCJzcmMvaW5kZXgudHNcIl0sXHJcbiAgb3V0RGlyOiBcImJ1aWxkXCIsXHJcbiAgZm9ybWF0OiBbXCJjanNcIiwgXCJlc21cIl0sXHJcbiAgZHRzOiB0cnVlLFxyXG4gIGNqc0ludGVyb3A6IHRydWUsXHJcbiAgc3BsaXR0aW5nOiB0cnVlLFxyXG4gIG91dEV4dGVuc2lvbjogKGN0eCkgPT4gKHtcclxuICAgIGpzOiBjdHguZm9ybWF0ID09PSBcImNqc1wiID8gXCIuY2pzXCIgOiBcIi5tanNcIixcclxuICB9KSxcclxuICBvblN1Y2Nlc3M6IGFzeW5jICgpID0+IHtcclxuICAgIGJ1aWxkSnNvblNjaGVtYSgpO1xyXG4gIH0sXHJcbn0pO1xyXG4iLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxIUFxcXFxsaW5nby5kZXZcXFxccGFja2FnZXNcXFxcc3BlY1xcXFxzcmNcXFxcanNvbi1zY2hlbWEudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9IUC9saW5nby5kZXYvcGFja2FnZXMvc3BlYy9zcmMvanNvbi1zY2hlbWEudHNcIjtpbXBvcnQgZnMgZnJvbSBcImZzXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwidXJsXCI7XHJcbmltcG9ydCB7IHpvZFRvSnNvblNjaGVtYSB9IGZyb20gXCJ6b2QtdG8tanNvbi1zY2hlbWFcIjtcclxuaW1wb3J0IHsgTEFURVNUX0NPTkZJR19ERUZJTklUSU9OIH0gZnJvbSBcIi4vY29uZmlnXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZEpzb25TY2hlbWEoKSB7XHJcbiAgY29uc3QgY29uZmlnU2NoZW1hID0gem9kVG9Kc29uU2NoZW1hKExBVEVTVF9DT05GSUdfREVGSU5JVElPTi5zY2hlbWEpO1xyXG4gIGNvbnN0IGN1cnJlbnREaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcclxuICBmcy53cml0ZUZpbGVTeW5jKFxyXG4gICAgYCR7Y3VycmVudERpcn0vLi4vYnVpbGQvaTE4bi5zY2hlbWEuanNvbmAsXHJcbiAgICBKU09OLnN0cmluZ2lmeShjb25maWdTY2hlbWEsIG51bGwsIDIpLFxyXG4gICk7XHJcbn1cclxuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXFxcXGNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCJDOlxcXFxVc2Vyc1xcXFxIUFxcXFxsaW5nby5kZXZcXFxccGFja2FnZXNcXFxcc3BlY1xcXFxzcmNcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL0M6L1VzZXJzL0hQL2xpbmdvLmRldi9wYWNrYWdlcy9zcGVjL3NyYy9jb25maWcudHNcIjtpbXBvcnQgWiBmcm9tIFwiem9kXCI7XHJcbmltcG9ydCB7IGxvY2FsZUNvZGVTY2hlbWEgfSBmcm9tIFwiLi9sb2NhbGVzXCI7XHJcbmltcG9ydCB7IGJ1Y2tldFR5cGVTY2hlbWEgfSBmcm9tIFwiLi9mb3JtYXRzXCI7XHJcblxyXG4vLyBjb21tb25cclxuZXhwb3J0IGNvbnN0IGxvY2FsZVNjaGVtYSA9IFoub2JqZWN0KHtcclxuICBzb3VyY2U6IGxvY2FsZUNvZGVTY2hlbWEuZGVzY3JpYmUoXHJcbiAgICBcIlByaW1hcnkgc291cmNlIGxvY2FsZSBjb2RlIG9mIHlvdXIgY29udGVudCAoZS5nLiAnZW4nLCAnZW4tVVMnLCAncHRfQlInLCBvciAncHQtckJSJykuIE11c3QgYmUgb25lIG9mIHRoZSBzdXBwb3J0ZWQgbG9jYWxlIGNvZGVzIFx1MjAxMyBlaXRoZXIgYSBzaG9ydCBJU08tNjM5IGxhbmd1YWdlIGNvZGUgb3IgYSBmdWxsIGxvY2FsZSBpZGVudGlmaWVyIHVzaW5nICctJywgJ18nIG9yIEFuZHJvaWQgJy1yJyBub3RhdGlvbi5cIixcclxuICApLFxyXG4gIHRhcmdldHM6IFouYXJyYXkobG9jYWxlQ29kZVNjaGVtYSkuZGVzY3JpYmUoXHJcbiAgICBcIkxpc3Qgb2YgdGFyZ2V0IGxvY2FsZSBjb2RlcyB0byB0cmFuc2xhdGUgdG8uXCIsXHJcbiAgKSxcclxufSkuZGVzY3JpYmUoXCJMb2NhbGUgY29uZmlndXJhdGlvbiBibG9jay5cIik7XHJcblxyXG4vLyBmYWN0b3JpZXNcclxudHlwZSBDb25maWdEZWZpbml0aW9uPFxyXG4gIFQgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4gIF9QIGV4dGVuZHMgWi5ab2RSYXdTaGFwZSA9IGFueSxcclxuPiA9IHtcclxuICBzY2hlbWE6IFouWm9kT2JqZWN0PFQ+O1xyXG4gIGRlZmF1bHRWYWx1ZTogWi5pbmZlcjxaLlpvZE9iamVjdDxUPj47XHJcbiAgcGFyc2U6IChyYXdDb25maWc6IHVua25vd24pID0+IFouaW5mZXI8Wi5ab2RPYmplY3Q8VD4+O1xyXG59O1xyXG5jb25zdCBjcmVhdGVDb25maWdEZWZpbml0aW9uID0gPFxyXG4gIFQgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4gIF9QIGV4dGVuZHMgWi5ab2RSYXdTaGFwZSA9IGFueSxcclxuPihcclxuICBkZWZpbml0aW9uOiBDb25maWdEZWZpbml0aW9uPFQsIF9QPixcclxuKSA9PiBkZWZpbml0aW9uO1xyXG5cclxudHlwZSBDb25maWdEZWZpbml0aW9uRXh0ZW5zaW9uUGFyYW1zPFxyXG4gIFQgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4gIFAgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4+ID0ge1xyXG4gIGNyZWF0ZVNjaGVtYTogKGJhc2VTY2hlbWE6IFouWm9kT2JqZWN0PFA+KSA9PiBaLlpvZE9iamVjdDxUPjtcclxuICBjcmVhdGVEZWZhdWx0VmFsdWU6IChcclxuICAgIGJhc2VEZWZhdWx0VmFsdWU6IFouaW5mZXI8Wi5ab2RPYmplY3Q8UD4+LFxyXG4gICkgPT4gWi5pbmZlcjxaLlpvZE9iamVjdDxUPj47XHJcbiAgY3JlYXRlVXBncmFkZXI6IChcclxuICAgIGNvbmZpZzogWi5pbmZlcjxaLlpvZE9iamVjdDxQPj4sXHJcbiAgICBzY2hlbWE6IFouWm9kT2JqZWN0PFQ+LFxyXG4gICAgZGVmYXVsdFZhbHVlOiBaLmluZmVyPFouWm9kT2JqZWN0PFQ+PixcclxuICApID0+IFouaW5mZXI8Wi5ab2RPYmplY3Q8VD4+O1xyXG59O1xyXG5jb25zdCBleHRlbmRDb25maWdEZWZpbml0aW9uID0gPFxyXG4gIFQgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4gIFAgZXh0ZW5kcyBaLlpvZFJhd1NoYXBlLFxyXG4+KFxyXG4gIGRlZmluaXRpb246IENvbmZpZ0RlZmluaXRpb248UCwgYW55PixcclxuICBwYXJhbXM6IENvbmZpZ0RlZmluaXRpb25FeHRlbnNpb25QYXJhbXM8VCwgUD4sXHJcbikgPT4ge1xyXG4gIGNvbnN0IHNjaGVtYSA9IHBhcmFtcy5jcmVhdGVTY2hlbWEoZGVmaW5pdGlvbi5zY2hlbWEpO1xyXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IHBhcmFtcy5jcmVhdGVEZWZhdWx0VmFsdWUoZGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUpO1xyXG4gIGNvbnN0IHVwZ3JhZGVyID0gKGNvbmZpZzogWi5pbmZlcjxaLlpvZE9iamVjdDxQPj4pID0+XHJcbiAgICBwYXJhbXMuY3JlYXRlVXBncmFkZXIoY29uZmlnLCBzY2hlbWEsIGRlZmF1bHRWYWx1ZSk7XHJcblxyXG4gIHJldHVybiBjcmVhdGVDb25maWdEZWZpbml0aW9uKHtcclxuICAgIHNjaGVtYSxcclxuICAgIGRlZmF1bHRWYWx1ZSxcclxuICAgIHBhcnNlOiAocmF3Q29uZmlnKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNhZmVSZXN1bHQgPSBzY2hlbWEuc2FmZVBhcnNlKHJhd0NvbmZpZyk7XHJcbiAgICAgIGlmIChzYWZlUmVzdWx0LnN1Y2Nlc3MpIHtcclxuICAgICAgICByZXR1cm4gc2FmZVJlc3VsdC5kYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBsb2NhbGVFcnJvcnMgPSBzYWZlUmVzdWx0LmVycm9yLmVycm9yc1xyXG4gICAgICAgIC5maWx0ZXIoKGlzc3VlKSA9PiBpc3N1ZS5tZXNzYWdlLmluY2x1ZGVzKFwiSW52YWxpZCBsb2NhbGUgY29kZVwiKSlcclxuICAgICAgICAubWFwKChpc3N1ZSkgPT4ge1xyXG4gICAgICAgICAgbGV0IHVuc3VwcG9ydGVkTG9jYWxlID0gXCJcIjtcclxuICAgICAgICAgIGNvbnN0IHBhdGggPSBpc3N1ZS5wYXRoO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHJhd0NvbmZpZyBhcyB7IGxvY2FsZT86IHsgW2tleTogc3RyaW5nXTogYW55IH0gfTtcclxuXHJcbiAgICAgICAgICBpZiAoY29uZmlnLmxvY2FsZSkge1xyXG4gICAgICAgICAgICB1bnN1cHBvcnRlZExvY2FsZSA9IHBhdGgucmVkdWNlPGFueT4oKGFjYywga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGFjYyAmJiB0eXBlb2YgYWNjID09PSBcIm9iamVjdFwiICYmIGtleSBpbiBhY2MpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY2Nba2V5XTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICAgICAgfSwgY29uZmlnLmxvY2FsZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIGBVbnN1cHBvcnRlZCBsb2NhbGU6ICR7dW5zdXBwb3J0ZWRMb2NhbGV9YDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChsb2NhbGVFcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXFxuJHtsb2NhbGVFcnJvcnMuam9pbihcIlxcblwiKX1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgYmFzZUNvbmZpZyA9IGRlZmluaXRpb24ucGFyc2UocmF3Q29uZmlnKTtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gdXBncmFkZXIoYmFzZUNvbmZpZyk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8gYW55IC0+IHYwXHJcbmNvbnN0IGNvbmZpZ1YwU2NoZW1hID0gWi5vYmplY3Qoe1xyXG4gIHZlcnNpb246IFoudW5pb24oW1oubnVtYmVyKCksIFouc3RyaW5nKCldKVxyXG4gICAgLmRlZmF1bHQoMClcclxuICAgIC5kZXNjcmliZShcIlRoZSB2ZXJzaW9uIG51bWJlciBvZiB0aGUgc2NoZW1hLlwiKSxcclxufSk7XHJcbmV4cG9ydCBjb25zdCBjb25maWdWMERlZmluaXRpb24gPSBjcmVhdGVDb25maWdEZWZpbml0aW9uKHtcclxuICBzY2hlbWE6IGNvbmZpZ1YwU2NoZW1hLFxyXG4gIGRlZmF1bHRWYWx1ZTogeyB2ZXJzaW9uOiAwIH0sXHJcbiAgcGFyc2U6IChyYXdDb25maWcpID0+IHtcclxuICAgIHJldHVybiBjb25maWdWMFNjaGVtYS5wYXJzZShyYXdDb25maWcpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gdjAgLT4gdjFcclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxRGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oY29uZmlnVjBEZWZpbml0aW9uLCB7XHJcbiAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgIGJhc2VTY2hlbWEuZXh0ZW5kKHtcclxuICAgICAgbG9jYWxlOiBsb2NhbGVTY2hlbWEsXHJcbiAgICAgIGJ1Y2tldHM6IFoucmVjb3JkKFouc3RyaW5nKCksIGJ1Y2tldFR5cGVTY2hlbWEpXHJcbiAgICAgICAgLmRlZmF1bHQoe30pXHJcbiAgICAgICAgLmRlc2NyaWJlKFxyXG4gICAgICAgICAgXCJNYXBwaW5nIG9mIHNvdXJjZSBmaWxlIHBhdGhzIChnbG9iIHBhdHRlcm5zKSB0byBidWNrZXQgdHlwZXMuXCIsXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5vcHRpb25hbCgpLFxyXG4gICAgfSksXHJcbiAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoKSA9PiAoe1xyXG4gICAgdmVyc2lvbjogMSxcclxuICAgIGxvY2FsZToge1xyXG4gICAgICBzb3VyY2U6IFwiZW5cIiBhcyBjb25zdCxcclxuICAgICAgdGFyZ2V0czogW1wiZXNcIiBhcyBjb25zdF0sXHJcbiAgICB9LFxyXG4gICAgYnVja2V0czoge30sXHJcbiAgfSksXHJcbiAgY3JlYXRlVXBncmFkZXI6ICgpID0+ICh7XHJcbiAgICB2ZXJzaW9uOiAxLFxyXG4gICAgbG9jYWxlOiB7XHJcbiAgICAgIHNvdXJjZTogXCJlblwiIGFzIGNvbnN0LFxyXG4gICAgICB0YXJnZXRzOiBbXCJlc1wiIGFzIGNvbnN0XSxcclxuICAgIH0sXHJcbiAgICBidWNrZXRzOiB7fSxcclxuICB9KSxcclxufSk7XHJcblxyXG4vLyB2MSAtPiB2MS4xXHJcbmV4cG9ydCBjb25zdCBjb25maWdWMV8xRGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oY29uZmlnVjFEZWZpbml0aW9uLCB7XHJcbiAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgIGJhc2VTY2hlbWEuZXh0ZW5kKHtcclxuICAgICAgYnVja2V0czogWi5yZWNvcmQoXHJcbiAgICAgICAgYnVja2V0VHlwZVNjaGVtYSxcclxuICAgICAgICBaLm9iamVjdCh7XHJcbiAgICAgICAgICBpbmNsdWRlOiBaLmFycmF5KFouc3RyaW5nKCkpXHJcbiAgICAgICAgICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgICAgICAgICAuZGVzY3JpYmUoXHJcbiAgICAgICAgICAgICAgXCJGaWxlIHBhdGhzIG9yIGdsb2IgcGF0dGVybnMgdG8gaW5jbHVkZSBmb3IgdGhpcyBidWNrZXQuXCIsXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICBleGNsdWRlOiBaLmFycmF5KFouc3RyaW5nKCkpXHJcbiAgICAgICAgICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgICAgICAuZGVzY3JpYmUoXHJcbiAgICAgICAgICAgICAgXCJGaWxlIHBhdGhzIG9yIGdsb2IgcGF0dGVybnMgdG8gZXhjbHVkZSBmcm9tIHRoaXMgYnVja2V0LlwiLFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICApLmRlZmF1bHQoe30pLFxyXG4gICAgfSksXHJcbiAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgIC4uLmJhc2VEZWZhdWx0VmFsdWUsXHJcbiAgICB2ZXJzaW9uOiAxLjEsXHJcbiAgICBidWNrZXRzOiB7fSxcclxuICB9KSxcclxuICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZywgc2NoZW1hKSA9PiB7XHJcbiAgICBjb25zdCB1cGdyYWRlZENvbmZpZzogWi5pbmZlcjx0eXBlb2Ygc2NoZW1hPiA9IHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjEsXHJcbiAgICAgIGJ1Y2tldHM6IHt9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBUcmFuc2Zvcm0gYnVja2V0cyBmcm9tIHYxIHRvIHYxLjEgZm9ybWF0XHJcbiAgICBpZiAob2xkQ29uZmlnLmJ1Y2tldHMpIHtcclxuICAgICAgZm9yIChjb25zdCBbYnVja2V0UGF0aCwgYnVja2V0VHlwZV0gb2YgT2JqZWN0LmVudHJpZXMoXHJcbiAgICAgICAgb2xkQ29uZmlnLmJ1Y2tldHMsXHJcbiAgICAgICkpIHtcclxuICAgICAgICBpZiAoIXVwZ3JhZGVkQ29uZmlnLmJ1Y2tldHNbYnVja2V0VHlwZV0pIHtcclxuICAgICAgICAgIHVwZ3JhZGVkQ29uZmlnLmJ1Y2tldHNbYnVja2V0VHlwZV0gPSB7XHJcbiAgICAgICAgICAgIGluY2x1ZGU6IFtdLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBncmFkZWRDb25maWcuYnVja2V0c1tidWNrZXRUeXBlXT8uaW5jbHVkZS5wdXNoKGJ1Y2tldFBhdGgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHVwZ3JhZGVkQ29uZmlnO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gdjEuMSAtPiB2MS4yXHJcbi8vIENoYW5nZXM6IEFkZCBcImV4dHJhU291cmNlXCIgb3B0aW9uYWwgZmllbGQgdG8gdGhlIGxvY2FsZSBub2RlIG9mIHRoZSBjb25maWdcclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxXzJEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV8xRGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgbG9jYWxlOiBsb2NhbGVTY2hlbWEuZXh0ZW5kKHtcclxuICAgICAgICAgIGV4dHJhU291cmNlOiBsb2NhbGVDb2RlU2NoZW1hXHJcbiAgICAgICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgICAgIC5kZXNjcmliZShcclxuICAgICAgICAgICAgICBcIk9wdGlvbmFsIGV4dHJhIHNvdXJjZSBsb2NhbGUgY29kZSB1c2VkIGFzIGZhbGxiYWNrIGR1cmluZyB0cmFuc2xhdGlvbi5cIixcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICB9KSxcclxuICAgICAgfSksXHJcbiAgICBjcmVhdGVEZWZhdWx0VmFsdWU6IChiYXNlRGVmYXVsdFZhbHVlKSA9PiAoe1xyXG4gICAgICAuLi5iYXNlRGVmYXVsdFZhbHVlLFxyXG4gICAgICB2ZXJzaW9uOiAxLjIsXHJcbiAgICB9KSxcclxuICAgIGNyZWF0ZVVwZ3JhZGVyOiAob2xkQ29uZmlnKSA9PiAoe1xyXG4gICAgICAuLi5vbGRDb25maWcsXHJcbiAgICAgIHZlcnNpb246IDEuMixcclxuICAgIH0pLFxyXG4gIH0sXHJcbik7XHJcblxyXG4vLyB2MS4yIC0+IHYxLjNcclxuLy8gQ2hhbmdlczogU3VwcG9ydCBib3RoIHN0cmluZyBwYXRocyBhbmQge3BhdGgsIGRlbGltaXRlcn0gb2JqZWN0cyBpbiBidWNrZXQgaW5jbHVkZS9leGNsdWRlIGFycmF5c1xyXG5leHBvcnQgY29uc3QgYnVja2V0SXRlbVNjaGVtYSA9IFoub2JqZWN0KHtcclxuICBwYXRoOiBaLnN0cmluZygpLmRlc2NyaWJlKFwiUGF0aCBwYXR0ZXJuIGNvbnRhaW5pbmcgYSBbbG9jYWxlXSBwbGFjZWhvbGRlci5cIiksXHJcbiAgZGVsaW1pdGVyOiBaLnVuaW9uKFtaLmxpdGVyYWwoXCItXCIpLCBaLmxpdGVyYWwoXCJfXCIpLCBaLmxpdGVyYWwobnVsbCldKVxyXG4gICAgLm9wdGlvbmFsKClcclxuICAgIC5kZXNjcmliZShcclxuICAgICAgXCJEZWxpbWl0ZXIgdGhhdCByZXBsYWNlcyB0aGUgW2xvY2FsZV0gcGxhY2Vob2xkZXIgaW4gdGhlIHBhdGggKGRlZmF1bHQ6IG5vIGRlbGltaXRlcikuXCIsXHJcbiAgICApLFxyXG59KS5kZXNjcmliZShcclxuICBcIkJ1Y2tldCBwYXRoIGl0ZW0uIEVpdGhlciBhIHN0cmluZyBwYXRoIG9yIGFuIG9iamVjdCBzcGVjaWZ5aW5nIHBhdGggYW5kIGRlbGltaXRlci5cIixcclxuKTtcclxuZXhwb3J0IHR5cGUgQnVja2V0SXRlbSA9IFouaW5mZXI8dHlwZW9mIGJ1Y2tldEl0ZW1TY2hlbWE+O1xyXG5cclxuLy8gRGVmaW5lIGEgYmFzZSBidWNrZXQgdmFsdWUgc2NoZW1hIHRoYXQgY2FuIGJlIHJldXNlZCBhbmQgZXh0ZW5kZWRcclxuZXhwb3J0IGNvbnN0IGJ1Y2tldFZhbHVlU2NoZW1hVjFfMyA9IFoub2JqZWN0KHtcclxuICBpbmNsdWRlOiBaLmFycmF5KFoudW5pb24oW1ouc3RyaW5nKCksIGJ1Y2tldEl0ZW1TY2hlbWFdKSlcclxuICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgLmRlc2NyaWJlKFwiR2xvYiBwYXR0ZXJucyBvciBidWNrZXQgaXRlbXMgdG8gaW5jbHVkZSBmb3IgdGhpcyBidWNrZXQuXCIpLFxyXG4gIGV4Y2x1ZGU6IFouYXJyYXkoWi51bmlvbihbWi5zdHJpbmcoKSwgYnVja2V0SXRlbVNjaGVtYV0pKVxyXG4gICAgLmRlZmF1bHQoW10pXHJcbiAgICAub3B0aW9uYWwoKVxyXG4gICAgLmRlc2NyaWJlKFwiR2xvYiBwYXR0ZXJucyBvciBidWNrZXQgaXRlbXMgdG8gZXhjbHVkZSBmcm9tIHRoaXMgYnVja2V0LlwiKSxcclxuICBpbmplY3RMb2NhbGU6IFouYXJyYXkoWi5zdHJpbmcoKSlcclxuICAgIC5vcHRpb25hbCgpXHJcbiAgICAuZGVzY3JpYmUoXHJcbiAgICAgIFwiS2V5cyB3aXRoaW4gZmlsZXMgd2hlcmUgdGhlIGN1cnJlbnQgbG9jYWxlIHNob3VsZCBiZSBpbmplY3RlZCBvciByZW1vdmVkLlwiLFxyXG4gICAgKSxcclxufSkuZGVzY3JpYmUoXCJDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIGEgdHJhbnNsYXRpb24gYnVja2V0LlwiKTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWdWMV8zRGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oXHJcbiAgY29uZmlnVjFfMkRlZmluaXRpb24sXHJcbiAge1xyXG4gICAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgICAgYmFzZVNjaGVtYS5leHRlbmQoe1xyXG4gICAgICAgIGJ1Y2tldHM6IFoucmVjb3JkKGJ1Y2tldFR5cGVTY2hlbWEsIGJ1Y2tldFZhbHVlU2NoZW1hVjFfMykuZGVmYXVsdCh7fSksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS4zLFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjMsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuY29uc3QgY29uZmlnU2NoZW1hID0gXCJodHRwczovL2xpbmdvLmRldi9zY2hlbWEvaTE4bi5qc29uXCI7XHJcblxyXG4vLyB2MS4zIC0+IHYxLjRcclxuLy8gQ2hhbmdlczogQWRkICRzY2hlbWEgdG8gdGhlIGNvbmZpZ1xyXG5leHBvcnQgY29uc3QgY29uZmlnVjFfNERlZmluaXRpb24gPSBleHRlbmRDb25maWdEZWZpbml0aW9uKFxyXG4gIGNvbmZpZ1YxXzNEZWZpbml0aW9uLFxyXG4gIHtcclxuICAgIGNyZWF0ZVNjaGVtYTogKGJhc2VTY2hlbWEpID0+XHJcbiAgICAgIGJhc2VTY2hlbWEuZXh0ZW5kKHtcclxuICAgICAgICAkc2NoZW1hOiBaLnN0cmluZygpLmRlZmF1bHQoY29uZmlnU2NoZW1hKSxcclxuICAgICAgfSksXHJcbiAgICBjcmVhdGVEZWZhdWx0VmFsdWU6IChiYXNlRGVmYXVsdFZhbHVlKSA9PiAoe1xyXG4gICAgICAuLi5iYXNlRGVmYXVsdFZhbHVlLFxyXG4gICAgICB2ZXJzaW9uOiAxLjQsXHJcbiAgICAgICRzY2hlbWE6IGNvbmZpZ1NjaGVtYSxcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlVXBncmFkZXI6IChvbGRDb25maWcpID0+ICh7XHJcbiAgICAgIC4uLm9sZENvbmZpZyxcclxuICAgICAgdmVyc2lvbjogMS40LFxyXG4gICAgICAkc2NoZW1hOiBjb25maWdTY2hlbWEsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gdjEuNCAtPiB2MS41XHJcbi8vIENoYW5nZXM6IGFkZCBcInByb3ZpZGVyXCIgZmllbGQgdG8gdGhlIGNvbmZpZ1xyXG5jb25zdCBwcm92aWRlclNjaGVtYSA9IFoub2JqZWN0KHtcclxuICBpZDogWi5lbnVtKFtcclxuICAgIFwib3BlbmFpXCIsXHJcbiAgICBcImFudGhyb3BpY1wiLFxyXG4gICAgXCJnb29nbGVcIixcclxuICAgIFwib2xsYW1hXCIsXHJcbiAgICBcIm9wZW5yb3V0ZXJcIixcclxuICAgIFwibWlzdHJhbFwiLFxyXG4gIF0pLmRlc2NyaWJlKFwiSWRlbnRpZmllciBvZiB0aGUgdHJhbnNsYXRpb24gcHJvdmlkZXIgc2VydmljZS5cIiksXHJcbiAgbW9kZWw6IFouc3RyaW5nKCkuZGVzY3JpYmUoXCJNb2RlbCBuYW1lIHRvIHVzZSBmb3IgdHJhbnNsYXRpb25zLlwiKSxcclxuICBwcm9tcHQ6IFouc3RyaW5nKCkuZGVzY3JpYmUoXHJcbiAgICBcIlByb21wdCB0ZW1wbGF0ZSB1c2VkIHdoZW4gcmVxdWVzdGluZyB0cmFuc2xhdGlvbnMuXCIsXHJcbiAgKSxcclxuICBiYXNlVXJsOiBaLnN0cmluZygpXHJcbiAgICAub3B0aW9uYWwoKVxyXG4gICAgLmRlc2NyaWJlKFwiQ3VzdG9tIGJhc2UgVVJMIGZvciB0aGUgcHJvdmlkZXIgQVBJIChvcHRpb25hbCkuXCIpLFxyXG59KS5kZXNjcmliZShcIkNvbmZpZ3VyYXRpb24gZm9yIHRoZSBtYWNoaW5lLXRyYW5zbGF0aW9uIHByb3ZpZGVyLlwiKTtcclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxXzVEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV80RGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgcHJvdmlkZXI6IHByb3ZpZGVyU2NoZW1hLm9wdGlvbmFsKCksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS41LFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjUsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gdjEuNSAtPiB2MS42XHJcbi8vIENoYW5nZXM6IEFkZCBcImxvY2tlZEtleXNcIiBzdHJpbmcgYXJyYXkgdG8gYnVja2V0IGNvbmZpZ1xyXG5leHBvcnQgY29uc3QgYnVja2V0VmFsdWVTY2hlbWFWMV82ID0gYnVja2V0VmFsdWVTY2hlbWFWMV8zLmV4dGVuZCh7XHJcbiAgbG9ja2VkS2V5czogWi5hcnJheShaLnN0cmluZygpKVxyXG4gICAgLmRlZmF1bHQoW10pXHJcbiAgICAub3B0aW9uYWwoKVxyXG4gICAgLmRlc2NyaWJlKFxyXG4gICAgICBcIktleXMgdGhhdCBtdXN0IHJlbWFpbiB1bmNoYW5nZWQgYW5kIHNob3VsZCBuZXZlciBiZSBvdmVyd3JpdHRlbiBieSB0cmFuc2xhdGlvbnMuXCIsXHJcbiAgICApLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWdWMV82RGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oXHJcbiAgY29uZmlnVjFfNURlZmluaXRpb24sXHJcbiAge1xyXG4gICAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgICAgYmFzZVNjaGVtYS5leHRlbmQoe1xyXG4gICAgICAgIGJ1Y2tldHM6IFoucmVjb3JkKGJ1Y2tldFR5cGVTY2hlbWEsIGJ1Y2tldFZhbHVlU2NoZW1hVjFfNikuZGVmYXVsdCh7fSksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS42LFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjYsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gQ2hhbmdlczogQWRkIFwibG9ja2VkUGF0dGVybnNcIiBzdHJpbmcgYXJyYXkgb2YgcmVnZXggcGF0dGVybnMgdG8gYnVja2V0IGNvbmZpZ1xyXG5leHBvcnQgY29uc3QgYnVja2V0VmFsdWVTY2hlbWFWMV83ID0gYnVja2V0VmFsdWVTY2hlbWFWMV82LmV4dGVuZCh7XHJcbiAgbG9ja2VkUGF0dGVybnM6IFouYXJyYXkoWi5zdHJpbmcoKSlcclxuICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgLm9wdGlvbmFsKClcclxuICAgIC5kZXNjcmliZShcclxuICAgICAgXCJSZWd1bGFyIGV4cHJlc3Npb24gcGF0dGVybnMgd2hvc2UgbWF0Y2hlZCBjb250ZW50IHNob3VsZCByZW1haW4gbG9ja2VkIGR1cmluZyB0cmFuc2xhdGlvbi5cIixcclxuICAgICksXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxXzdEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV82RGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgYnVja2V0czogWi5yZWNvcmQoYnVja2V0VHlwZVNjaGVtYSwgYnVja2V0VmFsdWVTY2hlbWFWMV83KS5kZWZhdWx0KHt9KSxcclxuICAgICAgfSksXHJcbiAgICBjcmVhdGVEZWZhdWx0VmFsdWU6IChiYXNlRGVmYXVsdFZhbHVlKSA9PiAoe1xyXG4gICAgICAuLi5iYXNlRGVmYXVsdFZhbHVlLFxyXG4gICAgICB2ZXJzaW9uOiAxLjcsXHJcbiAgICB9KSxcclxuICAgIGNyZWF0ZVVwZ3JhZGVyOiAob2xkQ29uZmlnKSA9PiAoe1xyXG4gICAgICAuLi5vbGRDb25maWcsXHJcbiAgICAgIHZlcnNpb246IDEuNyxcclxuICAgIH0pLFxyXG4gIH0sXHJcbik7XHJcblxyXG4vLyB2MS43IC0+IHYxLjhcclxuLy8gQ2hhbmdlczogQWRkIFwiaWdub3JlZEtleXNcIiBzdHJpbmcgYXJyYXkgdG8gYnVja2V0IGNvbmZpZ1xyXG5leHBvcnQgY29uc3QgYnVja2V0VmFsdWVTY2hlbWFWMV84ID0gYnVja2V0VmFsdWVTY2hlbWFWMV83LmV4dGVuZCh7XHJcbiAgaWdub3JlZEtleXM6IFouYXJyYXkoWi5zdHJpbmcoKSlcclxuICAgIC5kZWZhdWx0KFtdKVxyXG4gICAgLm9wdGlvbmFsKClcclxuICAgIC5kZXNjcmliZShcclxuICAgICAgXCJLZXlzIHRoYXQgc2hvdWxkIGJlIGNvbXBsZXRlbHkgaWdub3JlZCBieSB0cmFuc2xhdGlvbiBwcm9jZXNzZXMuXCIsXHJcbiAgICApLFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWdWMV84RGVmaW5pdGlvbiA9IGV4dGVuZENvbmZpZ0RlZmluaXRpb24oXHJcbiAgY29uZmlnVjFfN0RlZmluaXRpb24sXHJcbiAge1xyXG4gICAgY3JlYXRlU2NoZW1hOiAoYmFzZVNjaGVtYSkgPT5cclxuICAgICAgYmFzZVNjaGVtYS5leHRlbmQoe1xyXG4gICAgICAgIGJ1Y2tldHM6IFoucmVjb3JkKGJ1Y2tldFR5cGVTY2hlbWEsIGJ1Y2tldFZhbHVlU2NoZW1hVjFfOCkuZGVmYXVsdCh7fSksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS44LFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjgsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gdjEuOCAtPiB2MS45XHJcbi8vIENoYW5nZXM6IEFkZCBcImZvcm1hdHRlclwiIGZpZWxkIHRvIHRvcC1sZXZlbCBjb25maWdcclxuZXhwb3J0IGNvbnN0IGNvbmZpZ1YxXzlEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV84RGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgZm9ybWF0dGVyOiBaLmVudW0oW1wicHJldHRpZXJcIiwgXCJiaW9tZVwiXSlcclxuICAgICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgICAuZGVzY3JpYmUoXHJcbiAgICAgICAgICAgIFwiQ29kZSBmb3JtYXR0ZXIgdG8gdXNlIGZvciBhbGwgYnVja2V0cy4gRGVmYXVsdHMgdG8gJ3ByZXR0aWVyJyBpZiBub3Qgc3BlY2lmaWVkIGFuZCBhIHByZXR0aWVyIGNvbmZpZyBpcyBmb3VuZC5cIixcclxuICAgICAgICAgICksXHJcbiAgICAgIH0pLFxyXG4gICAgY3JlYXRlRGVmYXVsdFZhbHVlOiAoYmFzZURlZmF1bHRWYWx1ZSkgPT4gKHtcclxuICAgICAgLi4uYmFzZURlZmF1bHRWYWx1ZSxcclxuICAgICAgdmVyc2lvbjogMS45LFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVVcGdyYWRlcjogKG9sZENvbmZpZykgPT4gKHtcclxuICAgICAgLi4ub2xkQ29uZmlnLFxyXG4gICAgICB2ZXJzaW9uOiAxLjksXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gdjEuOSAtPiB2MS4xMFxyXG4vLyBDaGFuZ2VzOiBBZGQgXCJzZXR0aW5nc1wiIGZpZWxkIHRvIHByb3ZpZGVyIGNvbmZpZyBmb3IgbW9kZWwtc3BlY2lmaWMgcGFyYW1ldGVyc1xyXG5jb25zdCBtb2RlbFNldHRpbmdzU2NoZW1hID0gWi5vYmplY3Qoe1xyXG4gIHRlbXBlcmF0dXJlOiBaLm51bWJlcigpXHJcbiAgICAubWluKDApXHJcbiAgICAubWF4KDIpXHJcbiAgICAub3B0aW9uYWwoKVxyXG4gICAgLmRlc2NyaWJlKFxyXG4gICAgICBcIkNvbnRyb2xzIHJhbmRvbW5lc3MgaW4gbW9kZWwgb3V0cHV0cyAoMD1kZXRlcm1pbmlzdGljLCAyPXZlcnkgcmFuZG9tKS4gU29tZSBtb2RlbHMgbGlrZSBHUFQtNSByZXF1aXJlIHRlbXBlcmF0dXJlPTEuXCIsXHJcbiAgICApLFxyXG59KVxyXG4gIC5vcHRpb25hbCgpXHJcbiAgLmRlc2NyaWJlKFwiTW9kZWwtc3BlY2lmaWMgc2V0dGluZ3MgZm9yIHRyYW5zbGF0aW9uIHJlcXVlc3RzLlwiKTtcclxuXHJcbmNvbnN0IHByb3ZpZGVyU2NoZW1hVjFfMTAgPSBaLm9iamVjdCh7XHJcbiAgaWQ6IFouZW51bShbXHJcbiAgICBcIm9wZW5haVwiLFxyXG4gICAgXCJhbnRocm9waWNcIixcclxuICAgIFwiZ29vZ2xlXCIsXHJcbiAgICBcIm9sbGFtYVwiLFxyXG4gICAgXCJvcGVucm91dGVyXCIsXHJcbiAgICBcIm1pc3RyYWxcIixcclxuICBdKS5kZXNjcmliZShcIklkZW50aWZpZXIgb2YgdGhlIHRyYW5zbGF0aW9uIHByb3ZpZGVyIHNlcnZpY2UuXCIpLFxyXG4gIG1vZGVsOiBaLnN0cmluZygpLmRlc2NyaWJlKFwiTW9kZWwgbmFtZSB0byB1c2UgZm9yIHRyYW5zbGF0aW9ucy5cIiksXHJcbiAgcHJvbXB0OiBaLnN0cmluZygpLmRlc2NyaWJlKFxyXG4gICAgXCJQcm9tcHQgdGVtcGxhdGUgdXNlZCB3aGVuIHJlcXVlc3RpbmcgdHJhbnNsYXRpb25zLlwiLFxyXG4gICksXHJcbiAgYmFzZVVybDogWi5zdHJpbmcoKVxyXG4gICAgLm9wdGlvbmFsKClcclxuICAgIC5kZXNjcmliZShcIkN1c3RvbSBiYXNlIFVSTCBmb3IgdGhlIHByb3ZpZGVyIEFQSSAob3B0aW9uYWwpLlwiKSxcclxuICBzZXR0aW5nczogbW9kZWxTZXR0aW5nc1NjaGVtYSxcclxufSkuZGVzY3JpYmUoXCJDb25maWd1cmF0aW9uIGZvciB0aGUgbWFjaGluZS10cmFuc2xhdGlvbiBwcm92aWRlci5cIik7XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnVjFfMTBEZWZpbml0aW9uID0gZXh0ZW5kQ29uZmlnRGVmaW5pdGlvbihcclxuICBjb25maWdWMV85RGVmaW5pdGlvbixcclxuICB7XHJcbiAgICBjcmVhdGVTY2hlbWE6IChiYXNlU2NoZW1hKSA9PlxyXG4gICAgICBiYXNlU2NoZW1hLmV4dGVuZCh7XHJcbiAgICAgICAgcHJvdmlkZXI6IHByb3ZpZGVyU2NoZW1hVjFfMTAub3B0aW9uYWwoKSxcclxuICAgICAgfSksXHJcbiAgICBjcmVhdGVEZWZhdWx0VmFsdWU6IChiYXNlRGVmYXVsdFZhbHVlKSA9PiAoe1xyXG4gICAgICAuLi5iYXNlRGVmYXVsdFZhbHVlLFxyXG4gICAgICB2ZXJzaW9uOiBcIjEuMTBcIixcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlVXBncmFkZXI6IChvbGRDb25maWcpID0+ICh7XHJcbiAgICAgIC4uLm9sZENvbmZpZyxcclxuICAgICAgdmVyc2lvbjogXCIxLjEwXCIsXHJcbiAgICB9KSxcclxuICB9LFxyXG4pO1xyXG5cclxuLy8gZXhwb3J0c1xyXG5leHBvcnQgY29uc3QgTEFURVNUX0NPTkZJR19ERUZJTklUSU9OID0gY29uZmlnVjFfMTBEZWZpbml0aW9uO1xyXG5cclxuZXhwb3J0IHR5cGUgSTE4bkNvbmZpZyA9IFouaW5mZXI8KHR5cGVvZiBMQVRFU1RfQ09ORklHX0RFRklOSVRJT04pW1wic2NoZW1hXCJdPjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUkxOG5Db25maWcocmF3Q29uZmlnOiB1bmtub3duKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IExBVEVTVF9DT05GSUdfREVGSU5JVElPTi5wYXJzZShyYXdDb25maWcpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBwYXJzZSBjb25maWc6ICR7ZXJyb3IubWVzc2FnZX1gKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0Q29uZmlnID0gTEFURVNUX0NPTkZJR19ERUZJTklUSU9OLmRlZmF1bHRWYWx1ZTtcclxuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXFxcXGxvY2FsZXMudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9IUC9saW5nby5kZXYvcGFja2FnZXMvc3BlYy9zcmMvbG9jYWxlcy50c1wiO2ltcG9ydCBaIGZyb20gXCJ6b2RcIjtcclxuXHJcbmNvbnN0IGxvY2FsZU1hcCA9IHtcclxuICAvLyBVcmR1IChQYWtpc3RhbilcclxuICB1cjogW1widXItUEtcIl0sXHJcbiAgLy8gVmlldG5hbWVzZSAoVmlldG5hbSlcclxuICB2aTogW1widmktVk5cIl0sXHJcbiAgLy8gVHVya2lzaCAoVHVya2V5KVxyXG4gIHRyOiBbXCJ0ci1UUlwiXSxcclxuICAvLyBUYW1pbCAoSW5kaWEpXHJcbiAgdGE6IFtcclxuICAgIFwidGEtSU5cIiwgLy8gSW5kaWFcclxuICAgIFwidGEtU0dcIiwgLy8gU2luZ2Fwb3JlXHJcbiAgXSxcclxuICAvLyBTZXJiaWFuXHJcbiAgc3I6IFtcclxuICAgIFwic3ItUlNcIiwgLy8gU2VyYmlhbiAoTGF0aW4pXHJcbiAgICBcInNyLUxhdG4tUlNcIiwgLy8gU2VyYmlhbiAoTGF0aW4pXHJcbiAgICBcInNyLUN5cmwtUlNcIiwgLy8gU2VyYmlhbiAoQ3lyaWxsaWMpXHJcbiAgXSxcclxuICAvLyBIdW5nYXJpYW4gKEh1bmdhcnkpXHJcbiAgaHU6IFtcImh1LUhVXCJdLFxyXG4gIC8vIEhlYnJldyAoSXNyYWVsKVxyXG4gIGhlOiBbXCJoZS1JTFwiXSxcclxuICAvLyBFc3RvbmlhbiAoRXN0b25pYSlcclxuICBldDogW1wiZXQtRUVcIl0sXHJcbiAgLy8gR3JlZWtcclxuICBlbDogW1xyXG4gICAgXCJlbC1HUlwiLCAvLyBHcmVlY2VcclxuICAgIFwiZWwtQ1lcIiwgLy8gQ3lwcnVzXHJcbiAgXSxcclxuICAvLyBEYW5pc2ggKERlbm1hcmspXHJcbiAgZGE6IFtcImRhLURLXCJdLFxyXG4gIC8vIEF6ZXJiYWlqYW5pIChBemVyYmFpamFuKVxyXG4gIGF6OiBbXCJhei1BWlwiXSxcclxuICAvLyBUaGFpIChUaGFpbGFuZClcclxuICB0aDogW1widGgtVEhcIl0sXHJcbiAgLy8gU3dlZGlzaCAoU3dlZGVuKVxyXG4gIHN2OiBbXCJzdi1TRVwiXSxcclxuICAvLyBFbmdsaXNoXHJcbiAgZW46IFtcclxuICAgIFwiZW4tVVNcIiwgLy8gVW5pdGVkIFN0YXRlc1xyXG4gICAgXCJlbi1HQlwiLCAvLyBVbml0ZWQgS2luZ2RvbVxyXG4gICAgXCJlbi1BVVwiLCAvLyBBdXN0cmFsaWFcclxuICAgIFwiZW4tQ0FcIiwgLy8gQ2FuYWRhXHJcbiAgICBcImVuLVNHXCIsIC8vIFNpbmdhcG9yZVxyXG4gICAgXCJlbi1JRVwiLCAvLyBJcmVsYW5kXHJcbiAgXSxcclxuICAvLyBTcGFuaXNoXHJcbiAgZXM6IFtcclxuICAgIFwiZXMtRVNcIiwgLy8gU3BhaW5cclxuICAgIFwiZXMtNDE5XCIsIC8vIExhdGluIEFtZXJpY2FcclxuICAgIFwiZXMtTVhcIiwgLy8gTWV4aWNvXHJcbiAgICBcImVzLUFSXCIsIC8vIEFyZ2VudGluYVxyXG4gIF0sXHJcbiAgLy8gRnJlbmNoXHJcbiAgZnI6IFtcclxuICAgIFwiZnItRlJcIiwgLy8gRnJhbmNlXHJcbiAgICBcImZyLUNBXCIsIC8vIENhbmFkYVxyXG4gICAgXCJmci1CRVwiLCAvLyBCZWxnaXVtXHJcbiAgICBcImZyLUxVXCIsIC8vIEx1eGVtYm91cmdcclxuICBdLFxyXG4gIC8vIENhdGFsYW4gKFNwYWluKVxyXG4gIGNhOiBbXCJjYS1FU1wiXSxcclxuICAvLyBKYXBhbmVzZSAoSmFwYW4pXHJcbiAgamE6IFtcImphLUpQXCJdLFxyXG4gIC8vIEthemFraCAoS2F6YWtoc3RhbilcclxuICBrazogW1wia2stS1pcIl0sXHJcbiAgLy8gR2VybWFuXHJcbiAgZGU6IFtcclxuICAgIFwiZGUtREVcIiwgLy8gR2VybWFueVxyXG4gICAgXCJkZS1BVFwiLCAvLyBBdXN0cmlhXHJcbiAgICBcImRlLUNIXCIsIC8vIFN3aXR6ZXJsYW5kXHJcbiAgXSxcclxuICAvLyBQb3J0dWd1ZXNlXHJcbiAgcHQ6IFtcclxuICAgIFwicHQtUFRcIiwgLy8gUG9ydHVnYWxcclxuICAgIFwicHQtQlJcIiwgLy8gQnJhemlsXHJcbiAgXSxcclxuICAvLyBJdGFsaWFuXHJcbiAgaXQ6IFtcclxuICAgIFwiaXQtSVRcIiwgLy8gSXRhbHlcclxuICAgIFwiaXQtQ0hcIiwgLy8gU3dpdHplcmxhbmRcclxuICBdLFxyXG4gIC8vIFJ1c3NpYW5cclxuICBydTogW1xyXG4gICAgXCJydS1SVVwiLCAvLyBSdXNzaWFcclxuICAgIFwicnUtQllcIiwgLy8gQmVsYXJ1c1xyXG4gIF0sXHJcbiAgLy8gVWtyYWluaWFuIChVa3JhaW5lKVxyXG4gIHVrOiBbXCJ1ay1VQVwiXSxcclxuICAvLyBCZWxhcnVzaWFuIChCZWxhcnVzKVxyXG4gIGJlOiBbXCJiZS1CWVwiXSxcclxuICAvLyBIaW5kaSAoSW5kaWEpXHJcbiAgaGk6IFtcImhpLUlOXCJdLFxyXG4gIC8vIENoaW5lc2VcclxuICB6aDogW1xyXG4gICAgXCJ6aC1DTlwiLCAvLyBTaW1wbGlmaWVkIENoaW5lc2UgKENoaW5hKVxyXG4gICAgXCJ6aC1UV1wiLCAvLyBUcmFkaXRpb25hbCBDaGluZXNlIChUYWl3YW4pXHJcbiAgICBcInpoLUhLXCIsIC8vIFRyYWRpdGlvbmFsIENoaW5lc2UgKEhvbmcgS29uZylcclxuICAgIFwiemgtU0dcIiwgLy8gU2ltcGxpZmllZCBDaGluZXNlIChTaW5nYXBvcmUpXHJcbiAgICBcInpoLUhhbnNcIiwgLy8gU2ltcGxpZmllZCBDaGluZXNlXHJcbiAgICBcInpoLUhhbnRcIiwgLy8gVHJhZGl0aW9uYWwgQ2hpbmVzZVxyXG4gICAgXCJ6aC1IYW50LUhLXCIsIC8vIFRyYWRpdGlvbmFsIENoaW5lc2UgKEhvbmcgS29uZylcclxuICAgIFwiemgtSGFudC1UV1wiLCAvLyBUcmFkaXRpb25hbCBDaGluZXNlIChUYWl3YW4pXHJcbiAgICBcInpoLUhhbnQtQ05cIiwgLy8gVHJhZGl0aW9uYWwgQ2hpbmVzZSAoQ2hpbmEpXHJcbiAgICBcInpoLUhhbnMtSEtcIiwgLy8gU2ltcGxpZmllZCBDaGluZXNlIChIb25nIEtvbmcpXHJcbiAgICBcInpoLUhhbnMtVFdcIiwgLy8gU2ltcGxpZmllZCBDaGluZXNlIChDaGluYSlcclxuICAgIFwiemgtSGFucy1DTlwiLCAvLyBTaW1wbGlmaWVkIENoaW5lc2UgKENoaW5hKVxyXG4gIF0sXHJcbiAgLy8gS29yZWFuIChTb3V0aCBLb3JlYSlcclxuICBrbzogW1wia28tS1JcIl0sXHJcbiAgLy8gQXJhYmljXHJcbiAgYXI6IFtcclxuICAgIFwiYXItRUdcIiwgLy8gRWd5cHRcclxuICAgIFwiYXItU0FcIiwgLy8gU2F1ZGkgQXJhYmlhXHJcbiAgICBcImFyLUFFXCIsIC8vIFVuaXRlZCBBcmFiIEVtaXJhdGVzXHJcbiAgICBcImFyLU1BXCIsIC8vIE1vcm9jY29cclxuICBdLFxyXG4gIC8vIEJ1bGdhcmlhbiAoQnVsZ2FyaWEpXHJcbiAgYmc6IFtcImJnLUJHXCJdLFxyXG4gIC8vIEN6ZWNoIChDemVjaCBSZXB1YmxpYylcclxuICBjczogW1wiY3MtQ1pcIl0sXHJcbiAgLy8gV2Vsc2ggKFdhbGVzKVxyXG4gIGN5OiBbXCJjeS1HQlwiXSxcclxuICAvLyBEdXRjaFxyXG4gIG5sOiBbXHJcbiAgICBcIm5sLU5MXCIsIC8vIE5ldGhlcmxhbmRzXHJcbiAgICBcIm5sLUJFXCIsIC8vIEJlbGdpdW1cclxuICBdLFxyXG4gIC8vIFBvbGlzaCAoUG9sYW5kKVxyXG4gIHBsOiBbXCJwbC1QTFwiXSxcclxuICAvLyBJbmRvbmVzaWFuIChJbmRvbmVzaWEpXHJcbiAgaWQ6IFtcImlkLUlEXCJdLFxyXG4gIGlzOiBbXCJpcy1JU1wiXSxcclxuICAvLyBNYWxheSAoTWFsYXlzaWEpXHJcbiAgbXM6IFtcIm1zLU1ZXCJdLFxyXG4gIC8vIEZpbm5pc2ggKEZpbmxhbmQpXHJcbiAgZmk6IFtcImZpLUZJXCJdLFxyXG4gIC8vIEJhc3F1ZSAoU3BhaW4pXHJcbiAgZXU6IFtcImV1LUVTXCJdLFxyXG4gIC8vIENyb2F0aWFuIChDcm9hdGlhKVxyXG4gIGhyOiBbXCJoci1IUlwiXSxcclxuICAvLyBIZWJyZXcgKElzcmFlbCkgLSBhbHRlcm5hdGl2ZSBjb2RlXHJcbiAgaXc6IFtcIml3LUlMXCJdLFxyXG4gIC8vIEtobWVyIChDYW1ib2RpYSlcclxuICBrbTogW1wia20tS0hcIl0sXHJcbiAgLy8gTGF0dmlhbiAoTGF0dmlhKVxyXG4gIGx2OiBbXCJsdi1MVlwiXSxcclxuICAvLyBMaXRodWFuaWFuIChMaXRodWFuaWEpXHJcbiAgbHQ6IFtcImx0LUxUXCJdLFxyXG4gIC8vIE5vcndlZ2lhblxyXG4gIG5vOiBbXHJcbiAgICBcIm5vLU5PXCIsIC8vIE5vcndheSAobGVnYWN5KVxyXG4gICAgXCJuYi1OT1wiLCAvLyBOb3J3ZWdpYW4gQm9rbVx1MDBFNWxcclxuICAgIFwibm4tTk9cIiwgLy8gTm9yd2VnaWFuIE55bm9yc2tcclxuICBdLFxyXG4gIC8vIFJvbWFuaWFuIChSb21hbmlhKVxyXG4gIHJvOiBbXCJyby1ST1wiXSxcclxuICAvLyBTbG92YWsgKFNsb3Zha2lhKVxyXG4gIHNrOiBbXCJzay1TS1wiXSxcclxuICAvLyBTd2FoaWxpXHJcbiAgc3c6IFtcclxuICAgIFwic3ctVFpcIiwgLy8gVGFuemFuaWFcclxuICAgIFwic3ctS0VcIiwgLy8gS2VueWFcclxuICAgIFwic3ctVUdcIiwgLy8gVWdhbmRhXHJcbiAgICBcInN3LUNEXCIsIC8vIERlbW9jcmF0aWMgUmVwdWJsaWMgb2YgQ29uZ29cclxuICAgIFwic3ctUldcIiwgLy8gUndhbmRhXHJcbiAgXSxcclxuICAvLyBQZXJzaWFuIChJcmFuKVxyXG4gIGZhOiBbXCJmYS1JUlwiXSxcclxuICAvLyBGaWxpcGlubyAoUGhpbGlwcGluZXMpXHJcbiAgZmlsOiBbXCJmaWwtUEhcIl0sXHJcbiAgLy8gUHVuamFiaVxyXG4gIHBhOiBbXHJcbiAgICBcInBhLUlOXCIsIC8vIEluZGlhXHJcbiAgICBcInBhLVBLXCIsIC8vIFBha2lzdGFuXHJcbiAgXSxcclxuICAvLyBCZW5nYWxpXHJcbiAgYm46IFtcclxuICAgIFwiYm4tQkRcIiwgLy8gQmFuZ2xhZGVzaFxyXG4gICAgXCJibi1JTlwiLCAvLyBJbmRpYVxyXG4gIF0sXHJcbiAgLy8gSXJpc2ggKElyZWxhbmQpXHJcbiAgZ2E6IFtcImdhLUlFXCJdLFxyXG4gIC8vIEdhbGljaWFuIChTcGFpbilcclxuICBnbDogW1wiZ2wtRVNcIl0sXHJcbiAgLy8gTWFsdGVzZSAoTWFsdGEpXHJcbiAgbXQ6IFtcIm10LU1UXCJdLFxyXG4gIC8vIFNsb3ZlbmlhbiAoU2xvdmVuaWEpXHJcbiAgc2w6IFtcInNsLVNJXCJdLFxyXG4gIC8vIEFsYmFuaWFuIChBbGJhbmlhKVxyXG4gIHNxOiBbXCJzcS1BTFwiXSxcclxuICAvLyBCYXZhcmlhbiAoR2VybWFueSlcclxuICBiYXI6IFtcImJhci1ERVwiXSxcclxuICAvLyBOZWFwb2xpdGFuIChJdGFseSlcclxuICBuYXA6IFtcIm5hcC1JVFwiXSxcclxuICAvLyBBZnJpa2FhbnMgKFNvdXRoIEFmcmljYSlcclxuICBhZjogW1wiYWYtWkFcIl0sXHJcbiAgLy8gVXpiZWsgKExhdGluKVxyXG4gIHV6OiBbXCJ1ei1MYXRuXCJdLFxyXG4gIC8vIFNvbWFsaSAoU29tYWxpYSlcclxuICBzbzogW1wic28tU09cIl0sXHJcbiAgLy8gVGlncmlueWEgKEV0aGlvcGlhKVxyXG4gIHRpOiBbXCJ0aS1FVFwiXSxcclxuICAvLyBTdGFuZGFyZCBNb3JvY2NhbiBUYW1hemlnaHQgKE1vcm9jY28pXHJcbiAgemdoOiBbXCJ6Z2gtTUFcIl0sXHJcbiAgLy8gVGFnYWxvZyAoUGhpbGlwcGluZXMpXHJcbiAgdGw6IFtcInRsLVBIXCJdLFxyXG4gIC8vIFRlbHVndSAoSW5kaWEpXHJcbiAgdGU6IFtcInRlLUlOXCJdLFxyXG4gIC8vIEtpbnlhcndhbmRhIChSd2FuZGEpXHJcbiAgcnc6IFtcInJ3LVJXXCJdLFxyXG4gIC8vIEdlb3JnaWFuIChHZW9yZ2lhKVxyXG4gIGthOiBbXCJrYS1HRVwiXSxcclxuICAvLyBNYWxheWFsYW0gKEluZGlhKVxyXG4gIG1sOiBbXCJtbC1JTlwiXSxcclxuICAvLyBBcm1lbmlhbiAoQXJtZW5pYSlcclxuICBoeTogW1wiaHktQU1cIl0sXHJcbiAgLy8gTWFjZWRvbmlhbiAoTWFjZWRvbmlhKVxyXG4gIG1rOiBbXCJtay1NS1wiXSxcclxufSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCB0eXBlIExvY2FsZUNvZGVTaG9ydCA9IGtleW9mIHR5cGVvZiBsb2NhbGVNYXA7XHJcbmV4cG9ydCB0eXBlIExvY2FsZUNvZGVGdWxsID0gKHR5cGVvZiBsb2NhbGVNYXApW0xvY2FsZUNvZGVTaG9ydF1bbnVtYmVyXTtcclxuZXhwb3J0IHR5cGUgTG9jYWxlQ29kZSA9IExvY2FsZUNvZGVTaG9ydCB8IExvY2FsZUNvZGVGdWxsO1xyXG5leHBvcnQgdHlwZSBMb2NhbGVEZWxpbWl0ZXIgPSBcIi1cIiB8IFwiX1wiIHwgbnVsbDtcclxuXHJcbmV4cG9ydCBjb25zdCBsb2NhbGVDb2Rlc1Nob3J0ID0gT2JqZWN0LmtleXMobG9jYWxlTWFwKSBhcyBMb2NhbGVDb2RlU2hvcnRbXTtcclxuZXhwb3J0IGNvbnN0IGxvY2FsZUNvZGVzRnVsbCA9IE9iamVjdC52YWx1ZXMoXHJcbiAgbG9jYWxlTWFwLFxyXG4pLmZsYXQoKSBhcyBMb2NhbGVDb2RlRnVsbFtdO1xyXG5leHBvcnQgY29uc3QgbG9jYWxlQ29kZXNGdWxsVW5kZXJzY29yZSA9IGxvY2FsZUNvZGVzRnVsbC5tYXAoKHZhbHVlKSA9PlxyXG4gIHZhbHVlLnJlcGxhY2UoXCItXCIsIFwiX1wiKSxcclxuKTtcclxuZXhwb3J0IGNvbnN0IGxvY2FsZUNvZGVzRnVsbEV4cGxpY2l0UmVnaW9uID0gbG9jYWxlQ29kZXNGdWxsLm1hcCgodmFsdWUpID0+IHtcclxuICBjb25zdCBjaHVua3MgPSB2YWx1ZS5zcGxpdChcIi1cIik7XHJcbiAgY29uc3QgcmVzdWx0ID0gW2NodW5rc1swXSwgXCItclwiLCBjaHVua3Muc2xpY2UoMSkuam9pbihcIi1cIildLmpvaW4oXCJcIik7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufSk7XHJcbmV4cG9ydCBjb25zdCBsb2NhbGVDb2RlcyA9IFtcclxuICAuLi5sb2NhbGVDb2Rlc1Nob3J0LFxyXG4gIC4uLmxvY2FsZUNvZGVzRnVsbCxcclxuICAuLi5sb2NhbGVDb2Rlc0Z1bGxVbmRlcnNjb3JlLFxyXG4gIC4uLmxvY2FsZUNvZGVzRnVsbEV4cGxpY2l0UmVnaW9uLFxyXG5dIGFzIExvY2FsZUNvZGVbXTtcclxuXHJcbmV4cG9ydCBjb25zdCBsb2NhbGVDb2RlU2NoZW1hID0gWi5zdHJpbmcoKS5yZWZpbmUoXHJcbiAgKHZhbHVlKSA9PiBsb2NhbGVDb2Rlcy5pbmNsdWRlcyh2YWx1ZSBhcyBhbnkpLFxyXG4gIHtcclxuICAgIG1lc3NhZ2U6IFwiSW52YWxpZCBsb2NhbGUgY29kZVwiLFxyXG4gIH0sXHJcbik7XHJcblxyXG4vKipcclxuICogUmVzb2x2ZXMgYSBsb2NhbGUgY29kZSB0byBpdHMgZnVsbCBsb2NhbGUgcmVwcmVzZW50YXRpb24uXHJcbiAqXHJcbiAqICBJZiB0aGUgcHJvdmlkZWQgbG9jYWxlIGNvZGUgaXMgYWxyZWFkeSBhIGZ1bGwgbG9jYWxlIGNvZGUsIGl0IHJldHVybnMgYXMgaXMuXHJcbiAqICBJZiB0aGUgcHJvdmlkZWQgbG9jYWxlIGNvZGUgaXMgYSBzaG9ydCBsb2NhbGUgY29kZSwgaXQgcmV0dXJucyB0aGUgZmlyc3QgY29ycmVzcG9uZGluZyBmdWxsIGxvY2FsZS5cclxuICogIElmIHRoZSBsb2NhbGUgY29kZSBpcyBub3QgZm91bmQsIGl0IHRocm93cyBhbiBlcnJvci5cclxuICpcclxuICogQHBhcmFtIHtsb2NhbGVDb2Rlc30gdmFsdWUgLSBUaGUgbG9jYWxlIGNvZGUgdG8gcmVzb2x2ZSAoZWl0aGVyIHNob3J0IG9yIGZ1bGwpXHJcbiAqIEByZXR1cm4ge0xvY2FsZUNvZGVGdWxsfSBUaGUgcmVzb2x2ZWQgZnVsbCBsb2NhbGUgY29kZVxyXG4gKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHByb3ZpZGVkIGxvY2FsZSBjb2RlIGlzIGludmFsaWQuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVzb2x2ZUxvY2FsZUNvZGUgPSAodmFsdWU6IHN0cmluZyk6IExvY2FsZUNvZGVGdWxsID0+IHtcclxuICBjb25zdCBleGlzdGluZ0Z1bGxMb2NhbGVDb2RlID0gT2JqZWN0LnZhbHVlcyhsb2NhbGVNYXApXHJcbiAgICAuZmxhdCgpXHJcbiAgICAuaW5jbHVkZXModmFsdWUgYXMgYW55KTtcclxuICBpZiAoZXhpc3RpbmdGdWxsTG9jYWxlQ29kZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlIGFzIExvY2FsZUNvZGVGdWxsO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZXhpc3RpbmdTaG9ydExvY2FsZUNvZGUgPSBPYmplY3Qua2V5cyhsb2NhbGVNYXApLmluY2x1ZGVzKHZhbHVlKTtcclxuICBpZiAoZXhpc3RpbmdTaG9ydExvY2FsZUNvZGUpIHtcclxuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdGdWxsTG9jYWxlcyA9IGxvY2FsZU1hcFt2YWx1ZSBhcyBMb2NhbGVDb2RlU2hvcnRdO1xyXG4gICAgY29uc3QgZmFsbGJhY2tGdWxsTG9jYWxlID0gY29ycmVzcG9uZGluZ0Z1bGxMb2NhbGVzWzBdO1xyXG4gICAgcmV0dXJuIGZhbGxiYWNrRnVsbExvY2FsZTtcclxuICB9XHJcblxyXG4gIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBsb2NhbGUgY29kZTogJHt2YWx1ZX1gKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIHRoZSBkZWxpbWl0ZXIgdXNlZCBpbiBhIGxvY2FsZSBjb2RlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgLSB0aGUgbG9jYWxlIHN0cmluZyAoZS5nLixcImVuX1VTXCIsXCJlbi1HQlwiKVxyXG4gKiBAcmV0dXJuIHsgc3RyaW5nIHwgbnVsbH0gLSBUaGUgZGVsaW1pdGVyIChcIl9cIiBvciBcIi1cIikgaWYgZm91bmQsIG90aGVyd2lzZSBgbnVsbGAuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldExvY2FsZUNvZGVEZWxpbWl0ZXIgPSAobG9jYWxlOiBzdHJpbmcpOiBMb2NhbGVEZWxpbWl0ZXIgPT4ge1xyXG4gIGlmIChsb2NhbGUuaW5jbHVkZXMoXCJfXCIpKSB7XHJcbiAgICByZXR1cm4gXCJfXCI7XHJcbiAgfSBlbHNlIGlmIChsb2NhbGUuaW5jbHVkZXMoXCItXCIpKSB7XHJcbiAgICByZXR1cm4gXCItXCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXBsYWNlcyB0aGUgZGVsaW1pdGVyIGluIGEgbG9jYWxlIHN0cmluZyB3aXRoIHRoZSBzcGVjaWZpZWQgZGVsaW1pdGVyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ31sb2NhbGUgLSBUaGUgbG9jYWxlIHN0cmluZyAoZS5nLixcImVuX1VTXCIsIFwiZW4tR0JcIikuXHJcbiAqIEBwYXJhbSB7XCItXCIgfCBcIl9cIiB8IG51bGx9IFtkZWxpbWl0ZXJdIC0gVGhlIG5ldyBkZWxpbWl0ZXIgdG8gcmVwbGFjZSB0aGUgZXhpc3Rpbmcgb25lLlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbG9jYWxlIHN0cmluZyB3aXRoIHRoZSByZXBsYWNlZCBkZWxpbWl0ZXIsIG9yIHRoZSBvcmlnaW5hbCBsb2NhbGUgaWYgbm8gZGVsaW1pdGVyIGlzIHByb3ZpZGVkLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBjb25zdCByZXNvbHZlT3ZlcnJpZGRlbkxvY2FsZSA9IChcclxuICBsb2NhbGU6IHN0cmluZyxcclxuICBkZWxpbWl0ZXI/OiBMb2NhbGVEZWxpbWl0ZXIsXHJcbik6IHN0cmluZyA9PiB7XHJcbiAgaWYgKCFkZWxpbWl0ZXIpIHtcclxuICAgIHJldHVybiBsb2NhbGU7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjdXJyZW50RGVsaW1pdGVyID0gZ2V0TG9jYWxlQ29kZURlbGltaXRlcihsb2NhbGUpO1xyXG4gIGlmICghY3VycmVudERlbGltaXRlcikge1xyXG4gICAgcmV0dXJuIGxvY2FsZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBsb2NhbGUucmVwbGFjZShjdXJyZW50RGVsaW1pdGVyLCBkZWxpbWl0ZXIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5vcm1hbGl6ZXMgYSBsb2NhbGUgc3RyaW5nIGJ5IHJlcGxhY2luZyB1bmRlcnNjb3JlcyB3aXRoIGh5cGhlbnNcclxuICogYW5kIHJlbW92aW5nIHRoZSBcInJcIiBpbiBjZXJ0YWluIHJlZ2lvbmFsIGNvZGVzIChlLmcuLCBcImZyLXJDQVwiIFx1MjE5MiBcImZyLUNBXCIpXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgLSBUaGUgbG9jYWxlIHN0cmluZyAoZS5nLixcImVuX1VTXCIsIFwiZW4tR0JcIikuXHJcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgbG9jYWxlIHN0cmluZy5cclxuICovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGxvY2FsZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gbG9jYWxlLnJlcGxhY2VBbGwoXCJfXCIsIFwiLVwiKS5yZXBsYWNlKC8oW2Etel17MiwzfS0pci8sIFwiJDFcIik7XHJcbn1cclxuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXFxcXGZvcm1hdHMudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiQzpcXFxcVXNlcnNcXFxcSFBcXFxcbGluZ28uZGV2XFxcXHBhY2thZ2VzXFxcXHNwZWNcXFxcc3JjXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9DOi9Vc2Vycy9IUC9saW5nby5kZXYvcGFja2FnZXMvc3BlYy9zcmMvZm9ybWF0cy50c1wiO2ltcG9ydCBaIGZyb20gXCJ6b2RcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBidWNrZXRUeXBlcyA9IFtcclxuICBcImFuZHJvaWRcIixcclxuICBcImNzdlwiLFxyXG4gIFwiZWpzXCIsXHJcbiAgXCJmbHV0dGVyXCIsXHJcbiAgXCJodG1sXCIsXHJcbiAgXCJqc29uXCIsXHJcbiAgXCJqc29uNVwiLFxyXG4gIFwianNvbmNcIixcclxuICBcIm1hcmtkb3duXCIsXHJcbiAgXCJtYXJrZG9jXCIsXHJcbiAgXCJtZHhcIixcclxuICBcInhjb2RlLXN0cmluZ3NcIixcclxuICBcInhjb2RlLXN0cmluZ3NkaWN0XCIsXHJcbiAgXCJ4Y29kZS14Y3N0cmluZ3NcIixcclxuICBcInhjb2RlLXhjc3RyaW5ncy12MlwiLFxyXG4gIFwieWFtbFwiLFxyXG4gIFwieWFtbC1yb290LWtleVwiLFxyXG4gIFwicHJvcGVydGllc1wiLFxyXG4gIFwicG9cIixcclxuICBcInhsaWZmXCIsXHJcbiAgXCJ4bWxcIixcclxuICBcInNydFwiLFxyXG4gIFwiZGF0b1wiLFxyXG4gIFwiY29tcGlsZXJcIixcclxuICBcInZ0dFwiLFxyXG4gIFwicGhwXCIsXHJcbiAgXCJwb1wiLFxyXG4gIFwidnVlLWpzb25cIixcclxuICBcInR5cGVzY3JpcHRcIixcclxuICBcInR4dFwiLFxyXG4gIFwianNvbi1kaWN0aW9uYXJ5XCIsXHJcbl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgYnVja2V0VHlwZVNjaGVtYSA9IFouZW51bShidWNrZXRUeXBlcyk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVEsU0FBUyxvQkFBb0I7OztBQ0FmLE9BQU8sUUFBUTtBQUNoUyxPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyx1QkFBdUI7OztBQ0h1TyxPQUFPQSxRQUFPOzs7QUNBWixPQUFPLE9BQU87QUFFdlIsSUFBTSxZQUFZO0FBQUE7QUFBQSxFQUVoQixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFDQTtBQUFBO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxJQUFJLENBQUMsT0FBTztBQUFBO0FBQUEsRUFFWixJQUFJLENBQUMsT0FBTztBQUFBLEVBQ1osSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSTtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSTtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosS0FBSyxDQUFDLFFBQVE7QUFBQTtBQUFBLEVBRWQsSUFBSTtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsSUFBSTtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBQ0E7QUFBQTtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVosSUFBSSxDQUFDLE9BQU87QUFBQTtBQUFBLEVBRVos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QVMsaURBQWlEO0FBQUEsRUFDN0QsT0FBT0EsR0FBRSxPQUFPLEVBQUUsU0FBUyxxQ0FBcUM7QUFBQSxFQUNoRSxRQUFRQSxHQUFFLE9BQU8sRUFBRTtBQUFBLElBQ2pCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBU0EsR0FBRSxPQUFPLEVBQ2YsU0FBUyxFQUNULFNBQVMsa0RBQWtEO0FBQUEsRUFDOUQsVUFBVTtBQUNaLENBQUMsRUFBRSxTQUFTLHFEQUFxRDtBQUUxRCxJQUFNLHdCQUF3QjtBQUFBLEVBQ25DO0FBQUEsRUFDQTtBQUFBLElBQ0UsY0FBYyxDQUFDLGVBQ2IsV0FBVyxPQUFPO0FBQUEsTUFDaEIsVUFBVSxvQkFBb0IsU0FBUztBQUFBLElBQ3pDLENBQUM7QUFBQSxJQUNILG9CQUFvQixDQUFDLHNCQUFzQjtBQUFBLE1BQ3pDLEdBQUc7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQyxlQUFlO0FBQUEsTUFDOUIsR0FBRztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQ0Y7QUFHTyxJQUFNLDJCQUEyQjtBQWFqQyxJQUFNLGdCQUFnQix5QkFBeUI7OztBRHJmcUgsSUFBTSwrQkFBK0I7QUFNak0sU0FBUixrQkFBbUM7QUFDeEMsUUFBTUUsZ0JBQWUsZ0JBQWdCLHlCQUF5QixNQUFNO0FBQ3BFLFFBQU0sYUFBYSxLQUFLLFFBQVEsY0FBYyw0QkFBZSxDQUFDO0FBQzlELEtBQUc7QUFBQSxJQUNELEdBQUcsVUFBVTtBQUFBLElBQ2IsS0FBSyxVQUFVQSxlQUFjLE1BQU0sQ0FBQztBQUFBLEVBQ3RDO0FBQ0Y7OztBRFZBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxFQUNQLFFBQVE7QUFBQSxFQUNSLE9BQU8sQ0FBQyxjQUFjO0FBQUEsRUFDdEIsUUFBUTtBQUFBLEVBQ1IsUUFBUSxDQUFDLE9BQU8sS0FBSztBQUFBLEVBQ3JCLEtBQUs7QUFBQSxFQUNMLFlBQVk7QUFBQSxFQUNaLFdBQVc7QUFBQSxFQUNYLGNBQWMsQ0FBQyxTQUFTO0FBQUEsSUFDdEIsSUFBSSxJQUFJLFdBQVcsUUFBUSxTQUFTO0FBQUEsRUFDdEM7QUFBQSxFQUNBLFdBQVcsWUFBWTtBQUNyQixvQkFBZ0I7QUFBQSxFQUNsQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbIloiLCAiWiIsICJaIiwgIloiLCAicGF0aCIsICJjb25maWdTY2hlbWEiXQp9Cg==
