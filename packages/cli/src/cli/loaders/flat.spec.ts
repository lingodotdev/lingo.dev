import { describe, expect, it } from "vitest";
import { flatten } from "flat";
import createFlatLoader, {
  buildDenormalizedKeysMap,
  denormalizeObjectKeys,
  mapDenormalizedKeys,
  normalizeObjectKeys,
  OBJECT_NUMERIC_KEY_PREFIX,
} from "./flat";

describe("flat loader", () => {
  describe("createFlatLoader", () => {
    it("loads numeric object and array and preserves state", async () => {
      const loader = createFlatLoader();
      loader.setDefaultLocale("en");
      await loader.pull("en", {
        messages: { "1": "foo", "2": "bar" },
        years: ["January 13, 2025", "February 14, 2025"],
      });
      await loader.pull("es", {}); // run again to ensure state is preserved
      const output = await loader.push("en", {
        "messages/1": "foo",
        "messages/2": "bar",
        "years/0": "January 13, 2025",
        "years/1": "February 14, 2025",
      });
      expect(output).toEqual({
        messages: { "1": "foo", "2": "bar" },
        years: ["January 13, 2025", "February 14, 2025"],
      });
    });

    it("handles date objects correctly", async () => {
      const loader = createFlatLoader();
      loader.setDefaultLocale("en");
      const date = new Date("2023-01-01T00:00:00Z");
      await loader.pull("en", {
        publishedAt: date,
        metadata: { createdAt: date },
      });
      const output = await loader.push("en", {
        publishedAt: date.toISOString(),
        "metadata/createdAt": date.toISOString(),
      });
      expect(output).toEqual({
        publishedAt: date.toISOString(),
        metadata: { createdAt: date.toISOString() },
      });
    });
  });

  describe("helper functions", () => {
    const inputObj = {
      messages: {
        "1": "a",
        "2": "b",
      },
    };
    const inputArray = {
      messages: ["a", "b", "c"],
    };

    describe("denormalizeObjectKeys", () => {
      it("should denormalize object keys", () => {
        const output = denormalizeObjectKeys(inputObj);
        expect(output).toEqual({
          messages: {
            [`${OBJECT_NUMERIC_KEY_PREFIX}1`]: "a",
            [`${OBJECT_NUMERIC_KEY_PREFIX}2`]: "b",
          },
        });
      });

      it("should preserve array", () => {
        const output = denormalizeObjectKeys(inputArray);
        expect(output).toEqual({
          messages: ["a", "b", "c"],
        });
      });

      it("should preserve date objects", () => {
        const date = new Date();
        const input = { createdAt: date };
        const output = denormalizeObjectKeys(input);
        expect(output).toEqual({ createdAt: date });
      });
    });

    describe("buildDenormalizedKeysMap", () => {
      it("should build normalized keys map", () => {
        const denormalized: Record<string, string> = flatten(
          denormalizeObjectKeys(inputObj),
          { delimiter: "/" },
        );
        const output = buildDenormalizedKeysMap(denormalized);
        expect(output).toEqual({
          "messages/1": `messages/${OBJECT_NUMERIC_KEY_PREFIX}1`,
          "messages/2": `messages/${OBJECT_NUMERIC_KEY_PREFIX}2`,
        });
      });

      it("should build keys map array", () => {
        const denormalized: Record<string, string> = flatten(
          denormalizeObjectKeys(inputArray),
          { delimiter: "/" },
        );
        const output = buildDenormalizedKeysMap(denormalized);
        expect(output).toEqual({
          "messages/0": "messages/0",
          "messages/1": "messages/1",
          "messages/2": "messages/2",
        });
      });
    });

    describe("normalizeObjectKeys", () => {
      it("should normalize denormalized object keys", () => {
        const output = normalizeObjectKeys(denormalizeObjectKeys(inputObj));
        expect(output).toEqual(inputObj);
      });

      it("should process array keys", () => {
        const output = normalizeObjectKeys(denormalizeObjectKeys(inputArray));
        expect(output).toEqual(inputArray);
      });

      it("should preserve date objects", () => {
        const date = new Date();
        const input = { createdAt: date };
        const output = normalizeObjectKeys(input);
        expect(output).toEqual({ createdAt: date });
      });
    });

    describe("mapDeormalizedKeys", () => {
      it("should map normalized keys", () => {
        const denormalized: Record<string, string> = flatten(
          denormalizeObjectKeys(inputObj),
          { delimiter: "/" },
        );
        const keyMap = buildDenormalizedKeysMap(denormalized);
        const flattened: Record<string, string> = flatten(inputObj, {
          delimiter: "/",
        });
        const mapped = mapDenormalizedKeys(flattened, keyMap);
        expect(mapped).toEqual(denormalized);
      });

      it("should map array", () => {
        const denormalized: Record<string, string> = flatten(
          denormalizeObjectKeys(inputArray),
          { delimiter: "/" },
        );
        const keyMap = buildDenormalizedKeysMap(denormalized);
        const flattened: Record<string, string> = flatten(inputArray, {
          delimiter: "/",
        });
        const mapped = mapDenormalizedKeys(flattened, keyMap);
        expect(mapped).toEqual(denormalized);
      });
    });
  });
});
