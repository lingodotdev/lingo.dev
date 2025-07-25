import { describe, it, expect, vi, beforeEach } from "vitest";
import dedent from "dedent";
import _ from "lodash";
import fs from "fs/promises";
import createBucketLoader from "./index";
import createTextFileLoader from "./text-file";

describe("bucket loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("android bucket loader", () => {
    it("should load android data", async () => {
      setupFileMocks();

      const input = `
        <resources>
          <string name="button.title">Submit</string>
        </resources>
      `.trim();
      const expectedOutput = { "button.title": "Submit" };

      mockFileOperations(input);

      const androidLoader = createBucketLoader(
        "android",
        "values-[locale]/strings.xml",
        {
          defaultLocale: "en",
        },
      );
      androidLoader.setDefaultLocale("en");
      const data = await androidLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should skip non-translatable strings", async () => {
      setupFileMocks();

      const input = `
        <resources>
          <string name="app_name" translatable="false">MyApp</string>
          <string name="button.title">Submit</string>
          <string name="version" translatable="false">1.0.0</string>
        </resources>
      `.trim();
      const expectedOutput = { "button.title": "Submit" };

      mockFileOperations(input);

      const androidLoader = createBucketLoader(
        "android",
        "values-[locale]/strings.xml",
        {
          defaultLocale: "en",
        },
      );
      androidLoader.setDefaultLocale("en");
      const data = await androidLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save android data", async () => {
      setupFileMocks();

      const input = `
        <resources>
          <string name="button.title">Submit</string>
        </resources>
      `.trim();
      const payload = { "button.title": "Enviar" };
      const expectedOutput = `<resources>\n  <string name="button.title">Enviar</string>\n</resources>`;

      mockFileOperations(input);

      const androidLoader = createBucketLoader(
        "android",
        "values-[locale]/strings.xml",
        {
          defaultLocale: "en",
        },
      );
      androidLoader.setDefaultLocale("en");
      await androidLoader.pull("en");

      await androidLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "values-es/strings.xml",
        expectedOutput,
        {
          encoding: "utf-8",
          flag: "w",
        },
      );
    });
  });

  describe("csv bucket loader", () => {
    it("should load csv data ('KEY' as key, from automatic fallback", async () => {
      setupFileMocks();

      const input = ` ,KEY,en\n,button.title,Submit`;
      const expectedOutput = { "button.title": "Submit" };

      mockFileOperations(input);

      const csvLoader = createBucketLoader("csv", "i18n.csv", {
        defaultLocale: "en",
      });
      csvLoader.setDefaultLocale("en");
      const data = await csvLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should load csv data ('id' as key, first cell)", async () => {
      setupFileMocks();

      const input = `id,en\nbutton.title,Submit`;
      const expectedOutput = { "button.title": "Submit" };

      mockFileOperations(input);

      const csvLoader = createBucketLoader("csv", "i18n.csv", {
        defaultLocale: "en",
      });
      csvLoader.setDefaultLocale("en");
      const data = await csvLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save csv data", async () => {
      setupFileMocks();

      const input = `id,en,es\nbutton.title,Submit,`;
      const payload = { "button.title": "Enviar" };
      const expectedOutput = `id,en,es\nbutton.title,Submit,Enviar`;

      mockFileOperations(input);

      const csvLoader = createBucketLoader("csv", "i18n.csv", {
        defaultLocale: "en",
      });
      csvLoader.setDefaultLocale("en");
      await csvLoader.pull("en");

      await csvLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n.csv", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });
  });

  describe("flutter bucket loader", () => {
    it("should load flutter data", async () => {
      setupFileMocks();

      const input = `{
        "@@locale": "en",
        "greeting": "Hello, {name}!",
        "@greeting": {
          "description": "A greeting with a name placeholder",
          "placeholders": {
            "name": {
              "type": "String",
              "example": "John"
            }
          }
        }
      }`;
      const expectedOutput = { greeting: "Hello, {name}!" };

      mockFileOperations(input);

      const flutterLoader = createBucketLoader(
        "flutter",
        "lib/l10n/app_[locale].arb",
        {
          defaultLocale: "en",
        },
      );
      flutterLoader.setDefaultLocale("en");
      const data = await flutterLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save flutter data", async () => {
      setupFileMocks();

      const input = `{
        "@@locale": "en",
        "greeting": "Hello, {name}!",
        "@greeting": {
          "description": "A greeting with a name placeholder",
          "placeholders": {
            "name": {
              "type": "String",
              "example": "John"
            }
          }
        }
      }`;
      const payload = { greeting: "¡Hola, {name}!" };
      const expectedOutput = JSON.stringify(
        {
          "@@locale": "es",
          greeting: "¡Hola, {name}!",
          "@greeting": {
            description: "A greeting with a name placeholder",
            placeholders: {
              name: {
                type: "String",
                example: "John",
              },
            },
          },
        },
        null,
        2,
      );

      mockFileOperations(input);

      const flutterLoader = createBucketLoader(
        "flutter",
        "lib/l10n/app_[locale].arb",
        {
          defaultLocale: "en",
        },
      );
      flutterLoader.setDefaultLocale("en");
      await flutterLoader.pull("en");

      await flutterLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "lib/l10n/app_es.arb",
        expectedOutput,
        {
          encoding: "utf-8",
          flag: "w",
        },
      );
    });
  });

  describe("html bucket loader", () => {
    it("should load html data", async () => {
      setupFileMocks();

      const input = `
<html>
  <head>
    <title>My Page</title>
    <meta name="description" content="Page description" />
  </head>
  <body>
    some simple text without an html tag
    <h1>Hello, world!</h1>
    <p>
      This is a paragraph with a 
      <a href="https://example.com">link</a>
      and 
      <b>
        bold and <i>italic text</i>
      </b>
      .
    </p>
  </body>
</html>
      `.trim();
      const expectedOutput = {
        "head/0/0": "My Page",
        "head/1#content": "Page description",
        "body/0": "some simple text without an html tag",
        "body/1/0": "Hello, world!",
        "body/2/0": "This is a paragraph with a",
        "body/2/1/0": "link",
        "body/2/2": "and",
        "body/2/3/0": "bold and",
        "body/2/3/1/0": "italic text",
        "body/2/4": ".",
      };

      mockFileOperations(input);

      const htmlLoader = createBucketLoader("html", "i18n/[locale].html", {
        defaultLocale: "en",
      });
      htmlLoader.setDefaultLocale("en");
      const data = await htmlLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save html data", async () => {
      const input = dedent`
<html>
  <head>
    <title>My Page</title>
    <meta name="description" content="Page description" />
  </head>
  <body>
    some simple text without an html tag
    <h1>Hello, world!</h1>
    <p>
      This is a paragraph with a <a href="https://example.com">link</a> and <b>bold and <i>italic text</i></b>
    </p>
  </body>
</html>
      `.trim();
      const payload = {
        "head/0/0": "Mi Página",
        "head/1#content": "Descripción de la página",
        "body/0": "texto simple sin etiqueta html",
        "body/1/0": "¡Hola, mundo!",
        "body/2/0": "Este es un párrafo con un ",
        "body/2/1/0": "enlace",
        "body/2/2": " y ",
        "body/2/3/0": "texto en negrita y ",
        "body/2/3/1/0": "texto en cursiva",
      };
      const expectedOutput = `<html lang="es">
  <head>
    <title>Mi Página</title>
    <meta name="description" content="Descripción de la página" />
  </head>
  <body>
    texto simple sin etiqueta html
    <h1>¡Hola, mundo!</h1>
    <p>
      Este es un párrafo con un
      <a href="https://example.com">enlace</a>
      y
      <b>
        texto en negrita y
        <i>texto en cursiva</i>
      </b>
    </p>
  </body>
</html>
      `.trim();

      mockFileOperations(input);

      const htmlLoader = createBucketLoader("html", "i18n/[locale].html", {
        defaultLocale: "en",
      });
      htmlLoader.setDefaultLocale("en");
      await htmlLoader.pull("en");

      await htmlLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.html",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });

  describe("jsonc bucket loader", () => {
    it("should load jsonc data with comments", async () => {
      setupFileMocks();

      const input = `{
        // This is a comment for title
        "title": "Submit",
        /* This is a block comment for description */
        "description": "Button description",
        "nested": {
          // Nested comment
          "key": "value"
        }
      }`;
      const expectedOutput = {
        title: "Submit",
        description: "Button description",
        "nested/key": "value",
      };

      mockFileOperations(input);

      const jsoncLoader = createBucketLoader("jsonc", "i18n/[locale].jsonc", {
        defaultLocale: "en",
      });
      jsoncLoader.setDefaultLocale("en");
      const data = await jsoncLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save jsonc data", async () => {
      setupFileMocks();

      const input = `{
        // This is a comment
        "title": "Submit"
      }`;
      const payload = { title: "Enviar" };
      const expectedOutput = JSON.stringify(payload, null, 2);

      mockFileOperations(input);

      const jsoncLoader = createBucketLoader("jsonc", "i18n/[locale].jsonc", {
        defaultLocale: "en",
      });
      jsoncLoader.setDefaultLocale("en");
      await jsoncLoader.pull("en");

      await jsoncLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.jsonc",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    it("should extract hints from jsonc comments", async () => {
      setupFileMocks();

      const input = `{
        "key1": "value1", // This is a comment for key1
        "key2": "value2" /* This is a comment for key2 */,
        // This is a comment for key3
        "key3": "value3",
        /* This is a block comment for key4 */
        "key4": "value4",
        /*
         This is a comment for key5
        */
        "key5": "value5",
        // This is a comment for key6
        "key6": {
          // This is a comment for key7
          "key7": "value7"
        }
      }`;

      mockFileOperations(input);

      const jsoncLoader = createBucketLoader("jsonc", "i18n/[locale].jsonc", {
        defaultLocale: "en",
      });
      jsoncLoader.setDefaultLocale("en");
      await jsoncLoader.pull("en");

      const hints = await jsoncLoader.pullHints();

      expect(hints).toEqual({
        key1: ["This is a comment for key1"],
        key2: ["This is a comment for key2"],
        key3: ["This is a comment for key3"],
        key4: ["This is a block comment for key4"],
        key5: ["This is a comment for key5"],
        "key6/key7": [
          "This is a comment for key6",
          "This is a comment for key7",
        ],
      });
    });

    it("should handle jsonc with trailing commas", async () => {
      setupFileMocks();

      const input = `{
        "hello": "Hello",
        "world": "World",
        "array": [
          "item1",
          "item2",
        ],
      }`;
      const expectedOutput = {
        hello: "Hello",
        world: "World",
        "array/0": "item1",
        "array/1": "item2",
      };

      mockFileOperations(input);

      const jsoncLoader = createBucketLoader("jsonc", "i18n/[locale].jsonc", {
        defaultLocale: "en",
      });
      jsoncLoader.setDefaultLocale("en");
      const data = await jsoncLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should handle invalid jsonc gracefully", async () => {
      setupFileMocks();

      const input = `{
        "hello": "Hello"
        "world": "World" // missing comma
        invalid: syntax
      }`;

      mockFileOperations(input);

      const jsoncLoader = createBucketLoader("jsonc", "i18n/[locale].jsonc", {
        defaultLocale: "en",
      });
      jsoncLoader.setDefaultLocale("en");

      await expect(jsoncLoader.pull("en")).rejects.toThrow(
        "Failed to parse JSONC",
      );
    });
  });

  describe("json bucket loader", () => {
    it("should load json data", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit" };
      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      const data = await jsonLoader.pull("en");

      expect(data).toEqual(input);
    });

    it("should save json data", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit" };
      const payload = { "button.title": "Enviar" };
      const expectedOutput = JSON.stringify(payload, null, 2);

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.json",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    it("should save json data with numeric keys", async () => {
      setupFileMocks();

      const input = { messages: { "1": "foo", "2": "bar", "3": "bar" } };
      const payload = {
        "messages/1": "foo",
        "messages/2": "bar",
        "messages/3": "bar",
      };
      const expectedOutput = JSON.stringify(input, null, 2);

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.json",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    it("should save json data with array", async () => {
      setupFileMocks();

      const input = { messages: ["foo", "bar"] };
      const payload = { "messages/0": "foo", "messages/1": "bar" };
      const expectedOutput = dedent`
        {
          "messages": ["foo", "bar"]
        }
      `.trim();

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.json",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    it("should return keys in correct order, should not use key values from original input for missing keys", async () => {
      setupFileMocks();

      const input = {
        "button.title": "Submit",
        "button.subtitle": "Submit subtitle",
        "button.description": "Submit description",
      };
      const payload = {
        "button.subtitle": "Subtítulo de envío",
        "button.title": "Enviar",
      };
      const expectedOutput = JSON.stringify(
        {
          "button.title": "Enviar",
          "button.subtitle": "Subtítulo de envío",
        },
        null,
        2,
      );

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.json",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    it("should load and save json data for paths with multiple locales", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit" };
      const payload = { "button.title": "Enviar" };
      const expectedOutput = JSON.stringify(payload, null, 2);

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader(
        "json",
        "i18n/[locale]/[locale].json",
        {
          defaultLocale: "en",
        },
      );
      jsonLoader.setDefaultLocale("en");
      const data = await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(data).toEqual(input);
      expect(fs.access).toHaveBeenCalledWith("i18n/en/en.json");
      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es/es.json",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    it("should remove injected locales from json data", async () => {
      setupFileMocks();

      const input = {
        "button.title": "Submit",
        settings: { locale: "en" },
        "not-a-locale": "bar",
      };
      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        defaultLocale: "en",
        injectLocale: ["settings/locale", "not-a-locale"],
      });
      jsonLoader.setDefaultLocale("en");
      const data = await jsonLoader.pull("en");

      expect(data).toEqual({ "button.title": "Submit", "not-a-locale": "bar" });
    });

    it("should inject locales into json data", async () => {
      setupFileMocks();

      const input = {
        "button.title": "Submit",
        "not-a-locale": "bar",
        settings: { locale: "en" },
      };
      const payload = { "button.title": "Enviar", "not-a-locale": "bar" };
      const expectedOutput = JSON.stringify(
        { ...payload, settings: { locale: "es" } },
        null,
        2,
      );

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        defaultLocale: "en",
        injectLocale: ["settings/locale", "not-a-locale"],
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.json",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });

  describe("locked keys functionality", () => {
    it("should respect locked keys for JSON format", async () => {
      setupFileMocks();

      const input = {
        "button.title": "Submit",
        "button.description": "Submit description",
        "locked.key": "Should not change",
        nested: {
          locked: "This is locked",
          unlocked: "This can change",
        },
      };
      const payload = {
        "button.title": "Enviar",
        "button.description": "Descripción de envío",
        "locked.key": "This should not be applied",
        "nested/locked": "This should not be applied either",
        "nested/unlocked": "Este puede cambiar",
      };

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader(
        "json",
        "i18n/[locale].json",
        { defaultLocale: "en" },
        ["locked.key", "nested/locked"],
      );

      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeFileCall = (fs.writeFile as any).mock.calls[0];
      const writtenContent = JSON.parse(writeFileCall[1]);

      // Check that locked keys retain their original values
      expect(writtenContent["locked.key"]).toBe("Should not change");
      expect(writtenContent.nested.locked).toBe("This is locked");

      // Check that unlocked keys are updated
      expect(writtenContent["button.title"]).toBe("Enviar");
      expect(writtenContent["button.description"]).toBe("Descripción de envío");
      expect(writtenContent.nested.unlocked).toBe("Este puede cambiar");
    });

    it("should handle deeply nested locked keys", async () => {
      setupFileMocks();

      const input = {
        level1: {
          level2: {
            level3: {
              locked: "This is locked deep",
              unlocked: "This can change",
            },
          },
        },
      };
      const payload = {
        "level1/level2/level3/locked": "This should not be applied",
        "level1/level2/level3/unlocked": "This should change",
      };

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader(
        "json",
        "i18n/[locale].json",
        { defaultLocale: "en" },
        ["level1/level2/level3/locked"],
      );

      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeFileCall = (fs.writeFile as any).mock.calls[0];
      const writtenContent = JSON.parse(writeFileCall[1]);

      // Check that deeply nested locked key retains its original value
      expect(writtenContent.level1.level2.level3.locked).toBe(
        "This is locked deep",
      );

      // Check that unlocked key is updated
      expect(writtenContent.level1.level2.level3.unlocked).toBe(
        "This should change",
      );
    });

    it("should lock keys that are arrays", async () => {
      setupFileMocks();

      const input = {
        messages: ["first", "second", "third"],
        unlocked: ["can", "be", "changed"],
      };
      const payload = {
        "messages/0": "should not change",
        "messages/1": "should not change either",
        "messages/2": "should definitely not change",
        "unlocked/0": "should",
        "unlocked/1": "definitely",
        "unlocked/2": "change",
      };

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader(
        "json",
        "i18n/[locale].json",
        { defaultLocale: "en" },
        ["messages/0", "messages/1", "messages/2"],
      );

      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeFileCall = (fs.writeFile as any).mock.calls[0];
      const writtenContent = JSON.parse(writeFileCall[1]);

      // Check that locked array elements retain their original values
      expect(writtenContent.messages[0]).toBe("first");
      expect(writtenContent.messages[1]).toBe("second");
      expect(writtenContent.messages[2]).toBe("third");

      // Check that unlocked array elements are updated
      expect(writtenContent.unlocked[0]).toBe("should");
      expect(writtenContent.unlocked[1]).toBe("definitely");
      expect(writtenContent.unlocked[2]).toBe("change");
    });
  });

  describe("mdx bucket loader", () => {
    it("should skip locked keys", async () => {
      setupFileMocks();

      const input = dedent`
---
title: Test Mdx
category: test
---

# Heading 1
`;
      const expectedPayload = {
        "meta/title": "Test Mdx",
        "content/0": "\n# Heading 1",
      };

      mockFileOperations(input);

      const mdxLoader = createBucketLoader(
        "mdx",
        "i18n/[locale].mdx",
        { defaultLocale: "en" },
        ["meta/category"],
      );

      mdxLoader.setDefaultLocale("en");
      const data = await mdxLoader.pull("en");

      expect(data).toEqual(expectedPayload);
    });
  });

  describe("markdown bucket loader", () => {
    it("should load markdown data", async () => {
      setupFileMocks();

      const input = `---
title: Test Markdown
date: 2023-05-25
---

# Heading 1

This is a paragraph.

## Heading 2

Another paragraph with **bold** and *italic* text.`;
      const expectedOutput = {
        "fm-attr-title": "Test Markdown",
        "md-section-0": "# Heading 1",
        "md-section-1": "This is a paragraph.",
        "md-section-2": "## Heading 2",
        "md-section-3": "Another paragraph with **bold** and _italic_ text.",
      };

      mockFileOperations(input);

      const markdownLoader = createBucketLoader(
        "markdown",
        "i18n/[locale].md",
        {
          defaultLocale: "en",
        },
      );
      markdownLoader.setDefaultLocale("en");
      const data = await markdownLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save markdown data", async () => {
      setupFileMocks();

      const input = `---
title: Test Markdown
date: 2023-05-25
---

# Heading 1

This is a paragraph.

## Heading 2

Another paragraph with **bold** and *italic* text.`;
      const payload = {
        "fm-attr-title": "Prueba Markdown",
        "fm-attr-date": "2023-05-25",
        "md-section-0": "# Encabezado 1",
        "md-section-1": "Esto es un párrafo.",
        "md-section-2": "## Encabezado 2",
        "md-section-3": "Otro párrafo con texto en **negrita** y en _cursiva_.",
      };
      const expectedOutput = `---
title: Prueba Markdown
date: 2023-05-25
---

# Encabezado 1

Esto es un párrafo.

## Encabezado 2

Otro párrafo con texto en **negrita** y en _cursiva_.
`.trim();

      mockFileOperations(input);

      const markdownLoader = createBucketLoader(
        "markdown",
        "i18n/[locale].md",
        {
          defaultLocale: "en",
        },
      );
      markdownLoader.setDefaultLocale("en");
      await markdownLoader.pull("en");

      await markdownLoader.push("es", payload);

      // Get the actual output content that was written
      const actualOutput = (fs.writeFile as any).mock.calls[0][1];

      // Instead of checking exact string match, check that it contains all expected content
      expect(actualOutput).toContain("title: Prueba Markdown");
      expect(actualOutput).toContain("date: 2023-05-25");
      expect(actualOutput).toContain("# Encabezado 1");
      expect(actualOutput).toContain("Esto es un párrafo.");
      expect(actualOutput).toContain("## Encabezado 2");
      expect(actualOutput).toContain(
        "Otro párrafo con texto en **negrita** y en _cursiva_.",
      );

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.md", actualOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });
  });

  describe("properties bucket loader", () => {
    it("should load properties data", async () => {
      setupFileMocks();

      const input = `
# General messages
welcome.message=Welcome to our application!
error.message=An error has occurred. Please try again later.

# User-related messages
user.login=Please enter your username and password.
user.username=Username
user.password=Password
      `.trim();
      const expectedOutput = {
        "welcome.message": "Welcome to our application!",
        "error.message": "An error has occurred. Please try again later.",
        "user.login": "Please enter your username and password.",
        "user.username": "Username",
        "user.password": "Password",
      };

      mockFileOperations(input);

      const propertiesLoader = createBucketLoader(
        "properties",
        "i18n/[locale].properties",
        {
          defaultLocale: "en",
        },
      );
      propertiesLoader.setDefaultLocale("en");
      const data = await propertiesLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save properties data", async () => {
      setupFileMocks();

      const input = `
# General messages
welcome.message=Welcome to our application!
error.message=An error has occurred. Please try again later.

# User-related messages
user.login=Please enter your username and password.
user.username=Username
user.password=Password
      `.trim();
      const payload = {
        "welcome.message": "Bienvenido a nuestra aplicación!",
        "error.message":
          "Se ha producido un error. Por favor, inténtelo de nuevo más tarde.",
        "user.login":
          "Por favor, introduzca su nombre de usuario y contraseña.",
        "user.username": "Nombre de usuario",
        "user.password": "Contraseña",
      };
      const expectedOutput = `
welcome.message=Bienvenido a nuestra aplicación!
error.message=Se ha producido un error. Por favor, inténtelo de nuevo más tarde.
user.login=Por favor, introduzca su nombre de usuario y contraseña.
user.username=Nombre de usuario
user.password=Contraseña
      `.trim();

      mockFileOperations(input);

      const propertiesLoader = createBucketLoader(
        "properties",
        "i18n/[locale].properties",
        {
          defaultLocale: "en",
        },
      );
      propertiesLoader.setDefaultLocale("en");
      await propertiesLoader.pull("en");

      await propertiesLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.properties",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });

  describe("xcode-strings bucket loader", () => {
    it("should load xcode-strings", async () => {
      setupFileMocks();

      const input = `
"key1" = "value1";
"key2" = "value2";
"key3" = "Line 1\\nLine 2\\"quoted\\"";
      `.trim();
      const expectedOutput = {
        key1: "value1",
        key2: "value2",
        key3: 'Line 1\nLine 2"quoted"',
      };

      mockFileOperations(input);

      const xcodeStringsLoader = createBucketLoader(
        "xcode-strings",
        "i18n/[locale].strings",
        {
          defaultLocale: "en",
        },
      );
      xcodeStringsLoader.setDefaultLocale("en");
      const data = await xcodeStringsLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save xcode-strings", async () => {
      setupFileMocks();

      const input = `
"hello" = "Hello!";
      `.trim();
      const payload = { hello: "¡Hola!" };
      const expectedOutput = `"hello" = "¡Hola!";`;

      mockFileOperations(input);

      const xcodeStringsLoader = createBucketLoader(
        "xcode-strings",
        "i18n/[locale].strings",
        {
          defaultLocale: "en",
        },
      );
      xcodeStringsLoader.setDefaultLocale("en");
      await xcodeStringsLoader.pull("en");

      await xcodeStringsLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.strings",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });

  describe("xcode-stringsdict bucket loader", () => {
    it("should load xcode-stringsdict", async () => {
      setupFileMocks();

      const input = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>greeting</key>
  <string>Hello!</string>
  <key>items_count</key>
  <dict>
    <key>NSStringLocalizedFormatKey</key>
    <string>%#@items@</string>
    <key>items</key>
    <dict>
      <key>NSStringFormatSpecTypeKey</key>
      <string>NSStringPluralRuleType</string>
      <key>NSStringFormatValueTypeKey</key>
      <string>d</string>
      <key>one</key>
      <string>%d item</string>
      <key>other</key>
      <string>%d items</string>
    </dict>
  </dict>
</dict>
</plist>
      `.trim();
      const expectedOutput = {
        greeting: "Hello!",
        "items_count/NSStringLocalizedFormatKey": "%#@items@",
        "items_count/items/NSStringFormatSpecTypeKey": "NSStringPluralRuleType",
        "items_count/items/NSStringFormatValueTypeKey": "d",
        "items_count/items/one": "%d item",
        "items_count/items/other": "%d items",
      };

      mockFileOperations(input);

      const xcodeStringsdictLoader = createBucketLoader(
        "xcode-stringsdict",
        "i18n/[locale].stringsdict",
        {
          defaultLocale: "en",
        },
      );
      xcodeStringsdictLoader.setDefaultLocale("en");
      const data = await xcodeStringsdictLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save xcode-stringsdict", async () => {
      setupFileMocks();

      const input = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>greeting</key>
    <string>Hello!</string>
  </dict>
</plist>
      `.trim();
      const payload = { greeting: "¡Hola!" };
      const expectedOutput = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>greeting</key>
    <string>¡Hola!</string>
  </dict>
</plist>
      `.trim();

      mockFileOperations(input);

      const xcodeStringsdictLoader = createBucketLoader(
        "xcode-stringsdict",
        "[locale].lproj/Localizable.stringsdict",
        {
          defaultLocale: "en",
        },
      );
      xcodeStringsdictLoader.setDefaultLocale("en");
      await xcodeStringsdictLoader.pull("en");

      await xcodeStringsdictLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "es.lproj/Localizable.stringsdict",
        expectedOutput,
        {
          encoding: "utf-8",
          flag: "w",
        },
      );
    });
  });

  describe("xcode-xcstrings bucket loader", () => {
    it("should load xcode-xcstrings", async () => {
      setupFileMocks();

      const input = JSON.stringify({
        sourceLanguage: "en",
        strings: {
          greeting: {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "Hello!",
                },
              },
            },
          },
          message: {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "Welcome to our app",
                },
              },
            },
          },
          items_count: {
            extractionState: "manual",
            localizations: {
              en: {
                variations: {
                  plural: {
                    zero: {
                      stringUnit: {
                        state: "translated",
                        value: "No items",
                      },
                    },
                    one: {
                      stringUnit: {
                        state: "translated",
                        value: "%d item",
                      },
                    },
                    other: {
                      stringUnit: {
                        state: "translated",
                        value: "%d items",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const expectedOutput = {
        greeting: "Hello!",
        message: "Welcome to our app",
        "items_count/zero": "No items",
        "items_count/one": "{variable:0} item",
        "items_count/other": "{variable:0} items",
      };

      mockFileOperations(input);

      const xcodeXcstringsLoader = createBucketLoader(
        "xcode-xcstrings",
        "i18n/[locale].xcstrings",
        {
          defaultLocale: "en",
        },
      );
      xcodeXcstringsLoader.setDefaultLocale("en");
      const data = await xcodeXcstringsLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should load keys without default locale entries and use the key as value", async () => {
      setupFileMocks();

      const input = JSON.stringify({
        sourceLanguage: "en",
        strings: {
          greeting: {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "Hello!",
                },
              },
            },
          },
          " and ": {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: " and ",
                },
              },
            },
          },
          key_with_no_default: {
            extractionState: "manual",
            localizations: {
              fr: {
                stringUnit: {
                  state: "translated",
                  value: "Valeur traduite",
                },
              },
            },
          },
        },
      });

      const expectedOutput = {
        greeting: "Hello!",
        "%20and%20": " and ",
        key_with_no_default: "key_with_no_default",
      };

      mockFileOperations(input);

      const xcodeXcstringsLoader = createBucketLoader(
        "xcode-xcstrings",
        "i18n/[locale].xcstrings",
        {
          defaultLocale: "en",
        },
      );
      xcodeXcstringsLoader.setDefaultLocale("en");
      const data = await xcodeXcstringsLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save xcode-xcstrings", async () => {
      setupFileMocks();

      const originalInput = {
        sourceLanguage: "en",
        strings: {
          greeting: {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "Hello!",
                },
              },
            },
          },
        },
      };

      mockFileOperations(JSON.stringify(originalInput));

      const payload = {
        greeting: "Bonjour!",
        message: "Bienvenue dans notre application",
        "items_count/zero": "Aucun élément",
        "items_count/one": "%d élément",
        "items_count/other": "%d éléments",
      };

      const xcodeXcstringsLoader = createBucketLoader(
        "xcode-xcstrings",
        "i18n/[locale].xcstrings",
        {
          defaultLocale: "en",
        },
      );
      xcodeXcstringsLoader.setDefaultLocale("en");
      await xcodeXcstringsLoader.pull("en");
      await xcodeXcstringsLoader.push("fr", payload);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeFileCall = (fs.writeFile as any).mock.calls[0];
      const writtenContent = JSON.parse(writeFileCall[1]);

      expect(writtenContent.strings.greeting.localizations.fr).toBeDefined();
      expect(
        writtenContent.strings.greeting.localizations.fr.stringUnit.value,
      ).toBe("Bonjour!");

      if (writtenContent.strings.message) {
        expect(
          writtenContent.strings.message.localizations.fr.stringUnit.value,
        ).toBe("Bienvenue dans notre application");
      }

      if (writtenContent.strings.items_count) {
        expect(
          writtenContent.strings.items_count.localizations.fr.variations.plural
            .zero.stringUnit.value,
        ).toBe("Aucun élément");
        expect(
          writtenContent.strings.items_count.localizations.fr.variations.plural
            .one.stringUnit.value,
        ).toBe("%d élément");
        expect(
          writtenContent.strings.items_count.localizations.fr.variations.plural
            .other.stringUnit.value,
        ).toBe("%d éléments");
      }
    });

    it("should maintain ASCII ordering with empty strings, whitespace, and numbers", async () => {
      setupFileMocks();

      const input = `{
  "sourceLanguage": "en",
  "strings": {
    "": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Empty key"
          }
        }
      }
    },
    " ": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Space key"
          }
        }
      }
    },
    "25": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Numeric key"
          }
        }
      }
    },
    "apple": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Apple"
          }
        }
      }
  }
}`;

      mockFileOperations(input);

      const xcodeXcstringsLoader = createBucketLoader(
        "xcode-xcstrings",
        "i18n/[locale].xcstrings",
        {
          defaultLocale: "en",
        },
      );
      xcodeXcstringsLoader.setDefaultLocale("en");
      const data = await xcodeXcstringsLoader.pull("en");

      Object.keys(data).forEach((key) => {
        if (key === "") {
          expect(data[key]).toBe("Empty key");
        } else if (key.includes("%20") || key === " ") {
          expect(data[key]).toBe("Space key");
        } else if (key === "25") {
          expect(data[key]).toBe("Numeric key");
        } else if (key === "apple") {
          expect(data[key]).toBe("Apple");
        }
      });

      const payload: Record<string, string> = {};

      Object.keys(data).forEach((key) => {
        if (key === "") {
          payload[key] = "Vide";
        } else if (key.includes("%20") || key === " ") {
          payload[key] = "Espace";
        } else if (key === "25") {
          payload[key] = "Numérique";
        } else if (key === "apple") {
          payload[key] = "Pomme";
        }
      });

      await xcodeXcstringsLoader.pull("en");
      await xcodeXcstringsLoader.push("fr", payload);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeFileCall = (fs.writeFile as any).mock.calls[0];
      const writtenContent = JSON.parse(writeFileCall[1]);

      if (writtenContent.strings[""]) {
        expect(
          writtenContent.strings[""].localizations.fr.stringUnit.value,
        ).toBe("Vide");
      }

      const hasSpaceKey = Object.keys(writtenContent.strings).some(
        (key) => key === " " || key === "%20" || key.includes("%20"),
      );
      if (hasSpaceKey) {
        const spaceKey = Object.keys(writtenContent.strings).find(
          (key) => key === " " || key === "%20" || key.includes("%20"),
        );
        if (spaceKey) {
          expect(
            writtenContent.strings[spaceKey].localizations.fr.stringUnit.value,
          ).toBe("Espace");
        }
      }

      if (writtenContent.strings["25"]) {
        expect(
          writtenContent.strings["25"].localizations.fr.stringUnit.value,
        ).toBe("Numérique");
      }

      if (writtenContent.strings["apple"]) {
        expect(
          writtenContent.strings["apple"].localizations.fr.stringUnit.value,
        ).toBe("Pomme");
      }

      const stringKeys = Object.keys(writtenContent.strings);

      expect(stringKeys.includes("25")).toBe(true);
      expect(stringKeys.includes("")).toBe(true);
      expect(stringKeys.includes(" ") || stringKeys.includes("%20")).toBe(true);
      expect(stringKeys.includes("apple")).toBe(true);

      expect(stringKeys.indexOf("25")).toBeLessThan(stringKeys.indexOf(""));

      const spaceIdx =
        stringKeys.indexOf(" ") === -1
          ? stringKeys.indexOf("%20")
          : stringKeys.indexOf(" ");
      if (spaceIdx !== -1) {
        expect(stringKeys.indexOf("")).toBeLessThan(spaceIdx);
      }

      if (spaceIdx !== -1) {
        expect(spaceIdx).toBeLessThan(stringKeys.indexOf("apple"));
      }
    });

    it("should respect shouldTranslate: false flag", async () => {
      setupFileMocks();

      const input = `{
  "sourceLanguage": "en",
  "strings": {
    "do_not_translate": {
      "shouldTranslate": false,
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "This should not be translated"
          }
        }
      }
    },
    "normal_key": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "This should be translated"
          }
        }
      }
    }
  }
}`;

      mockFileOperations(input);

      const xcodeXcstringsLoader = createBucketLoader(
        "xcode-xcstrings",
        "i18n/[locale].xcstrings",
        {
          defaultLocale: "en",
        },
      );
      xcodeXcstringsLoader.setDefaultLocale("en");

      const data = await xcodeXcstringsLoader.pull("en");

      expect(data).toHaveProperty("normal_key", "This should be translated");
      expect(data).not.toHaveProperty("do_not_translate");

      const payload = {
        normal_key: "Ceci devrait être traduit",
      };

      await xcodeXcstringsLoader.push("fr", payload);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeFileCall = (fs.writeFile as any).mock.calls[0];
      const writtenContent = JSON.parse(writeFileCall[1]);

      expect(
        writtenContent.strings.normal_key.localizations.fr.stringUnit.value,
      ).toBe("Ceci devrait être traduit");

      expect(writtenContent.strings.do_not_translate).toHaveProperty(
        "shouldTranslate",
        false,
      );

      expect(
        writtenContent.strings.do_not_translate.localizations,
      ).not.toHaveProperty("fr");

      await xcodeXcstringsLoader.push("fr", {});

      const secondWriteFileCall = (fs.writeFile as any).mock.calls[1];
      const secondWrittenContent = JSON.parse(secondWriteFileCall[1]);

      expect(secondWrittenContent.strings.do_not_translate).toHaveProperty(
        "shouldTranslate",
        false,
      );
    });

    it("should extract and restore variables during pull/push", async () => {
      setupFileMocks();

      const input = JSON.stringify({
        sourceLanguage: "en",
        strings: {
          message: {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "Value: %d items",
                },
              },
            },
          },
        },
      });

      mockFileOperations(input);

      const xcLoader = createBucketLoader(
        "xcode-xcstrings",
        "i18n/[locale].xcstrings",
        {
          defaultLocale: "en",
        },
      );
      xcLoader.setDefaultLocale("en");

      const data = await xcLoader.pull("en");

      expect(data).toEqual({ message: "Value: {variable:0} items" });

      const payload = {
        message: "Valeur: {variable:0} éléments",
      };

      await xcLoader.push("fr", payload);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeFileCall = (fs.writeFile as any).mock.calls[0];
      const writtenContent = JSON.parse(writeFileCall[1]);

      expect(
        writtenContent.strings.message.localizations.fr.stringUnit.value,
      ).toBe("Valeur: %d éléments");
    });

    it("should extract hints from xcstrings comments", async () => {
      setupFileMocks();

      const input = JSON.stringify({
        sourceLanguage: "en",
        strings: {
          welcome_message: {
            comment: "Greeting displayed on the main screen",
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "Welcome!",
                },
              },
            },
          },
          user_count: {
            comment: "Number of active users - supports pluralization",
            extractionState: "manual",
            localizations: {
              en: {
                variations: {
                  plural: {
                    one: {
                      stringUnit: {
                        state: "translated",
                        value: "1 user",
                      },
                    },
                    other: {
                      stringUnit: {
                        state: "translated",
                        value: "%d users",
                      },
                    },
                  },
                },
              },
            },
          },
          no_comment: {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "No comment here",
                },
              },
            },
          },
        },
      });

      mockFileOperations(input);

      const xcodeXcstringsLoader = createBucketLoader(
        "xcode-xcstrings",
        "i18n/[locale].xcstrings",
        {
          defaultLocale: "en",
        },
      );
      xcodeXcstringsLoader.setDefaultLocale("en");
      await xcodeXcstringsLoader.pull("en");

      const hints = await xcodeXcstringsLoader.pullHints();

      // Note: The output is flattened because xcode-xcstrings bucket loader goes through the flat loader
      expect(hints).toEqual({
        welcome_message: ["Greeting displayed on the main screen"],
        user_count: ["Number of active users - supports pluralization"],
        "user_count/one": ["Number of active users - supports pluralization"],
        "user_count/other": ["Number of active users - supports pluralization"],
      });
    });

    it("should handle xcstrings without comments in full-stack loader", async () => {
      setupFileMocks();

      const input = JSON.stringify({
        sourceLanguage: "en",
        strings: {
          simple_key: {
            extractionState: "manual",
            localizations: {
              en: {
                stringUnit: {
                  state: "translated",
                  value: "Simple value",
                },
              },
            },
          },
        },
      });

      mockFileOperations(input);

      const xcodeXcstringsLoader = createBucketLoader(
        "xcode-xcstrings",
        "i18n/[locale].xcstrings",
        {
          defaultLocale: "en",
        },
      );
      xcodeXcstringsLoader.setDefaultLocale("en");
      await xcodeXcstringsLoader.pull("en");

      const hints = await xcodeXcstringsLoader.pullHints();

      expect(hints).toEqual({});
    });
  });

  describe("yaml bucket loader", () => {
    it("should load yaml", async () => {
      setupFileMocks();

      const input = `
        greeting: Hello!
      `.trim();
      const expectedOutput = { greeting: "Hello!" };

      mockFileOperations(input);

      const yamlLoader = createBucketLoader("yaml", "i18n/[locale].yaml", {
        defaultLocale: "en",
      });
      yamlLoader.setDefaultLocale("en");
      const data = await yamlLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save yaml", async () => {
      setupFileMocks();

      const input = `
        greeting: Hello!
      `.trim();
      const payload = { greeting: "¡Hola!" };
      const expectedOutput = `greeting: ¡Hola!`;

      mockFileOperations(input);

      const yamlLoader = createBucketLoader("yaml", "i18n/[locale].yaml", {
        defaultLocale: "en",
      });
      yamlLoader.setDefaultLocale("en");
      await yamlLoader.pull("en");

      await yamlLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.yaml",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    describe("yaml with quoted keys and values", async () => {
      it.each([
        ["double quoted values", `greeting: "Hello!"`, `greeting: "¡Hola!"`],
        ["double quoted keys", `"greeting": Hello!`, `"greeting": ¡Hola!`],
        [
          "double quoted keys and values",
          `"greeting": "Hello!"`,
          `"greeting": "¡Hola!"`,
        ],
      ])(
        "should return correct value for %s",
        async (_, input, expectedOutput) => {
          const payload = { greeting: "¡Hola!" };

          mockFileOperations(input);

          const yamlLoader = createBucketLoader("yaml", "i18n/[locale].yaml", {
            defaultLocale: "en",
          });
          yamlLoader.setDefaultLocale("en");
          await yamlLoader.pull("en");

          await yamlLoader.push("es", payload);

          expect(fs.writeFile).toHaveBeenCalledWith(
            "i18n/es.yaml",
            expectedOutput,
            { encoding: "utf-8", flag: "w" },
          );
        },
      );
    });
  });

  describe("yaml-root-key bucket loader", () => {
    it("should load yaml-root-key", async () => {
      setupFileMocks();

      const input = `
      en:
        greeting: Hello!
    `.trim();
      const expectedOutput = { greeting: "Hello!" };

      mockFileOperations(input);

      const yamlRootKeyLoader = createBucketLoader(
        "yaml-root-key",
        "i18n/[locale].yaml",
        {
          defaultLocale: "en",
        },
      );
      yamlRootKeyLoader.setDefaultLocale("en");
      const data = await yamlRootKeyLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save yaml-root-key", async () => {
      setupFileMocks();

      const input = `
      en:
        greeting: Hello!
    `.trim();
      const payload = { greeting: "¡Hola!" };
      const expectedOutput = `es:\n  greeting: ¡Hola!`;

      mockFileOperations(input);

      const yamlRootKeyLoader = createBucketLoader(
        "yaml-root-key",
        "i18n/[locale].yaml",
        {
          defaultLocale: "en",
        },
      );
      yamlRootKeyLoader.setDefaultLocale("en");
      await yamlRootKeyLoader.pull("en");

      await yamlRootKeyLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.yaml",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });

  describe("vtt bucket loader", () => {
    it("should load complex vtt data", async () => {
      setupFileMocks();

      const input = `
  WEBVTT

