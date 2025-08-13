import { describe, it, expect, vi, beforeEach } from "vitest";

const cookiesSetSpy = vi.fn();
vi.mock("next/headers", () => {
  return {
    headers: vi.fn(async () => new Map([["x-lingo-locale", "it"]])),
    cookies: vi.fn(async () => ({
      get: (name: string) =>
        name === "lingo-locale" ? { value: "pt" } : undefined,
      set: cookiesSetSpy,
    })),
  };
});

import { headers, cookies } from "next/headers";
import {
  loadLocaleFromHeaders,
  loadLocaleFromCookies,
  setLocaleInCookies,
  loadDictionaryFromRequest,
} from "./utils";

describe("rsc/utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loadLocaleFromHeaders", () => {
    it("reads x-lingo-locale header", async () => {
      const value = await loadLocaleFromHeaders();
      expect(value).toBe("it");
      expect(headers).toHaveBeenCalled();
    });
  });

  describe("loadLocaleFromCookies", () => {
    it("reads cookie and defaults to 'en' when missing", async () => {
      const value = await loadLocaleFromCookies();
      expect(value).toBe("pt");
    });

    it("defaults to 'en' when cookie is missing", async () => {
      (cookies as any).mockResolvedValueOnce({ get: () => undefined });
      const value = await loadLocaleFromCookies();
      expect(value).toBe("en");
    });
  });

  describe("setLocaleInCookies", () => {
    it("writes cookie via next/headers cookies API", async () => {
      await setLocaleInCookies("de");
      expect(cookiesSetSpy).toHaveBeenCalledWith("lingo-locale", "de");
    });
  });

  describe("loadDictionaryFromRequest", () => {
    it("uses cookie locale to call loader", async () => {
      const loader = vi.fn(async (locale: string) => ({ locale }));
      (cookies as any).mockResolvedValueOnce({ get: () => ({ value: "ru" }) });
      const dict = await loadDictionaryFromRequest(loader);
      expect(loader).toHaveBeenCalledWith("ru");
      expect(dict).toEqual({ locale: "ru" });
    });
  });
});
