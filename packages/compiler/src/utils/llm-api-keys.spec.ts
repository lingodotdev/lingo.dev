import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as dotenv from "dotenv";
import * as path from "path";
import { getKeyFromEnv } from "./llm-api-key";

const ORIGINAL_ENV = { ...process.env };

vi.mock("dotenv");

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

    it("returns undefined if no GROQ_API_KEY in env or .env file", () => {
      delete process.env.GROQ_API_KEY;
      vi.mocked(dotenv.config).mockResolvedValue({ parsed: {} });
      expect(getKeyFromEnv("FOOBAR_API_KEY")).toBeUndefined();
    });
  });
});
