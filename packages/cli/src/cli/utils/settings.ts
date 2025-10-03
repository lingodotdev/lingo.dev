import os from "os";
import path from "path";
import _ from "lodash";
import Z from "zod";
import fs from "fs";
import Ini from "ini";

export type CliSettings = Z.infer<typeof SettingsSchema>;

export function getSettings(explicitApiKey: string | undefined): CliSettings {
  const env = _loadEnv();
  const systemFile = _loadSystemFile();
  const defaults = _loadDefaults();

  _legacyEnvVarWarning();

  _envVarsInfo();

  return {
    auth: {
      apiKey:
        explicitApiKey ||
        env.LINGODOTDEV_API_KEY ||
        systemFile.auth?.apiKey ||
        defaults.auth.apiKey,
      apiUrl:
        env.LINGODOTDEV_API_URL ||
        systemFile.auth?.apiUrl ||
        defaults.auth.apiUrl,
      webUrl:
        env.LINGODOTDEV_WEB_URL ||
        systemFile.auth?.webUrl ||
        defaults.auth.webUrl,
    },
    llm: {
      openaiApiKey: env.OPENAI_API_KEY || systemFile.llm?.openaiApiKey,
      anthropicApiKey: env.ANTHROPIC_API_KEY || systemFile.llm?.anthropicApiKey,
      groqApiKey: env.GROQ_API_KEY || systemFile.llm?.groqApiKey,
      googleApiKey: env.GOOGLE_API_KEY || systemFile.llm?.googleApiKey,
      openrouterApiKey:
        env.OPENROUTER_API_KEY || systemFile.llm?.openrouterApiKey,
      mistralApiKey: env.MISTRAL_API_KEY || systemFile.llm?.mistralApiKey,
    },
  };
}

export function saveSettings(settings: CliSettings): void {
  _saveSystemFile(settings);
}

export function loadSystemSettings() {
  return _loadSystemFile();
}

export function getSettingsFilePath(): string {
  const settingsFile = ".lingodotdevrc";
  const homedir = os.homedir();
  const settingsFilePath = path.join(homedir, settingsFile);
  return settingsFilePath;
}

export function getSettingsDisplayPath(): string {
  if (process.platform === "win32") {
    return getSettingsFilePath();
  }
  return "~/.lingodotdevrc";
}

const flattenZodObject = (schema: Z.ZodObject<any>, prefix = ""): string[] => {
  return Object.entries(schema.shape).flatMap(([key, value]) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (value instanceof Z.ZodObject) {
      return flattenZodObject(value, newPrefix);
    }
    return [newPrefix];
  });
};

const SettingsSchema = Z.object({
  auth: Z.object({
    apiKey: Z.string(),
    apiUrl: Z.string(),
    webUrl: Z.string(),
  }),
  llm: Z.object({
    openaiApiKey: Z.string().optional(),
    anthropicApiKey: Z.string().optional(),
    groqApiKey: Z.string().optional(),
    googleApiKey: Z.string().optional(),
    openrouterApiKey: Z.string().optional(),
    mistralApiKey: Z.string().optional(),
  }),
});

export const SETTINGS_KEYS = flattenZodObject(
  SettingsSchema,
) as readonly string[];

// Private

function _loadDefaults(): CliSettings {
  return {
    auth: {
      apiKey: "",
      apiUrl: "https://engine.lingo.dev",
      webUrl: "https://lingo.dev",
    },
    llm: {},
  };
}

function _loadEnv() {
  return Z.object({
    LINGODOTDEV_API_KEY: Z.string().optional(),
    LINGODOTDEV_API_URL: Z.string().optional(),
    LINGODOTDEV_WEB_URL: Z.string().optional(),
    OPENAI_API_KEY: Z.string().optional(),
    ANTHROPIC_API_KEY: Z.string().optional(),
    GROQ_API_KEY: Z.string().optional(),
    GOOGLE_API_KEY: Z.string().optional(),
    OPENROUTER_API_KEY: Z.string().optional(),
    MISTRAL_API_KEY: Z.string().optional(),
  })
    .passthrough()
    .parse(process.env);
}

function _loadSystemFile() {
  const settingsFilePath = getSettingsFilePath();
  const content = fs.existsSync(settingsFilePath)
    ? fs.readFileSync(settingsFilePath, "utf-8")
    : "";
  const data = Ini.parse(content);

  return Z.object({
    auth: Z.object({
      apiKey: Z.string().optional(),
      apiUrl: Z.string().optional(),
      webUrl: Z.string().optional(),
    }).optional(),
    llm: Z.object({
      openaiApiKey: Z.string().optional(),
      anthropicApiKey: Z.string().optional(),
      groqApiKey: Z.string().optional(),
      googleApiKey: Z.string().optional(),
      openrouterApiKey: Z.string().optional(),
      mistralApiKey: Z.string().optional(),
    }).optional(),
  })
    .passthrough()
    .parse(data);
}

function _saveSystemFile(settings: CliSettings) {
  const settingsFilePath = getSettingsFilePath();
  const content = Ini.stringify(settings);
  fs.writeFileSync(settingsFilePath, content);
}

function _legacyEnvVarWarning() {
  const env = _loadEnv();

  if (env.REPLEXICA_API_KEY && !env.LINGODOTDEV_API_KEY) {
    console.warn(
      "\x1b[33m%s\x1b[0m",
      `
⚠️  WARNING: REPLEXICA_API_KEY env var is deprecated ⚠️
===========================================================

Please use LINGODOTDEV_API_KEY instead.
===========================================================
`,
    );
  }
}

function _envVarsInfo() {
  const env = _loadEnv();
  const systemFile = _loadSystemFile();

  if (env.LINGODOTDEV_API_KEY && systemFile.auth?.apiKey) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using LINGODOTDEV_API_KEY env var instead of credentials from user config`,
    );
  }
  if (env.OPENAI_API_KEY && systemFile.llm?.openaiApiKey) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using OPENAI_API_KEY env var instead of key from user config.`,
    );
  }
  if (env.ANTHROPIC_API_KEY && systemFile.llm?.anthropicApiKey) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using ANTHROPIC_API_KEY env var instead of key from user config`,
    );
  }
  if (env.GROQ_API_KEY && systemFile.llm?.groqApiKey) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using GROQ_API_KEY env var instead of key from user config`,
    );
  }
  if (env.GOOGLE_API_KEY && systemFile.llm?.googleApiKey) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using GOOGLE_API_KEY env var instead of key from user config`,
    );
  }
  if (env.OPENROUTER_API_KEY && systemFile.llm?.openrouterApiKey) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using OPENROUTER_API_KEY env var instead of key from user config`,
    );
  }
  if (env.MISTRAL_API_KEY && systemFile.llm?.mistralApiKey) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using MISTRAL_API_KEY env var instead of key from user config`,
    );
  }
  if (env.LINGODOTDEV_API_URL) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using LINGODOTDEV_API_URL: ${env.LINGODOTDEV_API_URL}`,
    );
  }
  if (env.LINGODOTDEV_WEB_URL) {
    console.info(
      "\x1b[36m%s\x1b[0m",
      `ℹ️  Using LINGODOTDEV_WEB_URL: ${env.LINGODOTDEV_WEB_URL}`,
    );
  }
}
