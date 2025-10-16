import os from "os";
import path from "path";
import fs from "fs";
import Ini from "ini";
import Z from "zod";

export const rcConfigSchema = Z.object({
  auth: Z.object({
    apiKey: Z.string().optional(),
    apiUrl: Z.string().optional(),
    webUrl: Z.string().optional(),
  }).optional(),
  // Allow any llm provider keys and preserve them
  llm: Z.record(Z.string().optional()).optional(),
})
  .passthrough();

export type RcConfig = Z.infer<typeof rcConfigSchema>;

const SETTINGS_FILE = ".lingodotdevrc";

function getSettingsFilePath(): string {
  return path.join(os.homedir(), SETTINGS_FILE);
}

export function getRcConfig(): RcConfig {
  const settingsFilePath = getSettingsFilePath();
  const content = fs.existsSync(settingsFilePath)
    ? fs.readFileSync(settingsFilePath, "utf-8")
    : "";
  const data = Ini.parse(content);
  return rcConfigSchema.parse(data);
}
