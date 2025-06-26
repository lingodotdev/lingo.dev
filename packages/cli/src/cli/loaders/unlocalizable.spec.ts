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
