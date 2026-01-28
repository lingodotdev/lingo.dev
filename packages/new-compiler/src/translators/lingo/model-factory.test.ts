import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  parseModelString,
  getLocaleModel,
  validateAndGetApiKeys,
  createAiModel,
  getKeyFromEnv,
} from "./model-factory";

vi.mock("dotenv", () => ({
  config: vi.fn(() => ({ parsed: {} })),
}));

describe("model-factory", () => {
  describe("parseModelString", () => {
    it("should parse provider:model format correctly", () => {
      const result = parseModelString("openai:gpt-4");
      expect(result).toEqual({ provider: "openai", name: "gpt-4" });
    });

    it("should handle model names with colons", () => {
      const result = parseModelString("openai:ft:gpt-4:my-org:custom:id");
      expect(result).toEqual({
        provider: "openai",
        name: "ft:gpt-4:my-org:custom:id",
      });
    });

    it("should handle simple model names with dashes", () => {
      const result = parseModelString("groq:llama3-8b-8192");
      expect(result).toEqual({ provider: "groq", name: "llama3-8b-8192" });
    });

    it("should return undefined for invalid format", () => {
      expect(parseModelString("invalid")).toBeUndefined();
      expect(parseModelString("")).toBeUndefined();
    });
  });

  describe("getLocaleModel", () => {
    it("should match exact locale pair", () => {
      const config = {
        "en:fr": "openai:gpt-4",
        "*:*": "groq:llama3-8b-8192",
      };

      const result = getLocaleModel(config, "en", "fr");
      expect(result).toEqual({ provider: "openai", name: "gpt-4" });
    });

    it("should fallback to *:targetLocale wildcard pattern", () => {
      const config = {
        "*:fr": "openai:gpt-3.5-turbo",
        "*:*": "groq:llama3-8b-8192",
      };

      const result = getLocaleModel(config, "en", "fr");
      expect(result).toEqual({ provider: "openai", name: "gpt-3.5-turbo" });
    });

    it("should fallback to sourceLocale:* wildcard pattern", () => {
      const config = {
        "en:*": "openai:gpt-4",
        "*:*": "groq:llama3-8b-8192",
      };

      const result = getLocaleModel(config, "en", "de");
      expect(result).toEqual({ provider: "openai", name: "gpt-4" });
    });

    it("should return undefined when no match found", () => {
      const config = {
        "en:fr": "openai:gpt-4",
      };

      const result = getLocaleModel(config, "de", "es");
      expect(result).toBeUndefined();
    });
  });

  describe("validateAndGetApiKeys", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should validate and return API keys for configured providers", () => {
      process.env.OPENAI_API_KEY = "test-openai-key";
      process.env.GROQ_API_KEY = "test-groq-key";

      const config = {
        "*:fr": "openai:gpt-4",
        "*:es": "groq:llama3-8b-8192",
      };

      const result = validateAndGetApiKeys(config);
      expect(result).toEqual({
        openai: "test-openai-key",
        groq: "test-groq-key",
      });
    });

    it("should skip providers that don't require API keys (like Ollama)", () => {
      const config = {
        "*:*": "ollama:llama3",
      };

      // Should not throw even without OLLAMA_API_KEY
      const result = validateAndGetApiKeys(config);
      expect(result).toEqual({});
    });

    it("should throw error for missing required API keys", () => {
      const config = {
        "*:*": "openai:gpt-4",
      };

      expect(() => validateAndGetApiKeys(config)).toThrow();
    });

    it("should validate lingo.dev provider when specified", () => {
      process.env.LINGODOTDEV_API_KEY = "test-lingo-key";

      const result = validateAndGetApiKeys("lingo.dev");
      expect(result).toEqual({
        "lingo.dev": "test-lingo-key",
      });
    });

    it("should throw error for unknown provider", () => {
      const config = {
        "*:*": "unknownprovider:model",
      };

      expect(() => validateAndGetApiKeys(config)).toThrow(
        /Unknown provider "unknownprovider"/,
      );
    });
  });

  describe("createAiModel", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should support OpenAI with custom baseURL from env", () => {
      process.env.OPENAI_BASE_URL = "https://api.studio.nebius.ai/v1/";
      process.env.OPENAI_API_KEY = "test-key";

      const model = { provider: "openai", name: "gpt-4" };
      const keys = { openai: "test-key" };

      const result = createAiModel(model, keys);
      expect(result).toBeDefined();
    });

    it("should create OpenAI model without baseURL when not set", () => {
      delete process.env.OPENAI_BASE_URL;
      process.env.OPENAI_API_KEY = "test-key";

      const model = { provider: "openai", name: "gpt-4" };
      const keys = { openai: "test-key" };

      const result = createAiModel(model, keys);
      expect(result).toBeDefined();
    });

    it("should create Groq model", () => {
      const model = { provider: "groq", name: "llama3-8b-8192" };
      const keys = { groq: "test-groq-key" };

      const result = createAiModel(model, keys);
      expect(result).toBeDefined();
    });

    it("should create Google model", () => {
      const model = { provider: "google", name: "gemini-pro" };
      const keys = { google: "test-google-key" };

      const result = createAiModel(model, keys);
      expect(result).toBeDefined();
    });

    it("should create OpenRouter model", () => {
      const model = { provider: "openrouter", name: "anthropic/claude-3-opus" };
      const keys = { openrouter: "test-openrouter-key" };

      const result = createAiModel(model, keys);
      expect(result).toBeDefined();
    });

    it("should create Ollama model without API key", () => {
      const model = { provider: "ollama", name: "llama3" };
      const keys = {};

      const result = createAiModel(model, keys);
      expect(result).toBeDefined();
    });

    it("should create Mistral model", () => {
      const model = { provider: "mistral", name: "mistral-large-latest" };
      const keys = { mistral: "test-mistral-key" };

      const result = createAiModel(model, keys);
      expect(result).toBeDefined();
    });

    it("should throw error for unsupported provider", () => {
      const model = { provider: "unsupported", name: "model" };
      const keys = {};

      expect(() => createAiModel(model, keys)).toThrow(
        /Provider "unsupported" is not supported/,
      );
    });
  });

  describe("getKeyFromEnv", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should get key from process.env", () => {
      process.env.TEST_KEY = "test-value";
      expect(getKeyFromEnv("TEST_KEY")).toBe("test-value");
    });

    it("should return undefined for missing key", () => {
      expect(getKeyFromEnv("NONEXISTENT_KEY")).toBeUndefined();
    });
  });
});
