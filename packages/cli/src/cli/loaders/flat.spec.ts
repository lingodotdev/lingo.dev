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

  describe("pullHints", () => {
    it("should flatten comments from nested structure", async () => {
      const loader = createFlatLoader();
      loader.setDefaultLocale("en");

      const input = {
        key1: { hint: "This is a comment for key1" },
        key2: { hint: "This is a comment for key2" },
        key3: { hint: "This is a comment for key3" },
        key4: { hint: "This is a block comment for key4" },
        key5: { hint: "This is a comment for key5" },
        key6: {
          hint: "This is a comment for key6",
          key7: { hint: "This is a comment for key7" },
        },
      };

      const comments = await loader.pullHints(input);

      expect(comments).toEqual({
        key1: ["This is a comment for key1"],
        key2: ["This is a comment for key2"],
        key3: ["This is a comment for key3"],
        key4: ["This is a block comment for key4"],
        key5: ["This is a comment for key5"],
        "key6/key7": [
          "This is a comment for key6",
          "This is a comment for key7",
        ],
      });
    });

    it("should handle empty input", async () => {
      const loader = createFlatLoader();
      loader.setDefaultLocale("en");

      const comments = await loader.pullHints({});
      expect(comments).toEqual({});
    });

    it("should handle null/undefined input", async () => {
      const loader = createFlatLoader();
      loader.setDefaultLocale("en");

      const comments1 = await loader.pullHints(null as any);
      expect(comments1).toEqual({});

      const comments2 = await loader.pullHints(undefined as any);
      expect(comments2).toEqual({});
    });

    it("should handle deeply nested structure", async () => {
      const loader = createFlatLoader();
      loader.setDefaultLocale("en");

      const input = {
        level1: {
          hint: "Level 1 hint",
          level2: {
            hint: "Level 2 hint",
            level3: {
              hint: "Level 3 hint",
            },
          },
        },
      };

      const comments = await loader.pullHints(input);

      expect(comments).toEqual({
        "level1/level2/level3": [
          "Level 1 hint",
          "Level 2 hint",
          "Level 3 hint",
        ],
      });
    });

    it("should handle objects without hints", async () => {
      const loader = createFlatLoader();
      loader.setDefaultLocale("en");

      const input = {
        key1: { hint: "Has hint" },
        key2: {
          key3: { hint: "Nested hint" },
        },
      };

      const comments = await loader.pullHints(input);

      expect(comments).toEqual({
        key1: ["Has hint"],
        "key2/key3": ["Nested hint"],
      });
    });

    it("should handle mixed structures", async () => {
      const loader = createFlatLoader();
      loader.setDefaultLocale("en");

      const input = {
        simple: { hint: "Simple hint" },
        parent: {
          hint: "Parent hint",
          child1: { hint: "Child 1 hint" },
          child2: {
            grandchild: { hint: "Grandchild hint" },
          },
        },
      };

      const comments = await loader.pullHints(input);

      expect(comments).toEqual({
        simple: ["Simple hint"],
        "parent/child1": ["Parent hint", "Child 1 hint"],
        "parent/child2/grandchild": ["Parent hint", "Grandchild hint"],
      });
    });
  });
});
