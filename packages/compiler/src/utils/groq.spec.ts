import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getGroqKey, getGroqKeyFromEnv, getGroqKeyFromRc } from "./groq";

// Mock the dotenv module
vi.mock("dotenv", () => ({
  config: vi.fn(),
}));

// Mock the rc module
vi.mock("./rc", () => ({
  getRc: vi.fn(() => ({})),
}));

describe("groq utilities", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv };
    delete process.env.GROQ_API_KEY;
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getGroqKeyFromEnv", () => {
    it("should return GROQ_API_KEY from process.env when available", () => {
      process.env.GROQ_API_KEY = "test-api-key-from-env";

      const result = getGroqKeyFromEnv();

      expect(result).toBe("test-api-key-from-env");
    });

    it("should return undefined when GROQ_API_KEY is not in process.env and no .env file", async () => {
      const dotenv = await import("dotenv");
      vi.mocked(dotenv.config).mockReturnValue({
        parsed: undefined,
      });

      const result = getGroqKeyFromEnv();

      expect(result).toBeUndefined();
    });

    it("should return GROQ_API_KEY from .env file when not in process.env", async () => {
      const dotenv = await import("dotenv");
      vi.mocked(dotenv.config).mockReturnValue({
        parsed: {
          GROQ_API_KEY: "test-api-key-from-dotenv",
        },
      });

      const result = getGroqKeyFromEnv();

      expect(result).toBe("test-api-key-from-dotenv");
      expect(dotenv.config).toHaveBeenCalledOnce();
    });

    it("should prioritize process.env over .env file", async () => {
      process.env.GROQ_API_KEY = "env-key";

      const dotenv = await import("dotenv");
      const dotenvSpy = vi.mocked(dotenv.config);

      const result = getGroqKeyFromEnv();

      expect(result).toBe("env-key");
      expect(dotenvSpy).not.toHaveBeenCalled();
    });

    it("should handle dotenv errors gracefully", async () => {
      const dotenv = await import("dotenv");
      vi.mocked(dotenv.config).mockImplementation(() => {
        throw new Error("File not found");
      });

      const result = getGroqKeyFromEnv();

      expect(result).toBeUndefined();
    });
  });

  describe("getGroqKeyFromRc", () => {
    it("should return groqApiKey from rc config", async () => {
      const { getRc } = await import("./rc");
      vi.mocked(getRc).mockReturnValue({
        llm: {
          groqApiKey: "test-api-key-from-rc",
        },
      });

      const result = getGroqKeyFromRc();

      expect(result).toBe("test-api-key-from-rc");
    });

    it("should return undefined when rc config has no groqApiKey", async () => {
      const { getRc } = await import("./rc");
      vi.mocked(getRc).mockReturnValue({});

      const result = getGroqKeyFromRc();

      expect(result).toBeUndefined();
    });
  });

  describe("getGroqKey", () => {
    it("should prioritize environment over rc config", async () => {
      process.env.GROQ_API_KEY = "env-key";

      const { getRc } = await import("./rc");
      vi.mocked(getRc).mockReturnValue({
        llm: {
          groqApiKey: "rc-key",
        },
      });

      const result = getGroqKey();

      expect(result).toBe("env-key");
    });

    it("should fallback to rc config when environment key is not available", async () => {
      const dotenv = await import("dotenv");
      vi.mocked(dotenv.config).mockReturnValue({
        parsed: undefined,
      });

      const { getRc } = await import("./rc");
      vi.mocked(getRc).mockReturnValue({
        llm: {
          groqApiKey: "rc-key",
        },
      });

      const result = getGroqKey();

      expect(result).toBe("rc-key");
    });

    it("should prioritize .env file over rc config", async () => {
      const dotenv = await import("dotenv");
      vi.mocked(dotenv.config).mockReturnValue({
        parsed: {
          GROQ_API_KEY: "dotenv-key",
        },
      });

      const { getRc } = await import("./rc");
      vi.mocked(getRc).mockReturnValue({
        llm: {
          groqApiKey: "rc-key",
        },
      });

      const result = getGroqKey();

      expect(result).toBe("dotenv-key");
    });

    it("should return undefined when no key is available anywhere", async () => {
      const dotenv = await import("dotenv");
      vi.mocked(dotenv.config).mockReturnValue({
        parsed: undefined,
      });

      const { getRc } = await import("./rc");
      vi.mocked(getRc).mockReturnValue({});

      const result = getGroqKey();

      expect(result).toBeUndefined();
    });
  });
});
