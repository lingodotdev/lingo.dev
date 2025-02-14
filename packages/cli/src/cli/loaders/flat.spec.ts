import { describe, expect, it } from "vitest";
import { flatten, unflatten } from "flat";
import {
  buildNormalizedKeysMap,
  denormalizeObjectKeys,
  mapNormalizedKeys,
  normalizeObjectKeys,
  OBJECT_NUMERIC_KEY_PREFIX,
} from "./flat";

describe("flat loader helper functions", () => {
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
  });

  describe("buildNormalizedKeysMap", () => {
    it("should build normalized keys map", () => {
      const denormalized: Record<string, string> = flatten(denormalizeObjectKeys(inputObj), { delimiter: "/" });
      const output = buildNormalizedKeysMap(denormalized);
      expect(output).toEqual({
        "messages/1": `messages/${OBJECT_NUMERIC_KEY_PREFIX}1`,
        "messages/2": `messages/${OBJECT_NUMERIC_KEY_PREFIX}2`,
      });
    });

    it("should build keys map array", () => {
      const denormalized: Record<string, string> = flatten(denormalizeObjectKeys(inputArray), { delimiter: "/" });
      const output = buildNormalizedKeysMap(denormalized);
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
  });

  describe("mapNormalizedKeys", () => {
    it("should map normalized keys", () => {
      const denormalized: Record<string, string> = flatten(denormalizeObjectKeys(inputObj), { delimiter: "/" });
      const keyMap = buildNormalizedKeysMap(denormalized);
      const flattened: Record<string, string> = flatten(inputObj, { delimiter: "/" });
      const mapped = mapNormalizedKeys(flattened, keyMap);
      expect(mapped).toEqual(denormalized);
    });

    it("should map array", () => {
      const denormalized: Record<string, string> = flatten(denormalizeObjectKeys(inputArray), { delimiter: "/" });
      const keyMap = buildNormalizedKeysMap(denormalized);
      const flattened: Record<string, string> = flatten(inputArray, { delimiter: "/" });
      const mapped = mapNormalizedKeys(flattened, keyMap);
      expect(mapped).toEqual(denormalized);
    });
  });
});
