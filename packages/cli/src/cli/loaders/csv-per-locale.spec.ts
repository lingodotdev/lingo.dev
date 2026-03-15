import { describe, expect, it } from "vitest";
import createCsvPerLocaleLoader from "./csv-per-locale";

describe("csv-per-locale loader", () => {
  const sampleCsv = `id,name,description
35,Hello,Welcome
36,Bye,Farewell`;

  const sampleCsvWithDuplicates = `id,name,name,description
35,Hello,Hi,Welcome
36,Bye,Goodbye,Farewell`;

  it("pull should parse CSV to array of objects", async () => {
    const loader = createCsvPerLocaleLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", sampleCsv);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "35",
      name: "Hello",
      description: "Welcome",
    });
    expect(result[1]).toEqual({
      id: "36",
      name: "Bye",
      description: "Farewell",
    });
  });

  it("pull should handle duplicate headers by deduplicating", async () => {
    const loader = createCsvPerLocaleLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", sampleCsvWithDuplicates);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "35",
      name: "Hello",
      name__2: "Hi",
      description: "Welcome",
    });
    expect(result[1]).toEqual({
      id: "36",
      name: "Bye",
      name__2: "Goodbye",
      description: "Farewell",
    });
  });

  it("pull should return empty object for empty CSV", async () => {
    const loader = createCsvPerLocaleLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", "");
    expect(result).toEqual({});
  });

  it("push should serialize array back to CSV preserving original headers", async () => {
    const loader = createCsvPerLocaleLoader();
    loader.setDefaultLocale("en");
    const originalInput = sampleCsv;
    await loader.pull("en", originalInput);

    const data = [
      { id: "35", name: "Hello edited", description: "Welcome edited" },
      { id: "36", name: "Bye edited", description: "Farewell edited" },
    ];

    // @ts-expect-error - originalInput is used internally but not in public interface
    const csv = await loader.push("en", data, originalInput);

    expect(csv).toContain("id,name,description");
    expect(csv).toContain("35,Hello edited,Welcome edited");
    expect(csv).toContain("36,Bye edited,Farewell edited");
  });

  it("push should preserve all columns from original CSV including duplicates", async () => {
    const loader = createCsvPerLocaleLoader();
    loader.setDefaultLocale("en");
    const originalInput = sampleCsvWithDuplicates;
    await loader.pull("en", originalInput);

    const data = [
      { id: "35", name: "Hola", name__2: "Hola2", description: "Bienvenido" },
      { id: "36", name: "Adiós", name__2: "Adiós2", description: "Despedida" },
    ];

    // @ts-expect-error - originalInput is used internally but not in public interface
    const csv = await loader.push("en", data, originalInput);

    expect(csv).toContain("id,name,name,description");
    expect(csv).toContain("35,Hola,Hola2,Bienvenido");
    expect(csv).toContain("36,Adiós,Adiós2,Despedida");
  });

  it("push should handle object with numeric keys", async () => {
    const loader = createCsvPerLocaleLoader();
    loader.setDefaultLocale("en");
    const originalInput = sampleCsv;
    await loader.pull("en", originalInput);

    const data = {
      0: { id: "35", name: "Hola", description: "Bienvenido" },
      1: { id: "36", name: "Adiós", description: "Despedida" },
    };

    // @ts-expect-error - originalInput is used internally but not in public interface
    const csv = await loader.push("en", data, originalInput);

    expect(csv).toContain("id,name,description");
    expect(csv).toContain("35,Hola,Bienvenido");
    expect(csv).toContain("36,Adiós,Despedida");
  });
});