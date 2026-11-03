import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { loadDotenv } from "./env";

describe("loadDotenv", () => {
  const originalEnv = process.env;
  const originalCwd = process.cwd();
  let tmpDir: string;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.EDITOR;
    delete process.env.VISUAL;
    delete process.env.LINGO_TEST_FROM_DOTENV;
    delete process.env.LINGO_TEST_EXISTING;

    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "lingo-env-"));
    fs.writeFileSync(
      path.join(tmpDir, ".env"),
      [
        "LINGO_TEST_FROM_DOTENV=from-file",
        "LINGO_TEST_EXISTING=from-file",
        "EDITOR=project-editor",
        "VISUAL=project-visual",
      ].join("\n"),
    );
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    process.env = originalEnv;
  });

  it("loads values from .env", () => {
    loadDotenv();
    expect(process.env.LINGO_TEST_FROM_DOTENV).toBe("from-file");
  });

  it("does not override existing values", () => {
    process.env.LINGO_TEST_EXISTING = "from-process";
    loadDotenv();
    expect(process.env.LINGO_TEST_EXISTING).toBe("from-process");
  });

  it("does not take editor settings from .env", () => {
    loadDotenv();
    expect(process.env.EDITOR).toBeUndefined();
    expect(process.env.VISUAL).toBeUndefined();
  });

  it("keeps editor settings from the process environment", () => {
    process.env.EDITOR = "nano";
    loadDotenv();
    expect(process.env.EDITOR).toBe("nano");
  });
});
