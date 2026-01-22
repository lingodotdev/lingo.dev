export interface GitHubRepoResponse {
  stargazers_count: number;
  watchers_count: number;
}

export async function fetchGitHubStats() {
  const res = await fetch(
    "https://api.github.com/repos/lingodotdev/lingo.dev"
  );
  if (!res.ok) throw new Error("Failed to fetch GitHub stats");

  return res.json() as Promise<GitHubRepoResponse>;
}
