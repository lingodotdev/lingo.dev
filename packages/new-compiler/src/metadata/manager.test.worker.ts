/**
 * Worker script for multi-process LMDB tests.
 * This file is forked by manager.test.ts to simulate Next.js workers.
 *
 * Each forked process has its own singleton DatabaseConnection,
 * testing true cross-process LMDB behavior.
 */
import { MetadataManager, loadMetadata } from "./manager";
import type { TranslationEntry } from "../types";

interface WorkerMessage {
  type: "write" | "read" | "write-batch";
  dbPath: string;
  workerId?: string;
  entries?: Array<{ hash: string; sourceText?: string }>;
}

interface WorkerResponse {
  type: "success" | "error";
  workerId?: string;
  totalEntries?: number;
  entries?: Record<string, TranslationEntry>;
  error?: string;
}

function createEntry(hash: string, sourceText?: string): TranslationEntry {
  return {
    type: "content",
    hash,
    sourceText: sourceText ?? `Source text for ${hash}`,
    context: {
      filePath: "test.tsx",
      componentName: "TestComponent",
    },
    location: {
      filePath: "test.tsx",
      line: 1,
      column: 1,
    },
  } as TranslationEntry;
}

async function handleMessage(message: WorkerMessage): Promise<WorkerResponse> {
  try {
    const manager = new MetadataManager(message.dbPath);

    if (message.type === "write" || message.type === "write-batch") {
      const entries = (message.entries ?? []).map((e) =>
        createEntry(e.hash, e.sourceText),
      );
      await manager.saveMetadataWithEntries(entries);
      const metadata = manager.loadMetadata();
      return {
        type: "success",
        workerId: message.workerId,
        totalEntries: metadata.stats?.totalEntries ?? 0,
      };
    }

    if (message.type === "read") {
      const metadata = loadMetadata(message.dbPath);
      return {
        type: "success",
        workerId: message.workerId,
        totalEntries: metadata.stats?.totalEntries ?? 0,
        entries: metadata.entries,
      };
    }

    return { type: "error", error: "Unknown message type" };
  } catch (error) {
    return {
      type: "error",
      workerId: message.workerId,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Handle messages from parent process
process.on("message", async (message: WorkerMessage) => {
  const response = await handleMessage(message);
  process.send!(response);
});

// Signal ready
process.send!({ type: "ready" });
