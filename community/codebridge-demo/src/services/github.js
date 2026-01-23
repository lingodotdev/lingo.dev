import { Octokit } from "@octokit/rest";

// Initialize Octokit (GitHub API client)
// No auth token for now - will use public API (60 requests/hour)
// User can add their own token later for higher limits
const octokit = new Octokit();

/**
 * Parse GitHub URL into owner and repo
 * Supports formats:
 * - https://github.com/facebook/react
 * - github.com/facebook/react
 * - facebook/react
 */
export function parseGitHubUrl(url) {
  const trimmed = url.trim();

  // Remove https://, http://, www.
  let cleaned = trimmed.replace(/^https?:\/\/(www\.)?/, "");

  // Remove github.com/
  cleaned = cleaned.replace(/^github\.com\//, "");

  // Remove trailing slashes
  cleaned = cleaned.replace(/\/$/, "");

  // Split by /
  const parts = cleaned.split("/");

  if (parts.length < 2) {
    throw new Error("Invalid GitHub URL format. Expected: owner/repo");
  }

  return {
    owner: parts[0],
    repo: parts[1],
  };
}

/**
 * Fetch repository information
 */
export async function fetchRepository(owner, repo) {
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      defaultBranch: data.default_branch,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    if (error.status === 404) {
      throw new Error("Repository not found");
    }
    throw new Error(`Failed to fetch repository: ${error.message}`);
  }
}

/**
 * Fetch repository file tree
 */
export async function fetchFileTree(owner, repo, branch = "main") {
  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "1",
    });

    // Filter and organize files
    return data.tree
      .filter((item) => item.type === "blob") // Only files, not directories
      .map((item) => ({
        path: item.path,
        sha: item.sha,
        size: item.size,
        type: getFileType(item.path),
      }));
  } catch (error) {
    // Try 'master' if 'main' fails
    if (branch === "main") {
      return fetchFileTree(owner, repo, "master");
    }
    throw new Error(`Failed to fetch file tree: ${error.message}`);
  }
}

/**
 * Fetch file content
 */
export async function fetchFileContent(owner, repo, path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (data.type !== "file") {
      throw new Error("Not a file");
    }

    // Decode base64 content
    const content = atob(data.content);

    return {
      content,
      path: data.path,
      size: data.size,
      sha: data.sha,
      type: getFileType(data.path),
    };
  } catch (error) {
    throw new Error(`Failed to fetch file: ${error.message}`);
  }
}

/**
 * Get file type from path
 */
function getFileType(path) {
  const ext = path.split(".").pop().toLowerCase();

  const typeMap = {
    // JavaScript
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",

    // Python
    py: "python",
    pyw: "python",

    // Web
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "sass",

    // Markup
    md: "markdown",
    markdown: "markdown",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",

    // Other languages
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    swift: "swift",
    kt: "kotlin",

    // Shell
    sh: "bash",
    bash: "bash",
    zsh: "bash",

    // Config
    gitignore: "text",
    env: "text",
    txt: "text",
  };

  return typeMap[ext] || "text";
}
