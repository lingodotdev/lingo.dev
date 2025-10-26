import { describe, it, expect, vi } from "vitest";
import { getDictionary } from "./get-dictionary";

describe("get-dictionary", () => {
  const mockLoaderEn = vi.fn().mockResolvedValue(
    Promise.resolve({
      default: { hello: "Hello", goodbye: "Goodbye" },
      otherExport: "ignored",
    }),
  );
  const mockLoaderEs = vi.fn().mockResolvedValue(
    Promise.resolve({
      default: { hello: "Hola", goodbye: "Adiós" },
    }),
  );
  const loaders = {
    en: mockLoaderEn,
    es: mockLoaderEs,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDictionary", () => {
    it("should load dictionary for specific locale using correct async loader", async () => {
      const result = await getDictionary("es", loaders);
      expect(mockLoaderEs).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ hello: "Hola", goodbye: "Adiós" });
    });

    it("should fallback to first available loader when specific locale not found", async () => {
      const result = await getDictionary("fr", loaders);

      expect(mockLoaderEn).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ hello: "Hello", goodbye: "Goodbye" });
    });

    it("should throw error when no loaders are provided", async () => {
      expect(() => getDictionary("en", {})).toThrow(
        "No available dictionary loaders found",
      );
      expect(() => getDictionary("en")).toThrow(
        "No available dictionary loaders found",
      );
    });
  });
});
