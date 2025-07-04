import { describe, expect, it, vi, afterEach } from "vitest";
import { LCPAPI } from "./api";
import _ = require("lodash");

describe("LCPAPI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("translate", () => {
    // very abstract test to make sure the translate function calls private functions of the class
    it("should chunk, translate and merge", async () => {
      const modelsMock = {};
      const chunkSpy = vi
        .spyOn(LCPAPI as any, "_chunkDictionary")
        .mockReturnValue([1, 2, 3]);
      const translateSpy = vi
        .spyOn(LCPAPI as any, "_translateChunk")
        .mockImplementation((_: any, param: number) => param * 10);
      const mergeSpy = vi
        .spyOn(LCPAPI as any, "_mergeDictionaries")
        .mockReturnValue(100);

      const result = await LCPAPI.translate(modelsMock, 0 as any, "en", "es");

      expect(chunkSpy).toHaveBeenCalledWith(0);
      expect(translateSpy).toHaveBeenCalledTimes(3);
      expect(translateSpy).toHaveBeenCalledWith(
        modelsMock,
        1,
        "en",
        "es",
        undefined,
      );
      expect(translateSpy).toHaveBeenCalledWith(
        modelsMock,
        2,
        "en",
        "es",
        undefined,
      );
      expect(translateSpy).toHaveBeenCalledWith(
        modelsMock,
        3,
        "en",
        "es",
        undefined,
      );
      expect(mergeSpy).toHaveBeenCalledWith([10, 20, 30]);
      expect(result).toEqual(100);
    });
  });

  describe("_chunkDictionary", () => {
    it("should split dictionary into chunks of maximum 100 entries", () => {
      const result = (LCPAPI as any)._chunkDictionary({
        $schema: "https://lcp.dev/schema/v1/dictionary.json",
        version: 0.1,
        locale: "en",
        files: {
          "test1.json": {
            entries: _.fromPairs(
              _.times(230, (i) => [`entry${i}`, `value${i}`]),
            ),
          },
          "test2.json": {
            entries: _.fromPairs(
              _.times(90, (i) => [`entry${i}`, `value${i}`]),
            ),
          },
          "test3.json": {
            entries: _.fromPairs(
              _.times(130, (i) => [`entry${i}`, `value${i}`]),
            ),
          },
        },
      });

      expect(result.length).toEqual(5);
      expect(Object.keys(result[0].files["test1.json"].entries).length).toEqual(
        100,
      );
      expect(Object.keys(result[1].files["test1.json"].entries).length).toEqual(
        100,
      );
      expect(Object.keys(result[2].files["test1.json"].entries).length).toEqual(
        30,
      );
      expect(Object.keys(result[2].files["test2.json"].entries).length).toEqual(
        70,
      );
      expect(Object.keys(result[3].files["test2.json"].entries).length).toEqual(
        20,
      );
      expect(Object.keys(result[3].files["test3.json"].entries).length).toEqual(
        80,
      );
      expect(Object.keys(result[4].files["test3.json"].entries).length).toEqual(
        50,
      );
    });
  });

  describe("_mergeDictionaries", () => {
    it("should merge dictionaries into one", () => {
      const dictionaries = [
        {
          $schema: "https://lcp.dev/schema/v1/dictionary.json",
          version: 0.1,
          locale: "en",
          files: {
            "test1.json": {
              entries: _.fromPairs(
                _.times(10, (i) => [`a-entry${i}`, `value${i}`]),
              ),
            },
          },
        },
        {
          $schema: "https://lcp.dev/schema/v1/dictionary.json",
          version: 0.1,
          locale: "en",
          files: {
            "test1.json": {
              entries: _.fromPairs(
                _.times(10, (i) => [`b-entry${i}`, `value${i}`]),
              ),
            },
          },
        },
        {
          $schema: "https://lcp.dev/schema/v1/dictionary.json",
          version: 0.1,
          locale: "en",
          files: {
            "test1.json": {
              entries: _.fromPairs(
                _.times(5, (i) => [`c-entry${i}`, `value${i}`]),
              ),
            },
            "test2.json": {
              entries: _.fromPairs(
                _.times(5, (i) => [`a-entry${i}`, `value${i}`]),
              ),
            },
          },
        },
        {
          $schema: "https://lcp.dev/schema/v1/dictionary.json",
          version: 0.1,
          locale: "en",
          files: {
            "test2.json": {
              entries: _.fromPairs(
                _.times(3, (i) => [`b-entry${i}`, `value${i}`]),
              ),
            },
            "test3.json": {
              entries: _.fromPairs(
                _.times(7, (i) => [`a-entry${i}`, `value${i}`]),
              ),
            },
          },
        },
        {
          $schema: "https://lcp.dev/schema/v1/dictionary.json",
          version: 0.1,
          locale: "en",
          files: {
            "test3.json": {
              entries: _.fromPairs(
                _.times(6, (i) => [`b-entry${i}`, `value${i}`]),
              ),
            },
          },
        },
      ];

      const result = (LCPAPI as any)._mergeDictionaries(dictionaries);
      expect(Object.keys(result.files).length).toEqual(3);
      expect(Object.keys(result.files["test1.json"].entries).length).toEqual(
        25,
      );
      expect(Object.keys(result.files["test2.json"].entries).length).toEqual(8);
      expect(Object.keys(result.files["test3.json"].entries).length).toEqual(
        13,
      );
    });
  });
});
