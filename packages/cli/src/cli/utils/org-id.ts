import { execSync } from "child_process";

let cachedGitOrgId: string | null | undefined = undefined;

function extractOrg(fullPath: string): string | null {
  const parts = fullPath.split("/");
  if (parts.length < 1) {
    return null;
  }
  return parts[0];
}

export function clearOrgIdCache(): void {
  cachedGitOrgId = undefined;
}

export function getOrgId(): string | null {
  const ciOrgId = getCIOrgId();
  if (ciOrgId) return ciOrgId;

  const gitOrgId = getGitOrgId();
  if (gitOrgId) return gitOrgId;

  return null;
}

function getCIOrgId(): string | null {
  if (process.env.GITHUB_REPOSITORY) {
    const org = extractOrg(process.env.GITHUB_REPOSITORY);
    if (org) return `github:${org}`;
  }

  if (process.env.CI_PROJECT_PATH) {
    const org = extractOrg(process.env.CI_PROJECT_PATH);
    if (org) return `gitlab:${org}`;
  }

  if (process.env.BITBUCKET_REPO_FULL_NAME) {
    const org = extractOrg(process.env.BITBUCKET_REPO_FULL_NAME);
    if (org) return `bitbucket:${org}`;
  }

  return null;
}

function getGitOrgId(): string | null {
  if (cachedGitOrgId !== undefined) {
    return cachedGitOrgId;
  }

  try {
    const remoteUrl = execSync("git config --get remote.origin.url", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    if (!remoteUrl) {
      cachedGitOrgId = null;
      return null;
    }

    cachedGitOrgId = parseGitUrl(remoteUrl);
    return cachedGitOrgId;
  } catch {
    cachedGitOrgId = null;
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

  const org = extractOrg(repoPath);
  if (!org) return null;

  if (platform) {
    return `${platform}:${org}`;
  }

  return `git:${org}`;
}
