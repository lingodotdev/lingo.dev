import os from "os";
import path from "path";
import fs from "fs";
import Ini from "ini";

export function getRc() {
  const settingsFile = ".lingodotdevrc";
  const homedir = os.homedir();
  const settingsFilePath = path.join(homedir, settingsFile);
  const content = fs.existsSync(settingsFilePath)
    ? fs.readFileSync(settingsFilePath, "utf-8")
    : "";
  const data = Ini.parse(content);
  return data;
}
