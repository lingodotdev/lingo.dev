import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLingoLocale, setLingoLocale } from "./locale";

// Mock the utils module
vi.mock("./utils", async (orig) => {
  const actual = await orig();
  return {
    ...(actual as any),
    getLocaleFromCookies: vi.fn(() => "en"),
    setLocaleInCookies: vi.fn(),
  };
});

import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, "location", {
  value: { ...window.location, reload: mockReload },
  writable: true,
});

describe("useLingoLocale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the locale from cookies", () => {
    (getLocaleFromCookies as any).mockReturnValue("es");
    const { result } = renderHook(() => useLingoLocale());

    expect(result.current).toBe("es");
    expect(getLocaleFromCookies).toHaveBeenCalled();
  });

  it("returns null when no locale is set", () => {
    (getLocaleFromCookies as any).mockReturnValue(null);
    const { result } = renderHook(() => useLingoLocale());

    expect(result.current).toBe(null);
  });
});

describe("setLingoLocale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReload.mockClear();
  });

  it("sets locale in cookies and reloads page for valid locale", () => {
    act(() => {
      setLingoLocale("es");
    });

    expect(setLocaleInCookies).toHaveBeenCalledWith("es");
    expect(mockReload).toHaveBeenCalled();
  });

  it("accepts various locales", () => {
    const validLocales = [
      "en",
      "es",
      "fr",
      "de",
      "en-US",
      "es-ES",
      "fr-CA",
      "de-DE",
    ];

    validLocales.forEach((locale) => {
      expect(() => {
        act(() => {
          setLingoLocale(locale);
        });
      }).not.toThrow();

      expect(setLocaleInCookies).toHaveBeenCalledWith(locale);
    });
  });
});
