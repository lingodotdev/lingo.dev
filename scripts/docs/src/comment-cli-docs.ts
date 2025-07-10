#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import { existsSync, readFileSync } from "fs";
import type { Root } from "mdast";
import path from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { getRepoRoot } from "./utils.js";

const MAX_COMMENT_LENGTH = 65000; // GitHub comment max ~65536 bytes
const MARKER = "<!-- auto-generated-cli-docs -->";

function truncate(content: string, maxLength: number) {
  return content.length > maxLength
    ? `${content.slice(0, maxLength)}\n\n...truncated...`
    : content;
}

async function main() {
  const eventName = process.env.GITHUB_EVENT_NAME;
  if (eventName !== "pull_request") {
    console.log(`Skipping comment step  because event name is '${eventName}'.`);
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is required.");
  }

  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) {
    throw new Error("GITHUB_REPOSITORY environment variable is missing.");
  }
  const [owner, repo] = repository.split("/");

  let prNumber: number | undefined;
  if (process.env.PR_NUMBER) {
    prNumber = Number(process.env.PR_NUMBER);
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!prNumber && eventPath && existsSync(eventPath)) {
    try {
      const eventData = JSON.parse(readFileSync(eventPath, "utf8"));
      prNumber = eventData.pull_request?.number;
    } catch (err) {
      console.warn("Failed to parse GITHUB_EVENT_PATH JSON:", err);
    }
  }

  if (!prNumber) {
    throw new Error("Could not determine pull request number.");
  }

  const repoRoot = getRepoRoot();
  const docsPath = path.resolve(repoRoot, "docs", "cli-commands.md");

  if (!existsSync(docsPath)) {
    console.log("CLI docs file not found – skipping comment update.");
    return;
  }

  const raw = readFileSync(docsPath, "utf8");
  const truncated = truncate(raw, MAX_COMMENT_LENGTH);

  function buildCommentBody(content: string) {
    const mdast: Root = {
      type: "root",
      children: [
        {
          type: "html",
          value: MARKER,
        },
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
        {
          type: "html",
          value: "<details>",
        },
        {
          type: "html",
          value: "<summary>Lingo.dev CLI Commands</summary>",
        },
        { type: "paragraph", children: [{ type: "text", value: content }] },
        { type: "html", value: "</details>" },
      ],
    };

    return unified()
      .use([[remarkStringify, { fence: "````" }]])
      .stringify(mdast)
      .toString();
  }

  const body = buildCommentBody(truncated);

  const octokit = new Octokit({ auth: token });

  // Check for existing auto-generated comment
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
