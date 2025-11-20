import fs from "fs/promises";
import path from "path";
import type { LoaderConfig, MetadataSchema, TranslationEntry } from "../types";

/**
 * Default metadata schema
 */
function createEmptyMetadata(): MetadataSchema {
  return {
    version: "0.1",
    entries: {},
    stats: {
      totalEntries: 0,
      lastUpdated: new Date().toISOString(),
    },
  };
}

/**
 * Get the path to the metadata file
 */
export function getMetadataPath(config: LoaderConfig): string {
  return path.join(config.sourceRoot, config.lingoDir, "metadata.json");
}

/**
 * Load metadata from disk
 * Creates empty metadata if file doesn't exist
 */
export async function loadMetadata(
  config: LoaderConfig,
): Promise<MetadataSchema> {
  const metadataPath = getMetadataPath(config);

  try {
    const content = await fs.readFile(metadataPath, "utf-8");
    return JSON.parse(content) as MetadataSchema;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist, create new metadata
      return createEmptyMetadata();
    }
    throw error;
  }
}

/**
 * Save metadata to disk
 */
export async function saveMetadata(
  config: LoaderConfig,
  metadata: MetadataSchema,
): Promise<void> {
  const metadataPath = getMetadataPath(config);
  await fs.mkdir(path.dirname(metadataPath), { recursive: true });

  metadata.stats = {
    totalEntries: Object.keys(metadata.entries).length,
    lastUpdated: new Date().toISOString(),
  };

  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), "utf-8");
}

/**
 * Add or update a translation entry in metadata
 */
export function upsertEntry(
  metadata: MetadataSchema,
  entry: TranslationEntry,
): MetadataSchema {
  const existing = metadata.entries[entry.hash];

  if (existing) {
    metadata.entries[entry.hash] = {
      ...existing,
      lastSeenAt: new Date().toISOString(),
    };
  } else {
    metadata.entries[entry.hash] = entry;
  }

  return metadata;
}

/**
 * Batch add multiple entries
 */
export function upsertEntries(
  metadata: MetadataSchema,
  entries: TranslationEntry[],
): MetadataSchema {
  let result = metadata;
  for (const entry of entries) {
    result = upsertEntry(result, entry);
  }
  return result;
}

/**
 * Get an entry by hash
 */
export function getEntry(
  metadata: MetadataSchema,
  hash: string,
): TranslationEntry | undefined {
  return metadata.entries[hash];
}

/**
 * Check if an entry exists
 */
export function hasEntry(metadata: MetadataSchema, hash: string): boolean {
  return hash in metadata.entries;
}

/**
 * Remove stale entries (entries not seen in a while)
 * This is useful for cleanup but should be done carefully
 */
export function removeStaleEntries(
  metadata: MetadataSchema,
  maxAgeMs: number = 30 * 24 * 60 * 60 * 1000, // 30 days default
): MetadataSchema {
  const now = Date.now();
  const filtered: Record<string, TranslationEntry> = {};

  for (const [hash, entry] of Object.entries(metadata.entries)) {
    const lastSeen = entry.lastSeenAt || entry.addedAt;
    const age = now - new Date(lastSeen).getTime();

    if (age < maxAgeMs) {
      filtered[hash] = entry;
    }
  }

  return {
    ...metadata,
    entries: filtered,
  };
}
