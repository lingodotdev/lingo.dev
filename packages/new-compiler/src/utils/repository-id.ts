import { execSync } from "child_process";
import { createHash } from "crypto";

let cachedGitRepoId: string | null | undefined = undefined;

function hashProjectName(fullPath: string): string {
  const parts = fullPath.split("/");
  if (parts.length !== 2) {
    return createHash("sha256").update(fullPath).digest("hex").slice(0, 8);
  }

  const [org, project] = parts;
  const hashedProject = createHash("sha256")
    .update(project)
    .digest("hex")
    .slice(0, 8);

  return `${org}/${hashedProject}`;
}

export function getRepositoryId(): string | null {
  const ciRepoId = getCIRepositoryId();
  if (ciRepoId) return ciRepoId;

  const gitRepoId = getGitRepositoryId();
  if (gitRepoId) return gitRepoId;

  return null;
}

function getCIRepositoryId(): string | null {
  if (process.env.GITHUB_REPOSITORY) {
    const hashed = hashProjectName(process.env.GITHUB_REPOSITORY);
    return `github:${hashed}`;
  }

  if (process.env.CI_PROJECT_PATH) {
    const hashed = hashProjectName(process.env.CI_PROJECT_PATH);
    return `gitlab:${hashed}`;
  }

  if (process.env.BITBUCKET_REPO_FULL_NAME) {
    const hashed = hashProjectName(process.env.BITBUCKET_REPO_FULL_NAME);
    return `bitbucket:${hashed}`;
  }

  return null;
}

function getGitRepositoryId(): string | null {
  if (cachedGitRepoId !== undefined) {
    return cachedGitRepoId;
  }

  try {
    const remoteUrl = execSync("git config --get remote.origin.url", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    if (!remoteUrl) {
      cachedGitRepoId = null;
      return null;
    }

    cachedGitRepoId = parseGitUrl(remoteUrl);
    return cachedGitRepoId;
  } catch {
    cachedGitRepoId = null;
    return null;
  }
}

function parseGitUrl(url: string): string | null {
  const cleanUrl = url.replace(/\.git$/, "");

  let platform: string | null = null;
  if (cleanUrl.includes("github.com")) {
    platform = "github";
  } else if (cleanUrl.includes("gitlab.com")) {
    platform = "gitlab";
  } else if (cleanUrl.includes("bitbucket.org")) {
    platform = "bitbucket";
  }

  const sshMatch = cleanUrl.match(/[@:]([^:/@]+\/[^:/@]+)$/);
  const httpsMatch = cleanUrl.match(/\/([^/]+\/[^/]+)$/);

  const repoPath = sshMatch?.[1] || httpsMatch?.[1];

  if (!repoPath) return null;

  const hashedPath = hashProjectName(repoPath);

  if (platform) {
    return `${platform}:${hashedPath}`;
  }

  return `git:${hashedPath}`;
}
