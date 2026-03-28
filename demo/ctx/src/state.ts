import fs from "fs";
import path from "path";
import { createHash } from "crypto";

export type State = { processedFiles: Record<string, string> };
export type FileEntry = [path: string, hash: string];

let _stateDir: string | undefined;
function getStateDir(): string {
  if (!_stateDir) {
    _stateDir = path.join(process.env.HOME!, ".ctx", "state");
    fs.mkdirSync(_stateDir, { recursive: true });
  }
  return _stateDir;
}

export function md5(data: Buffer | string): string {
  return createHash("md5").update(data).digest("hex");
}

function stateFile(p: string) {
  return path.join(getStateDir(), `${md5(p)}.json`);
}

export function loadState(p: string): State {
  try { return JSON.parse(fs.readFileSync(stateFile(p), "utf-8")); }
  catch { return { processedFiles: {} }; }
}

export function saveState(p: string, state: State) {
  fs.writeFileSync(stateFile(p), JSON.stringify(state, null, 2));
}

export function fileHash(f: string): string {
  try { return md5(fs.readFileSync(f)); }
  catch { return ""; }
}

export function filterNewFiles(files: string[], state: State): FileEntry[] {
  return files.flatMap((f) => {
    const hash = fileHash(f);
    if (!hash) return [];  // skip unreadable files
    return hash !== state.processedFiles[f] ? [[f, hash]] : [];
  });
}

export function recordFiles(entries: FileEntry[], p: string) {
  const state = loadState(p);
  for (const [f, hash] of entries) {
    if (hash) state.processedFiles[f] = hash;  // never store empty hash
  }
  saveState(p, state);
}

export function clearState(p: string) {
  try { fs.unlinkSync(stateFile(p)); } catch {}
}
