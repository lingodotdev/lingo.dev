import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as dotenv from "dotenv";
import * as path from "path";
import { getKeyFromEnv, getGeminiKey, getGeminiKeyFromEnv, getGeminiKeyFromRc } from "./llm-api-key";
import * as rc from "./rc";

const ORIGINAL_ENV = { ...process.env };

vi.mock("dotenv");
vi.mock("./rc");

describe("LLM API keys", () => {
  describe("getKeyFromEnv", () => {
    beforeEach(() => {
      vi.resetModules();
      process.env = { ...ORIGINAL_ENV };
    });

    afterEach(() => {
      process.env = { ...ORIGINAL_ENV };
      vi.restoreAllMocks();
    });

    it("returns API key from process.env if set", () => {
      process.env.FOOBAR_API_KEY = "env-key";
      expect(getKeyFromEnv("FOOBAR_API_KEY")).toBe("env-key");
    });

    it("returns API key from .env file if not in process.env", () => {
      delete process.env.FOOBAR_API_KEY;
      const fakeEnv = { FOOBAR_API_KEY: "file-key" };
      const configMock = vi
        .mocked(dotenv.config)
        .mockImplementation((opts: any) => {
          if (opts && opts.processEnv) {
            Object.assign(opts.processEnv, fakeEnv);
          }
          return { parsed: fakeEnv };
        });
      expect(getKeyFromEnv("FOOBAR_API_KEY")).toBe("file-key");
      expect(configMock).toHaveBeenCalledWith({
        path: [
          path.resolve(process.cwd(), ".env"),
          path.resolve(process.cwd(), ".env.local"),
          path.resolve(process.cwd(), ".env.development"),
        ],
      });
    });

    it("returns undefined if no API key in env or .env file", () => {
      delete process.env.FOOBAR_API_KEY;
      vi.mocked(dotenv.config).mockResolvedValue({ parsed: {} });
      expect(getKeyFromEnv("FOOBAR_API_KEY")).toBeUndefined();
    });
  });
  
  describe("Gemini API key", () => {
    beforeEach(() => {
      vi.resetModules();
      process.env = { ...ORIGINAL_ENV };
    });

    afterEach(() => {
      process.env = { ...ORIGINAL_ENV };
      vi.restoreAllMocks();
    });
    
    it("getGeminiKeyFromEnv returns key from environment", () => {
      process.env.GEMINI_API_KEY = "gemini-env-key";
      expect(getGeminiKeyFromEnv()).toBe("gemini-env-key");
    });
    
    it("getGeminiKeyFromRc returns key from rc file", () => {
      vi.mocked(rc.getRc).mockReturnValue({ llm: { geminiApiKey: "gemini-rc-key" } });
      expect(getGeminiKeyFromRc()).toBe("gemini-rc-key");
    });
    
    it("getGeminiKey prioritizes env over rc", () => {
      process.env.GEMINI_API_KEY = "gemini-env-key";
      vi.mocked(rc.getRc).mockReturnValue({ llm: { geminiApiKey: "gemini-rc-key" } });
      expect(getGeminiKey()).toBe("gemini-env-key");
    });
    
    it("getGeminiKey falls back to rc when env is not set", () => {
      delete process.env.GEMINI_API_KEY;
      vi.mocked(rc.getRc).mockReturnValue({ llm: { geminiApiKey: "gemini-rc-key" } });
      expect(getGeminiKey()).toBe("gemini-rc-key");
    });
    
    it("getGeminiKey returns undefined when neither env nor rc has key", () => {
      delete process.env.GEMINI_API_KEY;
      vi.mocked(rc.getRc).mockReturnValue({});
      expect(getGeminiKey()).toBeUndefined();
    });
  });
});