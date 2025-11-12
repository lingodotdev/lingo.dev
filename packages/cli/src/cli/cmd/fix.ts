import { Command } from "interactive-commander";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import { jsonrepair } from "jsonrepair";
import YAML from "yaml";
import prettier from "prettier";
import chalk from "chalk";
import { diffLines } from "diff";

type FixOptions = {
  dryRun?: boolean;
  fixNumericKeys?: boolean;
  fixTrailingCommas?: boolean;
  fixQuotes?: boolean;
  fixYamlIndent?: boolean;
  removeBom?: boolean;
  fixUnicode?: boolean;
  files?: string[];
};

function stripBOM(input: string): string {
  if (!input) return input;
  // Remove UTF-8 BOM if present
  return input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
}

function sanitizeUnicode(input: string): string {
  if (!input) return input;
  // Replace unpaired surrogates with the Unicode replacement character
  return input.replace(/[\uD800-\uDFFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "\uFFFD");
}

function isJsonFile(filePath: string): boolean {
  return /\.(json|jsonc)$/i.test(filePath);
}

function isYamlFile(filePath: string): boolean {
  return /\.(ya?ml)$/i.test(filePath);
}

async function loadPrettierConfig(filePath: string) {
  try {
    return await prettier.resolveConfig(filePath);
  } catch {
    return null;
  }
}

async function formatWithPrettier(content: string, filePath: string): Promise<string> {
  const config = (await loadPrettierConfig(filePath)) || undefined;
  const parser = isJsonFile(filePath) ? "json" : isYamlFile(filePath) ? "yaml" : undefined;
  if (!parser) return content;
  try {
    return await prettier.format(content, { ...(config || {}), parser });
  } catch {
    return content;
  }
}

function convertNumericObjectKeys(value: any): any {
  if (Array.isArray(value)) {
    return value.map(convertNumericObjectKeys);
  }
  if (value && typeof value === "object") {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      // Ensure keys are stored as strings explicitly; for JSON this is always true, but this coerces any numeric-like keys consistently
      const key = String(k);
      result[key] = convertNumericObjectKeys(v);
    }
    return result;
  }
  return value;
}

function safeReadFile(filePath: string): string {
  const raw = fs.readFileSync(filePath, "utf8");
  return sanitizeUnicode(stripBOM(raw));
}

function buildSummaryLine(label: string, count: number): string {
  return `  ${chalk.green("\u2713")} ${label.replace("{n}", String(count))}`;
}

async function processJson(content: string, opts: Required<FixOptions>, filePath: string) {
  const before = content;
  let working = content;

  // Trailing commas, missing quotes, escaping: jsonrepair
  if (opts.fixTrailingCommas) {
    try {
      // jsonrepair always returns valid JSON text
      working = jsonrepair(working);
    } catch {}
  }

  // Parse to object to transform keys
  let parsed: any;
  try {
    parsed = JSON.parse(working);
  } catch {
    try {
      parsed = JSON.parse(jsonrepair(working));
    } catch {
      // Give up and return original
      return { output: before, summary: ["Failed to parse JSON, skipped fixes"], changed: false };
    }
  }

  const preKeys = JSON.stringify(parsed);
  if (opts.fixNumericKeys) {
    parsed = convertNumericObjectKeys(parsed);
  }
  const postKeys = JSON.stringify(parsed);
  const keysChanged = preKeys !== postKeys;

  // Serialize compactly; formatting handled by Prettier
  let serialized = JSON.stringify(parsed);

  // Quotes consistency handled by Prettier; but ensure final newline
  serialized += serialized.endsWith("\n") ? "" : "\n";
  const formatted = await formatWithPrettier(serialized, filePath);

  const changed = formatted !== before;
  const summary: string[] = [];
  if (opts.fixNumericKeys) summary.push(buildSummaryLine("Converted {n} numeric-key objects (by structure)", keysChanged ? 1 : 0));
  if (opts.fixTrailingCommas) summary.push(buildSummaryLine("Removed/fixed trailing commas", formatted === before ? 0 : 1));
  if (opts.fixQuotes) summary.push(buildSummaryLine("Normalized quote style", formatted === before ? 0 : 1));
  return { output: formatted, summary, changed };
}

