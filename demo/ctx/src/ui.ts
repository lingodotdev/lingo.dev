// ─── ANSI ────────────────────────────────────────────────────────────────────
const R  = "\x1B[0m";
const B  = "\x1B[1m";     // bold
const D  = "\x1B[2m";     // dim
const CY = "\x1B[36m";    // cyan
const GR = "\x1B[32m";    // green
const YL = "\x1B[33m";    // yellow
const RD = "\x1B[31m";    // red
const MG = "\x1B[35m";    // magenta

// ─── Building blocks ─────────────────────────────────────────────────────────
export const dim   = (s: string) => `${D}${s}${R}`;
export const bold  = (s: string) => `${B}${s}${R}`;
export const cyan  = (s: string) => `${CY}${s}${R}`;
export const green = (s: string) => `${GR}${s}${R}`;

// ─── Header ──────────────────────────────────────────────────────────────────
export function printHeader(opts: {
  targetDir: string;
  outPath:   string;
  model:     string;
  source:    string;
  targets:   string[];
}) {
  const rel   = opts.outPath.replace(opts.targetDir + "/", "");
  const arrow = opts.targets.length ? `${opts.source} → ${opts.targets.join("  ")}` : opts.source;
  console.log();
  console.log(`  ${B}${CY}ctx${R}  ${B}${opts.targetDir}${R}`);
  console.log(`  ${D}${rel}  ·  ${opts.model}  ·  ${arrow}${R}`);
}

// ─── Phase header — big transition between stages ────────────────────────────
export function phase(label: string, sub?: string) {
  console.log();
  console.log(`  ${B}${CY}◆${R}  ${B}${label}${R}`);
  if (sub) console.log(`     ${D}${sub}${R}`);
}

// ─── Tool call — compact, no full paths ──────────────────────────────────────
export function toolCall(name: string, input: Record<string, string>) {
  const arg = input.file_path ?? input.directory ?? Object.values(input)[0] ?? "";
  // show only the last 2 path segments to keep it readable
  const short = arg.split("/").slice(-2).join("/");
  const color = name === "write_file" ? `${GR}` : `${D}`;
  console.log(`     ${color}↳  ${name.padEnd(12)}${short}${R}`);
}

// ─── File item (dry-run / update list) ───────────────────────────────────────
export function fileItem(name: string) {
  console.log(`     ${D}·  ${name}${R}`);
}

// ─── Progress counter (update loop) ──────────────────────────────────────────
export function progress(i: number, total: number, label: string) {
  console.log();
  console.log(`  ${D}[${i}/${total}]${R}  ${B}${label}${R}`);
}

// ─── Status lines ─────────────────────────────────────────────────────────────
export function ok(msg: string)   { console.log(`\n  ${GR}✓${R}  ${msg}`); }
export function warn(msg: string) { console.log(`\n  ${YL}!${R}  ${msg}`); }
export function fail(msg: string) { console.log(`\n  ${RD}✗${R}  ${msg}`); }
export function info(msg: string) { console.log(`  ${D}${msg}${R}`); }

// ─── Summary line (section changed/added/removed) ─────────────────────────────
export function summaryLine(prefix: "+" | "-" | "~", label: string, detail = "") {
  const color = prefix === "+" ? GR : prefix === "-" ? RD : YL;
  console.log(`  ${color}${prefix}${R}  ${label}${detail ? `  ${D}${detail}${R}` : ""}`);
}

// ─── Review box ───────────────────────────────────────────────────────────────
const PREVIEW_LINES = 50;
const WIDTH = 62;

export function reviewBox(label: string, content: string) {
  const lines = content.split("\n");
  const preview = lines.slice(0, PREVIEW_LINES).join("\n");
  const truncated = lines.length > PREVIEW_LINES;
  const title = ` ${label} `;
  const pad = WIDTH - title.length - 2;
  const hr = `${D}${"─".repeat(WIDTH)}${R}`;

  console.log();
  console.log(`  ${D}┌─${R}${B}${title}${R}${D}${"─".repeat(Math.max(0, pad))}┐${R}`);
  console.log();
  // indent content
  for (const line of preview.split("\n")) console.log(`  ${line}`);
  if (truncated) console.log(`\n  ${D}… ${lines.length - PREVIEW_LINES} more lines${R}`);
  console.log();
  console.log(`  ${D}└${"─".repeat(WIDTH)}┘${R}`);
}
