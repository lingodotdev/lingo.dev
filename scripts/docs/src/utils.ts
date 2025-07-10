import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

export const GITHUB_MAX_COMMENT_LENGTH = 65000;

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

export function truncate(content: string, maxLength: number) {
  return content.length > maxLength
    ? `${content.slice(0, maxLength)}\n\n...truncated...`
    : content;
}

export function getGitHubEventName() {
  const eventName = process.env.GITHUB_EVENT_NAME;

  if (!eventName) {
    throw new Error("GITHUB_EVENT_NAME environment variable is missing.");
  }

  return eventName;
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
