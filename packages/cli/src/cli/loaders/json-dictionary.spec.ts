import { forEach } from "lodash";
import createJsonKeysLoader from "./json-dictionary";
import { describe, it, expect } from "vitest";

describe("json-dictionary loader", () => {
  const input = {
    title: {
      en: "I am a title",
    },
    logoPosition: "right",
    pages: [
      {
        name: "Welcome to my world",
        elements: [
          {
            title: {
              en: "I am an element title",
            },
            description: {
              en: "I am an element description",
            },
          },
        ],
      },
    ],
  };

  it("should return nested object of only translatable keys on pull", async () => {
    const loader = createJsonKeysLoader();
    loader.setDefaultLocale("en");
    const pulled = await loader.pull("en", input);
    expect(pulled).toEqual({
      title: "I am a title",
      pages: [
        {
          elements: [
            {
              title: "I am an element title",
              description: "I am an element description",
            },
          ],
        },
      ],
    });
  });

  it("should add target locale keys only where source locale keys exist on push", async () => {
    const loader = createJsonKeysLoader();
    loader.setDefaultLocale("en");
    const pulled = await loader.pull("en", input);
    const output = await loader.push("es", {
      title: "Yo soy un titulo",
      logoPosition: "right",
      pages: [
        {
          name: "Welcome to my world",
          elements: [
            {
              title: "Yo soy un elemento de titulo",
              description: "Yo soy una descripcion de elemento",
            },
          ],
        },
      ],
    });
    expect(output).toEqual({
      title: { en: "I am a title", es: "Yo soy un titulo" },
      logoPosition: "right",
      pages: [
        {
          name: "Welcome to my world",
          elements: [
            {
              title: {
                en: "I am an element title",
                es: "Yo soy un elemento de titulo",
              },
              description: {
                en: "I am an element description",
                es: "Yo soy una descripcion de elemento",
              },
            },
          ],
        },
      ],
    });
  });

  it("should correctly order locale keys on push", async () => {
    const loader = createJsonKeysLoader();
    loader.setDefaultLocale("en");
    const pulled = await loader.pull("en", {
      data: {
        en: "foo1",
        es: "foo2",
        de: "foo3",
      },
    });
    const output = await loader.push("fr", { data: "foo4" });
    expect(Object.keys(output.data)).toEqual(["en", "de", "es", "fr"]);
  });

  it("should not add target locale keys to non-object values", async () => {
    const loader = createJsonKeysLoader();
    loader.setDefaultLocale("en");
    const data = { foo: 123, bar: true, baz: null };
    const pulled = await loader.pull("en", data);
    expect(pulled).toEqual({});
    const output = await loader.push("es", pulled);
    expect(output).toEqual({
      foo: 123,
      bar: true,
      baz: null,
    });
  });
});
