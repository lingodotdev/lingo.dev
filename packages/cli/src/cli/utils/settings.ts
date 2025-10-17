import os from "os";
import path from "path";
import _ from "lodash";
import Z from "zod";
import fs from "fs";
import { getRcConfig, saveRcConfig } from "@lingo.dev/config";
import { PROVIDER_METADATA } from "@lingo.dev/providers";

export type CliSettings = Z.infer<typeof SettingsSchema>;

export function getSettings(explicitApiKey: string | undefined): CliSettings {
  const env = _loadEnv();
  const systemFile = _loadSystemFile();
  const defaults = _loadDefaults();

  _legacyEnvVarWarning();

  _envVarsInfo();

  const llm: Record<string, string | undefined> = {};
  for (const meta of Object.values(PROVIDER_METADATA)) {
    const envVar = meta.apiKeyEnvVar;
    const cfgKey = meta.apiKeyConfigKey;
    if (!envVar || !cfgKey) continue;
    const suffix = cfgKey.startsWith("llm.") ? cfgKey.slice(4) : undefined;
    if (!suffix) continue;
    const envVal = (env as any)[envVar] as string | undefined;
    const rcVal = (systemFile.llm as any)?.[suffix] as string | undefined;
    llm[suffix] = envVal || rcVal;
  }

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
    llm,
  };
}

export function saveSettings(settings: CliSettings): void {
  _saveSystemFile(settings);
}

export function loadSystemSettings() {
  return _loadSystemFile();
}

const SettingsSchema = Z.object({
  auth: Z.object({
    apiKey: Z.string(),
    apiUrl: Z.string(),
    webUrl: Z.string(),
  }),
  // Allow dynamic llm provider keys
  llm: Z.record(Z.string().optional()),
});

function _providerConfigKeys(): string[] {
  const keys: string[] = [];
  for (const m of Object.values(PROVIDER_METADATA)) {
    if (m.apiKeyConfigKey) keys.push(m.apiKeyConfigKey);
  }
  return keys;
}

function _providerEnvVarKeys(): string[] {
  const keys: string[] = [];
  for (const m of Object.values(PROVIDER_METADATA)) {
    if (m.apiKeyEnvVar) keys.push(m.apiKeyEnvVar);
  }
  return keys;
}

export const SETTINGS_KEYS = [
  "auth.apiKey",
  "auth.apiUrl",
  "auth.webUrl",
  ..._providerConfigKeys(),
] as string[];

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
  const shape: Record<string, Z.ZodTypeAny> = {
    LINGODOTDEV_API_KEY: Z.string().optional(),
    LINGODOTDEV_API_URL: Z.string().optional(),
    LINGODOTDEV_WEB_URL: Z.string().optional(),
  };
  for (const envVar of _providerEnvVarKeys()) {
    shape[envVar] = Z.string().optional();
  }
  return Z.object(shape).passthrough().parse(process.env);
}

function _loadSystemFile() {
  const data = getRcConfig();
  return Z.object({
    auth: Z.object({
      apiKey: Z.string().optional(),
      apiUrl: Z.string().optional(),
      webUrl: Z.string().optional(),
    }).optional(),
    // Accept any llm provider key from rc file
    llm: Z.record(Z.string().optional()).optional(),
  })
    .passthrough()
    .parse(data);
}

function _saveSystemFile(settings: CliSettings) {
  saveRcConfig(settings);
}

function _getSettingsFilePath(): string {
  const settingsFile = ".lingodotdevrc";
  const homedir = os.homedir();
  const settingsFilePath = path.join(homedir, settingsFile);
  return settingsFilePath;
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
  // Provider-specific env vs rc info using shared metadata
  for (const meta of Object.values(PROVIDER_METADATA)) {
    const envVar = meta.apiKeyEnvVar;
    const cfgKey = meta.apiKeyConfigKey;
    if (!envVar || !cfgKey) continue;
    const cfgSuffix = cfgKey.startsWith("llm.") ? cfgKey.slice(4) : undefined;
    const envVal = (env as any)[envVar];
    const rcVal = cfgSuffix ? (systemFile.llm as any)?.[cfgSuffix] : undefined;
    if (envVal && rcVal) {
      console.info(
        "\x1b[36m%s\x1b[0m",
        `ℹ️  Using ${envVar} env var instead of key from user config`,
      );
    }
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
