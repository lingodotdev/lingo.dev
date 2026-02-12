import fs from "fs";
import path from "path";
import { open, type RootDatabase } from "lmdb";
import type { MetadataSchema, PathConfig, TranslationEntry } from "../types";
import { getLingoDir } from "../utils/path-helpers";
import { logger } from "../utils/logger";

const METADATA_DIR_DEV = "metadata-dev";
const METADATA_DIR_BUILD = "metadata-build";

/**
 * Opens an LMDB connection for a single operation.
 *
 * lmdb-js deduplicates open() calls to the same path (ref-counted at C++ level),
 * so this is cheap. Each open() also clears stale readers from terminated workers.
 */
function openDatabaseConnection(dbPath: string, noSync: boolean): RootDatabase {
  try {
    fs.mkdirSync(dbPath, { recursive: true });
    return open({
      path: dbPath,
      compression: true,
      noSync,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to open LMDB at ${dbPath}: ${message}`);
  }
}

/**
 * Closes the LMDB connection. Also prevents EBUSY/EPERM on Windows during
 * directory cleanup.
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

/**
 * Opens a database connection, runs the callback, and ensures the connection
 * is closed afterwards.
 */
async function runWithDbConnection<T>(
  dbPath: string,
  noSync: boolean,
  fn: (db: RootDatabase) => T,
): Promise<T> {
  const db = openDatabaseConnection(dbPath, noSync);
  try {
    return fn(db);
  } finally {
    await closeDatabaseConnection(db, dbPath);
  }
}

function readEntriesFromDb(db: RootDatabase): MetadataSchema {
  const entries: MetadataSchema = {};

  for (const { key, value } of db.getRange()) {
    entries[key as string] = value as TranslationEntry;
  }

  return entries;
}

export async function loadMetadata(
  dbPath: string,
  noSync = false,
): Promise<MetadataSchema> {
  return runWithDbConnection(dbPath, noSync, readEntriesFromDb);
}

/**
 * Persists translation entries to LMDB in a single atomic transaction.
 */
export async function saveMetadata(
  dbPath: string,
  entries: TranslationEntry[],
  noSync = false,
): Promise<void> {
  return runWithDbConnection(dbPath, noSync, (db) => {
    db.transactionSync(() => {
      for (const entry of entries) {
        db.putSync(entry.hash, entry);
      }
    });
  });
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
