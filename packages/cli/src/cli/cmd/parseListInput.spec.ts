import { describe, it, expect } from "vitest";
import { parseListInput } from "./init";

describe("parseListInput", () => {
  it("parses comma-separated values", () => {
    expect(parseListInput("es,fr")).toEqual(["es", "fr"]);
  });

  it("parses comma-separated values with whitespace", () => {
    expect(parseListInput("es, fr")).toEqual(["es", "fr"]);
  });

  it("parses space-separated values", () => {
    expect(parseListInput("es fr")).toEqual(["es", "fr"]);
  });

  it("parses single-quoted values", () => {
    expect(parseListInput("'es', 'fr'")).toEqual(["es", "fr"]);
  });

  it("parses double-quoted values", () => {
    expect(parseListInput('"es", "fr"')).toEqual(["es", "fr"]);
  });

  it("returns empty array for empty input", () => {
    expect(parseListInput("")).toEqual([]);
  });

  it("returns empty array for whitespace-only input", () => {
    expect(parseListInput("   ")).toEqual([]);
  });

  it("filters duplicate separators", () => {
    expect(parseListInput("es,,fr")).toEqual(["es", "fr"]);
  });

  it("parses outer-quoted comma-separated lists", () => {
    expect(parseListInput("'es,fr'")).toEqual(["es", "fr"]);
  });
});
