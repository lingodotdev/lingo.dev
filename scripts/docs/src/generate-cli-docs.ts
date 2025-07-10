#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import type { Command } from "commander";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import type { Root } from "mdast";
import { resolve } from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { pathToFileURL } from "url";
import {
  getGitHubOwner,
  getGitHubPRNumber,
  getGitHubRepo,
  getGitHubToken,
  getRepoRoot,
} from "./utils";

async function getCLI(repoRoot: string): Promise<Command> {
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
  // Create a Markdown AST
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

  // Stringify the AST to Markdown
  return unified().use(remarkStringify).stringify(mdast);
}

type GitHubCommentOptions = {
  marker: string;
  body: string;
};

async function createOrUpdateGitHubComment(
  options: GitHubCommentOptions,
): Promise<void> {
  const token = getGitHubToken();
  const owner = getGitHubOwner();
  const repo = getGitHubRepo();
  const prNumber = getGitHubPRNumber();

  const octokit = new Octokit({ auth: token });

  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });

  const existing = comments.find((c) => c.body?.startsWith(options.marker));

  if (existing) {
    console.log(`Updating existing comment (id: ${existing.id}).`);
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body: options.body,
    });
  } else {
    console.log("Creating new comment.");
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: options.body,
    });
  }
}

async function main(): Promise<void> {
  console.log("🔄 Generating CLI docs...");

  const repoRoot = getRepoRoot();
  const outputDir = resolve(repoRoot, "docs");
  const outputFileName = "cli-commands.md";
  const outputFilePath = resolve(outputDir, outputFileName);
  const COMMENT_MARKER = "<!-- generate-cli-docs -->";

  const cli = await getCLI(repoRoot);
  const markdown = buildMarkdown(cli);

  const isGitHubAction = Boolean(process.env.GITHUB_ACTIONS);

  if (isGitHubAction) {
    console.log("💬 Commenting on GitHub PR...");

    const mdast: Root = {
      type: "root",
      children: [
        { type: "html", value: COMMENT_MARKER },
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
      marker: COMMENT_MARKER,
      body,
    });

    return;
  }

  console.log(`💾 Saving to ${outputFilePath}...`);
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFilePath, markdown, "utf8");
  console.log(`✅ Saved to ${outputFilePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