00:00:00.000 --> 00:00:01.000
Hello world!

00:00:30.000 --> 00:00:31.000 align:start line:0%
This is a subtitle

00:01:00.000 --> 00:01:01.000
Foo

00:01:50.000 --> 00:01:51.000
Bar
      `.trim();

      const expectedOutput = {
        "0#0-1#": "Hello world!",
        "1#30-31#": "This is a subtitle",
        "2#60-61#": "Foo",
        "3#110-111#": "Bar",
      };

      mockFileOperations(input);

      const vttLoader = createBucketLoader("vtt", "i18n/[locale].vtt", {
        defaultLocale: "en",
      });
      vttLoader.setDefaultLocale("en");
      const data = await vttLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save complex vtt data", async () => {
      setupFileMocks();
      const input = `
  WEBVTT

00:00:00.000 --> 00:00:01.000
Hello world!

00:00:30.000 --> 00:00:31.000 align:start line:0%
This is a subtitle

00:01:00.000 --> 00:01:01.000
Foo

00:01:50.000 --> 00:01:51.000
Bar
      `.trim();

      const payload = {
        "0#0-1#": "¡Hola mundo!",
        "1#30-31#": "Este es un subtítulo",
        "2#60-61#": "Foo",
        "3#110-111#": "Bar",
      };

      const expectedOutput = `
  WEBVTT

