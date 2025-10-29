import fs from "fs";
import path from "path";
import { createPatch } from "diff";
import jsonrepair from "jsonrepair";
import prettier from "prettier";
import * as YAML from "yaml";
// json5 does not ship types in this project; allow implicit any import
// @ts-ignore
import JSON5 from "json5";

export type FixOptions = {
  fixNumericKeys?: boolean;
  fixTrailingCommas?: boolean;
  fixQuotes?: boolean;
  fixBom?: boolean;
  fixYamlIndentation?: boolean;
  fixUnicode?: boolean;
  dryRun?: boolean;
};

export type FixResult = {
  filePath: string;
  original: string;
  fixed: string;
  diffs: string | null;
  summary: Record<string, number>;
};

function stripBOM(content: string) {
  return content.replace(/^\uFEFF/, "");
}

function convertNumericKeyObjectsToArray(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(convertNumericKeyObjectsToArray);

  const keys = Object.keys(obj);
  // detect all numeric keys
  const numericKeys = keys.filter((k) => String(parseInt(k, 10)) === k);
  if (numericKeys.length === keys.length && numericKeys.length > 0) {
    // if keys are contiguous from 0..n-1, convert to array
    const nums = numericKeys.map((k) => parseInt(k, 10)).sort((a, b) => a - b);
    const contiguous = nums.every((n, i) => n === i);
    if (contiguous) {
      const arr = [] as any[];
      for (let i = 0; i < nums.length; i++) {
        arr[i] = convertNumericKeyObjectsToArray(obj[String(i)]);
      }
      return arr;
    }
  }

  const out: any = {};
  for (const k of keys) {
    out[k] = convertNumericKeyObjectsToArray(obj[k]);
  }
  return out;
}

async function tryFormatWithPrettier(content: string, filePath: string) {
  try {
    const config = await prettier.resolveConfig(filePath);
    const formatted = prettier.format(content, { ...config, filepath: filePath });
    return formatted;
  } catch (err) {
    return content;
  }
}

function unifiedDiff(oldStr: string, newStr: string, filePath: string) {
  try {
    const patch = createPatch(filePath, oldStr, newStr);
    return patch;
  } catch (err) {
    return null;
  }
}

export async function fixFile(filePath: string, options: FixOptions): Promise<FixResult> {
  const original = fs.readFileSync(filePath, "utf-8");
  let working = original;
  const summary: Record<string, number> = {
    numericKeysConverted: 0,
    trailingCommasRemoved: 0,
    quotesFixed: 0,
    bomRemoved: 0,
    yamlIndentationFixed: 0,
    unicodeEscaped: 0,
  };

  // BOM
  if (options.fixBom) {
    if (/^\uFEFF/.test(working)) {
      working = stripBOM(working);
      summary.bomRemoved = 1;
    }
  }

  const ext = path.extname(filePath).toLowerCase();

  // Try JSON-like fixes first for .json/.json5/.jsonc
  if ([".json", ".json5", ".jsonc", ".js"].includes(ext) || options.fixTrailingCommas || options.fixNumericKeys || options.fixQuotes) {
    try {
      // jsonrepair will try to fix trailing commas, missing quotes, etc.
      if (options.fixTrailingCommas || options.fixQuotes) {
        const repaired = jsonrepair(working);
        if (repaired !== working) {
          working = repaired;
          summary.trailingCommasRemoved = 1; // best-effort indicator
        }
      }

      // parse JSON
      let parsed: any;
      try {
        parsed = JSON.parse(working);
      } catch (err) {
        // try json5
        try {
          parsed = JSON5.parse(working);
        } catch (err2) {
          parsed = null;
        }
      }

      if (parsed !== null) {
        if (options.fixNumericKeys) {
          const converted = convertNumericKeyObjectsToArray(parsed);
          // if conversion changed structure, count it
          if (JSON.stringify(converted) !== JSON.stringify(parsed)) {
            summary.numericKeysConverted = 1;
            parsed = converted;
          }
        }

        // convert back to string
        const printed = JSON.stringify(parsed, null, 2);
        working = printed;
      }
    } catch (err) {
      // fail silently and continue to YAML fallback
    }
  }

  // YAML handling
  if ([".yml", ".yaml"].includes(ext) || options.fixYamlIndentation) {
    try {
      const parsed = YAML.parse(working);
      const printed = YAML.stringify(parsed);
      if (printed !== working) {
        working = printed;
        summary.yamlIndentationFixed = 1;
      }
    } catch (err) {
      // try to be permissive by attempting jsonrepair then parse as JSON into YAML
      try {
        const repaired = jsonrepair(working);
        const parsedJson = JSON.parse(repaired);
        const printed = YAML.stringify(parsedJson);
        working = printed;
        summary.yamlIndentationFixed = 1;
      } catch (_) {
        // give up
      }
    }
  }

  // Unicode escaping - simple check: replace invalid surrogate pairs
  if (options.fixUnicode) {
    // replace lone surrogates with escaped form
    const cleaned = working.replace(/([\uD800-\uDFFF])(?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])([\uDC00-\uDFFF])/g, (m: string) => {
      summary.unicodeEscaped += 1;
      return "\\u" + m.charCodeAt(0).toString(16).padStart(4, "0");
    });
    working = cleaned;
  }

  // Prettier formatting (also addresses quote style if requested)
  if (options.fixQuotes || options.fixTrailingCommas || options.fixNumericKeys) {
    try {
      const formatted = await tryFormatWithPrettier(working, filePath);
      if (formatted && formatted !== working) {
        working = formatted;
        summary.quotesFixed = 1; // heuristic
      }
    } catch (err) {
      // ignore formatting errors
    }
  }

  const diffs = unifiedDiff(original, working, filePath);

  // write file unless dry-run
  if (!options.dryRun && diffs) {
    fs.writeFileSync(filePath, working, "utf-8");
  }

  return {
    filePath,
    original,
    fixed: working,
    diffs,
    summary,
  };
}

export async function collectFiles(paths: string[]): Promise<string[]> {
  const results: string[] = [];
  for (const p of paths) {
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(p);
      const childPaths = entries.map((e: string) => path.join(p, e));
      const sub = await collectFiles(childPaths);
      results.push(...sub);
    } else if (stat.isFile()) {
      results.push(p);
    }
  }
  return results;
}

export default {
  fixFile,
  collectFiles,
};
