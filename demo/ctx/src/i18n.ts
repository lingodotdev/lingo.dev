import fs from "fs";
import { readFile } from "./files.ts";
import { selectMenu } from "./cli.ts";
import { summaryLine, info } from "./ui.ts";

export function parseSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = content.split(/^(## .+)$/m);
  for (let i = 1; i < parts.length; i += 2) {
    sections[parts[i].trim()] = parts[i + 1]?.trim() ?? "";
  }
  return sections;
}

export function printUpdateSummary(before: string, after: string): void {
  const prev = parseSections(before);
  const next = parseSections(after);
  const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const lines: string[] = [];

  for (const key of allKeys) {
    const label = key.replace("## ", "");
    if (!prev[key]) {
      lines.push(`  + ${label} (new section)`);
    } else if (!next[key]) {
      lines.push(`  - ${label} (removed)`);
    } else if (prev[key] !== next[key]) {
      const pluralize = (n: number, word: string) => `${n} ${word}${n !== 1 ? "s" : ""}`;
      if (label === "Tricky Terms") {
        const countRows = (s: string) => s.split("\n").filter(l => l.startsWith("| ") && !l.includes("---") && !l.includes("Term |")).length;
        const added = countRows(next[key]) - countRows(prev[key]);
        const suffix = added > 0 ? ` (+${pluralize(added, "term")})` : "";
        lines.push(`  ~ ${label}${suffix}`);
      } else if (label === "Files") {
        const countFiles = (s: string) => (s.match(/^### /gm) ?? []).length;
        const added = countFiles(next[key]) - countFiles(prev[key]);
        const suffix = added > 0 ? ` (+${pluralize(added, "file")})` : "";
        lines.push(`  ~ ${label}${suffix}`);
      } else {
        lines.push(`  ~ ${label}`);
      }
    }
  }

  if (lines.length) {
    console.log();
    for (const l of lines) {
      const prefix = l.trimStart()[0] as "+" | "-" | "~";
      const rest = l.replace(/^\s*[+\-~]\s*/, "");
      const [label, detail] = rest.split(/\s*\((.+)\)$/);
      summaryLine(prefix, label.trim(), detail);
    }
  }
}

export async function updateI18nProvider(i18nPath: string, contextPath: string): Promise<void> {
  const context = readFile(contextPath);
  const i18nRaw = fs.readFileSync(i18nPath, "utf-8");
  const i18n = JSON.parse(i18nRaw);

  const newProvider = {
    id: "anthropic",
    model: "claude-haiku-4-5",
    prompt: `Translate from {source} to {target}.\n\n${context}`,
    ...(i18n.provider?.voices ? { voices: i18n.provider.voices } : {}),
  };

  if (i18n.provider) {
    info(`provider: ${i18n.provider.id}  ·  ${i18n.provider.model}`);
    const choice = await selectMenu("Overwrite provider with updated context?", ["Update", "Keep existing"], 1);
    if (choice === 1) return;
  }

  i18n.provider = newProvider;
  fs.writeFileSync(i18nPath, JSON.stringify(i18n, null, 2), "utf-8");
  info(`updated provider in i18n.json`);
}
