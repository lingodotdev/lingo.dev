import { describe, it, expect } from "vitest";
import createLockedKeysLoader from "./locked-keys";

describe("createLockedKeysLoader", () => {
  const lockedKeys = ["common.locked", "feature.settings"];
  const locale = "en";

  describe("pull", () => {
    it("should remove locked keys from the data", async () => {
      const loader = createLockedKeysLoader(lockedKeys);
      loader.setDefaultLocale(locale);
      const data = {
        "common.title": "Title",
        "common.locked.label": "Locked Label",
        "feature.settings.title": "Settings",
        "feature.enabled": true,
      };

      const result = await loader.pull(locale, data);

      expect(result).toEqual({
        "common.title": "Title",
        "feature.enabled": true,
      });
    });

    it("should return the same data if no keys are locked", async () => {
      const loader = createLockedKeysLoader([]);
      loader.setDefaultLocale(locale);
      const data = {
        "common.title": "Title",
        "feature.enabled": true,
      };

      const result = await loader.pull(locale, data);

      expect(result).toEqual(data);
    });

    it("should handle empty data object", async () => {
      const loader = createLockedKeysLoader(lockedKeys);
      loader.setDefaultLocale(locale);
      const data = {};

      const result = await loader.pull(locale, data);

      expect(result).toEqual({});
    });

    it("should not remove keys that partially match but do not start with a locked key", async () => {
      const loader = createLockedKeysLoader(["locked"]);
      loader.setDefaultLocale(locale);
      const data = {
        "locked.a": 1,
        "is.locked.b": 1,
        "notlocked.c": 1,
      };

      const result = await loader.pull("en", data);

      expect(result).toEqual({
        "is.locked.b": 1,
        "notlocked.c": 1,
      });
    });
  });

  describe("push", () => {
    const originalInput = {
      "common.title": "Original Title",
      "common.locked.label": "Original Locked Label",
      "feature.settings.title": "Original Settings",
      "feature.enabled": false,
    };

    it("should merge new data with original, preserving locked keys from original", async () => {
      const loader = createLockedKeysLoader(lockedKeys, false);
      loader.setDefaultLocale(locale);
      await loader.pull(locale, originalInput);
      const data = {
        "common.title": "New Title",
        "common.locked.label": "New Locked Label",
        "feature.enabled": true,
        "new.feature": "hello",
      };

      const result = await loader.push(locale, data);

      expect(result).toEqual({
        "common.title": "New Title",
        "common.locked.label": "Original Locked Label",
        "feature.settings.title": "Original Settings",
        "feature.enabled": true,
        "new.feature": "hello",
      });
    });

    it("should handle undefined original input", async () => {
      const loader = createLockedKeysLoader(lockedKeys, false);
      loader.setDefaultLocale(locale);
      await loader.pull(locale, undefined as any);
      const data = {
        "common.title": "New Title",
        "new.feature": "hello",
      };

      const result = await loader.push(locale, data);

      expect(result).toEqual({
        "common.title": "New Title",
        "new.feature": "hello",
      });
    });
  });
});
