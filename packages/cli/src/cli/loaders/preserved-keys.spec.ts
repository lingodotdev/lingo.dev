import { describe, it, expect } from "vitest";
import createPreservedKeysLoader from "./preserved-keys";

describe("preserved-keys loader", () => {
  describe("pull", () => {
    it("should remove preserved keys from data", async () => {
      const loader = createPreservedKeysLoader(["preservedKey"]);
      await loader.init();
      loader.setDefaultLocale("en");

      const result = await loader.pull("en", {
        normalKey: "normal value",
        preservedKey: "preserved value",
        anotherKey: "another value",
      });

      expect(result).toEqual({
        normalKey: "normal value",
        anotherKey: "another value",
      });
    });

    it("should handle wildcard patterns", async () => {
      const loader = createPreservedKeysLoader(["legal.*"]);
      await loader.init();
      loader.setDefaultLocale("en");

      const result = await loader.pull("en", {
        normalKey: "normal value",
        "legal.privacyUrl": "https://example.com/privacy",
        "legal.termsUrl": "https://example.com/terms",
        "support.email": "support@example.com",
      });

      expect(result).toEqual({
        normalKey: "normal value",
        "support.email": "support@example.com",
      });
    });

    it("should handle nested keys with wildcard patterns", async () => {
      const loader = createPreservedKeysLoader(["pages/*/title"]);
      await loader.init();
      loader.setDefaultLocale("en");

      const result = await loader.pull("en", {
        greeting: "hello",
        "pages/0/title": "Title 0",
        "pages/0/content": "Content 0",
        "pages/foo/title": "Foo Title",
        "pages/foo/content": "Foo Content",
        "pages/bar/notitle": "No Title",
        "pages/bar/content": "No Content",
      });

      expect(result).toEqual({
        greeting: "hello",
        "pages/0/content": "Content 0",
        "pages/foo/content": "Foo Content",
        "pages/bar/notitle": "No Title",
        "pages/bar/content": "No Content",
      });
    });

    it("should return all data when no preserved keys specified", async () => {
      const loader = createPreservedKeysLoader([]);
      await loader.init();
      loader.setDefaultLocale("en");

      const result = await loader.pull("en", {
        normalKey: "normal value",
        anotherKey: "another value",
      });

      expect(result).toEqual({
        normalKey: "normal value",
        anotherKey: "another value",
      });
    });
  });

  describe("push", () => {
    it("should add preserved keys from source when missing in target", async () => {
      const loader = createPreservedKeysLoader(["preservedKey"]);
      await loader.init();
      loader.setDefaultLocale("en");

      // Pull from source (sets originalInput)
      await loader.pull("en", {
        normalKey: "normal value",
        preservedKey: "source preserved value",
      });

      // Pull from target (target file does not have preservedKey)
      await loader.pull("es", {
        normalKey: "existing value",
      });

      // Push to target locale
      const result = await loader.push(
        "es",
        { normalKey: "valor normal" }, // translated data
      );

      expect(result).toEqual({
        normalKey: "valor normal",
        preservedKey: "source preserved value", // Added from source
      });
    });

    it("should keep existing target value for preserved keys", async () => {
      const loader = createPreservedKeysLoader(["preservedKey"]);
      await loader.init();
      loader.setDefaultLocale("en");

      // Pull from source (sets originalInput)
      await loader.pull("en", {
        normalKey: "normal value",
        preservedKey: "source preserved value",
      });

      // Pull from target (target file has customized preservedKey)
      await loader.pull("es", {
        normalKey: "existing value",
        preservedKey: "already customized value",
      });

      // Push to target locale
      const result = await loader.push(
        "es",
        { normalKey: "valor normal" }, // translated data
      );

      expect(result).toEqual({
        normalKey: "valor normal",
        preservedKey: "already customized value", // Kept from target
      });
    });

    it("should handle wildcard patterns for preserved keys", async () => {
      const loader = createPreservedKeysLoader(["legal.*"]);
      await loader.init();
      loader.setDefaultLocale("en");

      // Pull from source
      await loader.pull("en", {
        normalKey: "normal value",
        "legal.privacyUrl": "https://example.com/privacy",
        "legal.termsUrl": "https://example.com/terms",
      });

      // Pull from target (has one preserved key, missing another)
      await loader.pull("es", {
        normalKey: "existing",
        "legal.privacyUrl": "https://es.example.com/privacidad",
        // legal.termsUrl is missing
      });

      // Push to target locale
      const result = await loader.push("es", { normalKey: "valor normal" });

      expect(result).toEqual({
        normalKey: "valor normal",
        "legal.privacyUrl": "https://es.example.com/privacidad", // Kept from target
        "legal.termsUrl": "https://example.com/terms", // Added from source
      });
    });

    it("should handle nested keys with wildcard patterns for preserved keys", async () => {
      const loader = createPreservedKeysLoader(["pages/*/title"]);
      await loader.init();
      loader.setDefaultLocale("en");

      // Pull from source
      await loader.pull("en", {
        greeting: "hello",
        "pages/0/title": "Title 0",
        "pages/0/content": "Content 0",
        "pages/foo/title": "Foo Title",
        "pages/foo/content": "Foo Content",
      });

      // Pull from target (has one preserved key customized, another missing)
      await loader.pull("es", {
        greeting: "hola",
        "pages/0/title": "Título Personalizado 0",
        "pages/0/content": "Contenido 0",
        // pages/foo/title is missing
        "pages/foo/content": "Contenido Foo",
      });

      // Push to target locale
      const result = await loader.push("es", {
        greeting: "hola traducido",
        "pages/0/content": "Contenido Nuevo 0",
        "pages/foo/content": "Contenido Nuevo Foo",
      });

      expect(result).toEqual({
        greeting: "hola traducido",
        "pages/0/title": "Título Personalizado 0", // Kept from target
        "pages/0/content": "Contenido Nuevo 0",
        "pages/foo/title": "Foo Title", // Added from source (was missing)
        "pages/foo/content": "Contenido Nuevo Foo",
      });
    });

    it("should handle empty preserved keys array", async () => {
      const loader = createPreservedKeysLoader([]);
      await loader.init();
      loader.setDefaultLocale("en");

      await loader.pull("en", {
        normalKey: "normal value",
        anotherKey: "another value",
      });

      await loader.pull("es", {
        normalKey: "existing",
      });

      const result = await loader.push("es", {
        normalKey: "valor normal",
        anotherKey: "otro valor",
      });

      expect(result).toEqual({
        normalKey: "valor normal",
        anotherKey: "otro valor",
      });
    });
  });
});
