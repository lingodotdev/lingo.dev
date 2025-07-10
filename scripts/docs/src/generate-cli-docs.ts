#!/usr/bin/env node

import type { Command } from "commander";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import type { Root } from "mdast";
import { dirname, relative, resolve } from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { pathToFileURL } from "url";
import { getRepoRoot } from "./utils";

const REPO_ROOT = getRepoRoot();
const DEFAULT_OUTPUT_DIR = resolve(REPO_ROOT, "docs");
const DEFAULT_OUTPUT_FILE_NAME = "cli-commands.md";
const DEFAULT_OUTPUT_FILE_PATH = resolve(
  DEFAULT_OUTPUT_DIR,
  DEFAULT_OUTPUT_FILE_NAME,
);

const OUTPUT_FILE_PATH =
  process.env.GENERATE_CLI_DOCS_OUTPUT_FILE_PATH || DEFAULT_OUTPUT_FILE_PATH;

async function getCLI(): Promise<Command> {
  const filePath = resolve(
    REPO_ROOT,
    "packages",
    "cli",
    "src",
    "cli",
    "index.ts",
  );

  if (!existsSync(filePath)) {
    throw new Error(`CLI source file not found at ${filePath}`);
  }

  const cliModule = (await import(pathToFileURL(filePath).href)) as {
    default: Command;
  };

  return cliModule.default;
}

function buildMarkdown(program: Command): string {
  // Create a Markdown AST
  const root: Root = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value:
              "This page contains the complete list of commands available via ",
          },
          {
            type: "strong",
            children: [{ type: "text", value: "Lingo.dev CLI" }],
          },
          {
            type: "text",
            value: ". To access this documentation from the CLI itself, run ",
          },
          {
            type: "inlineCode",
            value: "npx lingo.dev@latest --help",
          },
          {
            type: "text",
            value: ".",
          },
        ],
      },
    ],
  };

  const helper = program.createHelp();
  const visited = new Set<Command>();

  type WalkOptions = {
    cmd: Command;
    parents: string[];
  };

  function walk({ cmd, parents }: WalkOptions): void {
    if (visited.has(cmd)) {
      return;
    }
    visited.add(cmd);

    const commandPath = [...parents, cmd.name()].join(" ").trim();

    // Heading for this command
    root.children.push({
      type: "heading",
      depth: 2,
      children: [{ type: "inlineCode", value: commandPath || cmd.name() }],
    });

    // Code block containing the help output
    root.children.push({
      type: "code",
      lang: "bash",
      value: helper.formatHelp(cmd, helper).trimEnd(),
    });

    cmd.commands.forEach((sub: Command) => {
      walk({ cmd: sub, parents: [...parents, cmd.name()] });
    });
  }

  walk({ cmd: program, parents: [] });

  // Stringify the AST to Markdown
  return unified().use(remarkStringify).stringify(root);
}

async function main(): Promise<void> {
  console.log("🔄 Generating CLI docs...");
  const cli = await getCLI();
  const markdown = buildMarkdown(cli);
  const outputDir = dirname(OUTPUT_FILE_PATH);
  await mkdir(outputDir, { recursive: true });
  await writeFile(OUTPUT_FILE_PATH, markdown, "utf8");
  console.log(`✅ Saved to ${relative(REPO_ROOT, OUTPUT_FILE_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
