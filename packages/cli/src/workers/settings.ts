import os from "os";
import path from "path";
import _ from "lodash";
import Z from "zod";
import fs from "fs";
import Ini from "ini";

export type CliSettings = Z.infer<typeof SettingsSchema>;

export async function loadSettings(): Promise<CliSettings> {
  const env = await _loadEnv();
  const systemFile = await _loadSystemFile();
  const defaults = await _loadDefaults();

  return {
    auth: {
      apiKey: env.REPLEXICA_API_KEY || systemFile.auth?.apiKey || defaults.auth.apiKey,
      apiUrl: env.REPLEXICA_API_URL || systemFile.auth?.apiUrl || defaults.auth.apiUrl,
      webUrl: env.REPLEXICA_WEB_URL || systemFile.auth?.webUrl || defaults.auth.webUrl,
    },
  };
}

export async function saveSettings(settings: CliSettings): Promise<void> {
  await _saveSystemFile(settings);
}

const SettingsSchema = Z.object({
  auth: Z.object({
    apiKey: Z.string(),
    apiUrl: Z.string(),
    webUrl: Z.string(),
  }),
});

// Private

async function _loadDefaults(): Promise<CliSettings> {
  return {
    auth: {
      apiKey: '',
      apiUrl: "https://engine.replexica.com",
      webUrl: "https://replexica.com",
    },
  };
}

async function _loadEnv() {
  return Z.object({
    REPLEXICA_API_KEY: Z.string().optional(),
    REPLEXICA_API_URL: Z.string().optional(),
    REPLEXICA_WEB_URL: Z.string().optional(),
  })
    .passthrough()
    .parse(process.env);
}

async function _loadSystemFile() {
  const settingsFilePath = _getSettingsFilePath();
  const content = fs.readFileSync(settingsFilePath, 'utf-8');
  const data = Ini.parse(content);

  return Z.object({
    auth: Z.object({
      apiKey: Z.string().optional(),
      apiUrl: Z.string().optional(),
      webUrl: Z.string().optional(),
    }).optional(),
  })
    .passthrough()
    .parse(data);
}

async function _saveSystemFile(settings: CliSettings) {
  const settingsFilePath = _getSettingsFilePath();
  const content = Ini.stringify(settings);
  fs.writeFileSync(settingsFilePath, content);
}

function _getSettingsFilePath(): string {
  const settingsFile = ".replexicarc";
  const homedir = os.homedir();
  const settingsFilePath = path.join(homedir, settingsFile);
  return settingsFilePath;
}