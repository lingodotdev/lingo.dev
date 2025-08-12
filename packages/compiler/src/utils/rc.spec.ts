import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRc } from "./rc";

vi.mock("os", () => ({ default: { homedir: () => "/home/test" } }));
vi.mock("fs", () => {
  const mockFs = {
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn(() => ""),
  } as any;
  return { ...mockFs, default: mockFs };
});

import fsAny from "fs";

describe("getRc", () => {
  beforeEach(() => {
    (fsAny as any).existsSync.mockReset().mockReturnValue(false);
    (fsAny as any).readFileSync.mockReset().mockReturnValue("");
  });

  it("returns empty object when rc file missing", () => {
    const data = getRc();
    expect(data).toEqual({});
  });

  it("parses ini file when present", () => {
    (fsAny as any).existsSync.mockReturnValue(true);
    (fsAny as any).readFileSync.mockReturnValue("[auth]\napiKey=abc\n");
    const data = getRc();
    expect(data).toHaveProperty("auth.apiKey", "abc");
  });
});
