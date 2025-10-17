import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveRcConfig, getRcConfig } from "./index";
import fs from "fs";
import os from "os";
import path from "path";

vi.mock("fs");
vi.mock("os");

describe("config package", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(os.homedir).mockReturnValue("/mock/home");
  });

  it("saveRcConfig uses Ini.stringify", () => {
    const mockWrite = vi.mocked(fs.writeFileSync);

    saveRcConfig({
      auth: {
        apiKey: "test-key",
        apiUrl: "https://test.com",
        webUrl: "https://web.test.com",
      },
      llm: {
        openaiApiKey: "openai-key",
      },
    });

    expect(mockWrite).toHaveBeenCalledWith(
      path.join("/mock/home", ".lingodotdevrc"),
      expect.stringContaining("[auth]")
    );
    expect(mockWrite).toHaveBeenCalledWith(
      path.join("/mock/home", ".lingodotdevrc"),
      expect.stringContaining("[llm]")
    );
  });

  it("saveRcConfig handles undefined values gracefully", () => {
    const mockWrite = vi.mocked(fs.writeFileSync);

    saveRcConfig({
      auth: {
        apiKey: "test-key",
      },
      llm: {
        openaiApiKey: undefined,
        anthropicApiKey: "defined-key",
      },
    });

    expect(mockWrite).toHaveBeenCalled();
    const writtenContent = mockWrite.mock.calls[0][1] as string;

    // Ini.stringify should omit undefined values, not write "undefined"
    expect(writtenContent).not.toContain("undefined");
    expect(writtenContent).toContain("anthropicApiKey");
  });
});
