import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function getRepoRoot(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let currentDir = __dirname;

  while (currentDir !== path.parse(currentDir).root) {
    if (existsSync(path.join(currentDir, ".git"))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error("Could not find project root");
}
