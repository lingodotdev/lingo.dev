import os from "os";
import path from "path";
import fs from "fs";
import Ini from "ini";
import Z from "zod";

export interface RcConfig {
  auth?: {
    apiKey?: string;
    apiUrl?: string;
    webUrl?: string;
  };
  llm?: {
    groqApiKey?: string;
    openaiApiKey?: string;
    anthropicApiKey?: string;
    googleApiKey?: string;
    openrouterApiKey?: string;
    mistralApiKey?: string;
  };
  [key: string]: any;
}

export const rcConfigSchema = Z.object({
  auth: Z.object({
    apiKey: Z.string().optional(),
    apiUrl: Z.string().optional(),
    webUrl: Z.string().optional(),
  }).optional(),
  llm: Z.object({
    groqApiKey: Z.string().optional(),
    openaiApiKey: Z.string().optional(),
    anthropicApiKey: Z.string().optional(),
    googleApiKey: Z.string().optional(),
    openrouterApiKey: Z.string().optional(),
    mistralApiKey: Z.string().optional(),
  }).optional(),
})
  .passthrough()
  .transform((v) => v as RcConfig);

export function getRcConfig(): RcConfig {
  const settingsFile = ".lingodotdevrc";
  const homedir = os.homedir();
  const settingsFilePath = path.join(homedir, settingsFile);
  const content = fs.existsSync(settingsFilePath)
    ? fs.readFileSync(settingsFilePath, "utf-8")
    : "";
  const data = Ini.parse(content);
  return rcConfigSchema.parse(data);
}
