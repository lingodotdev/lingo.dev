import os from "os";
import path from "path";
import fs from "fs";
import Ini from "ini";

export interface RcData {
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

export function readRc(): RcData {
  const settingsFile = ".lingodotdevrc";
  const homedir = os.homedir();
  const settingsFilePath = path.join(homedir, settingsFile);
  const content = fs.existsSync(settingsFilePath)
    ? fs.readFileSync(settingsFilePath, "utf-8")
    : "";
  const data = Ini.parse(content);
  return data as RcData;
}
