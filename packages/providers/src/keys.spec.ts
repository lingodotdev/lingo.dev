import { describe, it, expect } from "vitest";
import { resolveProviderApiKey } from "./keys";
import { ProviderKeyMissingError } from "./errors";

describe("resolveProviderApiKey", () => {
  it("prefers env over rc when both provided", () => {
    const key = resolveProviderApiKey("openai", {
      sources: {
        env: { OPENAI_API_KEY: "env-key" },
        rc: { llm: { openaiApiKey: "rc-key" } },
      },
    });
    expect(key).toBe("env-key");
  });

  it("throws when required and key missing", () => {
    expect(() =>
      resolveProviderApiKey("mistral", {
        sources: { env: {}, rc: {} },
        required: true,
      }),
    ).toThrow(ProviderKeyMissingError);
  });
});
