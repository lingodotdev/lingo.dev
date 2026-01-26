import { db } from '../db';
import { githubStats } from '../db/schema';
import { sql } from 'drizzle-orm';

export interface GitHubRepoResponse {
  stargazers_count: number;
  watchers_count: number;
}

/**
 * Fetches GitHub repository statistics from the GitHub API
 * 
 * @returns GitHub repository stats including stargazers and watchers count
 * @throws Error if the GitHub API request fails
 */
export async function fetchGitHubStats() {
  const res = await fetch(
    "https://api.github.com/repos/lingodotdev/lingo.dev"
  );
  if (!res.ok) throw new Error("Failed to fetch GitHub stats");

  return res.json() as Promise<GitHubRepoResponse>;
}

/**
 * Retrieves the most recent GitHub stats from the database cache
 * 
 * @returns Cached GitHub stats or null if no cache exists
 */
export async function getCachedGitHubStats() {
  const result = await db
    .select()
    .from(githubStats)
    .orderBy(sql`${githubStats.updatedAt} DESC`)
    .limit(1);

  return result[0] || null;
}

/**
 * Stores GitHub stats in the database cache
 * 
 * @param stats - GitHub repository statistics to cache
 */
export async function setCachedGitHubStats(stats: GitHubRepoResponse) {
  await db.insert(githubStats).values({
    stargazersCount: stats.stargazers_count,
    watchersCount: stats.watchers_count,
  });
}
