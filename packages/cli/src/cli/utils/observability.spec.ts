import { describe, it, expect } from "vitest";
import { sanitizeProperties } from "./observability";

describe("sanitizeProperties", () => {
  it("masks credential-like fields at any depth", () => {
    const result = sanitizeProperties({
      flags: { apiKey: "key-123", locale: ["es"], key: "home.title" },
      nested: [{ api_key: "a" }, { authToken: "b" }, { password: "c" }],
      clientSecret: "d",
    });

    expect(result).toEqual({
      flags: { apiKey: "[REDACTED]", locale: ["es"], key: "home.title" },
      nested: [
        { api_key: "[REDACTED]" },
        { authToken: "[REDACTED]" },
        { password: "[REDACTED]" },
      ],
      clientSecret: "[REDACTED]",
    });
  });

  it("keeps empty credential fields as-is", () => {
    expect(sanitizeProperties({ apiKey: undefined, token: null })).toEqual({
      apiKey: undefined,
      token: null,
    });
  });

  it("keeps non-credential fields untouched", () => {
    const input = {
      inputTokens: 10,
      bucketTypes: ["json"],
      lockedKeys: ["a"],
      errorMessage: "Something failed",
      count: 3,
      enabled: true,
    };
    expect(sanitizeProperties(input)).toEqual(input);
  });

  it("masks bearer values inside strings", () => {
    expect(
      sanitizeProperties({
        errorMessage: 'request failed: {"authorization":"Bearer abc.def-123"}',
      }),
    ).toEqual({
      errorMessage: 'request failed: {"authorization":"Bearer [REDACTED]"}',
    });
  });

  it("keeps shared references and drops circular ones", () => {
    const shared = { a: 1 };
    const circular: Record<string, any> = { name: "root" };
    circular.self = circular;

    expect(sanitizeProperties({ x: shared, y: shared })).toEqual({
      x: { a: 1 },
      y: { a: 1 },
    });
    expect(sanitizeProperties(circular)).toEqual({
      name: "root",
      self: undefined,
    });
  });

  it("does not mutate the input", () => {
    const input = { flags: { apiKey: "key-123" } };
    sanitizeProperties(input);
    expect(input.flags.apiKey).toBe("key-123");
  });
});
