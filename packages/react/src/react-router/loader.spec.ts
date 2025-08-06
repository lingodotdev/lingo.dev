import { describe, expect, it, vi } from "vitest";
import { LOCALE_COOKIE_NAME } from "../core";
import { loadDictionary_internal } from "./loader";

describe("loadDictionary_internal", () => {
  function createMockRequest(cookieHeader?: string): Request {
    const headers = new Headers();
    if (cookieHeader) {
      headers.set("Cookie", cookieHeader);
    }
    return new Request("http://localhost", { headers });
  }

  const mockDictionaryLoader = {
    en: vi.fn().mockResolvedValue({ default: { hello: "Hello" } }),
    es: vi.fn().mockResolvedValue({ default: { hello: "Hola" } }),
    fr: vi.fn().mockResolvedValue({ default: { hello: "Bonjour" } }),
  };

  it("should return first dictionary when no Cookie header is present", async () => {
    const request = createMockRequest();
    const result = await loadDictionary_internal(request, mockDictionaryLoader);

    expect(mockDictionaryLoader.en).toHaveBeenCalled();
    expect(result).toEqual({ hello: "Hello" });
  });

  it("should return  first dictionary when Cookie header exists but no lingo-locale cookie", async () => {
    const request = createMockRequest("session=abc123; other-cookie=value");
    const result = await loadDictionary_internal(request, mockDictionaryLoader);

    expect(mockDictionaryLoader.en).toHaveBeenCalled();
    expect(result).toEqual({ hello: "Hello" });
  });

  it("should parse locale from lingo-locale cookie", async () => {
    const request = createMockRequest(`${LOCALE_COOKIE_NAME}=es`);
    const result = await loadDictionary_internal(request, mockDictionaryLoader);

    expect(mockDictionaryLoader.es).toHaveBeenCalled();
    expect(result).toEqual({ hello: "Hola" });
  });

  it("should handle lingo-locale cookie with other cookies", async () => {
    const request = createMockRequest(
      `session=abc; ${LOCALE_COOKIE_NAME}=fr; other=value`,
    );
    const result = await loadDictionary_internal(request, mockDictionaryLoader);

    expect(mockDictionaryLoader.fr).toHaveBeenCalled();
    expect(result).toEqual({ hello: "Bonjour" });
  });

  it("should handle lingo-locale cookie with spaces", async () => {
    const request = createMockRequest(
      `session=abc; ${LOCALE_COOKIE_NAME}=es ; other=value`,
    );
    const result = await loadDictionary_internal(request, mockDictionaryLoader);

    expect(mockDictionaryLoader.es).toHaveBeenCalled();
    expect(result).toEqual({ hello: "Hola" });
  });

  it("should use explicit locale string when provided", async () => {
    const result = await loadDictionary_internal("fr", mockDictionaryLoader);

    expect(mockDictionaryLoader.fr).toHaveBeenCalled();
    expect(result).toEqual({ hello: "Bonjour" });
  });

  it("should return first dictionary when locale is not available in dictionary loaders", async () => {
    const request = createMockRequest(`${LOCALE_COOKIE_NAME}=de`);
    const result = await loadDictionary_internal(request, mockDictionaryLoader);

    expect(result).toEqual({ hello: "Hello" });
  });

  it("should return first dictionary when explicit locale is not available", async () => {
    const result = await loadDictionary_internal("de", mockDictionaryLoader);

    expect(result).toEqual({ hello: "Hello" });
  });

  it("should handle malformed cookie values gracefully", async () => {
    const request = createMockRequest(`${LOCALE_COOKIE_NAME}=`);
    const result = await loadDictionary_internal(request, mockDictionaryLoader);

    expect(result).toEqual({ hello: "Hello" });
  });

  it("should handle cookie with equals sign in value", async () => {
    const request = createMockRequest(`${LOCALE_COOKIE_NAME}=en=US`);
    const mockLoader = {
      "en=US": vi.fn().mockResolvedValue({ default: { hello: "Hello US" } }),
    };
    const result = await loadDictionary_internal(request, mockLoader);

    expect(mockLoader["en=US"]).toHaveBeenCalled();
    expect(result).toEqual({ hello: "Hello US" });
  });

  it("should handle empty string locale", async () => {
    const result = await loadDictionary_internal("", mockDictionaryLoader);

    expect(result).toEqual({ hello: "Hello" });
  });

  it("should extract default export from loader result", async () => {
    const customLoader = {
      custom: vi.fn().mockResolvedValue({
        default: { test: "value" },
        other: { ignored: "data" },
      }),
    };
    const result = await loadDictionary_internal("custom", customLoader);

    expect(result).toEqual({ test: "value" });
  });
});
