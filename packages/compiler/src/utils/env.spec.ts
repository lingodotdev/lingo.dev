import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isRunningInCIOrDocker } from "./env";

vi.mock("fs", () => {
  const mockFs = { existsSync: vi.fn(() => false) } as any;
  return { ...mockFs, default: mockFs };
});

import fsAny from "fs";

describe("isRunningInCIOrDocker", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    (fsAny as any).existsSync.mockReset().mockReturnValue(false);
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns true when CI env var is set", () => {
    process.env.CI = "true";
    expect(isRunningInCIOrDocker()).toBe(true);
  });

  it("returns true when /.dockerenv exists", () => {
    (fsAny as any).existsSync.mockReturnValueOnce(true);
    delete process.env.CI;
    expect(isRunningInCIOrDocker()).toBe(true);
  });

  it("returns false otherwise", () => {
    delete process.env.CI;
    (fsAny as any).existsSync.mockReturnValueOnce(false);
    expect(isRunningInCIOrDocker()).toBe(false);
  });
});
