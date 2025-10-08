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
  llm?: Record<string, string | undefined>;
  [key: string]: any;
}

export const rcConfigSchema = Z.object({
  auth: Z.object({
    apiKey: Z.string().optional(),
    apiUrl: Z.string().optional(),
    webUrl: Z.string().optional(),
  }).optional(),
  // Allow any llm provider keys and preserve them
  llm: Z.record(Z.string().optional()).optional(),
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
