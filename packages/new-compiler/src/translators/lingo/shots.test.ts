import { describe, it, expect } from "vitest";
import { getShots } from "./shots";

describe("getShots", () => {
  it("returns the Spanish example for Spanish targets", () => {
    for (const locale of ["es", "es-ES", "es-419", "es-MX"]) {
      const shots = getShots(locale);
      expect(shots).toHaveLength(1);
      expect(shots[0][1].locale).toBe("es");
    }
  });

  it("returns the Simplified Chinese example for Simplified targets", () => {
    for (const locale of ["zh-Hans", "zh-Hans-CN", "zh-CN", "zh-SG", "zh"]) {
      const shots = getShots(locale);
      expect(shots).toHaveLength(1);
      expect(shots[0][1].locale).toBe("zh-Hans");
    }
  });

  it("returns the Traditional Chinese example for Traditional targets", () => {
    for (const locale of ["zh-Hant", "zh-Hant-HK", "zh-TW", "zh-HK"]) {
      const shots = getShots(locale);
      expect(shots).toHaveLength(1);
      expect(shots[0][1].locale).toBe("zh-Hant");
    }
  });

  it("returns the matching example for other covered languages", () => {
    expect(getShots("ja")[0][1].locale).toBe("ja");
    expect(getShots("ko")[0][1].locale).toBe("ko");
    expect(getShots("fr-CA")[0][1].locale).toBe("fr");
    expect(getShots("pt_BR")[0][1].locale).toBe("pt");
  });

  it("returns no example for uncovered locales or the source language", () => {
    for (const locale of ["sw", "hu", "vi", "en", "en-US"]) {
      expect(getShots(locale)).toEqual([]);
    }
  });

  it("never returns an example whose language differs from the target", () => {
    for (const locale of ["zh-Hans", "zh-Hant", "ja", "ko", "fr", "de"]) {
      for (const [, output] of getShots(locale)) {
        expect(output.locale.split("-")[0]).toBe(locale.split("-")[0]);
      }
    }
  });

  it("keeps the English input and target output structurally aligned", () => {
    for (const [input, output] of getShots("zh-Hans")) {
      expect(input.locale).toBe("en");
      expect(Object.keys(output.entries)).toEqual(Object.keys(input.entries));
    }
  });
});