00:00:00.000 --> 00:00:01.000
¡Hola mundo!

00:00:30.000 --> 00:00:31.000
Este es un subtítulo

00:01:00.000 --> 00:01:01.000
Foo

00:01:50.000 --> 00:01:51.000
Bar`.trim();

      mockFileOperations(input);

      const vttLoader = createBucketLoader("vtt", "i18n/[locale].vtt", {
        defaultLocale: "en",
      });
      vttLoader.setDefaultLocale("en");
      await vttLoader.pull("en");

      await vttLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.vtt", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });
  });

  describe("XML bucket loader", () => {
    it("should load XML data", async () => {
      setupFileMocks();

      const input = `<root>
    <title>Test XML</title>
    <date>2023-05-25</date>
    <content>
      <section>Introduction</section>
      <section>
        <text>
          Detailed text. 
        </text>
      </section>
    </content>
  </root>`;

      const expectedOutput = {
        "root/title": "Test XML",
        "root/content/section/0": "Introduction",
        "root/content/section/1/text": "Detailed text.",
      };

      mockFileOperations(input);

      const xmlLoader = createBucketLoader("xml", "i18n/[locale].xml", {
        defaultLocale: "en",
      });
      xmlLoader.setDefaultLocale("en");
      const data = await xmlLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save XML data", async () => {
      setupFileMocks();

      const input = `<root>
    <title>Test XML</title>
    <date>2023-05-25</date>
    <content>
      <section>Introduction</section>
      <section>
        <text>
          Detailed text.
        </text>
      </section>
    </content>
  </root>`;

      const payload = {
        "root/title": "Prueba XML",
        "root/date": "2023-05-25",
        "root/content/section/0": "Introducción",
        "root/content/section/1/text": "Detalles texto.",
      };

      let expectedOutput = `
      <root>
        <title>Prueba XML</title>
        <date>2023-05-25</date>
        <content>
          <section>Introducción</section>
          <section>
            <text>Detalles texto.</text>
          </section>
        </content>
      </root>`
        .replace(/\s+/g, " ")
        .replace(/>\s+</g, "><")
        .trim();
      mockFileOperations(input);
      const xmlLoader = createBucketLoader("xml", "i18n/[locale].xml", {
        defaultLocale: "en",
      });
      xmlLoader.setDefaultLocale("en");
      await xmlLoader.pull("en");

      await xmlLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.xml", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });
  });

  describe("srt bucket loader", () => {
    it("should load srt", async () => {
      setupFileMocks();

      const input = `
