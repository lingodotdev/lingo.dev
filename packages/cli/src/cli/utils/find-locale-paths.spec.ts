import { describe, it, expect, vi, beforeEach } from "vitest";
import { glob } from "glob";
import findLocaleFiles from "./find-locale-paths";

vi.mock("glob", () => ({
  glob: {
    sync: vi.fn(),
  },
}));

describe("findLocaleFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should find json locale files", () => {
    vi.mocked(glob.sync).mockReturnValue([
      // valid locales
      "src/i18n/en.json",
      "src/i18n/fr.json",
      "src/i18n/en-US.json",
      "src/translations/es.json",

      // not a valid locale
      "src/xx.json",
      "src/settings.json",
    ]);

    const result = findLocaleFiles("json");

    expect(result).toEqual({
      found: true,
      patterns: ["src/i18n/[locale].json", "src/translations/[locale].json"],
    });
  });

  it("should find yaml locale files", () => {
    vi.mocked(glob.sync).mockReturnValue(["locales/en.yml", "locales/fr.yml", "translations/es.yml"]);

    const result = findLocaleFiles("yaml");

    expect(result).toEqual({
      found: true,
      patterns: ["locales/[locale].yml", "translations/[locale].yml"],
    });
  });

  it("should find flutter arb locale files", () => {
    vi.mocked(glob.sync).mockReturnValue(["lib/l10n/en.arb", "lib/l10n/es.arb", "lib/translations/fr.arb"]);

    const result = findLocaleFiles("flutter");

    expect(result).toEqual({
      found: true,
      patterns: ["lib/l10n/[locale].arb", "lib/translations/[locale].arb"],
    });
  });

  it("should find locale files in nested directories", () => {
    vi.mocked(glob.sync).mockReturnValue([
      // valid locales
      "src/locales/en/messages.json",
      "src/locales/fr/messages.json",
      "src/i18n/es/strings.json",
      "src/translations/es.json",
      "src/aa/translations/en.json",
      "src/aa/bb/foobar/cc/translations/es/values.json",
      "src/aa/en.json",
      "src/aa/translations/bb/en.json",
      "foo/en-US/en-US.json",
      "foo/en-US/en-US/messages.json",
      "bar/es/baz/es.json",
      "bar/es/es.json",

      // not a valid locale
      "src/xx/settings.json",
      "src/xx.json",
    ]);

    const result = findLocaleFiles("json");

    expect(result).toEqual({
      found: true,
      patterns: [
        "src/locales/[locale]/messages.json",
        "src/i18n/[locale]/strings.json",
        "src/translations/[locale].json",
        "src/aa/translations/[locale].json",
        "src/aa/bb/foobar/cc/translations/[locale]/values.json",
        "src/aa/[locale].json",
        "src/aa/translations/bb/[locale].json",
        "foo/[locale]/[locale].json",
        "foo/[locale]/[locale]/messages.json",
        "bar/[locale]/baz/[locale].json",
        "bar/[locale]/[locale].json",
      ],
    });
  });

  it("should return default pattern when no files found", () => {
    vi.mocked(glob.sync).mockReturnValue([]);

    const result = findLocaleFiles("json");

    expect(result).toEqual({
      found: false,
      patterns: ["i18n/[locale].json"],
    });
  });

  it("should find xcode-xcstrings locale files", () => {
    vi.mocked(glob.sync).mockReturnValue([
      "ios/MyApp/Localizable.xcstrings",
      "ios/MyApp/Onboarding/Localizable.xcstrings",
      "ios/MyApp/Onboarding/fr.xcstrings",
      "ios/MyApp/xx/Localizable.xcstrings",
    ]);

    const result = findLocaleFiles("xcode-xcstrings");

    expect(result).toEqual({
      found: true,
      patterns: [
        "ios/MyApp/Localizable.xcstrings",
        "ios/MyApp/Onboarding/Localizable.xcstrings",
        "ios/MyApp/xx/Localizable.xcstrings",
      ],
    });
  });

  it("should return default pattern for xcode-xcstrings when no files found", () => {
    vi.mocked(glob.sync).mockReturnValue([]);

    const result = findLocaleFiles("xcode-xcstrings");

    expect(result).toEqual({
      found: false,
      patterns: ["Localizable.xcstrings"],
    });
  });

  it("should throw error for unsupported bucket type", () => {
    expect(() => findLocaleFiles("invalid")).toThrow("Unsupported bucket type: invalid");
  });
});
