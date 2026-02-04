import fs from "fs";
import path from "path";
import { open, type RootDatabase } from "lmdb";
import type { MetadataSchema, PathConfig, TranslationEntry } from "../types";
import { getLingoDir } from "../utils/path-helpers";
import { logger } from "../utils/logger";

const STATS_KEY = "__stats__";
const METADATA_DIR_DEV = "metadata-dev";
const METADATA_DIR_BUILD = "metadata-build";

/**
 * Opens a short-lived LMDB connection.
 *
 * Short-lived over singleton: bundlers (Webpack/Next.js) spawn isolated workers
 * that can't share a single connection. LMDB's MVCC handles concurrent access.
 */
function openDatabaseConnection(dbPath: string): RootDatabase {
  fs.mkdirSync(dbPath, { recursive: true });

  const isBuildMode = dbPath.endsWith(METADATA_DIR_BUILD);

  try {
    return open({
      path: dbPath,
      compression: true,
      // Build: skip fsync (data is ephemeral). Dev: sync for durability.
      noSync: isBuildMode,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to open LMDB at ${dbPath}: ${message}`);
  }
}

/**
 * Releases file handles to allow directory cleanup (avoids EBUSY/EPERM on Windows).
 */
async function closeDatabaseConnection(
  db: RootDatabase,
  dbPath: string,
): Promise<void> {
  try {
    await db.close();
  } catch (e) {
    logger.debug(`Error closing database at ${dbPath}: ${e}`);
  }
}

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

export async function loadMetadata(dbPath: string): Promise<MetadataSchema> {
  const db = openDatabaseConnection(dbPath);
  try {
    return readEntriesFromDb(db);
  } finally {
    await closeDatabaseConnection(db, dbPath);
  }
}

/**
 * Persists translation entries to LMDB.
 *
 * Uses transactionSync to batch all writes into a single commit.
 * Async transactions are slow in Vite (~80-100ms) due to setImmediate scheduling.
 */
export async function saveMetadata(
  dbPath: string,
  entries: TranslationEntry[],
): Promise<void> {
  const db = openDatabaseConnection(dbPath);

  try {
    db.transactionSync(() => {
      for (const entry of entries) {
        db.putSync(entry.hash, entry);
      }

      const totalKeys = db.getKeysCount();
      const entryCount =
        db.get(STATS_KEY) !== undefined ? totalKeys - 1 : totalKeys;
      db.putSync(STATS_KEY, {
        totalEntries: entryCount,
        lastUpdated: new Date().toISOString(),
      });
    });
  } finally {
    await closeDatabaseConnection(db, dbPath);
  }
}

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

export function getMetadataPath(config: PathConfig): string {
  const dirname =
    config.environment === "development"
      ? METADATA_DIR_DEV
      : METADATA_DIR_BUILD;
  return path.join(getLingoDir(config), dirname);
}
