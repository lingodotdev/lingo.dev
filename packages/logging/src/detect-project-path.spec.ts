// Unit tests for project path detection

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  mkdirSync,
  writeFileSync,
  rmSync,
  existsSync,
  realpathSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectProjectPath } from "./detect-project-path.js";

describe("detectProjectPath", () => {
  let testRoot: string;
  let originalCwd: string;

  beforeEach(() => {
    // Save original working directory
    originalCwd = process.cwd();

    // Create and resolve test directory (handles macOS /private symlink)
    const tempPath = join(tmpdir(), "lingo-project-detect-test");
    if (existsSync(tempPath)) {
      rmSync(tempPath, { recursive: true, force: true });
    }
    mkdirSync(tempPath, { recursive: true });
    testRoot = realpathSync(tempPath);
  });

  afterEach(() => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up test directory
    if (existsSync(testRoot)) {
      rmSync(testRoot, { recursive: true, force: true });
    }
  });

  it("should detect project path when i18n.json exists", () => {
    const projectDir = join(testRoot, "project-with-i18n");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "i18n.json"), "{}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath();

    expect(detectedPath).toBe(projectDir);
  });

  it("should detect project path when next.config.js exists", () => {
    const projectDir = join(testRoot, "project-with-next");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "next.config.js"), "module.exports = {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath();

    expect(detectedPath).toBe(projectDir);
  });

  it("should detect project path when vite.config.ts exists", () => {
    const projectDir = join(testRoot, "project-with-vite");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "vite.config.ts"), "export default {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath();

    expect(detectedPath).toBe(projectDir);
  });

  it("should prioritize i18n.json over other config files", () => {
    const projectDir = join(testRoot, "project-with-multiple");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "i18n.json"), "{}");
    writeFileSync(join(projectDir, "next.config.js"), "module.exports = {}");
    writeFileSync(join(projectDir, "vite.config.ts"), "export default {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath();

    expect(detectedPath).toBe(projectDir);
  });

  it("should traverse upward through parent directories", () => {
    const projectRoot = join(testRoot, "project-root");
    const subDir = join(projectRoot, "src", "components");
    mkdirSync(subDir, { recursive: true });
    writeFileSync(join(projectRoot, "i18n.json"), "{}");

    process.chdir(subDir);
    const detectedPath = detectProjectPath();

    expect(detectedPath).toBe(projectRoot);
  });

  it("should return null when no config files found", () => {
    const emptyDir = join(testRoot, "empty-project");
    mkdirSync(emptyDir, { recursive: true });

    process.chdir(emptyDir);
    const detectedPath = detectProjectPath();

    expect(detectedPath).toBeNull();
  });

  it("should detect next.config.mjs", () => {
    const projectDir = join(testRoot, "project-with-next-mjs");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "next.config.mjs"), "export default {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath();

    expect(detectedPath).toBe(projectDir);
  });

  it("should detect vite.config.js", () => {
    const projectDir = join(testRoot, "project-with-vite-js");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "vite.config.js"), "export default {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath();

    expect(detectedPath).toBe(projectDir);
  });
});
