import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

export interface ShellOptions {
  stdio?: "inherit" | "pipe";
  encoding?: "utf8" | "ascii" | "base64" | "hex";
  cwd?: string;
}

export function removeFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
  }
}

export function getCurrentDirectory(): string {
  return process.cwd();
}

export function listDirectory(dirPath: string = ".", options: ShellOptions = {}): string {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    return files
      .map(file => {
        const stats = fs.statSync(path.join(dirPath, file.name));
        const permissions = stats.mode.toString(8).slice(-3);
        const size = stats.size;
        const modified = stats.mtime.toISOString().slice(0, 19).replace('T', ' ');
        return `${file.isDirectory() ? 'd' : '-'}${permissions} ${size.toString().padStart(8)} ${modified} ${file.name}`;
      })
      .join('\n');
  } catch (error) {
    try {
      return execSync('ls -la', { 
        encoding: 'utf8',
        cwd: dirPath,
        ...options 
      });
    } catch {
      return execSync('dir', { 
        encoding: 'utf8',
        cwd: dirPath,
        ...options 
      });
    }
  }
}

export function executeCommand(command: string, options: ShellOptions = {}): string {
  return execSync(command, {
    encoding: 'utf8',
    ...options
  });
}

export function escapeShellArg(arg: string): string {
  if (arg.includes("'") && !arg.includes('"')) {
    return `"${arg.replace(/"/g, '""')}"`;
  } else {
    return `'${arg.replace(/'/g, "'\\''")}'`;
  }
}
