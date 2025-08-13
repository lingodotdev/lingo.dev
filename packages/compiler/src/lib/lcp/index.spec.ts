import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import dedent from "dedent";

vi.mock("fs", async (importOriginal) => {
  const mod = await importOriginal<typeof import("fs")>();
  return {
    ...mod,
    existsSync: vi.fn(() => false),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(() => "{}"),
    statSync: vi.fn(() => ({ mtimeMs: Date.now() - 10_000 }) as any),
    rmdirSync: vi.fn(),
    utimesSync: vi.fn(),
  } as any;
});

// import after mocks
import { LCP } from "./index";

describe("LCP", () => {
  beforeEach(() => {
    (fs.existsSync as any).mockReset().mockReturnValue(false);
    (fs.mkdirSync as any).mockReset();
    (fs.writeFileSync as any).mockReset();
    (fs.readFileSync as any).mockReset().mockReturnValue("{}");
    (fs.statSync as any)
      .mockReset()
      .mockReturnValue({ mtimeMs: Date.now() - 10_000 });
    (fs.rmdirSync as any).mockReset();
    (fs.utimesSync as any).mockReset();
  });

  describe("ensureFile", () => {
    let originalExit: any;
    beforeEach(() => {
      // stub exit to avoid existing the actual test process
      originalExit = process.exit;
      // @ts-expect-error override for test
      process.exit = vi.fn();
    });
    afterEach(() => {
      // restore mocked exit behavior
      (process.exit as any) = originalExit;
    });

    it("creates meta.json and exists the process", () => {
      (fs.existsSync as any).mockReturnValueOnce(false);
      LCP.ensureFile({ sourceRoot: "src", lingoDir: "lingo" });
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("does not create meta.json if it already exists", () => {
      (fs.existsSync as any).mockReturnValue(true);
      LCP.ensureFile({ sourceRoot: "src", lingoDir: "lingo" });
      expect(fs.mkdirSync).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  describe("getInstance", () => {
    it("returns parsed schema when file exists", () => {
      (fs.existsSync as any).mockReturnValue(true);
      (fs.readFileSync as any).mockReturnValue('{"version":42, "files": {}}');
      const lcp = LCP.getInstance({ sourceRoot: "src", lingoDir: "lingo" });
      expect(lcp.data.version).toBe(42);
    });

    it("returns new instance when file does not exist", () => {
      (fs.existsSync as any).mockReturnValue(false);
      const lcp = LCP.getInstance({ sourceRoot: "src", lingoDir: "lingo" });
      expect(lcp.data.version).toBe(0.1);
    });
  });

  describe("ready", () => {
    it("resolves immediately when meta.json is older than threshold", async () => {
      (fs.existsSync as any).mockReturnValue(true);
      (fs.statSync as any).mockReturnValue({ mtimeMs: Date.now() - 10_000 });
      await LCP.ready({ sourceRoot: "src", lingoDir: "lingo", isDev: false });
      expect(fs.statSync).toHaveBeenCalled();
    });
  });

  describe("setScope* chain", () => {
    it("modifies internal data and save writes only on change", () => {
      const lcp = LCP.getInstance({ sourceRoot: "src", lingoDir: "lingo" });
      (fs.existsSync as any).mockReturnValue(false);
      lcp
        .resetScope("file.tsx", "scope-1")
        .setScopeType("file.tsx", "scope-1", "element")
        .setScopeContext("file.tsx", "scope-1", "ctx")
        .setScopeHash("file.tsx", "scope-1", "hash")
        .setScopeSkip("file.tsx", "scope-1", false)
        .setScopeOverrides("file.tsx", "scope-1", { es: "x" })
        .setScopeContent("file.tsx", "scope-1", "Hello");

      // first save writes
      lcp.save();
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

      // mimic that file exists and content matches -> no write
      (fs.existsSync as any).mockReturnValue(true);
      (fs.readFileSync as any).mockReturnValueOnce(
        (fs.writeFileSync as any).mock.calls[0][1],
      );
      lcp.save();
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    });
  });
});
