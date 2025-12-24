import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import lockfile from "proper-lockfile";
import type { MetadataSchema, PathConfig, TranslationEntry } from "../types";
import { DEFAULT_TIMEOUTS, withTimeout } from "../utils/timeout";
import { getLingoDir } from "../utils/path-helpers";
import { logger } from "../utils/logger";

export function createEmptyMetadata(): MetadataSchema {
  return {
    entries: {},
    stats: {
      totalEntries: 0,
      lastUpdated: new Date().toISOString(),
    },
  };
}

export function loadMetadata(path: string) {
  return new MetadataManager(path).loadMetadata();
}

export function cleanupExistingMetadata(metadataFilePath: string) {
  // General cleanup. Delete metadata and stop the server if any was started.
  logger.debug(`Attempting to cleanup metadata file: ${metadataFilePath}`);

  try {
    fs.unlinkSync(metadataFilePath);
    logger.info(`🧹 Cleaned up build metadata file: ${metadataFilePath}`);
  } catch (error: any) {
    // Ignore if file doesn't exist
    if (error.code === "ENOENT") {
      logger.debug(
        `Metadata file already deleted or doesn't exist: ${metadataFilePath}`,
      );
    } else {
      logger.warn(`Failed to cleanup metadata file: ${error.message}`);
    }
  }
}

/**
 * Get the absolute path to the metadata file
 *
 * @param config - Config with sourceRoot, lingoDir, and environment
 * @returns Absolute path to metadata file
 */
export function getMetadataPath(config: PathConfig): string {
  const filename =
    // Similar to next keeping dev build separate, let's keep the build metadata clean of any dev mode additions
    config.environment === "development"
      ? "metadata-dev.json"
      : "metadata-build.json";
  return path.join(getLingoDir(config), filename);
}

export class MetadataManager {
  constructor(private readonly filePath: string) {}

  /**
   * Load metadata from disk
   * Creates empty metadata if file doesn't exist
   * Times out after 15 seconds to prevent indefinite hangs
   */
  async loadMetadata(): Promise<MetadataSchema> {
    try {
      const content = await withTimeout(
        fsPromises.readFile(this.filePath, "utf-8"),
        DEFAULT_TIMEOUTS.METADATA,
        "Load metadata",
      );
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
   * Times out after 15 seconds to prevent indefinite hangs
   */
  private async saveMetadata(metadata: MetadataSchema): Promise<void> {
    await withTimeout(
      fsPromises.mkdir(path.dirname(this.filePath), { recursive: true }),
      DEFAULT_TIMEOUTS.FILE_IO,
      "Create metadata directory",
    );

    metadata.stats = {
      totalEntries: Object.keys(metadata.entries).length,
      lastUpdated: new Date().toISOString(),
    };

    // Per LLM writing to a file is not an atomic operation while rename is, so nobody should get partial content.
    // Sounds reasonable.
    const dir = path.dirname(this.filePath);
    const base = path.basename(this.filePath);

    // Keep temp file in the same directory to maximize chance that rename is atomic
    const tmpPath = path.join(dir, `.${base}.tmp-${process.pid}-${Date.now()}`);

    const json = JSON.stringify(metadata, null, 2);

    await withTimeout(
      fsPromises.writeFile(tmpPath, json, "utf-8"),
      DEFAULT_TIMEOUTS.METADATA,
      "Save metadata (tmp write)",
    );

    try {
      // TODO (AleksandrSl 14/12/2025): LLM says that we may want to remove older file first for windows, but it seems lo work fine as is.
      await withTimeout(
        fsPromises.rename(tmpPath, this.filePath),
        DEFAULT_TIMEOUTS.METADATA,
        "Save metadata (atomic rename)",
      );
    } catch (error) {
      // On Windows, rename() can fail with EPERM if something briefly holds the file.
      // As a fallback, try writing directly to the destination (not atomic).
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "EPERM"
      ) {
        await withTimeout(
          fsPromises.writeFile(this.filePath, json, "utf-8"),
          DEFAULT_TIMEOUTS.METADATA,
          "Save metadata (EPERM fallback direct write)",
        );
        return;
      }
      throw error;
    } finally {
      // Best-effort cleanup if rename failed for some reason
      await fsPromises.unlink(tmpPath).catch(() => {});
    }
  }

  /**
   * Thread-safe save operation that atomically updates metadata with new entries
   * Uses file locking to prevent concurrent write corruption
   *
   * @param entries - Translation entries to add/update
   * @returns The updated metadata schema
   */
  async saveMetadataWithEntries(
    entries: TranslationEntry[],
  ): Promise<MetadataSchema> {
    const lockDir = path.dirname(this.filePath);

    await fsPromises.mkdir(lockDir, { recursive: true });

    try {
      await fsPromises.access(this.filePath);
    } catch {
      await fsPromises.writeFile(
        this.filePath,
        JSON.stringify(createEmptyMetadata(), null, 2),
        "utf-8",
      );
    }

    const release = await lockfile.lock(this.filePath, {
      retries: {
        retries: 10,
        minTimeout: 50,
        maxTimeout: 1000,
      },
      stale: 2000,
    });

    try {
      // Re-load metadata inside lock to get latest state
      const currentMetadata = await this.loadMetadata();
      for (const entry of entries) {
        currentMetadata.entries[entry.hash] = entry;
      }
      await this.saveMetadata(currentMetadata);
      return currentMetadata;
    } finally {
      await release();
    }
  }
}
