#!/usr/bin/env node

import { existsSync, readFileSync } from "fs";
import path from "path";
import { Octokit } from "@octokit/rest";
import { getRepoRoot } from "./utils.js";

const MAX_COMMENT_LENGTH = 65000; // GitHub comment max ~65536 bytes
const MARKER = "<!-- auto-generated-cli-docs -->";

async function main(): Promise<void> {
  const eventName = process.env.GITHUB_EVENT_NAME;
  if (eventName !== "pull_request") {
    console.log(`Skipping comment step because event name is '${eventName}'.`);
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is required.");
  }

  const repoRoot = getRepoRoot();
  const docsPath = path.resolve(repoRoot, "docs", "cli-commands.md");

  if (!existsSync(docsPath)) {
    console.log("CLI docs file not found – skipping comment update.");
    return;
  }

  const raw = readFileSync(docsPath, "utf8");
  const truncated =
    raw.length > MAX_COMMENT_LENGTH
      ? `${raw.slice(0, MAX_COMMENT_LENGTH)}\n\n...truncated...`
      : raw;

  const body = `${MARKER}\n<details>\n<summary>📖 CLI Command Reference</summary>\n\n\
\`\`\`markdown\n${truncated}\n\`\`\`\n\n</details>`;

  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) {
    throw new Error("GITHUB_REPOSITORY environment variable is missing.");
  }
  const [owner, repo] = repository.split("/");

  // Determine PR number
  let prNumber: number | undefined;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath && existsSync(eventPath)) {
    try {
      const eventData = JSON.parse(readFileSync(eventPath, "utf8"));
      prNumber = eventData.pull_request?.number;
    } catch (err) {
      console.warn("Failed to parse GITHUB_EVENT_PATH JSON:", err);
    }
  }
  if (!prNumber && process.env.PR_NUMBER) {
    prNumber = Number(process.env.PR_NUMBER);
  }
  if (!prNumber) {
    throw new Error("Could not determine pull request number.");
  }

  const octokit = new Octokit({ auth: token });

  // Check for existing auto-generated comment
  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });

  const existing = comments.find((c: { body?: string | null }) =>
    c.body?.startsWith(MARKER),
  );

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
