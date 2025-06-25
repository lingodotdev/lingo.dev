import { describe, expect, it } from "vitest";
import createUnlocalizableLoader from "./unlocalizable";

describe("unlocalizable loader", () => {
  const data = {
    foo: "bar",
    num: 1,
    numStr: "1.0",
    empty: "",
    bool: true,
    boolStr: "false",
    isoDate: "2025-02-21",
    isoDateTime: "2025-02-21T00:00:00.000Z",
    bar: "foo",
    url: "https://example.com",
    systemId: "Ab1cdefghijklmnopqrst2",
  };

  describe("cache restoration", () => {
    describe.each([true, false])("%s", (cacheRestoration) => {
      it("should remove unlocalizable keys on pull", async () => {
        const loader = createUnlocalizableLoader(cacheRestoration);
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
        const pushData = { foo: "bar-es", bar: "foo-es" };

        const loader = createUnlocalizableLoader(cacheRestoration);
        loader.setDefaultLocale("en");
        await loader.pull("en", data);
        const result = await loader.push("es", pushData);

        const expectedData = cacheRestoration
          ? { ...pushData }
          : { ...data, ...pushData };
        expect(result).toEqual(expectedData);
      });
    });
  });

  describe("return unlocalizable keys", () => {
    describe.each([true, false])("%s", (returnUnlocalizedKeys) => {
      it("should return unlocalizable keys on pull", async () => {
        const loader = createUnlocalizableLoader(false, returnUnlocalizedKeys);
        loader.setDefaultLocale("en");
        const result = await loader.pull("en", data);

        const extraUnlocalizableData = returnUnlocalizedKeys
          ? {
              unlocalizable: {
                num: 1,
                empty: "",
                bool: true,
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
        const pushData = { foo: "bar-es", bar: "foo-es" };

        const loader = createUnlocalizableLoader(false, returnUnlocalizedKeys);
        loader.setDefaultLocale("en");
        await loader.pull("en", data);
        const result = await loader.push("es", pushData);

        const expectedData = { ...data, ...pushData };
        expect(result).toEqual(expectedData);
      });
    });
  });
});
