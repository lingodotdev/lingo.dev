import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const IGNORE = new Set(["node_modules", ".next", ".git", "dist", ".turbo"]);

export function readFile(filePath: string): string {
  try {
    const buf = fs.readFileSync(filePath);
    if (buf.byteLength > 50_000) return `[File too large: ${buf.byteLength} bytes]`;
    return buf.toString("utf-8");
  } catch (e) {
    return `[Error: ${e}]`;
  }
}

export function writeFile(filePath: string, content: string): string {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  return `Written to ${filePath}`;
}

export function listFiles(dir: string): string[] {
  const results: string[] = [];
  function walk(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (IGNORE.has(entry.name)) continue;
      const full = path.join(current, entry.name);
      entry.isDirectory() ? walk(full) : results.push(full);
    }
  }
  walk(dir);
  return results;
}

export function git(cmd: string, cwd: string): string {
  try { return execSync(cmd, { cwd, encoding: "utf-8" }).trim(); }
  catch { return ""; }
}

export function getChangedFiles(cwd: string, commits: number | null): string[] {
  let output: string;
  if (commits !== null) {
    output = git(`git diff HEAD~${commits} --name-only`, cwd);
  } else {
    output = git("git status --porcelain", cwd)
      .split("\n").filter(Boolean).map((l) => l.slice(3).trim()).join("\n");
  }
  const paths = output.split("\n").map((f) => f.trim()).filter(Boolean)
    .map((f) => path.join(cwd, f));

  const files: string[] = [];
  for (const p of paths) {
    try {
      const stat = fs.statSync(p);
      if (stat.isFile()) files.push(p);
      else if (stat.isDirectory()) files.push(...listFiles(p));
    } catch {}
  }
  return files;
}

export function formatFileBlock(filePath: string): string {
  return `\n--- ${filePath} ---\n${readFile(filePath)}\n`;
}
