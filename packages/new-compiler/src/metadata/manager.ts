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
 * Singleton class managing the LMDB database connection.
 * Only one database is ever open at a time (either dev or build).
 *
 * Note: In multi-process bundler environments (e.g., Webpack workers),
 * each process has its own singleton instance. LMDB handles concurrent
 * access across processes safely via OS-level locking (MVCC).
 */
class DatabaseConnection {
  private static instance: { db: RootDatabase; path: string } | null = null;

  static get(dbPath: string): RootDatabase {
    // Return existing db if same path
    if (this.instance?.path === dbPath) {
      return this.instance.db;
    }

    // Close previous db if different path
    if (this.instance) {
      try {
        this.instance.db.close();
      } catch (e) {
        logger.debug(`Error closing previous database: ${e}`);
      }
      this.instance = null;
    }

    fs.mkdirSync(dbPath, { recursive: true });

    // Build mode: disable fsync - metadata is deleted immediately after build,
    // so durability is not needed and this avoids delay on close.
    // Dev mode: keep sync enabled for consistency during long-running sessions.
    const isBuildMode = dbPath.endsWith(METADATA_DIR_BUILD);

    try {
      const db = open({
        path: dbPath,
        compression: true,
        noSync: isBuildMode,
      });

      this.instance = { db, path: dbPath };
      return db;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to open LMDB metadata database at ${dbPath}. ` +
          `This may be caused by disk space issues, permission problems, or database corruption. ` +
          `Try deleting the ${dbPath} directory and rebuilding. ` +
          `Original error: ${message}`,
      );
    }
  }

  static close(dbPath: string): void {
    if (this.instance?.path === dbPath) {
      try {
        this.instance.db.close();
      } catch (e) {
        logger.debug(`Error closing database at ${dbPath}: ${e}`);
      }
      this.instance = null;
    }
  }
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

export function loadMetadata(dbPath: string): MetadataSchema {
  return new MetadataManager(dbPath).loadMetadata();
}

/**
 * Synchronous sleep using Atomics.wait().
 * Blocks the thread without consuming CPU cycles.
 */
function sleepSync(ms: number): void {
  const sharedBuffer = new SharedArrayBuffer(4);
  const int32 = new Int32Array(sharedBuffer);
  Atomics.wait(int32, 0, 0, ms);
}

/**
 * Clean up the metadata database directory.
 * Synchronous to work with process exit handlers.
 * Uses Atomics.wait() for non-busy-wait blocking during retries on Windows.
 */
export function cleanupExistingMetadata(metadataDbPath: string): void {
  logger.debug(`Attempting to cleanup metadata database: ${metadataDbPath}`);

  // Close database if open to release locks
  DatabaseConnection.close(metadataDbPath);

  // Retry a few times - on Windows, memory-mapped files may be held briefly by other processes
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      fs.rmSync(metadataDbPath, { recursive: true, force: true });
      logger.info(`🧹 Cleaned up metadata database: ${metadataDbPath}`);
      return;
    } catch (error) {
      const code =
        error instanceof Error && "code" in error
          ? (error as NodeJS.ErrnoException).code
          : undefined;
      const message = error instanceof Error ? error.message : String(error);

      if (code === "ENOENT") {
        // Ignore if file doesn't exist
        logger.debug(
          `Metadata database already deleted or doesn't exist: ${metadataDbPath}`,
        );
        return;
      }

      const isRetryable = code === "EBUSY" || code === "EPERM";
      if (isRetryable && attempt < maxRetries) {
        logger.debug(`Cleanup attempt ${attempt} failed, retrying...`);
        sleepSync(200);
        continue;
      }

      logger.warn(`Failed to cleanup metadata database: ${message}`);
    }
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

export class MetadataManager {
  private db: RootDatabase;

  constructor(dbPath: string) {
    this.db = DatabaseConnection.get(dbPath);
  }

  /**
   * Load metadata from LMDB database.
   * Returns empty metadata if database is empty.
   */
  loadMetadata(): MetadataSchema {
    const entries: Record<string, TranslationEntry> = {};

    for (const { key, value } of this.db.getRange()) {
      const keyStr = key as string;
      if (keyStr !== STATS_KEY) {
        entries[keyStr] = value as TranslationEntry;
      }
    }

    const stats = this.db.get(STATS_KEY) as MetadataSchema["stats"] | undefined;
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

  /**
   * Save entries to database - LMDB handles concurrency via MVCC.
   *
   * @param entries - Translation entries to add/update
   * @returns The updated metadata schema
   */
  async saveMetadataWithEntries(
    entries: TranslationEntry[],
  ): Promise<MetadataSchema> {
    await this.db.transaction(() => {
      for (const entry of entries) {
        this.db.put(entry.hash, entry);
      }

      // Count entries explicitly (excluding stats key) for clarity
      let entryCount = 0;
      for (const { key } of this.db.getRange()) {
        if (key !== STATS_KEY) {
          entryCount++;
        }
      }

      const stats = {
        totalEntries: entryCount,
        lastUpdated: new Date().toISOString(),
      };
      this.db.put(STATS_KEY, stats);
    });

    return this.loadMetadata();
  }
}
