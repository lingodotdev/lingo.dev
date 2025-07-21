import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { Octokit } from "@octokit/rest";

export function getRepoRoot(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let currentDir = __dirname;

  while (currentDir !== path.parse(currentDir).root) {
    if (existsSync(path.join(currentDir, ".git"))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error("Could not find project root");
}

export function getGitHubToken() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is required.");
  }

  return token;
}

export function getGitHubRepo() {
  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    throw new Error("GITHUB_REPOSITORY environment variable is missing.");
  }

  const [_, repo] = repository.split("/");

  return repo;
}

export function getGitHubOwner() {
  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository) {
    throw new Error("GITHUB_REPOSITORY environment variable is missing.");
  }

  const [owner] = repository.split("/");

  return owner;
}

export function getGitHubPRNumber() {
  const prNumber = process.env.PR_NUMBER;

  if (prNumber) {
    return Number(prNumber);
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (eventPath && existsSync(eventPath)) {
    try {
      const eventData = JSON.parse(readFileSync(eventPath, "utf8"));
      return Number(eventData.pull_request?.number);
    } catch (err) {
      console.warn("Failed to parse GITHUB_EVENT_PATH JSON:", err);
    }
  }

  throw new Error("Could not determine pull request number.");
}

export type GitHubCommentOptions = {
  commentMarker: string;
  body: string;
};

export async function createOrUpdateGitHubComment(
  options: GitHubCommentOptions,
): Promise<void> {
  const token = getGitHubToken();
  const owner = getGitHubOwner();
  const repo = getGitHubRepo();
  const prNumber = getGitHubPRNumber();

  const octokit = new Octokit({ auth: token });

  const commentsResponse = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });

  const comments = commentsResponse.data;

  const existing = comments.find((c) => {
    if (!c.body) {
      return false;
    }
    return c.body.startsWith(options.commentMarker);
  });

  if (existing) {
    console.log(`Updating existing comment (id: ${existing.id}).`);
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existing.id,
      body: options.body,
    });
    return;
  }

  console.log("Creating new comment.");
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: options.body,
  });
}
