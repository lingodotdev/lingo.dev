import { describe, it, expect } from "vitest";
import createIgnoredKeysLoader from "./ignored-keys";
import createTypescriptLoader from "./typescript";
import createFlatLoader from "./flat";
import { composeLoaders } from "./_utils";

describe("ignored keys with typescript loader", () => {
  it("should ignore keys in export default pattern", async () => {
    const ignoredKeys = ["title", "nested/title"];

    const loader = composeLoaders(
      createTypescriptLoader(),
      createFlatLoader(),
      createIgnoredKeysLoader(ignoredKeys),
    );

    loader.setDefaultLocale("en");

    const input = `export default {
  title: "Hello World",
  description: "This is a description",
  nested: {
    title: "Nested Title",
    content: "Nested content"
  }
};`;

    const pulled = await loader.pull("en", input);

    console.log("Pulled data:", pulled);

    // Should not contain any title keys (using flat loader's slash separator)
    expect(pulled).not.toHaveProperty("title");
    expect(pulled).not.toHaveProperty("nested/title");

    // Should contain other keys (using flat loader's slash separator)
    expect(pulled).toHaveProperty("description");
    expect(pulled).toHaveProperty("nested/content");
  });

  it("should ignore keys in export const pattern", async () => {
    const ignoredKeys = ["title", "nested/content"];

    const loader = composeLoaders(
      createTypescriptLoader(),
      createFlatLoader(),
      createIgnoredKeysLoader(ignoredKeys),
    );

    loader.setDefaultLocale("en");

    const input = `export const messages = {
  title: "Hello World",
  description: "This is a description",
  nested: {
    title: "Nested Title", 
    content: "Nested content"
  }
};`;

    const pulled = await loader.pull("en", input);

    console.log("Pulled data:", pulled);

    // Should not contain any title keys (using flat loader's slash separator)
    expect(pulled).not.toHaveProperty("title");
    expect(pulled).not.toHaveProperty("nested/content");

    // Should contain other keys (using flat loader's slash separator)
    expect(pulled).toHaveProperty("description");
    expect(pulled).toHaveProperty("nested/title");
  });
});
