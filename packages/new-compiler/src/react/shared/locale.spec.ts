import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  setLocale,
  getLocale,
  _registerLocaleHandlers,
  _unregisterLocaleHandlers,
} from "./locale";

describe("locale utilities", () => {
  beforeEach(() => {
    // Clean up before each test
    _unregisterLocaleHandlers();
  });

  describe("setLocale", () => {
    it("should throw if called before LingoProvider mounts", () => {
      expect(() => setLocale("es")).toThrow(
        "setLocale was called before LingoProvider mounted",
      );
    });

    it("should call the registered setLocale handler", async () => {
      const mockSetLocale = vi.fn().mockResolvedValue(undefined);
      const mockGetLocale = vi.fn().mockReturnValue("en");

      _registerLocaleHandlers(mockGetLocale, mockSetLocale);

      await setLocale("es");

      expect(mockSetLocale).toHaveBeenCalledWith("es");
      expect(mockSetLocale).toHaveBeenCalledTimes(1);
    });
  });

  describe("getLocale", () => {
    it("should throw if called before LingoProvider mounts", () => {
      expect(() => getLocale()).toThrow(
        "getLocale was called before LingoProvider mounted",
      );
    });

    it("should return the current locale from the registered handler", () => {
      const mockSetLocale = vi.fn().mockResolvedValue(undefined);
      const mockGetLocale = vi.fn().mockReturnValue("de");

      _registerLocaleHandlers(mockGetLocale, mockSetLocale);

      const result = getLocale();

      expect(result).toBe("de");
      expect(mockGetLocale).toHaveBeenCalledTimes(1);
    });
  });

  describe("_unregisterLocaleHandlers", () => {
    it("should clear handlers so they throw again", async () => {
      const mockSetLocale = vi.fn().mockResolvedValue(undefined);
      const mockGetLocale = vi.fn().mockReturnValue("en");

      _registerLocaleHandlers(mockGetLocale, mockSetLocale);

      // Should work after registration
      expect(() => getLocale()).not.toThrow();

      _unregisterLocaleHandlers();

      // Should throw after unregistration
      expect(() => getLocale()).toThrow(
        "getLocale was called before LingoProvider mounted",
      );
      expect(() => setLocale("es")).toThrow(
        "setLocale was called before LingoProvider mounted",
      );
    });
  });
});
