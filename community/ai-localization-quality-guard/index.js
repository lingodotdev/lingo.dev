#!/usr/bin/env node

/**
 * AI Localization Quality Guard (Educational Example)
 * -----------------------------------------------
 * This CLI compares source and translated localization files
 * and reports common localization quality issues.
 *
 * This is a community demo project, not production code.
 */

const fs = require("fs");
const path = require("path");

// ---------- Helpers ----------
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error(`❌ Failed to read file: ${filePath}`);
    process.exit(1);
  }
}

// ---------- Core Logic ----------
function analyzeTranslations(source, translated) {
  const issues = [];

  for (const key of Object.keys(source)) {
    const sourceText = source[key];
    const translatedText = translated[key];

    // Missing translation
    if (!translatedText) {
      issues.push({
        key,
        severity: "HIGH",
        issue: "Missing translation"
      });
      continue;
    }

    // Placeholder check
    const placeholders = sourceText.match(/{[^}]+}/g) || [];
    for (const placeholder of placeholders) {
      if (!translatedText.includes(placeholder)) {
        issues.push({
          key,
          severity: "HIGH",
          issue: `Missing placeholder ${placeholder}`
        });
      }
    }

    // Length explosion check (UI risk)
    if (translatedText.length > sourceText.length * 2) {
      issues.push({
        key,
        severity: "MEDIUM",
        issue: "Translated text is significantly longer and may break UI"
      });
    }
  }

  return issues;
}

// ---------- CLI ----------
const args = process.argv.slice(2);
const strictMode = args.includes("--strict");

const jsonFiles = args.filter(arg => arg.endsWith(".json"));

if (jsonFiles.length < 2) {
  console.log("Usage:");
  console.log("  node index.js <source.json> <translated.json> [--strict]");
  process.exit(1);
}

const sourcePath = path.resolve(jsonFiles[0]);
const translatedPath = path.resolve(jsonFiles[1]);

const sourceData = readJson(sourcePath);
const translatedData = readJson(translatedPath);

const issues = analyzeTranslations(sourceData, translatedData);

// Output result
console.log(JSON.stringify(issues, null, 2));

// Strict mode (CI-friendly)
if (strictMode) {
  const hasHighSeverity = issues.some(issue => issue.severity === "HIGH");
  if (hasHighSeverity) {
    console.error("❌ High severity localization issues found");
    process.exit(1);
  }
}
