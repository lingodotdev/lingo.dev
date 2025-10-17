import { describe, it, expect } from "vitest";
import { createProviderClient } from "./factory";

describe("createProviderClient", () => {
  it("creates ollama client without api key (skipAuth)", () => {
    const client = createProviderClient("ollama", "llama3");
    expect(client).toBeTruthy();
  });

  it("creates openrouter client with explicit apiKey override", () => {
    const client = createProviderClient("openrouter", "gpt-4o-mini", {
      apiKey: "dummy",
    });
    expect(client).toBeTruthy();
  });
});
