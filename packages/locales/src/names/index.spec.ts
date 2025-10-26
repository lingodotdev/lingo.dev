import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCountryName, getLanguageName, getScriptName } from "./index";

// Mock the loader functions
vi.mock("./loader", () => ({
  loadTerritoryNames: vi.fn(),
  loadLanguageNames: vi.fn(),
  loadScriptNames: vi.fn(),
}));

import {
  loadTerritoryNames,
  loadLanguageNames,
  loadScriptNames,
} from "./loader";

const mockLoadTerritoryNames = loadTerritoryNames as ReturnType<typeof vi.fn>;
const mockLoadLanguageNames = loadLanguageNames as ReturnType<typeof vi.fn>;
const mockLoadScriptNames = loadScriptNames as ReturnType<typeof vi.fn>;

describe("getCountryName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get country name in English by default", async () => {
    mockLoadTerritoryNames.mockResolvedValue({
      US: "United States",
      CN: "China",
      DE: "Germany",
    });

    const result = await getCountryName("US");

    expect(result).toBe("United States");
    expect(mockLoadTerritoryNames).toHaveBeenCalledWith("en");
  });

  it("should get country name in Spanish", async () => {
    mockLoadTerritoryNames.mockResolvedValue({
      US: "Estados Unidos",
      CN: "China",
      DE: "Alemania",
    });

    const result = await getCountryName("US", "es");

    expect(result).toBe("Estados Unidos");
    expect(mockLoadTerritoryNames).toHaveBeenCalledWith("es");
  });

  it("should normalize country code to uppercase", async () => {
    mockLoadTerritoryNames.mockResolvedValue({
      US: "United States",
      CN: "China",
    });

    const result = await getCountryName("us");

    expect(result).toBe("United States");
    expect(mockLoadTerritoryNames).toHaveBeenCalledWith("en");
  });

  it("should throw error for empty country code", async () => {
    await expect(getCountryName("")).rejects.toThrow(
      "Country code is required",
    );
    expect(mockLoadTerritoryNames).not.toHaveBeenCalled();
  });

  it("should throw error for null country code", async () => {
    await expect(getCountryName(null as any)).rejects.toThrow(
      "Country code is required",
    );
    expect(mockLoadTerritoryNames).not.toHaveBeenCalled();
  });

  it("should throw error for undefined country code", async () => {
    await expect(getCountryName(undefined as any)).rejects.toThrow(
      "Country code is required",
    );
    expect(mockLoadTerritoryNames).not.toHaveBeenCalled();
  });

  it("should throw error for unknown country code", async () => {
    mockLoadTerritoryNames.mockResolvedValue({
      US: "United States",
      CN: "China",
    });

    await expect(getCountryName("XX")).rejects.toThrow(
      'Country code "XX" not found',
    );
  });

  it("should handle loader errors", async () => {
    mockLoadTerritoryNames.mockRejectedValue(new Error("Failed to load data"));

    await expect(getCountryName("US")).rejects.toThrow("Failed to load data");
  });
});

describe("getLanguageName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get language name in English by default", async () => {
    mockLoadLanguageNames.mockResolvedValue({
      en: "English",
      es: "Spanish",
      zh: "Chinese",
    });

    const result = await getLanguageName("en");

    expect(result).toBe("English");
    expect(mockLoadLanguageNames).toHaveBeenCalledWith("en");
  });

  it("should get language name in Spanish", async () => {
    mockLoadLanguageNames.mockResolvedValue({
      en: "inglés",
      es: "español",
      zh: "chino",
    });

    const result = await getLanguageName("en", "es");

    expect(result).toBe("inglés");
    expect(mockLoadLanguageNames).toHaveBeenCalledWith("es");
  });

  it("should normalize language code to lowercase", async () => {
    mockLoadLanguageNames.mockResolvedValue({
      en: "English",
      es: "Spanish",
    });

    const result = await getLanguageName("EN");

    expect(result).toBe("English");
    expect(mockLoadLanguageNames).toHaveBeenCalledWith("en");
  });

  it("should throw error for empty language code", async () => {
    await expect(getLanguageName("")).rejects.toThrow(
      "Language code is required",
    );
    expect(mockLoadLanguageNames).not.toHaveBeenCalled();
  });

  it("should throw error for null language code", async () => {
    await expect(getLanguageName(null as any)).rejects.toThrow(
      "Language code is required",
    );
    expect(mockLoadLanguageNames).not.toHaveBeenCalled();
  });

  it("should throw error for undefined language code", async () => {
    await expect(getLanguageName(undefined as any)).rejects.toThrow(
      "Language code is required",
    );
    expect(mockLoadLanguageNames).not.toHaveBeenCalled();
  });

  it("should throw error for unknown language code", async () => {
    mockLoadLanguageNames.mockResolvedValue({
      en: "English",
      es: "Spanish",
    });

    await expect(getLanguageName("xx")).rejects.toThrow(
      'Language code "xx" not found',
    );
  });

  it("should handle loader errors", async () => {
    mockLoadLanguageNames.mockRejectedValue(new Error("Failed to load data"));

    await expect(getLanguageName("en")).rejects.toThrow("Failed to load data");
  });
});

