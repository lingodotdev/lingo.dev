import { execSync } from "child_process";

let cachedGitRepoId: string | null | undefined = undefined;

export function clearRepositoryIdCache(): void {
  cachedGitRepoId = undefined;
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
    return `github:${process.env.GITHUB_REPOSITORY}`;
  }

  if (process.env.CI_PROJECT_PATH) {
    return `gitlab:${process.env.CI_PROJECT_PATH}`;
  }

  if (process.env.BITBUCKET_REPO_FULL_NAME) {
    return `bitbucket:${process.env.BITBUCKET_REPO_FULL_NAME}`;
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

  if (platform) {
    return `${platform}:${repoPath}`;
  }

  return `git:${repoPath}`;
}
