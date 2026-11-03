import { describe, it, expect } from "vitest";
import { normalizeVerifyUrl } from "./login";

describe("normalizeVerifyUrl", () => {
  it("accepts http(s) URLs", () => {
    expect(
      normalizeVerifyUrl("https://lingo.dev/cli/verify?session=abc-123"),
    ).toBe("https://lingo.dev/cli/verify?session=abc-123");
    expect(normalizeVerifyUrl("http://localhost:3000/cli/verify")).toBe(
      "http://localhost:3000/cli/verify",
    );
  });

  it("rejects other protocols", () => {
    expect(() => normalizeVerifyUrl("file:///etc/passwd")).toThrow();
    expect(() => normalizeVerifyUrl("javascript:alert(1)")).toThrow();
  });

  it("rejects values that are not URLs", () => {
    expect(() => normalizeVerifyUrl("not a url")).toThrow();
    expect(() => normalizeVerifyUrl(undefined)).toThrow();
  });

  it("rejects URLs with unexpected characters", () => {
    expect(() => normalizeVerifyUrl("https://lingo.dev/verify/$session")).toThrow();
    expect(() => normalizeVerifyUrl("https://lingo.dev/verify?x=a`b")).toThrow();
  });
});
