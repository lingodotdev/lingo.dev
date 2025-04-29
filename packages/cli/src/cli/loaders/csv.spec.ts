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
});
