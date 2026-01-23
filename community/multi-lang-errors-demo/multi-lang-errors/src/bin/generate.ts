#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const cwd = process.cwd();
const configPath = path.join(cwd, "multi-lang-errors.config.json");

const userErrorsDir = path.join(cwd, "src", "errors");
const errorsFile = path.join(userErrorsDir, "errors.js");
const indexFile = path.join(userErrorsDir, "index.js");

export async function generateTranslations() {
  if (!fs.existsSync(configPath)) {
    console.error("❌ Config file not found. Run init first.");
    process.exit(1);
  }

  const { apiKey, languages, baseErrors } = JSON.parse(
    fs.readFileSync(configPath, "utf-8"),
  );

  if (!apiKey || apiKey === "YOUR_LINGO_API_KEY") {
    console.error("❌ Please set your LINGO API_KEY in config");
    process.exit(1);
  }

  fs.mkdirSync(userErrorsDir, { recursive: true });

  const client = new LingoDotDevEngine({ apiKey });

  // 🧠 STEP 1: LOAD EXISTING TRANSLATIONS IF PRESENT
  let existingTranslations: Record<string, Record<string, string>> = {};

  if (fs.existsSync(errorsFile)) {
    try {
      const raw = fs.readFileSync(errorsFile, "utf-8");
      const match = raw.match(/export const errors = (.*);/s);
      if (match) existingTranslations = JSON.parse(match[1]);
      console.log("📦 Loaded existing translations");
    } catch {
      console.warn("⚠️ Could not read existing translations, regenerating all");
    }
  }

  const translations = { ...existingTranslations };

  console.log("🌍 Generating missing translations...\n");

  for (const lang of languages) {
    translations[lang] = translations[lang] || {};

    for (const [key, text] of Object.entries(
      baseErrors as Record<string, string>,
    )) {
      // ⛔ Skip if already exists
      if (translations[lang][key]) {
        console.log(`⏭️  Skipped ${key} → ${lang} (already exists)`);
        continue;
      }

      try {
        translations[lang][key] =
          lang === "en"
            ? text
            : await client.localizeText(text, {
                sourceLocale: "en",
                targetLocale: lang,
              });

        console.log(`✅ Generated ${key} → ${lang}`);
      } catch {
        console.warn(`⚠️ Failed ${key} → ${lang}, using English`);
        translations[lang][key] = text;
      }
    }
  }

  // 📝 WRITE MERGED FILE
  fs.writeFileSync(
    errorsFile,
    `// ⚠️ AUTO-GENERATED FILE - SAFE TO EDIT
export const errors = ${JSON.stringify(translations, null, 2)};
`,
  );

  // 🧠 STEP 2: ENSURE BRIDGE FILE IS CORRECT
  let shouldWriteBridge = true;

  if (fs.existsSync(indexFile)) {
    const raw = fs.readFileSync(indexFile, "utf-8");

    // Detect if proper init bridge already exists
    const hasInitBridge = /initError\s*\(\s*errors\s*\)/.test(raw);

    if (hasInitBridge) {
      shouldWriteBridge = false;
      console.log("🔒 index.js already has initError — keeping user file");
    } else {
      console.log("🛠 index.js exists but missing initError — fixing");
    }
  }

  if (shouldWriteBridge) {
    fs.writeFileSync(
      indexFile,
      `// ⚠️ AUTO-GENERATED INIT FILE
import { initError } from "multi-lang-errors";
import { errors } from "./errors";

initError(errors);
`,
    );
    console.log("🔁 index.js bridge written/updated");
  }
}
