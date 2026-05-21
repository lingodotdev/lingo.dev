import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import YAML from "yaml";
import { MD5 } from "object-hash";

// The repo's vitest setup (tests/mock-storage.ts) globally mocks fs/promises
// to read/write from an in-memory store. These tests need real disk I/O so the
// JSON bucket loader can `fs.readFile` source files written by the test.
vi.unmock("fs/promises");

let lockfileCmd: any;

async function freshCmd() {
  vi.resetModules();
  // Dynamic import so each test gets a fresh Commander instance.
  const mod = await import("./lockfile");
  lockfileCmd = mod.default;
}

async function runLockfile(args: string[] = []) {
  await lockfileCmd.parseAsync(["node", "lockfile", ...args]);
}

function writeJson(filePath: string, content: any) {
  const dir = path.dirname(filePath);
  if (dir !== "." && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}

function readLock(): { version: number; checksums: Record<string, Record<string, string>> } {
  const raw = fs.readFileSync("i18n.lock", "utf-8");
  return YAML.parse(raw);
}

function writeLock(data: any) {
  fs.writeFileSync("i18n.lock", YAML.stringify(data));
}

function makeConfig(buckets: any) {
  return {
    $schema: "https://lingo.dev/schema/i18n.json",
    version: 0,
    locale: { source: "en", targets: ["es"] },
    buckets,
  };
}

describe("cmd lockfile (merge-default)", () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "lingo-lockfile-cmd-"));
    process.chdir(tmpDir);
    await freshCmd();
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("fills in a missing section while leaving an existing section byte-identical", async () => {
    writeJson("i18n.json", makeConfig({
      json: {
        include: ["src/a/[locale].json", "src/b/[locale].json"],
      },
    }));
    writeJson("src/a/en.json", { greeting: "hello-a" });
    writeJson("src/a/es.json", { greeting: "hola-a" });
    writeJson("src/b/en.json", { greeting: "hello-b" });
    writeJson("src/b/es.json", { greeting: "hola-b" });

    // Pre-populate lock with only section A.
    const sectionAKey = MD5("src/a/[locale].json");
    const sectionAExisting = { greeting: "preexisting-hash-A" };
    writeLock({
      version: 1,
      checksums: { [sectionAKey]: sectionAExisting },
    });

    await runLockfile();

    const lock = readLock();
    const sectionBKey = MD5("src/b/[locale].json");

    expect(lock.checksums[sectionAKey]).toEqual(sectionAExisting);
    expect(lock.checksums[sectionBKey]).toBeDefined();
    expect(lock.checksums[sectionBKey].greeting).toBe(MD5("hello-b"));
  });

  it("populates sections when the lock exists but checksums map is empty", async () => {
    writeJson("i18n.json", makeConfig({
      json: { include: ["src/[locale].json"] },
    }));
    writeJson("src/en.json", { greeting: "hello" });
    writeJson("src/es.json", { greeting: "hola" });

    writeLock({ version: 1, checksums: {} });

    await runLockfile();

    const lock = readLock();
    const key = MD5("src/[locale].json");
    expect(lock.checksums[key]).toBeDefined();
    expect(lock.checksums[key].greeting).toBe(MD5("hello"));
  });

  it("does NOT overwrite a section whose source value changed (preserves the divergence signal for --frozen)", async () => {
    writeJson("i18n.json", makeConfig({
      json: { include: ["src/[locale].json"] },
    }));
    writeJson("src/en.json", { greeting: "hello-new" });
    writeJson("src/es.json", { greeting: "hola-stale" });

    const key = MD5("src/[locale].json");
    const stale = { greeting: MD5("hello-old") };
    writeLock({ version: 1, checksums: { [key]: stale } });

    await runLockfile();

    const lock = readLock();
    // Section is byte-equivalent (parsed) to before: stale checksum preserved.
    expect(lock.checksums[key]).toEqual(stale);
    // Sanity: stale entry is genuinely diverged from current source, so a
    // subsequent --frozen run would still throw "Source file has been updated"
    // (validated by frozen.ts:127-131 via checksum mismatch).
    expect(lock.checksums[key].greeting).not.toBe(MD5("hello-new"));
  });

  it("--force rebuilds existing sections (regression guard)", async () => {
    writeJson("i18n.json", makeConfig({
      json: { include: ["src/[locale].json"] },
    }));
    writeJson("src/en.json", { greeting: "hello-new" });
    writeJson("src/es.json", { greeting: "hola" });

    const key = MD5("src/[locale].json");
    const stale = { greeting: MD5("hello-old") };
    writeLock({ version: 1, checksums: { [key]: stale } });

    await runLockfile(["--force"]);

    const lock = readLock();
    expect(lock.checksums[key].greeting).toBe(MD5("hello-new"));
  });

  it("adds only new pathPatterns under a ** recursive glob across two runs", async () => {
    writeJson("i18n.json", makeConfig({
      json: { include: ["src/[locale]/**/*.json"] },
    }));

    writeJson("src/en/feature-a.json", { greeting: "hello-a" });
    writeJson("src/es/feature-a.json", { greeting: "hola-a" });
    writeJson("src/en/feature-b.json", { greeting: "hello-b" });
    writeJson("src/es/feature-b.json", { greeting: "hola-b" });

    await runLockfile();

    const lockAfterFirst = readLock();
    const featureAPattern = "src/[locale]/feature-a.json";
    const featureBPattern = "src/[locale]/feature-b.json";
    const featureCPattern = "src/[locale]/feature-c.json";
    const aKey = MD5(featureAPattern);
    const bKey = MD5(featureBPattern);
    const cKey = MD5(featureCPattern);

    expect(lockAfterFirst.checksums[aKey]).toBeDefined();
    expect(lockAfterFirst.checksums[bKey]).toBeDefined();
    expect(lockAfterFirst.checksums[cKey]).toBeUndefined();

    const sectionABefore = lockAfterFirst.checksums[aKey];
    const sectionBBefore = lockAfterFirst.checksums[bKey];

    // Add a third file.
    writeJson("src/en/feature-c.json", { greeting: "hello-c" });
    writeJson("src/es/feature-c.json", { greeting: "hola-c" });

    await freshCmd();
    await runLockfile();

    const lockAfterSecond = readLock();
    expect(lockAfterSecond.checksums[aKey]).toEqual(sectionABefore);
    expect(lockAfterSecond.checksums[bKey]).toEqual(sectionBBefore);
    expect(lockAfterSecond.checksums[cKey]).toBeDefined();
    expect(lockAfterSecond.checksums[cKey].greeting).toBe(MD5("hello-c"));
  });

  it("exits gracefully when i18n.json is missing (does not crash)", async () => {
    // Intentionally no i18n.json. A stale lock alone simulates the regression
    // path from the reviewer: lock exists, config absent. Old code printed a
    // warning; the merge-default code must not crash via getBuckets(null).
    writeLock({ version: 1, checksums: {} });

    await expect(runLockfile()).resolves.not.toThrow();

    // Lock file is untouched.
    const lock = readLock();
    expect(lock.checksums).toEqual({});
  });
});