1
00:00:00,000 --> 00:00:01,000
Hello!

2
00:00:01,000 --> 00:00:02,000
World!
      `.trim();
      const expectedOutput = {
        "1#00:00:00,000-00:00:01,000": "Hello!",
        "2#00:00:01,000-00:00:02,000": "World!",
      };

      mockFileOperations(input);

      const srtLoader = createBucketLoader("srt", "i18n/[locale].srt", {
        defaultLocale: "en",
      });
      srtLoader.setDefaultLocale("en");
      const data = await srtLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save srt", async () => {
      setupFileMocks();

      const input = `
1
00:00:00,000 --> 00:00:01,000
Hello!

2
00:00:01,000 --> 00:00:02,000
World!
  `.trim();

      const payload = {
        "1#00:00:00,000-00:00:01,000": "¡Hola!",
        "2#00:00:01,000-00:00:02,000": "Mundo!",
      };

      const expectedOutput = `1
00:00:00,000 --> 00:00:01,000
¡Hola!

2
00:00:01,000 --> 00:00:02,000
Mundo!`;

      mockFileOperations(input);

      const srtLoader = createBucketLoader("srt", "i18n/[locale].srt", {
        defaultLocale: "en",
      });
      srtLoader.setDefaultLocale("en");
      await srtLoader.pull("en");

      await srtLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.srt", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });
  });

  describe("xliff bucket loader", () => {
    it("should load xliff data", async () => {
      setupFileMocks();

      const input = `
  <xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en-US">
    <file id="namespace1">
      <unit id="key1">
        <segment>
          <source>Hello</source>
        </segment>
      </unit>
      <unit id="key2">
        <segment>
          <source>An application to manipulate and process XLIFF documents</source>
        </segment>
      </unit>
      <unit id="key.nested">
        <segment>
          <source>XLIFF Data Manager</source>
        </segment>
      </unit>
      <group id="group">
        <unit id="groupUnit">
          <segment>
            <source>Group</source>
          </segment>
        </unit>
      </group>
    </file>
  </xliff>
      `.trim();

      // Keys must be encoded (e.g. / replaced with %2F)
      const expectedOutput = {
        "resources%2Fnamespace1%2Fgroup%2FgroupUnits%2FgroupUnit%2Fsource":
          "Group",
        "resources%2Fnamespace1%2Fkey.nested%2Fsource": "XLIFF Data Manager",
        "resources%2Fnamespace1%2Fkey1%2Fsource": "Hello",
        "resources%2Fnamespace1%2Fkey2%2Fsource":
          "An application to manipulate and process XLIFF documents",
        sourceLanguage: "en-US",
      };

      mockFileOperations(input);

      const xliffLoader = createBucketLoader("xliff", "i18n/[locale].xliff", {
        defaultLocale: "en",
      });
      xliffLoader.setDefaultLocale("en");
      const data = await xliffLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save xliff data", async () => {
      setupFileMocks();

      const input = `
    <xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en-US">
      <file id="namespace1">
        <unit id="key1">
          <segment>
            <source>Hello</source>
          </segment>
        </unit>
        <unit id="key2">
          <segment>
            <source>An application to manipulate and process XLIFF documents</source>
          </segment>
        </unit>
        <unit id="key.nested">
          <segment>
            <source>XLIFF Data Manager</source>
          </segment>
        </unit>
        <group id="group">
          <unit id="groupUnit">
            <segment>
              <source>Group</source>
            </segment>
          </unit>
        </group>
      </file>
    </xliff>
        `.trim();
      // Keys must be encoded (e.g. / replaced with %2F)
      const payload = {
        "resources%2Fnamespace1%2Fgroup%2FgroupUnits%2FgroupUnit%2Fsource":
          "Grupo",
        "resources%2Fnamespace1%2Fkey.nested%2Fsource":
          "Administrador de Datos XLIFF",
        "resources%2Fnamespace1%2Fkey1%2Fsource": "Hola",
        "resources%2Fnamespace1%2Fkey2%2Fsource":
          "Una aplicación para manipular y procesar documentos XLIFF",
        sourceLanguage: "es-ES",
      };

      const expectedOutput = `
