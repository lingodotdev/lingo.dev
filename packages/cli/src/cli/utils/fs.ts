import * as fs from "fs";
import * as path from "path";

export function tryReadFile(filePath: string, defaultValue: string | null = null): string | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return content;
  } catch (error) {
    return defaultValue;
  }
}

export function writeFile(filePath: string, content: string) {
  // create dirs
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

export function checkIfFileExists(filePath: string) {
  return fs.existsSync(filePath);
}
