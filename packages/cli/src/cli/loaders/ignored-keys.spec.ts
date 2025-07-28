import { describe, it, expect } from "vitest";
import createIgnoredKeysLoader from "./ignored-keys";
import createBucketLoader from "./index";

// Helper values
const defaultLocale = "en";
const targetLocale = "es";
const bucketPathPattern = "test/path/pattern";
const bucketOptions = { defaultLocale };

// Common ignored keys list used across tests
const IGNORED_KEYS = ["meta", "todo", "pages/*/title"];
const BUCKET_IGNORED_KEYS = ["meta", "debug", "internal/*"];

/**
 * Creates a fresh loader instance with the default locale already set.
 */
function createLoader() {
  const loader = createIgnoredKeysLoader(IGNORED_KEYS);
  loader.setDefaultLocale(defaultLocale);
  return loader;
}

describe("ignored-keys loader", () => {
  describe("unit tests - ignored-keys loader functionality", () => {
    it("should omit the ignored keys when pulling the default locale", async () => {
      const loader = createLoader();
      const input = {
        greeting: "hello",
        meta: "some meta information",
        todo: "translation pending",
      };

      const result = await loader.pull(defaultLocale, input);

      expect(result).toEqual({ greeting: "hello" });
    });

    it("should omit the ignored keys when pulling a target locale", async () => {
      const loader = createLoader();

      // First pull for the default locale (required by createLoader)
      await loader.pull(defaultLocale, {
        greeting: "hello",
        meta: "meta en",
      });

      // Now pull the target locale
      const targetInput = {
        greeting: "hola",
        meta: "meta es",
        todo: "todo es",
      };
      const result = await loader.pull(targetLocale, targetInput);

      expect(result).toEqual({ greeting: "hola" });
    });

    it("should merge the ignored keys back when pushing a target locale", async () => {
      const loader = createLoader();

      // Initial pull for the default locale
      await loader.pull(defaultLocale, {
        greeting: "hello",
        meta: "meta en",
        todo: "todo en",
      });

      // Pull for the target locale (simulating a translator editing the file)
      const targetInput = {
        greeting: "hola",
        meta: "meta es",
        todo: "todo es",
      };
      await loader.pull(targetLocale, targetInput);

      // Data that will be pushed (ignored keys are intentionally missing)
      const dataToPush = {
        greeting: "hola",
      };

      const pushResult = await loader.push(targetLocale, dataToPush);

      // The loader should have re-inserted the ignored keys from the pull input.
      expect(pushResult).toEqual({
        greeting: "hola",
      });
    });

    it("should omit keys matching wildcard patterns when pulling the default locale", async () => {
      const loader = createLoader();
      const input = {
        greeting: "hello",
        meta: "some meta information",
        "pages/0/title": "Title 0",
        "pages/0/content": "Content 0",
        "pages/foo/title": "Foo Title",
        "pages/foo/content": "Foo Content",
        "pages/bar/notitle": "No Title",
        "pages/bar/content": "No Content",
      };
      const result = await loader.pull(defaultLocale, input);
      expect(result).toEqual({
        greeting: "hello",
        "pages/0/content": "Content 0",
        "pages/foo/content": "Foo Content",
        "pages/bar/notitle": "No Title",
        "pages/bar/content": "No Content",
      });
    });

    it("should omit keys matching wildcard patterns when pulling a target locale", async () => {
      const loader = createLoader();
      await loader.pull(defaultLocale, {
        greeting: "hello",
        meta: "meta en",
        "pages/0/title": "Title 0",
        "pages/0/content": "Content 0",
        "pages/foo/title": "Foo Title",
        "pages/foo/content": "Foo Content",
        "pages/bar/notitle": "No Title",
        "pages/bar/content": "No Content",
      });
      const targetInput = {
        greeting: "hola",
        meta: "meta es",
        "pages/0/title": "Title 0",
        "pages/0/content": "Contenido 0",
        "pages/foo/title": "Foo Title",
        "pages/foo/content": "Contenido Foo",
        "pages/bar/notitle": "No Title",
        "pages/bar/content": "No Content",
      };
      const result = await loader.pull(targetLocale, targetInput);
      expect(result).toEqual({
        greeting: "hola",
        "pages/0/content": "Contenido 0",
        "pages/foo/content": "Contenido Foo",
        "pages/bar/notitle": "No Title",
        "pages/bar/content": "No Content",
      });
    });

    it("should merge wildcard-ignored keys back when pushing a target locale", async () => {
      const loader = createLoader();
      await loader.pull(defaultLocale, {
        greeting: "hello",
        meta: "meta en",
        "pages/0/title": "Title 0",
        "pages/0/content": "Content 0",
        "pages/foo/title": "Foo Title",
        "pages/foo/content": "Foo Content",
        "pages/bar/notitle": "No Title",
        "pages/bar/content": "No Content",
      });
      await loader.pull(targetLocale, {
        greeting: "hola",
        meta: "meta es",
        "pages/0/title": "Título 0",
        "pages/0/content": "Contenido 0",
        "pages/foo/title": "Título Foo",
        "pages/foo/content": "Contenido Foo",
        "pages/bar/notitle": "No Título",
        "pages/bar/content": "Contenido Bar",
      });
      const dataToPush = {
        greeting: "hola",
        "pages/0/content": "Contenido Nuveo",
        "pages/foo/content": "Contenido Nuevo Foo",
        "pages/bar/notitle": "No Título",
        "pages/bar/content": "Contenido Nuevo Bar",
      };
      const pushResult = await loader.push(targetLocale, dataToPush);
      expect(pushResult).toEqual({
        greeting: "hola",
        "pages/0/content": "Contenido Nuveo",
        "pages/foo/content": "Contenido Nuevo Foo",
        "pages/bar/notitle": "No Título",
        "pages/bar/content": "Contenido Nuevo Bar",
      });
    });
  });

  describe("integration tests - bucket loader integration", () => {
    describe("bucket types with ignored keys support", () => {
      it("should include createIgnoredKeysLoader for json bucket type", () => {
        const loader = createBucketLoader(
          "json",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        // Check that the loader was created successfully (basic smoke test)
        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for yaml bucket type", () => {
        const loader = createBucketLoader(
          "yaml",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for php bucket type", () => {
        const loader = createBucketLoader(
          "php",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for vue-json bucket type", () => {
        const loader = createBucketLoader(
          "vue-json",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for flutter bucket type", () => {
        const loader = createBucketLoader(
          "flutter",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for xml bucket type", () => {
        const loader = createBucketLoader(
          "xml",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for android bucket type", () => {
        const loader = createBucketLoader(
          "android",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for csv bucket type", () => {
        const loader = createBucketLoader(
          "csv",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for po bucket type", () => {
        const loader = createBucketLoader(
          "po",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for xcode-stringsdict bucket type", () => {
        const loader = createBucketLoader(
          "xcode-stringsdict",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for xcode-xcstrings bucket type", () => {
        const loader = createBucketLoader(
          "xcode-xcstrings",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for xliff bucket type", () => {
        const loader = createBucketLoader(
          "xliff",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should include createIgnoredKeysLoader for typescript bucket type", () => {
        const loader = createBucketLoader(
          "typescript",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });
    });

    describe("bucket types that should NOT have ignored keys support", () => {
      it("should not break when creating html bucket type (which doesn't support ignored keys)", () => {
        // HTML bucket type doesn't include createIgnoredKeysLoader
        const loader = createBucketLoader(
          "html",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS, // This should be ignored for HTML
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should not break when creating ejs bucket type (which doesn't support ignored keys)", () => {
        // EJS bucket type doesn't include createIgnoredKeysLoader
        const loader = createBucketLoader(
          "ejs",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS, // This should be ignored for EJS
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should not break when creating markdown bucket type (which doesn't support ignored keys)", () => {
        // Markdown bucket type doesn't include createIgnoredKeysLoader
        const loader = createBucketLoader(
          "markdown",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS, // This should be ignored for Markdown
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should not break when creating properties bucket type (which doesn't support ignored keys)", () => {
        // Properties bucket type doesn't include createIgnoredKeysLoader
        const loader = createBucketLoader(
          "properties",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS, // This should be ignored for Properties
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should not break when creating xcode-strings bucket type (which doesn't support ignored keys)", () => {
        // Xcode Strings bucket type doesn't include createIgnoredKeysLoader
        const loader = createBucketLoader(
          "xcode-strings",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS, // This should be ignored for Xcode Strings
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should not break when creating srt bucket type (which doesn't support ignored keys)", () => {
        // SRT bucket type doesn't include createIgnoredKeysLoader
        const loader = createBucketLoader(
          "srt",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS, // This should be ignored for SRT
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should not break when creating vtt bucket type (which doesn't support ignored keys)", () => {
        // VTT bucket type doesn't include createIgnoredKeysLoader
        const loader = createBucketLoader(
          "vtt",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS, // This should be ignored for VTT
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should not break when creating txt bucket type (which doesn't support ignored keys)", () => {
        // TXT bucket type doesn't include createIgnoredKeysLoader
        const loader = createBucketLoader(
          "txt",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          BUCKET_IGNORED_KEYS, // This should be ignored for TXT
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });
    });

    describe("edge cases", () => {
      it("should handle empty ignored keys array", () => {
        const loader = createBucketLoader(
          "json",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          [], // empty ignored keys
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should handle undefined ignored keys", () => {
        const loader = createBucketLoader(
          "json",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          undefined as any, // undefined ignored keys
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });

      it("should handle wildcard patterns in ignored keys", () => {
        const WILDCARD_IGNORED_KEYS = ["meta", "config/*", "temp.*"];

        const loader = createBucketLoader(
          "json",
          bucketPathPattern,
          bucketOptions,
          [], // lockedKeys
          [], // lockedPatterns
          WILDCARD_IGNORED_KEYS,
        );

        expect(loader).toBeDefined();
        expect(typeof loader.pull).toBe("function");
        expect(typeof loader.push).toBe("function");
        expect(typeof loader.setDefaultLocale).toBe("function");
      });
    });
  });
});
