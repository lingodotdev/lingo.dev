import { describe, it, expect, vi, beforeEach } from "vitest";
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

      const androidLoader = createBucketLoader("android", "values-[locale]/strings.xml", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const androidLoader = createBucketLoader("android", "values-[locale]/strings.xml", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const androidLoader = createBucketLoader("android", "values-[locale]/strings.xml", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      androidLoader.setDefaultLocale("en");
      await androidLoader.pull("en");

      await androidLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("values-es/strings.xml", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
    });
  });

  describe("csv bucket loader", () => {
    it("should load csv data", async () => {
      setupFileMocks();

      const input = `id,en\nbutton.title,Submit`;
      const expectedOutput = { "button.title": "Submit" };

      mockFileOperations(input);

      const csvLoader = createBucketLoader("csv", "i18n.csv", { isCacheRestore: false, defaultLocale: "en" });
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

      const csvLoader = createBucketLoader("csv", "i18n.csv", { isCacheRestore: false, defaultLocale: "en" });
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

      const flutterLoader = createBucketLoader("flutter", "lib/l10n/app_[locale].arb", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const flutterLoader = createBucketLoader("flutter", "lib/l10n/app_[locale].arb", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      flutterLoader.setDefaultLocale("en");
      await flutterLoader.pull("en");

      await flutterLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("lib/l10n/app_es.arb", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
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
        isCacheRestore: false,
        defaultLocale: "en",
      });
      htmlLoader.setDefaultLocale("en");
      const data = await htmlLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save html data", async () => {
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
      const expectedOutput = `
<html lang="es">
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
        isCacheRestore: false,
        defaultLocale: "en",
      });
      htmlLoader.setDefaultLocale("en");
      await htmlLoader.pull("en");

      await htmlLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.html", expectedOutput, { encoding: "utf-8", flag: "w" });
    });
  });

  describe("json bucket loader", () => {
    it("should load json data", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit" };
      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        isCacheRestore: false,
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
        isCacheRestore: false,
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.json", expectedOutput, { encoding: "utf-8", flag: "w" });
    });

    it("should save json data with numeric keys", async () => {
      setupFileMocks();

      const input = { messages: { "1": "foo", "2": "bar", "3": "bar" } };
      const payload = { "messages/1": "foo", "messages/2": "bar", "messages/3": "bar" };
      const expectedOutput = JSON.stringify(input, null, 2);

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.json", expectedOutput, { encoding: "utf-8", flag: "w" });
    });

    it("should save json data with array", async () => {
      setupFileMocks();

      const input = { messages: ["foo", "bar"] };
      const payload = { "messages/0": "foo", "messages/1": "bar" };
      const expectedOutput = `{\n  "messages\": [\"foo\", \"bar\"]\n}`;

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.json", expectedOutput, { encoding: "utf-8", flag: "w" });
    });

    it("should use key values from original input for missing keys", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit", "button.description": "Submit description" };
      const payload = { "button.title": "Enviar" };
      const expectedOutput = JSON.stringify({ ...input, ...payload }, null, 2);

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.json", expectedOutput, { encoding: "utf-8", flag: "w" });
    });

    it("should not use key values from original input on cache restoration", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit", "button.description": "Submit description" };
      const payload = { "button.title": "Enviar" };
      const expectedOutput = JSON.stringify(payload, null, 2);

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        isCacheRestore: true,
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.json", expectedOutput, { encoding: "utf-8", flag: "w" });
    });

    it("should load and save json data for paths with multiple locales", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit" };
      const payload = { "button.title": "Enviar" };
      const expectedOutput = JSON.stringify(payload, null, 2);

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale]/[locale].json", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      jsonLoader.setDefaultLocale("en");
      const data = await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(data).toEqual(input);
      expect(fs.access).toHaveBeenCalledWith("i18n/en/en.json");
      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es/es.json", expectedOutput, { encoding: "utf-8", flag: "w" });
    });

    it("should remove injected locales from json data", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit", settings: { locale: "en" }, "not-a-locale": "bar" };
      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        isCacheRestore: false,
        defaultLocale: "en",
        injectLocale: ["settings.locale", "not-a-locale"],
      });
      jsonLoader.setDefaultLocale("en");
      const data = await jsonLoader.pull("en");

      expect(data).toEqual({ "button.title": "Submit", "not-a-locale": "bar" });
    });

    it("should inject locales into json data", async () => {
      setupFileMocks();

      const input = { "button.title": "Submit", "not-a-locale": "bar", settings: { locale: "en" } };
      const payload = { "button.title": "Enviar", "not-a-locale": "bar" };
      const expectedOutput = JSON.stringify({ ...payload, settings: { locale: "es" } }, null, 2);

      mockFileOperations(JSON.stringify(input));

      const jsonLoader = createBucketLoader("json", "i18n/[locale].json", {
        isCacheRestore: false,
        defaultLocale: "en",
        injectLocale: ["settings.locale", "not-a-locale"],
      });
      jsonLoader.setDefaultLocale("en");
      await jsonLoader.pull("en");

      await jsonLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.json", expectedOutput, { encoding: "utf-8", flag: "w" });
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
        "md-section-3": "Another paragraph with **bold** and *italic* text.",
      };

      mockFileOperations(input);

      const markdownLoader = createBucketLoader("markdown", "i18n/[locale].md", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const markdownLoader = createBucketLoader("markdown", "i18n/[locale].md", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      markdownLoader.setDefaultLocale("en");
      await markdownLoader.pull("en");

      await markdownLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.md", expectedOutput, {
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

      const propertiesLoader = createBucketLoader("properties", "i18n/[locale].properties", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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
        "error.message": "Se ha producido un error. Por favor, inténtelo de nuevo más tarde.",
        "user.login": "Por favor, introduzca su nombre de usuario y contraseña.",
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

      const propertiesLoader = createBucketLoader("properties", "i18n/[locale].properties", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      propertiesLoader.setDefaultLocale("en");
      await propertiesLoader.pull("en");

      await propertiesLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.properties", expectedOutput, { encoding: "utf-8", flag: "w" });
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

      const xcodeStringsLoader = createBucketLoader("xcode-strings", "i18n/[locale].strings", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const xcodeStringsLoader = createBucketLoader("xcode-strings", "i18n/[locale].strings", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      xcodeStringsLoader.setDefaultLocale("en");
      await xcodeStringsLoader.pull("en");

      await xcodeStringsLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.strings", expectedOutput, { encoding: "utf-8", flag: "w" });
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

      const xcodeStringsdictLoader = createBucketLoader("xcode-stringsdict", "i18n/[locale].stringsdict", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const xcodeStringsdictLoader = createBucketLoader("xcode-stringsdict", "[locale].lproj/Localizable.stringsdict", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      xcodeStringsdictLoader.setDefaultLocale("en");
      await xcodeStringsdictLoader.pull("en");

      await xcodeStringsdictLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("es.lproj/Localizable.stringsdict", expectedOutput, {
        encoding: "utf-8",
        flag: "w",
      });
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

      const xcodeXcstringsLoader = createBucketLoader("xcode-xcstrings", "i18n/[locale].xcstrings", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const xcodeXcstringsLoader = createBucketLoader("xcode-xcstrings", "i18n/[locale].xcstrings", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const xcodeXcstringsLoader = createBucketLoader("xcode-xcstrings", "i18n/[locale].xcstrings", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      xcodeXcstringsLoader.setDefaultLocale("en");
      await xcodeXcstringsLoader.pull("en");
      await xcodeXcstringsLoader.push("fr", payload);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeFileCall = (fs.writeFile as any).mock.calls[0];
      const writtenContent = JSON.parse(writeFileCall[1]);

      expect(writtenContent.strings.greeting.localizations.fr).toBeDefined();
      expect(writtenContent.strings.greeting.localizations.fr.stringUnit.value).toBe("Bonjour!");

      if (writtenContent.strings.message) {
        expect(writtenContent.strings.message.localizations.fr.stringUnit.value).toBe(
          "Bienvenue dans notre application",
        );
      }

      if (writtenContent.strings.items_count) {
        expect(writtenContent.strings.items_count.localizations.fr.variations.plural.zero.stringUnit.value).toBe(
          "Aucun élément",
        );
        expect(writtenContent.strings.items_count.localizations.fr.variations.plural.one.stringUnit.value).toBe(
          "%d élément",
        );
        expect(writtenContent.strings.items_count.localizations.fr.variations.plural.other.stringUnit.value).toBe(
          "%d éléments",
        );
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

      const xcodeXcstringsLoader = createBucketLoader("xcode-xcstrings", "i18n/[locale].xcstrings", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      xcodeXcstringsLoader.setDefaultLocale("en");
      const data = await xcodeXcstringsLoader.pull("en");

      Object.keys(data).forEach((key) => {
        if (key === "") {
          expect(data[key]).toBe("Empty key");
        } else if (key.includes("%20") || key === " ") {
          console.log(`Found space key: "${key}"`);
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
        expect(writtenContent.strings[""].localizations.fr.stringUnit.value).toBe("Vide");
      }

      const hasSpaceKey = Object.keys(writtenContent.strings).some(
        (key) => key === " " || key === "%20" || key.includes("%20"),
      );
      if (hasSpaceKey) {
        const spaceKey = Object.keys(writtenContent.strings).find(
          (key) => key === " " || key === "%20" || key.includes("%20"),
        );
        console.log(`Found space key in written content: "${spaceKey}"`);
        if (spaceKey) {
          expect(writtenContent.strings[spaceKey].localizations.fr.stringUnit.value).toBe("Espace");
        }
      }

      if (writtenContent.strings["25"]) {
        expect(writtenContent.strings["25"].localizations.fr.stringUnit.value).toBe("Numérique");
      }

      if (writtenContent.strings["apple"]) {
        expect(writtenContent.strings["apple"].localizations.fr.stringUnit.value).toBe("Pomme");
      }

      const stringKeys = Object.keys(writtenContent.strings);

      expect(stringKeys.includes("25")).toBe(true);
      expect(stringKeys.includes("")).toBe(true);
      expect(stringKeys.includes(" ") || stringKeys.includes("%20")).toBe(true);
      expect(stringKeys.includes("apple")).toBe(true);

      expect(stringKeys.indexOf("25")).toBeLessThan(stringKeys.indexOf(""));

      const spaceIdx = stringKeys.indexOf(" ") === -1 ? stringKeys.indexOf("%20") : stringKeys.indexOf(" ");
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

      const xcodeXcstringsLoader = createBucketLoader("xcode-xcstrings", "i18n/[locale].xcstrings", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      expect(writtenContent.strings.normal_key.localizations.fr.stringUnit.value).toBe("Ceci devrait être traduit");

      expect(writtenContent.strings.do_not_translate).toHaveProperty("shouldTranslate", false);

      expect(writtenContent.strings.do_not_translate.localizations).not.toHaveProperty("fr");

      await xcodeXcstringsLoader.push("fr", {});

      const secondWriteFileCall = (fs.writeFile as any).mock.calls[1];
      const secondWrittenContent = JSON.parse(secondWriteFileCall[1]);

      expect(secondWrittenContent.strings.do_not_translate).toHaveProperty("shouldTranslate", false);
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
        isCacheRestore: false,
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
        isCacheRestore: false,
        defaultLocale: "en",
      });
      yamlLoader.setDefaultLocale("en");
      await yamlLoader.pull("en");

      await yamlLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.yaml", expectedOutput, { encoding: "utf-8", flag: "w" });
    });

    describe("yaml with quoted keys and values", async () => {
      it.each([
        ["double quoted values", `greeting: "Hello!"`, `greeting: "¡Hola!"`],
        ["double quoted keys", `"greeting": Hello!`, `"greeting": ¡Hola!`],
        ["double quoted keys and values", `"greeting": "Hello!"`, `"greeting": "¡Hola!"`],
      ])("should return correct value for %s", async (_, input, expectedOutput) => {
        const payload = { greeting: "¡Hola!" };

        mockFileOperations(input);

        const yamlLoader = createBucketLoader("yaml", "i18n/[locale].yaml", {
          isCacheRestore: false,
          defaultLocale: "en",
        });
        yamlLoader.setDefaultLocale("en");
        await yamlLoader.pull("en");

        await yamlLoader.push("es", payload);

        expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.yaml", expectedOutput, { encoding: "utf-8", flag: "w" });
      });
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

      const yamlRootKeyLoader = createBucketLoader("yaml-root-key", "i18n/[locale].yaml", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
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

      const yamlRootKeyLoader = createBucketLoader("yaml-root-key", "i18n/[locale].yaml", {
        isCacheRestore: false,
        defaultLocale: "en",
      });
      yamlRootKeyLoader.setDefaultLocale("en");
      await yamlRootKeyLoader.pull("en");

      await yamlRootKeyLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.yaml", expectedOutput, { encoding: "utf-8", flag: "w" });
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

      const vttLoader = createBucketLoader("vtt", "i18n/[locale].vtt", { isCacheRestore: false, defaultLocale: "en" });
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

      const vttLoader = createBucketLoader("vtt", "i18n/[locale].vtt", { isCacheRestore: false, defaultLocale: "en" });
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

      const xmlLoader = createBucketLoader("xml", "i18n/[locale].xml", { isCacheRestore: false, defaultLocale: "en" });
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
      const xmlLoader = createBucketLoader("xml", "i18n/[locale].xml", { isCacheRestore: false, defaultLocale: "en" });
      xmlLoader.setDefaultLocale("en");
      await xmlLoader.pull("en");

      await xmlLoader.push("es", payload);

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.xml", expectedOutput, { encoding: "utf-8", flag: "w" });
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

      const srtLoader = createBucketLoader("srt", "i18n/[locale].srt", { isCacheRestore: false, defaultLocale: "en" });
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

      const srtLoader = createBucketLoader("srt", "i18n/[locale].srt", { isCacheRestore: false, defaultLocale: "en" });
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

      const expectedOutput = {
        "resources/namespace1/group/groupUnits/groupUnit/source": "Group",
        "resources/namespace1/key.nested/source": "XLIFF Data Manager",
        "resources/namespace1/key1/source": "Hello",
        "resources/namespace1/key2/source": "An application to manipulate and process XLIFF documents",
        sourceLanguage: "en-US",
      };

      mockFileOperations(input);

      const xliffLoader = createBucketLoader("xliff", "i18n/[locale].xliff", {
        isCacheRestore: false,
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
      const payload = {
        "resources/namespace1/group/groupUnits/groupUnit/source": "Grupo",
        "resources/namespace1/key.nested/source": "Administrador de Datos XLIFF",
        "resources/namespace1/key1/source": "Hola",
        "resources/namespace1/key2/source": "Una aplicación para manipular y procesar documentos XLIFF",
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
        isCacheRestore: false,
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

        expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.txt", expectedOutput, { encoding: "utf-8", flag: "w" });
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

        expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.txt", expectedOutput, { encoding: "utf-8", flag: "w" });
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

        expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.txt", expectedOutput, { encoding: "utf-8", flag: "w" });
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

        expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.txt", expectedOutput, { encoding: "utf-8", flag: "w" });
      });
    });
  });

  describe("php bucket loader", () => {
    it("should load php array", async () => {
      setupFileMocks();

      const input = `<?php return ['button.title' => 'Submit'];`;
      const expectedOutput = { "button.title": "Submit" };

      mockFileOperations(input);

      const phpLoader = createBucketLoader("php", "i18n/[locale].php", { isCacheRestore: false, defaultLocale: "en" });
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

      const phpLoader = createBucketLoader("php", "i18n/[locale].php", { isCacheRestore: false, defaultLocale: "en" });
      phpLoader.setDefaultLocale("en");
      await phpLoader.pull("en");

      await phpLoader.push("es", {
        "button.title": "Enviar",
        "button.description/0": "Hola",
        "button.description/1": "Adiós",
      });

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.php", expectedOutput, { encoding: "utf-8", flag: "w" });
    });
  });

  describe("po bucket loader", () => {
    it("should load po file", async () => {
      setupFileMocks();

      const input = `msgid "Hello"\nmsgstr "Hello"`;
      const expectedOutput = { "Hello/singular": "Hello" };

      mockFileOperations(input);

      const poLoader = createBucketLoader("po", "i18n/[locale].po", { isCacheRestore: false, defaultLocale: "en" });
      poLoader.setDefaultLocale("en");
      const data = await poLoader.pull("en");

      expect(data).toEqual(expectedOutput);
    });

    it("should save po file", async () => {
      setupFileMocks();

      const input = `msgid "Hello"\nmsgstr "Hello"`;
      const expectedOutput = `msgid "Hello"\nmsgstr "Hola"`;

      mockFileOperations(input);

      const poLoader = createBucketLoader("po", "i18n/[locale].po", { isCacheRestore: false, defaultLocale: "en" });
      poLoader.setDefaultLocale("en");
      await poLoader.pull("en");

      await poLoader.push("es", {
        "Hello/singular": "Hola",
      });

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/es.po", expectedOutput, { encoding: "utf-8", flag: "w" });
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
        isCacheRestore: false,
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

      const vueLoader = createBucketLoader("vue-json", "i18n/App.vue", { isCacheRestore: false, defaultLocale: "en" });
      vueLoader.setDefaultLocale("en");
      await vueLoader.pull("en");

      await vueLoader.push("es", {
        hello: "hola mundo!",
      });

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/App.vue", expectedOutput, { encoding: "utf-8", flag: "w" });
    });

    it("should ignore vue file without i18n tag", async () => {
      setupFileMocks();

      const input = `${template}

${script}`;
      const expectedOutput = `${template}

${script}`;

      mockFileOperations(input);

      const vueLoader = createBucketLoader("vue-json", "i18n/App.vue", { isCacheRestore: false, defaultLocale: "en" });
      vueLoader.setDefaultLocale("en");
      await vueLoader.pull("en");

      await vueLoader.push("es", {
        hello: "hola mundo!",
      });

      expect(fs.writeFile).toHaveBeenCalledWith("i18n/App.vue", expectedOutput, { encoding: "utf-8", flag: "w" });
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
    input.hasOwnProperty(path) ? Promise.resolve() : Promise.reject(`fs.access: ${path} not mocked`),
  );
  (fs.readFile as any).mockImplementation((path) =>
    input.hasOwnProperty(path) ? Promise.resolve(input[path]) : Promise.reject(`fs.readFile: ${path} not mocked`),
  );
  (fs.writeFile as any).mockImplementation((path) =>
    input.hasOwnProperty(path) ? Promise.resolve() : Promise.reject(`fs:writeFile: ${path} not mocked`),
  );
}
