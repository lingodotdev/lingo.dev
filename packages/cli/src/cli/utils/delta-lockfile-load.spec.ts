import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import YAML from "yaml";

import { createDeltaProcessor } from "./delta";

/**
 * `loadLock` takes a fast path through `YAML.parse` and only falls back to
 * `deduplicateLockfileYaml` when that fails. Deduplication is not just a
 * duplicate-key remover: `YAML.parseDocument` collects syntax errors instead of
 * throwing, so it also rescues shapes `YAML.parse` rejects outright. These
 * tests pin every such shape, because skipping the fallback would turn a
 * lockfile that loads today into a hard failure.
 */
describe("loadLock repair path", () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "lingo-loadlock-"));
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function writeLock(content: string) {
    fs.writeFileSync(path.join(tmpDir, "i18n.lock"), content);
  }

  function readLock() {
    return fs.readFileSync(path.join(tmpDir, "i18n.lock"), "utf-8");
  }

  it("loads a well-formed lockfile without rewriting it", async () => {
    const content = YAML.stringify({
      version: 1,
      checksums: { sectionA: { greeting: "abc123" } },
    });
    writeLock(content);

    const lock = await createDeltaProcessor("src/[locale].json").loadLock();

    expect(lock.checksums).toEqual({ sectionA: { greeting: "abc123" } });
    expect(readLock()).toBe(content);
  });

  it("returns the default lock when the file is absent", async () => {
    const lock = await createDeltaProcessor("src/[locale].json").loadLock();
    expect(lock).toEqual({ version: 1, checksums: {} });
  });

  it("repairs duplicate keys inside a section, keeping the last occurrence", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    writeLock("version: 1\nchecksums:\n  sectionA:\n    greeting: first\n    greeting: second\n");

    const lock = await createDeltaProcessor("src/[locale].json").loadLock();

    expect(lock.checksums).toEqual({ sectionA: { greeting: "second" } });
    // The repaired content is written back so later loads take the fast path.
    expect(readLock()).not.toContain("greeting: first");
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Removed 1 duplicate entry from i18n.lock"),
    );
    logSpy.mockRestore();
  });

  // These shapes all make `YAML.parse` throw while `YAML.parseDocument`
  // recovers. They load today and must keep loading.
  it.each([
    [
      "a duplicate section id",
      "version: 1\nchecksums:\n  sectionA:\n    a: aaa\n  sectionA:\n    b: bbb\n",
    ],
    [
      "a duplicate top-level checksums key",
      "version: 1\nchecksums:\n  sectionA:\n    a: aaa\nchecksums:\n  sectionB:\n    b: bbb\n",
    ],
    [
      "a duplicate top-level version key",
      "version: 1\nversion: 1\nchecksums:\n  sectionA:\n    a: aaa\n",
    ],
  ])("still loads a lockfile with %s", async (_label, content) => {
    writeLock(content);
    expect(() => YAML.parse(content)).toThrow();

    const lock = await createDeltaProcessor("src/[locale].json").loadLock();

    expect(lock.version).toBe(1);
    expect(Object.keys(lock.checksums).length).toBeGreaterThan(0);
  });

  it("keeps the fast path byte-identical to the repair path on clean input", async () => {
    const content = YAML.stringify({
      version: 1,
      checksums: {
        // numeric-like keys are real: demo/php and demo/txt use them
        sectionA: { "0": "aaa", "1": "bbb", "10": "ccc", named: "ddd" },
        sectionB: { "unicode.ключ": "eee", "emoji🎉": "fff" },
      },
    });
    writeLock(content);

    const processor = createDeltaProcessor("src/[locale].json");
    const lock = await processor.loadLock();
    await processor.saveLock(lock);

    expect(readLock()).toBe(content);
  });
});
