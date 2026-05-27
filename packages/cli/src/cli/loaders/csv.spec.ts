import { describe, expect, it } from "vitest";
import { parse } from "csv-parse/sync";
import createCsvLoader from "./csv";

// Helper to build CSV strings easily
function buildCsv(rows: string[][]): string {
  return rows.map((r) => r.join(",")).join("\n");
}

describe("csv loader", () => {
  const sampleCsv = buildCsv([
    ["id", "en", "es"],
    ["hello", "Hello", "Hola"],
    ["bye", "Bye", "Adiós"],
    ["unused", "", "Sin uso"],
  ]);

  it("pull should extract translation map for the requested locale and skip empty values", async () => {
    const loader = createCsvLoader();
    loader.setDefaultLocale("en");

    const enResult = await loader.pull("en", sampleCsv);
    expect(enResult).toEqual({ hello: "Hello", bye: "Bye" });

    const esResult = await loader.pull("es", sampleCsv);
    expect(esResult).toEqual({
      hello: "Hola",
      bye: "Adiós",
      unused: "Sin uso",
    });
  });

  it("push should update existing rows and append new keys for the same locale", async () => {
    const loader = createCsvLoader();
    loader.setDefaultLocale("en");
    await loader.pull("en", sampleCsv);

    const updatedCsv = await loader.push("en", {
      hello: "Hello edited",
      newKey: "New Message",
    });

    const parsed = parse(updatedCsv, { columns: true, skip_empty_lines: true });
    expect(parsed).toEqual([
      { id: "hello", en: "Hello edited", es: "Hola" },
      { id: "bye", en: "Bye", es: "Adiós" },
      { id: "unused", en: "", es: "Sin uso" },
      { id: "", en: "New Message", es: "" },
    ]);
  });

  it("push should add a new locale column when pushing for a different locale", async () => {
    const loader = createCsvLoader();
    loader.setDefaultLocale("en");
    await loader.pull("en", sampleCsv);

    const esCsv = await loader.push("es", {
      hello: "Hola",
      bye: "Adiós",
    });

    const parsed = parse(esCsv, { columns: true, skip_empty_lines: true });
    expect(parsed).toEqual([
      { id: "hello", en: "Hello", es: "Hola" },
      { id: "bye", en: "Bye", es: "Adiós" },
      { id: "unused", en: "", es: "Sin uso" },
    ]);
  });

  it("push should add a completely new locale column when it previously didn't exist", async () => {
    const loader = createCsvLoader();
    loader.setDefaultLocale("en");
    await loader.pull("en", sampleCsv); // sampleCsv only has en & es columns

    const frCsv = await loader.push("fr", {
      hello: "Bonjour",
      bye: "Au revoir",
    });

    const parsed = parse(frCsv, { columns: true, skip_empty_lines: true });
    // Expect new column 'fr' to exist alongside existing ones, with empty strings when no translation provided
    expect(parsed).toEqual([
      { id: "hello", en: "Hello", es: "Hola", fr: "Bonjour" },
      { id: "bye", en: "Bye", es: "Adiós", fr: "Au revoir" },
      { id: "unused", en: "", es: "Sin uso", fr: "" },
    ]);
  });

  it("should throw an error if the first pull is not for the default locale", async () => {
    const loader = createCsvLoader();
    loader.setDefaultLocale("en");

    await expect(loader.pull("es", sampleCsv)).rejects.toThrow(
      "The first pull must be for the default locale",
    );
  });

  describe("key column validation", () => {
    it("should throw a descriptive error when the key column has duplicate values", async () => {
      // Mirrors the Salesfloor bug: first column is categorical, not unique,
      // which previously caused silent row collapse.
      const dupeCsv = buildCsv([
        ["type", "en", "es"],
        ["code", "Hello", ""],
        ["code", "Bye", ""],
        ["menu", "Home", ""],
        ["menu", "Profile", ""],
      ]);

      const loader = createCsvLoader();
      loader.setDefaultLocale("en");

      await expect(loader.pull("en", dupeCsv)).rejects.toThrow(
        /CSV column "type" has duplicate values/,
      );
    });

    it("should not throw when the detected key column is unique", async () => {
      const loader = createCsvLoader();
      loader.setDefaultLocale("en");

      // sampleCsv has unique `id` values — this should just work.
      await expect(loader.pull("en", sampleCsv)).resolves.toBeDefined();
    });

    it("should use the `keyColumn` option instead of the first column", async () => {
      // First column `type` is repeated; `id` is unique.
      // With keyColumn: "id", the loader must use `id` and not fail on `type` dupes.
      const csv = buildCsv([
        ["type", "id", "en", "es"],
        ["code", "hello", "Hello", ""],
        ["code", "bye", "Bye", ""],
        ["menu", "home", "Home", ""],
      ]);

      const loader = createCsvLoader({ keyColumn: "id" });
      loader.setDefaultLocale("en");

      const result = await loader.pull("en", csv);
      expect(result).toEqual({ hello: "Hello", bye: "Bye", home: "Home" });
    });

    it("should throw when `keyColumn` points to a column not in the CSV", async () => {
      const loader = createCsvLoader({ keyColumn: "nonexistent" });
      loader.setDefaultLocale("en");

      await expect(loader.pull("en", sampleCsv)).rejects.toThrow(
        /CSV key column "nonexistent" is not present/,
      );
    });

    it("should still throw on duplicates when `keyColumn` points at a non-unique column", async () => {
      const csv = buildCsv([
        ["id", "group", "en"],
        ["1", "menu", "Hello"],
        ["2", "menu", "Bye"],
      ]);

      const loader = createCsvLoader({ keyColumn: "group" });
      loader.setDefaultLocale("en");

      await expect(loader.pull("en", csv)).rejects.toThrow(
        /CSV column "group" has duplicate values/,
      );
    });

    it("should correctly push translations when `keyColumn` is not the first column", async () => {
      // Metadata columns (`type`, `group`) come first; `id` is the key in the middle.
      // Verifies that push matches translations by id (not row index) and preserves
      // non-key columns through the round-trip.
      const csv = buildCsv([
        ["type", "group", "id", "en"],
        ["code", "ui", "hello", "Hello"],
        ["code", "ui", "bye", "Bye"],
        ["menu", "nav", "home", "Home"],
      ]);

      const loader = createCsvLoader({ keyColumn: "id" });
      loader.setDefaultLocale("en");
      await loader.pull("en", csv);

      const esCsv = await loader.push("es", {
        hello: "Hola",
        bye: "Adiós",
        home: "Inicio",
      });

      const parsed = parse(esCsv, {
        columns: true,
        skip_empty_lines: true,
      });
      expect(parsed).toEqual([
        { type: "code", group: "ui", id: "hello", en: "Hello", es: "Hola" },
        { type: "code", group: "ui", id: "bye", en: "Bye", es: "Adiós" },
        { type: "menu", group: "nav", id: "home", en: "Home", es: "Inicio" },
      ]);
    });
  });
});
