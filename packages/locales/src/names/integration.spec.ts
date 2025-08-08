import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCountryName, getLanguageName, getScriptName } from "./index";

// Mock the loader functions to return predictable data
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

const mockLoadTerritoryNames = loadTerritoryNames as vi.MockedFunction<
  typeof loadTerritoryNames
>;
const mockLoadLanguageNames = loadLanguageNames as vi.MockedFunction<
  typeof loadLanguageNames
>;
const mockLoadScriptNames = loadScriptNames as vi.MockedFunction<
  typeof loadScriptNames
>;

describe("Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCountryName", () => {
    it("should get country names in different languages", async () => {
      // Mock data for different languages
      mockLoadTerritoryNames
        .mockResolvedValueOnce({ US: "United States", CN: "China" }) // en
        .mockResolvedValueOnce({ US: "Estados Unidos", CN: "China" }) // es
        .mockResolvedValueOnce({ US: "États-Unis", CN: "Chine" }); // fr

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

    it("should normalize country codes to uppercase", async () => {
      mockLoadTerritoryNames.mockResolvedValue({ US: "United States" });

      const result = await getCountryName("us");
      expect(result).toBe("United States");
    });

    it("should handle loader errors gracefully", async () => {
      mockLoadTerritoryNames.mockRejectedValue(new Error("Network error"));

      await expect(getCountryName("US")).rejects.toThrow("Network error");
    });
  });

  describe("getLanguageName", () => {
    it("should get language names in different languages", async () => {
      mockLoadLanguageNames
        .mockResolvedValueOnce({ en: "English", es: "Spanish" }) // en
        .mockResolvedValueOnce({ en: "inglés", es: "español" }) // es
        .mockResolvedValueOnce({ en: "anglais", es: "espagnol" }); // fr

      const result1 = await getLanguageName("en", "en");
      const result2 = await getLanguageName("en", "es");
      const result3 = await getLanguageName("en", "fr");

      expect(result1).toBe("English");
      expect(result2).toBe("inglés");
      expect(result3).toBe("anglais");
    });

    it("should normalize language codes to lowercase", async () => {
      mockLoadLanguageNames.mockResolvedValue({ en: "English" });

      const result = await getLanguageName("EN");
      expect(result).toBe("English");
    });
  });

  describe("getScriptName", () => {
    it("should get script names in different languages", async () => {
      mockLoadScriptNames
        .mockResolvedValueOnce({
          Hans: "Simplified Han",
          Hant: "Traditional Han",
        }) // en
        .mockResolvedValueOnce({
          Hans: "han simplificado",
          Hant: "han tradicional",
        }) // es
        .mockResolvedValueOnce({
          Hans: "han simplifié",
          Hant: "han traditionnel",
        }); // fr

      const result1 = await getScriptName("Hans", "en");
      const result2 = await getScriptName("Hans", "es");
      const result3 = await getScriptName("Hans", "fr");

      expect(result1).toBe("Simplified Han");
      expect(result2).toBe("han simplificado");
      expect(result3).toBe("han simplifié");
    });

    it("should preserve script code case", async () => {
      mockLoadScriptNames.mockResolvedValue({
        Latn: "Latin",
        CYRL: "Cyrillic",
        hans: "Simplified Han",
      });

      const result1 = await getScriptName("Latn");
      const result2 = await getScriptName("CYRL");
      const result3 = await getScriptName("hans");

      expect(result1).toBe("Latin");
      expect(result2).toBe("Cyrillic");
      expect(result3).toBe("Simplified Han");
    });
  });

  describe("Error handling", () => {
    it("should throw for empty inputs", async () => {
      await expect(getCountryName("")).rejects.toThrow(
        "Country code is required",
      );
      await expect(getLanguageName("")).rejects.toThrow(
        "Language code is required",
      );
      await expect(getScriptName("")).rejects.toThrow(
        "Script code is required",
      );
    });

    it("should throw for null/undefined inputs", async () => {
      await expect(getCountryName(null as any)).rejects.toThrow(
        "Country code is required",
      );
      await expect(getLanguageName(undefined as any)).rejects.toThrow(
        "Language code is required",
      );
      await expect(getScriptName(null as any)).rejects.toThrow(
        "Script code is required",
      );
    });

    it("should throw for unknown codes", async () => {
      mockLoadTerritoryNames.mockResolvedValue({ US: "United States" });
      mockLoadLanguageNames.mockResolvedValue({ en: "English" });
      mockLoadScriptNames.mockResolvedValue({ Latn: "Latin" });

      await expect(getCountryName("XX")).rejects.toThrow(
        'Country code "XX" not found',
      );
      await expect(getLanguageName("xx")).rejects.toThrow(
        'Language code "xx" not found',
      );
      await expect(getScriptName("Xxxx")).rejects.toThrow(
        'Script code "Xxxx" not found',
      );
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle Chinese locale names", async () => {
      mockLoadLanguageNames.mockResolvedValue({
        en: "英语",
        es: "西班牙语",
        fr: "法语",
        de: "德语",
      });

      const result1 = await getLanguageName("en", "zh");
      const result2 = await getLanguageName("es", "zh");
      const result3 = await getLanguageName("fr", "zh");
      const result4 = await getLanguageName("de", "zh");

      expect(result1).toBe("英语");
      expect(result2).toBe("西班牙语");
      expect(result3).toBe("法语");
      expect(result4).toBe("德语");
    });

    it("should handle Arabic locale names", async () => {
      mockLoadTerritoryNames.mockResolvedValue({
        US: "الولايات المتحدة",
        GB: "المملكة المتحدة",
        FR: "فرنسا",
      });

      const result1 = await getCountryName("US", "ar");
      const result2 = await getCountryName("GB", "ar");
      const result3 = await getCountryName("FR", "ar");

      expect(result1).toBe("الولايات المتحدة");
      expect(result2).toBe("المملكة المتحدة");
      expect(result3).toBe("فرنسا");
    });

    it("should handle script variants", async () => {
      mockLoadScriptNames.mockResolvedValue({
        Hans: "Simplified Han",
        Hant: "Traditional Han",
        Latn: "Latin",
        Cyrl: "Cyrillic",
        Arab: "Arabic",
        Deva: "Devanagari",
      });

      const result1 = await getScriptName("Hans");
      const result2 = await getScriptName("Hant");
      const result3 = await getScriptName("Latn");
      const result4 = await getScriptName("Cyrl");
      const result5 = await getScriptName("Arab");
      const result6 = await getScriptName("Deva");

      expect(result1).toBe("Simplified Han");
      expect(result2).toBe("Traditional Han");
      expect(result3).toBe("Latin");
      expect(result4).toBe("Cyrillic");
      expect(result5).toBe("Arabic");
      expect(result6).toBe("Devanagari");
    });
  });
});
