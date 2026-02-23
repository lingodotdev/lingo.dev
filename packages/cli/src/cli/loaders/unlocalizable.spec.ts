import { describe, expect, it } from "vitest";
import createUnlocalizableLoader from "./unlocalizable";

describe("unlocalizable loader", () => {
  const data = {
    foo: "bar",
    num: 1,
    numStr: "1.0",
    empty: "",
    boolTrue: true,
    boolFalse: false,
    boolStr: "false",
    isoDate: "2025-02-21",
    isoDateTime: "2025-02-21T00:00:00.000Z",
    bar: "foo",
    url: "https://example.com",
    systemId: "Ab1cdefghijklmnopqrst2",
  };

  it("should remove unlocalizable keys on pull", async () => {
    const loader = createUnlocalizableLoader();
    loader.setDefaultLocale("en");
    const result = await loader.pull("en", data);

    expect(result).toEqual({
      foo: "bar",
      numStr: "1.0",
      boolStr: "false",
      bar: "foo",
    });
  });

  it("should handle unlocalizable keys on push", async () => {
    const pushData = {
      foo: "bar-es",
      bar: "foo-es",
      numStr: "2.0",
      boolStr: "true",
    };

    const loader = createUnlocalizableLoader();
    loader.setDefaultLocale("en");
    await loader.pull("en", data);
    const result = await loader.push("es", pushData);

    expect(result).toEqual({ ...data, ...pushData });
  });

  describe("localizableKeys bypass", () => {
    it("should keep a numeric string key if it is in localizableKeys", async () => {
      const loader = createUnlocalizableLoader(false, ["num"]);
      loader.setDefaultLocale("en");
      const result = await loader.pull("en", data);

      expect(result).toEqual({
        foo: "bar",
        num: 1,
        numStr: "1.0",
        boolStr: "false",
        bar: "foo",
      });
    });

    it("should keep multiple bypassed keys", async () => {
      const loader = createUnlocalizableLoader(false, ["num", "url"]);
      loader.setDefaultLocale("en");
      const result = await loader.pull("en", data);

      expect(result).toEqual({
        foo: "bar",
        num: 1,
        numStr: "1.0",
        boolStr: "false",
        bar: "foo",
        url: "https://example.com",
      });
    });

    it("should restore bypassed keys on push", async () => {
      const pushData = {
        foo: "bar-es",
        bar: "foo-es",
        num: 112,
        numStr: "2.0",
        boolStr: "true",
        url: "https://example.es",
      };

      const loader = createUnlocalizableLoader(false, ["num", "url"]);
      loader.setDefaultLocale("en");
      await loader.pull("en", data);
      const result = await loader.push("es", pushData);

      expect(result).toEqual({ ...data, ...pushData });
    });

    it("should support nested key paths", async () => {
      const nestedData = {
        foo: "bar",
        "config/count": 42,
        "config/url": "https://example.com",
      };

      const loader = createUnlocalizableLoader(false, ["config/count"]);
      loader.setDefaultLocale("en");
      const result = await loader.pull("en", nestedData);

      expect(result).toEqual({
        foo: "bar",
        "config/count": 42,
      });
    });

    it("should support prefix matching", async () => {
      const nestedData = {
        foo: "bar",
        "config/count": 42,
        "config/url": "https://example.com",
      };

      const loader = createUnlocalizableLoader(false, ["config"]);
      loader.setDefaultLocale("en");
      const result = await loader.pull("en", nestedData);

      expect(result).toEqual({
        foo: "bar",
        "config/count": 42,
        "config/url": "https://example.com",
      });
    });

    it("should support glob patterns", async () => {
      const nestedData = {
        foo: "bar",
        "config/count": 42,
        "settings/count": 100,
        "config/url": "https://example.com",
      };

      const loader = createUnlocalizableLoader(false, ["*/count"]);
      loader.setDefaultLocale("en");
      const result = await loader.pull("en", nestedData);

      expect(result).toEqual({
        foo: "bar",
        "config/count": 42,
        "settings/count": 100,
      });
    });
  });

  describe("return unlocalizable keys", () => {
    describe.each([true, false])("%s", (returnUnlocalizedKeys) => {
      it("should return unlocalizable keys on pull", async () => {
        const loader = createUnlocalizableLoader(returnUnlocalizedKeys);
        loader.setDefaultLocale("en");
        const result = await loader.pull("en", data);

        const extraUnlocalizableData = returnUnlocalizedKeys
          ? {
              unlocalizable: {
                num: 1,
                empty: "",
                boolTrue: true,
                boolFalse: false,
                isoDate: "2025-02-21",
                isoDateTime: "2025-02-21T00:00:00.000Z",
                url: "https://example.com",
                systemId: "Ab1cdefghijklmnopqrst2",
              },
            }
          : {};

        expect(result).toEqual({
          foo: "bar",
          numStr: "1.0",
          boolStr: "false",
          bar: "foo",
          ...extraUnlocalizableData,
        });
      });

      it("should not affect push", async () => {
        const pushData = {
          foo: "bar-es",
          bar: "foo-es",
          numStr: "2.0",
          boolStr: "true",
        };

        const loader = createUnlocalizableLoader(returnUnlocalizedKeys);
        loader.setDefaultLocale("en");
        await loader.pull("en", data);
        const result = await loader.push("es", pushData);

        const expectedData = { ...data, ...pushData };
        expect(result).toEqual(expectedData);
      });
    });
  });
});