async function processYaml(content: string, opts: Required<FixOptions>, filePath: string) {
  const before = content;
  let parsed: any;
  try {
    parsed = YAML.parse(content) ?? {};
  } catch {
    // Attempt a simple indentation repair: normalize single-space indents to two spaces
    if (opts.fixYamlIndent) {
      const repaired = content
        .split("\n")
        .map((line) => (line.startsWith(" ") && !line.startsWith("  ") ? line.replace(/^\s{1}(\S)/, "  $1") : line))
        .join("\n");
      try {
        parsed = YAML.parse(repaired) ?? {};
        content = repaired;
      } catch {
        return { output: before, summary: ["Failed to parse YAML, skipped fixes"], changed: false };
      }
    } else {
      return { output: before, summary: ["Failed to parse YAML, skipped fixes"], changed: false };
    }
  }

  // Stringify with YAML to normalize indentation/quotes as best effort
  let serialized = YAML.stringify(parsed, { lineWidth: -1 });
  serialized += serialized.endsWith("\n") ? "" : "\n";
  const formatted = await formatWithPrettier(serialized, filePath);

  const changed = formatted !== before;
  const summary: string[] = [];
  if (opts.fixYamlIndent) summary.push(buildSummaryLine("Corrected YAML indentation/syntax", changed ? 1 : 0));
  if (opts.fixQuotes) summary.push(buildSummaryLine("Normalized quote style", changed ? 1 : 0));
  return { output: formatted, summary, changed };
}

function collectTargetFiles(argsFiles: string[] | undefined): string[] {
  if (argsFiles && argsFiles.length > 0) {
    return argsFiles
      .flatMap((p) => (fs.existsSync(p) && fs.statSync(p).isDirectory() ? glob.sync(path.join(p, "**/*.{json,jsonc,yml,yaml}"), { ignore: ["**/node_modules/**"] }) : [p]))
      .filter((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  }

  // Default: search current directory
  return glob.sync("**/*.{json,jsonc,yml,yaml}", {
    ignore: ["**/node_modules/**", "**/package*.json", "**/i18n.json", "**/lingo.json"],
  });
}

function printDiff(before: string, after: string, filePath: string) {
  const parts = diffLines(before, after);
  console.log(chalk.gray(`--- ${filePath}`));
  console.log(chalk.gray(`+++ ${filePath}`));
  for (const part of parts) {
    const color = part.added ? chalk.green : part.removed ? chalk.red : chalk.dim;
    process.stdout.write(color(part.value));
  }
  if (!parts.length) {
    console.log(chalk.dim("(no changes)"));
  }
}

export async function runFix(files: string[] | undefined, options: FixOptions) {
  const opts: Required<FixOptions> = {
    dryRun: Boolean(options.dryRun),
    fixNumericKeys: options.fixNumericKeys !== false,
    fixTrailingCommas: options.fixTrailingCommas !== false,
    fixQuotes: options.fixQuotes !== false,
    fixYamlIndent: options.fixYamlIndent !== false,
    removeBom: options.removeBom !== false,
    fixUnicode: options.fixUnicode !== false,
    files: files || [],
  } as Required<FixOptions>;

  const targets = collectTargetFiles(files);
  if (targets.length === 0) {
    console.log("No target files found.");
    return { totalFiles: 0, totalChanged: 0 };
  }

  let totalChanged = 0;
  let totalFiles = 0;

  for (const filePath of targets) {
    totalFiles += 1;
    const raw = safeReadFile(filePath);
    let working = raw;
    const pre = working;

    if (opts.removeBom) {
      working = stripBOM(working);
    }
    if (opts.fixUnicode) {
      working = sanitizeUnicode(working);
    }

    let result: { output: string; summary: string[]; changed: boolean } = {
      output: working,
      summary: [],
      changed: false,
    };

    if (isJsonFile(filePath)) {
      result = await processJson(working, opts, filePath);
    } else if (isYamlFile(filePath)) {
      result = await processYaml(working, opts, filePath);
    } else {
      continue;
    }

    const after = result.output;
    const changed = after !== pre;
    if (changed) totalChanged += 1;

    console.log();
    console.log(chalk.bold(`${changed ? "Fixed" : "Checked"} ${path.relative(process.cwd(), filePath)}:`));
    for (const line of result.summary) console.log(line);

    if (opts.dryRun) {
      printDiff(pre, after, filePath);
    } else if (changed) {
      fs.writeFileSync(filePath, after, "utf8");
    }
  }

  console.log();
  console.log(
    chalk.bold(
      `Processed ${totalFiles} file${totalFiles === 1 ? "" : "s"}; fixed ${totalChanged} file${totalChanged === 1 ? "" : "s"}.`,
    ),
  );

  return { totalFiles, totalChanged };
}

export default new Command()
  .command("fix")
  .description("Automatically repair common issues in JSON/YAML files")
  .helpOption("-h, --help", "Show help")
  .option("--dry-run", "Preview changes without writing files")
  .option("--fix-numeric-keys", "Convert numeric-like object keys to strings (JSON)")
  .option("--fix-trailing-commas", "Remove trailing commas and repair malformed JSON")
  .option("--fix-quotes", "Normalize quote style per Prettier config, if available")
  .option("--fix-yaml-indent", "Correct YAML indentation/syntax where possible")
  .option("--remove-bom", "Remove BOM (Byte Order Mark) if present")
  .option("--fix-unicode", "Replace invalid Unicode sequences with replacement character")
  .argument("[files...]")
  .action(async (filesArg: string[], options: FixOptions) => {
    await runFix(filesArg, options);
  });


