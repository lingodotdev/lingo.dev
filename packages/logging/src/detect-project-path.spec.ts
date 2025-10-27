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
    const detectedPath = detectProjectPath(["i18n.json"]);

    expect(detectedPath).toBe(projectDir);
  });

  it("should detect project path when next.config.js exists", () => {
    const projectDir = join(testRoot, "project-with-next");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "next.config.js"), "module.exports = {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath(["next.config.js"]);

    expect(detectedPath).toBe(projectDir);
  });

  it("should detect project path when vite.config.ts exists", () => {
    const projectDir = join(testRoot, "project-with-vite");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "vite.config.ts"), "export default {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath(["vite.config.ts"]);

    expect(detectedPath).toBe(projectDir);
  });

  it("should prioritize first config file in array", () => {
    const projectDir = join(testRoot, "project-with-multiple");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "i18n.json"), "{}");
    writeFileSync(join(projectDir, "next.config.js"), "module.exports = {}");
    writeFileSync(join(projectDir, "vite.config.ts"), "export default {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath([
      "i18n.json",
      "next.config.js",
      "vite.config.ts",
    ]);

    expect(detectedPath).toBe(projectDir);
  });

  it("should traverse upward through parent directories", () => {
    const projectRoot = join(testRoot, "project-root");
    const subDir = join(projectRoot, "src", "components");
    mkdirSync(subDir, { recursive: true });
    writeFileSync(join(projectRoot, "i18n.json"), "{}");

    process.chdir(subDir);
    const detectedPath = detectProjectPath(["i18n.json"]);

    expect(detectedPath).toBe(projectRoot);
  });

  it("should return null when no config files found", () => {
    const emptyDir = join(testRoot, "empty-project");
    mkdirSync(emptyDir, { recursive: true });

    process.chdir(emptyDir);
    const detectedPath = detectProjectPath(["i18n.json"]);

    expect(detectedPath).toBeNull();
  });

  it("should detect next.config.mjs", () => {
    const projectDir = join(testRoot, "project-with-next-mjs");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "next.config.mjs"), "export default {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath(["next.config.mjs"]);

    expect(detectedPath).toBe(projectDir);
  });

  it("should detect vite.config.js", () => {
    const projectDir = join(testRoot, "project-with-vite-js");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "vite.config.js"), "export default {}");

    process.chdir(projectDir);
    const detectedPath = detectProjectPath(["vite.config.js"]);

    expect(detectedPath).toBe(projectDir);
  });

  it("should find specific config file in monorepo with multiple projects", () => {
    // Simulate monorepo: /repo/i18n.json (CLI) and /repo/apps/web/next.config.ts (Web)
    const repoRoot = join(testRoot, "monorepo");
    const webAppDir = join(repoRoot, "apps", "web", "src");

    mkdirSync(webAppDir, { recursive: true });
    writeFileSync(join(repoRoot, "i18n.json"), "{}");
    writeFileSync(
      join(repoRoot, "apps", "web", "next.config.ts"),
      "export default {}",
    );

    // From web app subdirectory, search only for i18n.json
    process.chdir(webAppDir);
    const detectedPath = detectProjectPath(["i18n.json"]);

    // Should find repo root, not the web app directory
    expect(detectedPath).toBe(repoRoot);
  });

  it("should respect config file filter parameter", () => {
    const projectDir = join(testRoot, "project-with-both");
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, "i18n.json"), "{}");
    writeFileSync(join(projectDir, "next.config.js"), "module.exports = {}");

    process.chdir(projectDir);

    // Search only for next.config files
    const detectedPath = detectProjectPath([
      "next.config.js",
      "next.config.mjs",
      "next.config.ts",
    ]);

    expect(detectedPath).toBe(projectDir);
  });
});
