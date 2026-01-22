import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const STATS_FILE = join(process.cwd(), "stats.json");

interface Stats {
  count: number;
}

function getStats(): Stats {
  if (!existsSync(STATS_FILE)) {
    return { count: 0 };
  }
  try {
    return JSON.parse(readFileSync(STATS_FILE, "utf-8"));
  } catch {
    return { count: 0 };
  }
}

function saveStats(stats: Stats) {
  writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

export const incrementCounter = () => {
  const stats = getStats();
  stats.count += 1;
  saveStats(stats);
  return stats.count;
};

export const getCounter = () => {
  return getStats().count;
};
