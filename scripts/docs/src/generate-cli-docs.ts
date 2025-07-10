#!/usr/bin/env node

import type { Command } from "commander";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import type { Root } from "mdast";
import { dirname, relative, resolve } from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { pathToFileURL } from "url";
import { Octokit } from "@octokit/rest";
import {
  getRepoRoot,
  GITHUB_MAX_COMMENT_LENGTH,
  getGitHubEventName,
  getGitHubOwner,
  getGitHubPRNumber,
  getGitHubRepo,
  getGitHubToken,
  truncate,
} from "./utils";

const REPO_ROOT = getRepoRoot();
const OUTPUT_DIR = resolve(REPO_ROOT, "docs");
const OUTPUT_FILE_NAME = "cli-commands.md";
const OUTPUT_FILE_PATH = resolve(OUTPUT_DIR, OUTPUT_FILE_NAME);

const MARKER = "<!-- generate-cli-docs -->";

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

async function commentOnGitHubPR(content: string): Promise<void> {
  const eventName = getGitHubEventName();

  if (eventName !== "pull_request") {
    console.log(`Skipping comment step because event name is '${eventName}'.`);
    return;
  }

  const token = getGitHubToken();
  const owner = getGitHubOwner();
  const repo = getGitHubRepo();
  const prNumber = getGitHubPRNumber();

  const truncated = truncate(content, GITHUB_MAX_COMMENT_LENGTH);

  const mdast: Root = {
    type: "root",
    children: [
      { type: "html", value: MARKER },
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
      { type: "code", lang: "markdown", value: truncated },
      { type: "html", value: "</details>" },
    ],
  };

  const body = unified()
    .use([[remarkStringify, { fence: "~" }]])
    .stringify(mdast)
    .toString();

  const octokit = new Octokit({ auth: token });

  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });

  const existing = comments.find((c) => c.body?.startsWith(MARKER));

  if (existing) {
    console.log(`Updating existing comment (id: ${existing.id}).`);
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body,
    });
  } else {
    console.log("Creating new comment.");
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body,
    });
  }
}

async function main(): Promise<void> {
  console.log("🔄 Generating CLI docs...");
  const cli = await getCLI();
  const markdown = buildMarkdown(cli);

  const isGitHubAction = Boolean(process.env.GITHUB_ACTIONS);

  if (isGitHubAction) {
    console.log("💬 Commenting on GitHub PR...");
    await commentOnGitHubPR(markdown);
    return;
  }

  console.log(`💾 Saving to ${OUTPUT_FILE_PATH}...`);
  const outputDir = dirname(OUTPUT_FILE_PATH);
  await mkdir(outputDir, { recursive: true });
  await writeFile(OUTPUT_FILE_PATH, markdown, "utf8");
  console.log(`✅ Saved to ${OUTPUT_FILE_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
