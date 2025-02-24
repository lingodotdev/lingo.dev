import { describe, expect, it } from "vitest";
import createUnlocalizableLoader from "./unlocalizable";

describe("unlocalizable loader", () => {
  const data = {
    foo: "bar",
    num: 1,
    empty: "",
    bool: true,
    isoDate: "2025-02-21",
    bar: "foo",
    url: "https://example.com",
    systemId: "Ab1cdefghijklmnopqrst2",
  };

  describe.each([true, false])("cache restoration '%s'", (cacheRestoration) => {
    it("should remove unlocalizable keys on pull", async () => {
      const loader = createUnlocalizableLoader(cacheRestoration);
      loader.setDefaultLocale("en");
      const result = await loader.pull("en", data);

      expect(result).toEqual({ foo: "bar", bar: "foo" });
    });

    it("should handle unlocalizable keys on push", async () => {
      const pushData = { foo: "bar-es", bar: "foo-es" };

      const loader = createUnlocalizableLoader(cacheRestoration);
      loader.setDefaultLocale("en");
      await loader.pull("en", data);
      const result = await loader.push("es", pushData);

      const expectedData = cacheRestoration ? { ...pushData } : { ...data, ...pushData };
      expect(result).toEqual(expectedData);
    });
  });
});
