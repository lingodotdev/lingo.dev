#!/usr/bin/env node

import { mkdir, writeFile } from "fs/promises";
import type { Root } from "mdast";
import { resolve, dirname } from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { createOrUpdateGitHubComment } from "./utils";
import {
  localeCodesShort,
  localeCodesFull,
  resolveLocaleCode,
} from "@lingo.dev/_spec";

type LocaleInfo = {
  shortCode: string;
  longCodes: string[];
  displayName: string;
  flag: string;
};

function buildLocaleMap(): Record<string, string[]> {
  const localeMap: Record<string, string[]> = {};

  localeCodesShort.forEach((short: string) => {
    const matchingFull = localeCodesFull.filter(
      (full: string) => full.startsWith(`${short}-`) || full === short,
    );

    if (matchingFull.length > 0) {
      localeMap[short] = matchingFull;
    } else {
      try {
        localeMap[short] = [resolveLocaleCode(short)];
      } catch {
        localeMap[short] = [short];
      }
    }
  });

  return localeMap;
}

function getCountryFlag(countryCode: string): string {
  // Convert country code to flag emoji using Unicode Regional Indicator Symbols
  if (countryCode.length !== 2) return "🌐";

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 0x1f1e6 + char.charCodeAt(0) - "A".charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

function extractCountryCodeFromLocale(locale: string): string {
  // Extract country code from locale (e.g., "en-US" -> "US", "zh-Hans-CN" -> "CN")
  const parts = locale.split("-");

  // Look for a 2-letter country code
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (part.length === 2 && /^[A-Z]{2}$/i.test(part)) {
      return part.toUpperCase();
    }
  }

  // Special cases for common locales
  const specialCases: Record<string, string> = {
    "419": "🌎", // Latin America region
    Hans: "CN", // Simplified Chinese
    Hant: "TW", // Traditional Chinese
    Latn: "RS", // Latin script (for Serbian)
    Cyrl: "RS", // Cyrillic script (for Serbian)
  };

  for (const part of parts) {
    if (specialCases[part]) {
      const code = specialCases[part];
      return code.length === 2 ? code : "";
    }
  }

  return "";
}

function getDisplayName(locale: string): string {
  try {
    // Use Intl.DisplayNames to get human-readable language names
    const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

    // Try to get the language name for the full locale first
    try {
      return displayNames.of(locale) || locale;
    } catch {
      // If that fails, try just the language part
      const languageCode = locale.split("-")[0];
      const languageName = displayNames.of(languageCode) || languageCode;

      // Try to add region information if available
      const countryCode = extractCountryCodeFromLocale(locale);
      if (countryCode) {
        try {
          const regionName = regionNames.of(countryCode);
          return `${languageName} (${regionName})`;
        } catch {
          return languageName;
        }
      }

      return languageName;
    }
  } catch {
    return locale;
  }
}

function processLocales(localeMap: Record<string, string[]>): LocaleInfo[] {
  const locales: LocaleInfo[] = [];

  Object.entries(localeMap).forEach(([shortCode, longCodes]) => {
    // Use the first long code to determine the primary flag
    const primaryLocale = longCodes[0];
    const countryCode = extractCountryCodeFromLocale(primaryLocale);
    const flag = countryCode ? getCountryFlag(countryCode) : "🌐";

    // Get display name for the primary locale
    const displayName = getDisplayName(primaryLocale);

    locales.push({
      shortCode,
      longCodes,
      displayName,
      flag,
    });
  });

  // Sort alphabetically by short code
  return locales.sort((a, b) => a.shortCode.localeCompare(b.shortCode));
}

function buildMarkdown(locales: LocaleInfo[]): string {
  const mdast: Root = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "This page contains the complete list of locales supported by ",
          },
          {
            type: "strong",
            children: [{ type: "text", value: "Lingo.dev" }],
          },
          {
            type: "text",
            value: `. Each locale includes both short codes (e.g., "en") and full codes (e.g., "en-US") for maximum compatibility.`,
          },
        ],
      },
    ],
  };

  mdast.children.push({
    type: "heading",
    depth: 2,
    children: [{ type: "text", value: "Supported Locales" }],
  });

  // Add a summary paragraph
  mdast.children.push({
    type: "paragraph",
    children: [
      {
        type: "text",
        value: `Lingo.dev supports ${locales.length} languages with ${locales.reduce((sum, locale) => sum + locale.longCodes.length, 0)} regional variants.`,
      },
    ],
  });

  locales.forEach((locale) => {
    mdast.children.push({
      type: "heading",
      depth: 3,
      children: [
        { type: "text", value: `${locale.flag} ${locale.displayName}` },
      ],
    });

    mdast.children.push({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "Short Code:" }],
        },
        {
          type: "text",
          value: " ",
        },
        {
          type: "inlineCode",
          value: locale.shortCode,
        },
      ],
    });

    mdast.children.push({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "Full Codes:" }],
        },
      ],
    });

    const codesList = locale.longCodes.map((code) => ({
      type: "listItem" as const,
      children: [
        {
          type: "paragraph" as const,
          children: [
            {
              type: "inlineCode" as const,
              value: code,
            },
            {
              type: "text" as const,
              value: ` - ${getDisplayName(code)}`,
            },
          ],
        },
      ],
    }));

    mdast.children.push({
      type: "list",
      ordered: false,
      children: codesList,
    });

    // Add usage example
    mdast.children.push({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "Usage Example:" }],
        },
      ],
    });

    mdast.children.push({
      type: "code",
      lang: "json",
      value: JSON.stringify(
        {
          locale: {
            source: "en",
            targets: [locale.shortCode],
          },
        },
        null,
        2,
      ),
    });
  });

  return unified().use(remarkStringify).stringify(mdast);
}

async function main(): Promise<void> {
  const commentMarker = "<!-- generate-locales-docs -->";

  console.log("🔄 Generating locales docs...");
  const localeMap = buildLocaleMap();
  const locales = processLocales(localeMap);
  const markdown = buildMarkdown(locales);

  const isGitHubAction = Boolean(process.env.GITHUB_ACTIONS);

  if (isGitHubAction) {
    console.log("💬 Commenting on GitHub PR...");

    const mdast: Root = {
      type: "root",
      children: [
        { type: "html", value: commentMarker },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value:
                "Your PR affects Lingo.dev locale support and, as a result, may affect the auto-generated locale documentation that will be published to the documentation website. Please review the output below to ensure that the changes are correct.",
            },
          ],
        },
        { type: "html", value: "<details>" },
        {
          type: "html",
          value: "<summary>Lingo.dev Supported Locales</summary>",
        },
        { type: "code", lang: "markdown", value: markdown },
        { type: "html", value: "</details>" },
      ],
    };

    const body = unified()
      .use([[remarkStringify, { fence: "~" }]])
      .stringify(mdast)
      .toString();

    await createOrUpdateGitHubComment({
      commentMarker,
      body,
    });

    return;
  }

  const outputArg = process.argv[2];

  if (!outputArg) {
    throw new Error(
      "Output file path is required. Usage: generate-locales-docs <output-path>",
    );
  }

  const outputFilePath = resolve(process.cwd(), outputArg);

  console.log(`💾 Saving to ${outputFilePath}...`);
  await mkdir(dirname(outputFilePath), { recursive: true });
  await writeFile(outputFilePath, markdown, "utf8");
  console.log(`✅ Saved to ${outputFilePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
