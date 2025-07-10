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

    it("should remove locked keys with wildcard from the data", async () => {
      const loader = createLockedKeysLoader(["settings/*/locked"]);
      loader.setDefaultLocale(locale);
      const data = {
        "common.title": "Title",
        "settings/default/locked": "Foo",
        "settings/default/notifications": "Enabled",
        "settings/global/locked": "Bar",
        "settings/global/notifications": "Disabled",
        "settings/user/locked": "Baz",
        "settings/user/notifications": "Enabled",
      };

      const result = await loader.pull(locale, data);

      expect(result).toEqual({
        "common.title": "Title",
        "settings/default/notifications": "Enabled",
        "settings/global/notifications": "Disabled",
        "settings/user/notifications": "Enabled",
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
      const loader = createLockedKeysLoader(lockedKeys);
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

    it("should merge new data with original, preserving wildcard locked keys from original", async () => {
      const loader = createLockedKeysLoader(["settings/*/locked"]);
      loader.setDefaultLocale(locale);

      const originalInputWithWildcardKeys = {
        "common.title": "Some Title",
        "settings/default/locked": "Foo",
        "settings/default/notifications": "Enabled",
        "settings/global/locked": "Bar",
        "settings/global/notifications": "Disabled",
        "settings/user/locked": "Baz",
        "settings/user/notifications": "Enabled",
      };
      await loader.pull(locale, originalInputWithWildcardKeys);
      const data = {
        "common.title": "Better Title",
        "settings/default/notifications": "Maybe",
        "settings/global/notifications": "Perhaps",
        "settings/user/notifications": "Unknown",
      };

      const result = await loader.push(locale, data);

      expect(result).toEqual({
        "common.title": "Better Title",
        "settings/default/locked": "Foo",
        "settings/default/notifications": "Maybe",
        "settings/global/locked": "Bar",
        "settings/global/notifications": "Perhaps",
        "settings/user/locked": "Baz",
        "settings/user/notifications": "Unknown",
      });
    });

    it("should handle undefined original input", async () => {
      const loader = createLockedKeysLoader(lockedKeys);
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
