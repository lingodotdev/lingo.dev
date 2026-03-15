import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { CmdRunTask, CmdRunTaskResult } from "./_types";
import { applyRunExitCode } from "./exit-code";

/**
 * Tests that the CLI exits with non-zero code when localization tasks fail.
 * This prevents CI/CD pipelines from silently passing on partial errors.
 */
describe("run command - exit code on errors", () => {
  let originalExitCode: number | undefined;

  beforeEach(() => {
    originalExitCode = process.exitCode;
    process.exitCode = undefined;
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
  });

  function createTask(overrides?: Partial<CmdRunTask>): CmdRunTask {
    return {
      sourceLocale: "en",
      targetLocale: "es",
      bucketType: "json",
      bucketPathPattern: "[locale]/messages.json",
      injectLocale: [],
      lockedKeys: [],
      lockedPatterns: [],
      ignoredKeys: [],
      preservedKeys: [],
      localizableKeys: [],
      onlyKeys: [],
      ...overrides,
    };
  }

  it("should set exitCode=1 when any task has error status", () => {
    const results = new Map<CmdRunTask, CmdRunTaskResult>();
    results.set(createTask({ targetLocale: "es" }), { status: "success" });
    results.set(createTask({ targetLocale: "fr" }), {
      status: "error",
      error: new Error("API timeout"),
    });
    results.set(createTask({ targetLocale: "de" }), { status: "success" });

    const hasErrors = applyRunExitCode(results);

    expect(hasErrors).toBe(true);
    expect(process.exitCode).toBe(1);
  });

  it("should NOT set exitCode when all tasks succeed", () => {
    const results = new Map<CmdRunTask, CmdRunTaskResult>();
    results.set(createTask({ targetLocale: "es" }), { status: "success" });
    results.set(createTask({ targetLocale: "fr" }), { status: "success" });

    const hasErrors = applyRunExitCode(results);

    expect(hasErrors).toBe(false);
    expect(process.exitCode).toBeUndefined();
  });

  it("should NOT set exitCode when tasks are skipped (no errors)", () => {
    const results = new Map<CmdRunTask, CmdRunTaskResult>();
    results.set(createTask({ targetLocale: "es" }), { status: "skipped" });
    results.set(createTask({ targetLocale: "fr" }), { status: "success" });

    const hasErrors = applyRunExitCode(results);

    expect(hasErrors).toBe(false);
    expect(process.exitCode).toBeUndefined();
  });

  it("should set exitCode=1 when all tasks fail", () => {
    const results = new Map<CmdRunTask, CmdRunTaskResult>();
    results.set(createTask({ targetLocale: "es" }), {
      status: "error",
      error: new Error("fail 1"),
    });
    results.set(createTask({ targetLocale: "fr" }), {
      status: "error",
      error: new Error("fail 2"),
    });

    const hasErrors = applyRunExitCode(results);

    expect(hasErrors).toBe(true);
    expect(process.exitCode).toBe(1);
  });

  it("should set exitCode=1 even with mix of success, skipped, and error", () => {
    const results = new Map<CmdRunTask, CmdRunTaskResult>();
    results.set(createTask({ targetLocale: "es" }), { status: "success" });
    results.set(createTask({ targetLocale: "fr" }), { status: "skipped" });
    results.set(createTask({ targetLocale: "de" }), {
      status: "error",
      error: new Error("one failure"),
    });

    const hasErrors = applyRunExitCode(results);

    expect(hasErrors).toBe(true);
    expect(process.exitCode).toBe(1);
  });

  it("should NOT set exitCode when results map is empty", () => {
    const results = new Map<CmdRunTask, CmdRunTaskResult>();

    const hasErrors = applyRunExitCode(results);

    expect(hasErrors).toBe(false);
    expect(process.exitCode).toBeUndefined();
  });
});