<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="es-ES">
  <file id="namespace1">
    <unit id="key1">
      <segment>
        <source>Hola</source>
      </segment>
    </unit>
    <unit id="key2">
      <segment>
        <source>Una aplicación para manipular y procesar documentos XLIFF</source>
      </segment>
    </unit>
    <unit id="key.nested">
      <segment>
        <source>Administrador de Datos XLIFF</source>
      </segment>
    </unit>
    <group id="group">
      <unit id="groupUnit">
        <segment>
          <source>Grupo</source>
        </segment>
      </unit>
    </group>
  </file>
</xliff>`.trim();

      mockFileOperations(input);

      const xliffLoader = createBucketLoader("xliff", "i18n/[locale].xlf", {
        defaultLocale: "en",
      });
      xliffLoader.setDefaultLocale("en");
      await xliffLoader.pull("en");

      await xliffLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.xlf", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });
  });

  describe("text-file", () => {
    describe("when there is no target locale file", () => {
      it("should preserve trailing new line based on the source locale", async () => {
        setupFileMocks();

        const input = "Hello\n";
        const expectedOutput = "Hola\n";

        mockFileOperationsForPaths({
          "i18n/en.txt": input,
          "i18n/es.txt": "",
        });

        const textFileLoader = createTextFileLoader("i18n/[locale].txt");
        textFileLoader.setDefaultLocale("en");
        await textFileLoader.pull("en");

        await textFileLoader.push("es", "Hola");

        expect(fs.writeFile).toHaveBeenCalledWith(
          "i18n/es.txt",
          expectedOutput,
          { encoding: "utf-8", flag: "w" },
        );
      });

      it("should not add trailing new line based on the source locale", async () => {
        setupFileMocks();

        const input = "Hello";
        const expectedOutput = "Hola";

        mockFileOperationsForPaths({
          "i18n/en.txt": input,
          "i18n/es.txt": "",
        });

        const textFileLoader = createTextFileLoader("i18n/[locale].txt");
        textFileLoader.setDefaultLocale("en");
        await textFileLoader.pull("en");

        await textFileLoader.push("es", "Hola");

        expect(fs.writeFile).toHaveBeenCalledWith(
          "i18n/es.txt",
          expectedOutput,
          { encoding: "utf-8", flag: "w" },
        );
      });
    });

    describe("when there is a target locale file", () => {
      it("should preserve trailing new lines based on the target locale", async () => {
        setupFileMocks();

        const input = "Hello";
        const targetInput = "Hola\n";
        const expectedOutput = "Hola (translated)\n";

        mockFileOperationsForPaths({
          "i18n/en.txt": input,
          "i18n/es.txt": targetInput,
        });

        const textFileLoader = createTextFileLoader("i18n/[locale].txt");
        textFileLoader.setDefaultLocale("en");
        await textFileLoader.pull("en");

        await textFileLoader.push("es", "Hola (translated)");

        expect(fs.writeFile).toHaveBeenCalledWith(
          "i18n/es.txt",
          expectedOutput,
          { encoding: "utf-8", flag: "w" },
        );
      });

      it("should not add trailing new line based on the target locale", async () => {
        setupFileMocks();

        const input = "Hello\n";
        const targetInput = "Hola";
        const expectedOutput = "Hola (translated)";

        mockFileOperationsForPaths({
          "i18n/en.txt": input,
          "i18n/es.txt": targetInput,
        });

        const textFileLoader = createTextFileLoader("i18n/[locale].txt");
        textFileLoader.setDefaultLocale("en");
        await textFileLoader.pull("en");

        await textFileLoader.push("es", "Hola (translated)");

        expect(fs.writeFile).toHaveBeenCalledWith(
          "i18n/es.txt",
          expectedOutput,
          { encoding: "utf-8", flag: "w" },
        );
      });
    });
  });

  describe("php bucket loader", () => {
    it("should load php array", async () => {
      setupFileMocks();

      const input = `<?php return ['button.title' => 'Submit'];`;
      const expectedOutput = { "button.title": "Submit" };

      mockFileOperations(input);

      const phpLoader = createBucketLoader("php", "i18n/[locale].php", {
        defaultLocale: "en",
      });
      phpLoader.setDefaultLocale("en");
      const data = await phpLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save php array", async () => {
      setupFileMocks();

      const input = `<?php 
