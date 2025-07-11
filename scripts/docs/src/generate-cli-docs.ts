#!/usr/bin/env node

import type { Command } from "commander";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import type { Root } from "mdast";
import { resolve, dirname } from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { pathToFileURL } from "url";
import { createOrUpdateGitHubComment, getRepoRoot } from "./utils";

async function getProgram(repoRoot: string): Promise<Command> {
  const filePath = resolve(
    repoRoot,
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
  const mdast: Root = {
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
    mdast.children.push({
      type: "heading",
      depth: 2,
      children: [{ type: "inlineCode", value: commandPath || cmd.name() }],
    });

    // Code block containing the help output
    mdast.children.push({
      type: "code",
      lang: "bash",
      value: helper.formatHelp(cmd, helper).trimEnd(),
    });

    cmd.commands.forEach((sub: Command) => {
      walk({ cmd: sub, parents: [...parents, cmd.name()] });
    });
  }

  walk({ cmd: program, parents: [] });

  return unified().use(remarkStringify).stringify(mdast);
}

async function main(): Promise<void> {
  const repoRoot = getRepoRoot();
  const commentMarker = "<!-- generate-cli-docs -->";

  console.log("🔄 Generating CLI docs...");
  const cli = await getProgram(repoRoot);
  const markdown = buildMarkdown(cli);

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
                "Your PR affects Lingo.dev CLI and, as a result, may affect the auto-generated reference documentation that will be published to the documentation website. Please review the output below to ensure that the changes are correct.",
            },
          ],
        },
        { type: "html", value: "<details>" },
        { type: "html", value: "<summary>Lingo.dev CLI Commands</summary>" },
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
      "Output file path is required. Usage: generate-cli-docs <output-path>",
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