describe("getScriptName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get script name in English by default", async () => {
    mockLoadScriptNames.mockResolvedValue({
      Latn: "Latin",
      Cyrl: "Cyrillic",
      Hans: "Simplified",
      Hant: "Traditional",
    });

    const result = await getScriptName("Latn");

    expect(result).toBe("Latin");
    expect(mockLoadScriptNames).toHaveBeenCalledWith("en");
  });

  it("should get script name in Spanish", async () => {
    mockLoadScriptNames.mockResolvedValue({
      Latn: "latino",
      Cyrl: "cirílico",
      Hans: "simplificado",
      Hant: "tradicional",
    });

    const result = await getScriptName("Hans", "es");

    expect(result).toBe("simplificado");
    expect(mockLoadScriptNames).toHaveBeenCalledWith("es");
  });

  it("should preserve script code case", async () => {
    mockLoadScriptNames.mockResolvedValue({
      Latn: "Latin",
      CYRL: "Cyrillic", // Note: some script codes might be uppercase
      hans: "Simplified", // Note: some might be lowercase
    });

    const result1 = await getScriptName("Latn");
    const result2 = await getScriptName("CYRL");
    const result3 = await getScriptName("hans");

    expect(result1).toBe("Latin");
    expect(result2).toBe("Cyrillic");
    expect(result3).toBe("Simplified");
  });

  it("should throw error for empty script code", async () => {
    await expect(getScriptName("")).rejects.toThrow("Script code is required");
    expect(mockLoadScriptNames).not.toHaveBeenCalled();
  });

  it("should throw error for null script code", async () => {
    await expect(getScriptName(null as any)).rejects.toThrow(
      "Script code is required",
    );
    expect(mockLoadScriptNames).not.toHaveBeenCalled();
  });

  it("should throw error for undefined script code", async () => {
    await expect(getScriptName(undefined as any)).rejects.toThrow(
      "Script code is required",
    );
    expect(mockLoadScriptNames).not.toHaveBeenCalled();
  });

  it("should throw error for unknown script code", async () => {
    mockLoadScriptNames.mockResolvedValue({
      Latn: "Latin",
      Cyrl: "Cyrillic",
    });

    await expect(getScriptName("Xxxx")).rejects.toThrow(
      'Script code "Xxxx" not found',
    );
  });

  it("should handle loader errors", async () => {
    mockLoadScriptNames.mockRejectedValue(new Error("Failed to load data"));

    await expect(getScriptName("Latn")).rejects.toThrow("Failed to load data");
  });
});

describe("Integration scenarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle multiple languages for the same code", async () => {
    // Mock different responses for different languages
    mockLoadTerritoryNames
      .mockResolvedValueOnce({ US: "United States" }) // en
      .mockResolvedValueOnce({ US: "Estados Unidos" }) // es
      .mockResolvedValueOnce({ US: "États-Unis" }); // fr

    const result1 = await getCountryName("US", "en");
    const result2 = await getCountryName("US", "es");
    const result3 = await getCountryName("US", "fr");

    expect(result1).toBe("United States");
    expect(result2).toBe("Estados Unidos");
    expect(result3).toBe("États-Unis");

    expect(mockLoadTerritoryNames).toHaveBeenCalledTimes(3);
    expect(mockLoadTerritoryNames).toHaveBeenNthCalledWith(1, "en");
    expect(mockLoadTerritoryNames).toHaveBeenNthCalledWith(2, "es");
    expect(mockLoadTerritoryNames).toHaveBeenNthCalledWith(3, "fr");
  });

  it("should handle Chinese language names", async () => {
    mockLoadLanguageNames.mockResolvedValue({
      en: "英语",
      es: "西班牙语",
      fr: "法语",
    });

    const result1 = await getLanguageName("en", "zh");
    const result2 = await getLanguageName("es", "zh");
    const result3 = await getLanguageName("fr", "zh");

    expect(result1).toBe("英语");
    expect(result2).toBe("西班牙语");
    expect(result3).toBe("法语");
  });

  it("should handle script names with variants", async () => {
    mockLoadScriptNames.mockResolvedValue({
      Hans: "Simplified Han",
      Hant: "Traditional Han",
      Latn: "Latin",
      Cyrl: "Cyrillic",
    });

    const result1 = await getScriptName("Hans");
    const result2 = await getScriptName("Hant");
    const result3 = await getScriptName("Latn");

    expect(result1).toBe("Simplified Han");
    expect(result2).toBe("Traditional Han");
    expect(result3).toBe("Latin");
  });
});
