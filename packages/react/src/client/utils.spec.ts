import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

vi.mock("js-cookie", () => {
  return {
    default: {
      get: vi.fn(),
      set: vi.fn(),
    },
  };
});

// access mocked module
import Cookies from "js-cookie";

describe("client/utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLocaleFromCookies", () => {
    it("returns null when document is undefined (SSR)", () => {
      const original = globalThis.document;
      // @ts-ignore
      delete (globalThis as any).document;
      expect(getLocaleFromCookies()).toBeNull();
      (globalThis as any).document = original;
    });

    it("returns cookie value when present", () => {
      (Cookies.get as any).mockReturnValue("es");
      (globalThis as any).document = {} as any;
      expect(getLocaleFromCookies()).toBe("es");
    });
  });

  describe("setLocaleInCookies", () => {
    it("is no-op when document is undefined", () => {
      const original = globalThis.document;
      // @ts-ignore
      delete (globalThis as any).document;
      setLocaleInCookies("fr");
      expect(Cookies.set).not.toHaveBeenCalled();
      (globalThis as any).document = original;
    });

    it("writes cookie with expected options", () => {
      (globalThis as any).document = {} as any;
      setLocaleInCookies("en");
      expect(Cookies.set).toHaveBeenCalledWith("lingo-locale", "en", {
        path: "/",
        expires: 365,
        sameSite: "lax",
      });
    });
  });
});
