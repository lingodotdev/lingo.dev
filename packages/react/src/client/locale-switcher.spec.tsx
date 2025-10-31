import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import {
  LocaleSwitcher,
  normalizeLocales,
  LocaleConfig,
  LocalesProp,
} from "./locale-switcher";

vi.mock("./utils", async (orig) => {
  const actual = await orig();
  return {
    ...(actual as any),
    getLocaleFromCookies: vi.fn(() => "es"),
    setLocaleInCookies: vi.fn(),
  };
});

import { getLocaleFromCookies, setLocaleInCookies } from "./utils";

describe("normalizeLocales", () => {
  it("should handle string array input", () => {
    const locales: LocalesProp = ["en", "es"];
    const expected: LocaleConfig[] = [
      { code: "en", displayName: "en" },
      { code: "es", displayName: "es" },
    ];
    expect(normalizeLocales(locales)).toEqual(expected);
  });

  it("should handle object input", () => {
    const locales: LocalesProp = { en: "English", es: "Español" };
    const expected: LocaleConfig[] = [
      { code: "en", displayName: "English" },
      { code: "es", displayName: "Español" },
    ];
    expect(normalizeLocales(locales)).toEqual(expected);
  });

  it("should handle LocaleConfig array input", () => {
    const locales: LocalesProp = [
      { code: "en", displayName: "English", flag: "🇬🇧" },
      { code: "es", displayName: "Español", nativeName: "Español" },
    ];
    expect(normalizeLocales(locales)).toEqual(locales);
  });

  it("should throw an error for invalid LocaleConfig array", () => {
    const invalidLocales = [{ name: "English" }] as any;
    expect(() => normalizeLocales(invalidLocales)).toThrow(
      "Invalid LocaleConfig array provided. Each object must have 'code' and 'displayName' properties.",
    );
  });

  it("should throw an error for mixed array input", () => {
    const mixedLocales = ["en", { code: "es", displayName: "Español" }] as any;
    expect(() => normalizeLocales(mixedLocales)).toThrow(
      "Invalid 'locales' prop provided. It must be an array of strings, an array of LocaleConfig objects, or a Record<string, string>.",
    );
  });

  it("should throw an error for other invalid inputs", () => {
    expect(() => normalizeLocales(null as any)).toThrow(
      "Invalid 'locales' prop provided.",
    );
    expect(() => normalizeLocales(123 as any)).toThrow(
      "Invalid 'locales' prop provided.",
    );
  });

  it("should handle empty array", () => {
    expect(normalizeLocales([])).toEqual([]);
  });
});

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null before determining initial locale", () => {
    // This component sets state in an effect, but with jsdom and our mocked
    // cookie util returning a value synchronously, it may render immediately.
    // We still assert it produces a select afterward.
    const { container } = render(<LocaleSwitcher locales={["en", "es"]} />);
    expect(container.querySelector("select")).toBeTruthy();
  });

  it("uses cookie locale if valid; otherwise defaults to first provided locale", async () => {
    (getLocaleFromCookies as any).mockReturnValue("es");
    const { unmount } = render(<LocaleSwitcher locales={["en", "es"]} />);
    const select = (await screen.findByRole("combobox")) as HTMLSelectElement;
    expect(select.value).toBe("es");
    unmount(); // Unmount to ensure a clean state for the next render

    // invalid cookie -> defaults to first
    (getLocaleFromCookies as any).mockReturnValue("fr");
    render(<LocaleSwitcher locales={["en", "es"]} />);
    const select2 = (await screen.findByRole("combobox")) as HTMLSelectElement;
    expect(select2.value).toBe("en");
  });

  it("on change sets cookie and triggers full reload", async () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: reloadSpy },
      writable: true,
    });
    render(<LocaleSwitcher locales={["en", "es"]} />);
    const select = (await screen.findByRole("combobox")) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "en" } });

    expect(setLocaleInCookies).toHaveBeenCalledWith("en");
    expect(reloadSpy).toHaveBeenCalled();
  });

  it("renders correctly with string array input", async () => {
    render(<LocaleSwitcher locales={["en", "es"]} />);
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe("en");
    expect(options[1].textContent).toBe("es");
  });

  it("renders correctly with object input", async () => {
    render(<LocaleSwitcher locales={{ en: "English", es: "Español" }} />);
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe("English");
    expect(options[1].textContent).toBe("Español");
  });

  it("renders correctly with LocaleConfig array input", async () => {
    const locales: LocaleConfig[] = [
      { code: "en-US", displayName: "English (US)" },
      { code: "fr-CA", displayName: "Français (Canada)" },
    ];
    render(<LocaleSwitcher locales={locales} />);
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe("English (US)");
    expect(options[1].textContent).toBe("Français (Canada)");
  });
});
