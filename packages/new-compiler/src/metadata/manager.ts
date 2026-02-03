import fs from "fs";
import path from "path";
import { open, type RootDatabase } from "lmdb";
import type { MetadataSchema, PathConfig, TranslationEntry } from "../types";
import { getLingoDir } from "../utils/path-helpers";
import { logger } from "../utils/logger";

// Special key for storing stats
const STATS_KEY = "__stats__";

// Metadata directory names for each environment
const METADATA_DIR_DEV = "metadata-dev";
const METADATA_DIR_BUILD = "metadata-build";

/**
 * Opens an LMDB database connection at the given path.
 */
function openDatabase(dbPath: string): RootDatabase {
  fs.mkdirSync(dbPath, { recursive: true });

  // Build mode: disable fsync - metadata is deleted immediately after build, so durability is not needed.
  // Dev mode: keep sync enabled for consistency during long-running sessions.
  const isBuildMode = dbPath.endsWith(METADATA_DIR_BUILD);

  try {
    return open({
      path: dbPath,
      compression: true,
      noSync: isBuildMode,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to open LMDB metadata database at ${dbPath}. Error: ${message}`,
    );
  }
}

/**
 * Safely close database connection.
 */
async function closeDatabase(db: RootDatabase, dbPath: string): Promise<void> {
  try {
    await db.close();
  } catch (e) {
    logger.debug(`Error closing database at ${dbPath}: ${e}`);
  }
}

/**
 * Read all entries from an open database.
 * Internal helper - does not manage connection lifecycle.
 */
function readEntriesFromDb(db: RootDatabase): MetadataSchema {
  const entries: Record<string, TranslationEntry> = {};

  for (const { key, value } of db.getRange()) {
    const keyStr = key as string;
    if (keyStr !== STATS_KEY) {
      entries[keyStr] = value as TranslationEntry;
    }
  }

  const stats = db.get(STATS_KEY) as MetadataSchema["stats"] | undefined;
  if (Object.keys(entries).length === 0 && !stats) {
    return createEmptyMetadata();
  }
  return {
    entries,
    stats: stats || {
      totalEntries: Object.keys(entries).length,
      lastUpdated: new Date().toISOString(),
    },
  };
}

export function createEmptyMetadata(): MetadataSchema {
  return {
    entries: {},
    stats: {
      totalEntries: 0,
      lastUpdated: new Date().toISOString(),
    },
  };
}

/**
 * Load metadata from LMDB database.
 */
export async function loadMetadata(dbPath: string): Promise<MetadataSchema> {
  const db = openDatabase(dbPath);
  try {
    return readEntriesFromDb(db);
  } finally {
    await closeDatabase(db, dbPath);
  }
}

/**
 * Save translation entries to the metadata database.
 *
 * LMDB handles concurrency via MVCC, so multiple processes can write safely.
 *
 * @param dbPath - Path to the LMDB database directory
 * @param entries - Translation entries to add/update
 * @returns The updated metadata schema
 */
export async function saveMetadata(
  dbPath: string,
  entries: TranslationEntry[],
): Promise<MetadataSchema> {
  const db = openDatabase(dbPath);
  try {
    await db.transaction(() => {
      for (const entry of entries) {
        db.put(entry.hash, entry);
      }

      // Count entries explicitly (excluding stats key) for clarity
      let entryCount = 0;
      for (const { key } of db.getRange()) {
        if (key !== STATS_KEY) {
          entryCount++;
        }
      }

      const stats = {
        totalEntries: entryCount,
        lastUpdated: new Date().toISOString(),
      };
      db.put(STATS_KEY, stats);
    });

    return readEntriesFromDb(db);
  } finally {
    await closeDatabase(db, dbPath);
  }
}

/**
 * Clean up the metadata database directory.
 */
export function cleanupExistingMetadata(metadataDbPath: string): void {
  logger.debug(`Cleaning up metadata database: ${metadataDbPath}`);

  try {
    fs.rmSync(metadataDbPath, { recursive: true, force: true });
    logger.info(`🧹 Cleaned up metadata database: ${metadataDbPath}`);
  } catch (error) {
    const code =
      error instanceof Error && "code" in error
        ? (error as NodeJS.ErrnoException).code
        : undefined;
    const message = error instanceof Error ? error.message : String(error);

    if (code === "ENOENT") {
      logger.debug(
        `Metadata database already deleted or doesn't exist: ${metadataDbPath}`,
      );
      return;
    }

    logger.warn(`Failed to cleanup metadata database: ${message}`);
  }
}

/**
 * Get the absolute path to the metadata database directory
 *
 * @param config - Config with sourceRoot, lingoDir, and environment
 * @returns Absolute path to metadata database directory
 */
export function getMetadataPath(config: PathConfig): string {
  const dirname =
    config.environment === "development"
      ? METADATA_DIR_DEV
      : METADATA_DIR_BUILD;
  return path.join(getLingoDir(config), dirname);
}
