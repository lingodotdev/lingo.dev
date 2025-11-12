import os from "os";
import path from "path";
import { describe, it, expect, vi, afterEach } from "vitest";

import { getSettingsDisplayPath } from "./settings";

describe("getSettingsDisplayPath", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a tilde path on non-Windows platforms", () => {
    vi.spyOn(process, "platform", "get").mockReturnValue("linux");

    expect(getSettingsDisplayPath()).toBe("~/.lingodotdevrc");
  });

  it("returns the resolved settings path on Windows", () => {
    vi.spyOn(process, "platform", "get").mockReturnValue("win32");
    vi.spyOn(os, "homedir").mockReturnValue("C:\\Users\\alice");

    const expectedPath = path.join("C:\\Users\\alice", ".lingodotdevrc");

    expect(getSettingsDisplayPath()).toBe(expectedPath);
  });
});

