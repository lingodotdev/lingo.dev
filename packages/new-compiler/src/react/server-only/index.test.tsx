/**
 * @vitest-environment node
 */
import { assert, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { logger } from "../../utils/logger";

// Mock Next.js cookies
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(() => ({ value: "en" })),
  })),
}));

// Mock fs/promises
vi.mock("fs/promises", () => ({
  readFile: vi.fn(async () => {
    throw new Error("File not found");
  }),
}));

describe("Server-side rich text rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render plain text without params", async () => {
    const { getServerTranslations } = await import("./index");

    const { t } = await getServerTranslations({
      locale: "en",
    });

    const result = t("hash1", "Hello World");
    expect(result).toBe("Hello World");
  });

  it("should render text with variable placeholders", async () => {
    const { getServerTranslations } = await import("./index");

    const { t } = await getServerTranslations({
      locale: "en",
    });

    const result = t("hash2", "Hello {name}", { name: "Alice" });
    expect(result).toBe("Hello Alice");
  });

  it("should render text with component tags", async () => {
    const { getServerTranslations } = await import("./index");

    const { t } = await getServerTranslations({
      locale: "en",
    });

    const result = t("hash3", "Click <a0>here</a0>", {
      a0: (chunks) => <a href="/home">{chunks}</a>,
    });

    assert.isOk(Array.isArray(result));
    result.forEach((item) => {
      expect(React.isValidElement(item)).toBe(true);
    });
  });

  it("should render mixed content with variables and components", async () => {
    const { getServerTranslations } = await import("./index");

    const { t } = await getServerTranslations({
      locale: "en",
    });

    const result = t(
      "hash4",
      "Hello {name}, you have <strong0>{count}</strong0> messages",
      {
        name: "Alice",
        count: 5,
        strong0: (chunks) => <strong>{chunks}</strong>,
      },
    );

    assert.isOk(Array.isArray(result));
    result.forEach((item) => {
      expect(React.isValidElement(item)).toBe(true);
    });
  });

  it("should handle the page.tsx example case", async () => {
    const { getServerTranslations } = await import("./index");

    const { t } = await getServerTranslations({
      locale: "en",
    });

    const result = t(
      "hash5",
      "Looking for help? Head over to <a0>Templates</a0> or the <a1>Learning</a1> center.",
      {
        a0: (chunks) => (
          <a href="https://vercel.com/templates" className="font-medium">
            {chunks}
          </a>
        ),
        a1: (chunks) => (
          <a href="https://nextjs.org/learn" className="font-medium">
            {chunks}
          </a>
        ),
      },
    );

    assert.isOk(Array.isArray(result));
    result.forEach((item) => {
      expect(React.isValidElement(item)).toBe(true);
    });
  });
});