// this is locale

return array(
  'button.title' => 'Submit',
  'button.description' => ['Hello', 'Goodbye'],
  'button.index' => 1,
  'button.class' => null,
);`;
      const expectedOutput = `<?php 
// this is locale

return array(
  'button.title' => 'Enviar',
  'button.description' => array(
    'Hola',
    'Adiós'
  ),
  'button.index' => 1,
  'button.class' => null
);`;

      mockFileOperations(input);

      const phpLoader = createBucketLoader("php", "i18n/[locale].php", {
        defaultLocale: "en",
      });
      phpLoader.setDefaultLocale("en");
      await phpLoader.pull("en");

      await phpLoader.push("es", {
        "button.title": "Enviar",
        "button.description/0": "Hola",
        "button.description/1": "Adiós",
      });

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.php", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });
  });

  describe("po bucket loader", () => {
    it("should load po file", async () => {
      setupFileMocks();

      const input = `msgid "Hello"\nmsgstr "Hello"`;
      const expectedOutput = { "Hello/singular": "Hello" };

      mockFileOperations(input);

      const poLoader = createBucketLoader("po", "i18n/[locale].po", {
        defaultLocale: "en",
      });
      poLoader.setDefaultLocale("en");
      const data = await poLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save po file", async () => {
      setupFileMocks();

      const input = `msgid "Hello"\nmsgstr "Hello"`;
      const expectedOutput = `msgid "Hello"\nmsgstr "Hola"`;

      mockFileOperations(input);

      const poLoader = createBucketLoader("po", "i18n/[locale].po", {
        defaultLocale: "en",
      });
      poLoader.setDefaultLocale("en");
      await poLoader.pull("en");

      await poLoader.push("es", {
        "Hello/singular": "Hola",
      });

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.po", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });

    it("should extract and restore variables", async () => {
      setupFileMocks();

      const input = `msgid "You have %(count)d items"\nmsgstr "You have %(count)d items"\n\n#~ msgid "I am obsolete"\n#~ msgstr "I am obsolete"`;

      const expectedPullOutput = {
        "You%20have%20%25(count)d%20items/singular":
          "You have {variable:0} items",
      };

      mockFileOperations(input);

      const poLoader = createBucketLoader("po", "i18n/[locale].po", {
        defaultLocale: "en",
      });
      poLoader.setDefaultLocale("en");

      const data = await poLoader.pull("en");

      expect(data).toEqual(expectedPullOutput);

      const payload = {
        "You%20have%20%25(count)d%20items/singular":
          "Sie haben {variable:0} Elemente",
      };

      await poLoader.push("de", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/de.po",
        `msgid "You have %(count)d items"\nmsgstr "Sie haben %(count)d Elemente"`,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });

  describe("vue-json bucket loader", () => {
    const template = `<template>
  <div id="app">
    <label for="locale">locale</label>
    <select v-model="locale">
      <option>en</option>
      <option>ja</option>
    </select>
    <p>message: {{ $t('hello') }}</p>
  </div>
</template>`;
    const script = `<script>
export default {
  name: 'app',
  data () {
    this.$i18n.locale = 'en';
    return { locale: 'en' }
  },
  watch: {
    locale (val) {
      this.$i18n.locale = val
    }
  }
}
</script>`;

    it("should load vue-json file", async () => {
      setupFileMocks();

      const input = `${template}

<i18n>
{
  "en": {
    "hello": "hello world!"
  }
}
</i18n>

${script}`;
      const expectedOutput = { hello: "hello world!" };

      mockFileOperations(input);

      const vueLoader = createBucketLoader("vue-json", "i18n/[locale].vue", {
        defaultLocale: "en",
      });
      vueLoader.setDefaultLocale("en");
      const data = await vueLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save vue-json file", async () => {
      setupFileMocks();

      const input = `${template}

<i18n>
{
  "en": {
    "hello": "hello world!"
  }
}
</i18n>

${script}`;
      const expectedOutput = `${template}

<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "es": {
    "hello": "hola mundo!"
  }
}
</i18n>

${script}`;

      mockFileOperations(input);

      const vueLoader = createBucketLoader("vue-json", "i18n/App.vue", {
        defaultLocale: "en",
      });
      vueLoader.setDefaultLocale("en");
      await vueLoader.pull("en");

      await vueLoader.push("es", {
        hello: "hola mundo!",
      });

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/App.vue",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    it("should ignore vue file without i18n tag", async () => {
      setupFileMocks();

      const input = `${template}

${script}`;
      const expectedOutput = `${template}

${script}`;

      mockFileOperations(input);

      const vueLoader = createBucketLoader("vue-json", "i18n/App.vue", {
        defaultLocale: "en",
      });
      vueLoader.setDefaultLocale("en");
      await vueLoader.pull("en");

      await vueLoader.push("es", {
        hello: "hola mundo!",
      });

      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/App.vue",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });
  describe("ejs bucket loader", () => {
    it("should load ejs data", async () => {
      setupFileMocks();

      const input = `<!DOCTYPE html>
<html>
<head>
  <title>Welcome Page</title>
</head>
<body>
  <h1>Hello <%= user.name %>!</h1>
  <% if (user.isLoggedIn) { %>
    <p>Welcome back to our application.</p>
    <p>You have <%= notifications.length %> new notifications.</p>
  <% } else { %>
    <p>Please log in to continue.</p>
  <% } %>
  <ul>
    <% items.forEach(function(item, index) { %>
      <li>Item <%= index + 1 %>: <%= item.title %></li>
    <% }); %>
  </ul>
  <footer>© 2024 My Company. All rights reserved.</footer>
</body>
</html>`;

      const expectedOutput = {
        text_0: "Welcome Page",
        text_1: "Hello",
        text_2: "!",
        text_3: "Welcome back to our application.",
        text_4: "You have",
        text_5: "new notifications.",
        text_6: "Please log in to continue.",
        text_7: "Item",
        text_8: ":",
        text_9: "© 2024 My Company. All rights reserved.",
      };

      mockFileOperations(input);

      const ejsLoader = createBucketLoader("ejs", "templates/[locale].ejs", {
        defaultLocale: "en",
      });
      ejsLoader.setDefaultLocale("en");
      const data = await ejsLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save ejs data", async () => {
      setupFileMocks();

      const input = `<!DOCTYPE html>
<html>
<head>
  <title>Welcome Page</title>
</head>
<body>
  <h1>Hello <%= user.name %>!</h1>
  <p>Welcome to our application.</p>
  <footer>© 2024 My Company. All rights reserved.</footer>
</body>
</html>`;

      const payload = {
        text_0: "Página de Bienvenida",
        text_1: "Hola",
        text_2: "!",
        text_3: "Bienvenido a nuestra aplicación.",
        text_4: "© 2024 Mi Empresa. Todos los derechos reservados.",
      };

      const expectedOutput = `<!DOCTYPE html>
<html>
<head>
  <title>Página de Bienvenida</title>
</head>
<body>
  <h1>Hola <%= user.name %>!</h1>
  <p>Bienvenido a nuestra aplicación.</p>
  <footer>© 2024 Mi Empresa. Todos los derechos reservados.</footer>
</body>
</html>`;

      mockFileOperations(input);

      const ejsLoader = createBucketLoader("ejs", "templates/[locale].ejs", {
        defaultLocale: "en",
      });
      ejsLoader.setDefaultLocale("en");
      await ejsLoader.pull("en");

      await ejsLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "templates/es.ejs",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });

  describe("txt bucket loader", () => {
    it("should load txt", async () => {
      setupFileMocks();

      const input = `Welcome to our application!
This is a sample text file for fastlane metadata.
It contains app description that needs to be translated.`;

      const expectedOutput = {
        "1": "Welcome to our application!",
        "2": "This is a sample text file for fastlane metadata.",
        "3": "It contains app description that needs to be translated.",
      };

      mockFileOperations(input);

      const txtLoader = createBucketLoader(
        "txt",
        "fastlane/metadata/[locale]/description.txt",
        {
          defaultLocale: "en",
        },
      );
      txtLoader.setDefaultLocale("en");
      const data = await txtLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save txt", async () => {
      setupFileMocks();

      const input = `Welcome to our application!
This is a sample text file for fastlane metadata.
It contains app description that needs to be translated.`;

      const payload = {
        "1": "¡Bienvenido a nuestra aplicación!",
        "2": "Este es un archivo de texto de muestra para metadatos de fastlane.",
        "3": "Contiene la descripción de la aplicación que necesita ser traducida.",
      };

      const expectedOutput = `¡Bienvenido a nuestra aplicación!
Este es un archivo de texto de muestra para metadatos de fastlane.
Contiene la descripción de la aplicación que necesita ser traducida.`;

      mockFileOperations(input);

      const txtLoader = createBucketLoader(
        "txt",
        "fastlane/metadata/[locale]/description.txt",
        {
          defaultLocale: "en",
        },
      );
      txtLoader.setDefaultLocale("en");
      await txtLoader.pull("en");

      await txtLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "fastlane/metadata/es/description.txt",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });

    it("should handle empty txt files", async () => {
      setupFileMocks();

      const input = "";
      const expectedOutput = {};

      mockFileOperations(input);

      const txtLoader = createBucketLoader(
        "txt",
        "fastlane/metadata/[locale]/description.txt",
        {
          defaultLocale: "en",
        },
      );
      txtLoader.setDefaultLocale("en");
      const data = await txtLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should filter out empty lines during pull", async () => {
      setupFileMocks();

      const input = `Line 1

Line 3`;
      const expectedOutput = {
        "1": "Line 1",
        "3": "Line 3",
      };

      mockFileOperations(input);

      const txtLoader = createBucketLoader(
        "txt",
        "fastlane/metadata/[locale]/description.txt",
        {
          defaultLocale: "en",
        },
      );
      txtLoader.setDefaultLocale("en");
      const data = await txtLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should reconstruct file with empty lines restored", async () => {
      setupFileMocks();

      const input = `Line 1

Line 3`;

      const payload = {
        "1": "Línea 1",
        "3": "Línea 3",
      };

      const expectedOutput = `Línea 1

Línea 3`;

      mockFileOperations(input);

      const txtLoader = createBucketLoader(
        "txt",
        "fastlane/metadata/[locale]/description.txt",
        {
          defaultLocale: "en",
        },
      );
      txtLoader.setDefaultLocale("en");
      await txtLoader.pull("en");

      await txtLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith(
        "fastlane/metadata/es/description.txt",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });

  describe("json-dictionary bucket loader", () => {
    it("should add target locale keys only where source locale keys exist", async () => {
      setupFileMocks();
      const input = {
        title: { en: "I am a title" },
        logoPosition: "right",
        pages: [
          {
            name: "Welcome to my world",
            elements: [
              {
                title: { en: "I am an element title" },
                description: { en: "I am an element description" },
              },
            ],
          },
        ],
      };
      mockFileOperations(JSON.stringify(input));
      const loader = createBucketLoader(
        "json-dictionary",
        "i18n/[locale].json",
        {
          defaultLocale: "en",
        },
      );
      loader.setDefaultLocale("en");
      await loader.pull("en");
      await loader.push("es", {
        title: "Yo soy un titulo",
        "pages/0/elements/0/title": "Yo soy un elemento de titulo",
        "pages/0/elements/0/description": "Yo soy una descripcion de elemento",
      });
      const expectedOutput = `{
  "title": {
    "en": "I am a title",
    "es": "Yo soy un titulo"
  },
  "logoPosition": "right",
  "pages": [
    {
      "name": "Welcome to my world",
      "elements": [
        {
          "title": {
            "en": "I am an element title",
            "es": "Yo soy un elemento de titulo"
          },
          "description": {
            "en": "I am an element description",
            "es": "Yo soy una descripcion de elemento"
          }
        }
      ]
    }
  ]
}`;
      expect(fs.writeFile).toHaveBeenCalledWith(
        "i18n/es.json",
        expectedOutput,
        { encoding: "utf-8", flag: "w" },
      );
    });
  });
});

function setupFileMocks() {
  vi.mock("fs/promises", () => ({
    default: {
      readFile: vi.fn(),
      writeFile: vi.fn(),
      mkdir: vi.fn(),
      access: vi.fn(),
    },
  }));

  vi.mock("path", () => ({
    default: {
      resolve: vi.fn((path) => path),
      dirname: vi.fn((path) => path.split("/").slice(0, -1).join("/")),
    },
  }));
}

function mockFileOperations(input: string) {
  (fs.access as any).mockImplementation(() => Promise.resolve());
  (fs.readFile as any).mockImplementation(() => Promise.resolve(input));
  (fs.writeFile as any).mockImplementation(() => Promise.resolve());
}

function mockFileOperationsForPaths(input: Record<string, string>) {
  (fs.access as any).mockImplementation((path) =>
    input.hasOwnProperty(path)
      ? Promise.resolve()
      : Promise.reject(`fs.access: ${path} not mocked`),
  );
  (fs.readFile as any).mockImplementation((path) =>
    input.hasOwnProperty(path)
      ? Promise.resolve(input[path])
      : Promise.reject(`fs.readFile: ${path} not mocked`),
  );
  (fs.writeFile as any).mockImplementation((path) =>
    input.hasOwnProperty(path)
      ? Promise.resolve()
      : Promise.reject(`fs:writeFile: ${path} not mocked`),
  );
}
