import { describe, it, expect } from "vitest";
import createIgnoredKeysLoader from "./ignored-keys";

// Helper values
const defaultLocale = "en";
const targetLocale = "es";

// Common ignored keys list used across tests
const IGNORED_KEYS = ["meta", "todo", "pages/*/title"];

/**
 * Creates a fresh loader instance with the default locale already set.
 */
function createLoader() {
  const loader = createIgnoredKeysLoader(IGNORED_KEYS);
  loader.setDefaultLocale(defaultLocale);
  return loader;
}

describe("ignored-keys loader", () => {
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
