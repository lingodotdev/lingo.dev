import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export interface CacheEntry {
  command: string;
  targetLocale: string;
  originalHash: string;
  translatedContent: string;
  timestamp: number;
}

const CACHE_DIR = join(homedir(), ".lingo-man", "cache");

/**
 * Ensures the cache directory exists.
 */
function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Generates a unique cache key based on command, locale, and content.
 */
function generateCacheKey(
  command: string,
  targetLocale: string,
  content: string
): string {
  const contentHash = createHash("sha256").update(content).digest("hex").slice(0, 16);
  const keyData = `${command}:${targetLocale}:${contentHash}`;
  return createHash("sha256").update(keyData).digest("hex");
}

/**
 * Gets the file path for a cache key.
 */
function getCacheFilePath(cacheKey: string): string {
  return join(CACHE_DIR, `${cacheKey}.json`);
}

/**
 * Retrieves a cached translation if it exists.
 */
export function getFromCache(
  command: string,
  targetLocale: string,
  content: string
): string | null {
  ensureCacheDir();

  const cacheKey = generateCacheKey(command, targetLocale, content);
  const filePath = getCacheFilePath(cacheKey);

  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const data = readFileSync(filePath, "utf-8");
    const entry: CacheEntry = JSON.parse(data);

    // Verify the content hash matches
    const contentHash = createHash("sha256").update(content).digest("hex").slice(0, 16);
    if (entry.originalHash === contentHash) {
      return entry.translatedContent;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Saves a translation to the cache.
 */
export function saveToCache(
  command: string,
  targetLocale: string,
  originalContent: string,
  translatedContent: string
): void {
  ensureCacheDir();

  const contentHash = createHash("sha256")
    .update(originalContent)
    .digest("hex")
    .slice(0, 16);
  const cacheKey = generateCacheKey(command, targetLocale, originalContent);
  const filePath = getCacheFilePath(cacheKey);

  const entry: CacheEntry = {
    command,
    targetLocale,
    originalHash: contentHash,
    translatedContent,
    timestamp: Date.now(),
  };

  writeFileSync(filePath, JSON.stringify(entry, null, 2), "utf-8");
}

/**
 * Clears all cached translations.
 */
export function clearCache(): void {
  const { rmSync } = require("fs");
  if (existsSync(CACHE_DIR)) {
    rmSync(CACHE_DIR, { recursive: true, force: true });
  }
}
