import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs/promises";
import dedent from "dedent";
import createBucketLoader from "./index";

describe("ignored keys support across buckets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    setupFileMocks();
  });

  it("android: should omit ignored keys on pull", async () => {
    const input = `
      <resources>
        <string name="button.title">Submit</string>
        <string name="button.description">Description</string>
      </resources>
    `.trim();
    mockFileOperations(input);

    const loader = createBucketLoader(
      "android",
      "values-[locale]/strings.xml",
      { defaultLocale: "en" },
      [],
      [],
      ["button.description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ "button.title": "Submit" });
  });

  it("csv: should omit ignored keys on pull", async () => {
    const input = `id,en\nbutton.title,Submit\nbutton.description,Description`;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "csv",
      "i18n.csv",
      { defaultLocale: "en" },
      [],
      [],
      ["button.description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ "button.title": "Submit" });
  });

  it("html: should omit ignored keys (by prefix) on pull", async () => {
    const input = dedent`
      <html>
        <head>
          <title>My Page</title>
          <meta name="description" content="Page description" />
        </head>
        <body>
          <h1>Hello</h1>
          <p>Paragraph</p>
        </body>
      </html>
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "html",
      "i18n/[locale].html",
      { defaultLocale: "en" },
      [],
      [],
      ["head"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data).some((k) => k.startsWith("head"))).toBe(false);
  });

  it("ejs: should omit ignored keys on pull", async () => {
    const input = `<h1>Welcome</h1><p>Hello <%= name %></p>`;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "ejs",
      "templates/[locale].ejs",
      { defaultLocale: "en" },
      [],
      [],
      ["text_*"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({});
  });

  it("json: should omit ignored keys on pull", async () => {
    const input = JSON.stringify({ title: "Submit", description: "Desc" });
    mockFileOperations(input);

    const loader = createBucketLoader(
      "json",
      "i18n/[locale].json",
      { defaultLocale: "en" },
      [],
      [],
      ["description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ title: "Submit" });
  });

  it("json5: should omit ignored keys on pull", async () => {
    const input = `{
      // comment
      title: "Submit",
      description: "Desc"
    }`;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "json5",
      "i18n/[locale].json5",
      { defaultLocale: "en" },
      [],
      [],
      ["description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ title: "Submit" });
  });

  it("jsonc: should omit ignored keys on pull", async () => {
    const input = `{
      // comment
      "title": "Submit",
      "description": "Desc"
    }`;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "jsonc",
      "i18n/[locale].jsonc",
      { defaultLocale: "en" },
      [],
      [],
      ["description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ title: "Submit" });
  });

  it("markdown: should omit ignored keys (frontmatter) on pull", async () => {
    const input = dedent`
      ---
      title: Test Markdown
      date: 2023-05-25
      ---

      # Heading 1

      Content.
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "markdown",
      "i18n/[locale].md",
      { defaultLocale: "en" },
      [],
      [],
      ["fm-attr-title"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data)).not.toContain("fm-attr-title");
  });

  it("markdoc: should omit ignored keys by semantic prefix on pull", async () => {
    const input = dedent`
      ---
      title: My Page
      ---

      # Heading 1

      Hello world
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "markdoc",
      "docs/[locale].md",
      { defaultLocale: "en" },
      [],
      [],
      ["heading"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data).some((k) => k.startsWith("heading"))).toBe(false);
  });

  it("mdx: should omit ignored section keys on pull", async () => {
    const input = dedent`
      ---
      title: Hello
      ---

      # Title

      Paragraph
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "mdx",
      "i18n/[locale].mdx",
      { defaultLocale: "en", formatter: undefined },
      [],
      [],
      ["md-section-0"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data)).not.toContain("md-section-0");
  });

  it("po: should omit ignored keys on pull", async () => {
    const input = dedent`
      #: hello.py:1
      msgid "Hello"
      msgstr ""
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "po",
      "i18n/[locale].po",
      { defaultLocale: "en" },
      [],
      [],
      ["Hello"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({});
  });

  it("properties: should omit ignored keys on pull", async () => {
    const input = dedent`
      welcome.message=Welcome
      error.message=Error
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "properties",
      "i18n/[locale].properties",
      { defaultLocale: "en" },
      [],
      [],
      ["error.message"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ "welcome.message": "Welcome" });
  });

  it("xcode-strings: should omit ignored keys on pull", async () => {
    const input = `"hello" = "Hello!";\n"bye" = "Bye!";`;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "xcode-strings",
      "i18n/[locale].strings",
      { defaultLocale: "en" },
      [],
      [],
      ["bye"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ hello: "Hello!" });
  });

  it("xcode-stringsdict: should omit ignored keys on pull", async () => {
    const input = dedent`
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
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "xcode-stringsdict",
      "i18n/[locale].stringsdict",
      { defaultLocale: "en" },
      [],
      [],
      ["items_count"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data)).toContain("greeting");
    expect(Object.keys(data).some((k) => k.startsWith("items_count"))).toBe(
      false,
    );
  });

  it("xcode-xcstrings: should omit ignored keys on pull", async () => {
    const input = dedent`
      {
        "sourceLanguage": "en",
        "strings": {
          "greeting": {
            "extractionState": "manual",
            "localizations": {
              "en": { "stringUnit": { "state": "translated", "value": "Hello!" } }
            }
          },
          "message": {
            "extractionState": "manual",
            "localizations": {
              "en": { "stringUnit": { "state": "translated", "value": "Welcome" } }
            }
          }
        }
      }
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "xcode-xcstrings",
      "i18n/[locale].xcstrings",
      { defaultLocale: "en" },
      [],
      [],
      ["message"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ greeting: "Hello!" });
  });

  it("xcode-xcstrings-v2: should omit ignored string keys on pull", async () => {
    const input = dedent`
      {
        "sourceLanguage": "en",
        "strings": {
          "hello": {
            "extractionState": "manual",
            "localizations": {
              "en": { "stringUnit": { "state": "translated", "value": "Hello" } }
            }
          },
          "world": {
            "extractionState": "manual",
            "localizations": {
              "en": { "stringUnit": { "state": "translated", "value": "World" } }
            }
          }
        }
      }
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "xcode-xcstrings-v2",
      "i18n/[locale].xcstrings",
      { defaultLocale: "en" },
      [],
      [],
      ["world"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    // xcode-xcstrings-v2 uses flat loader, so keys are paths like "hello/stringUnit"
    expect(Object.keys(data).some((k) => k.startsWith("hello"))).toBe(true);
    expect(Object.keys(data).some((k) => k.startsWith("world"))).toBe(false);
  });

  it("yaml: should omit ignored keys on pull", async () => {
    const input = dedent`
      title: Submit
      description: Desc
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "yaml",
      "i18n/[locale].yml",
      { defaultLocale: "en" },
      [],
      [],
      ["description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ title: "Submit" });
  });

  it("yaml-root-key: should omit ignored keys on pull", async () => {
    const input = dedent`
      en:
        title: Submit
        description: Desc
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "yaml-root-key",
      "i18n/[locale].yml",
      { defaultLocale: "en" },
      [],
      [],
      ["description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ title: "Submit" });
  });

  it("flutter: should omit ignored keys on pull", async () => {
    const input = JSON.stringify(
      {
        "@@locale": "en",
        greeting: "Hello, {name}!",
        "@greeting": { description: "d" },
        farewell: "Goodbye!",
      },
      null,
      2,
    );
    mockFileOperations(input);

    const loader = createBucketLoader(
      "flutter",
      "lib/l10n/app_[locale].arb",
      { defaultLocale: "en" },
      [],
      [],
      ["farewell"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data)).toContain("greeting");
    expect(Object.keys(data)).not.toContain("farewell");
  });

  it("xliff: should omit ignored keys on pull", async () => {
    const input = dedent`
      <?xml version="1.0" encoding="utf-8"?>
      <xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
        <file original="" source-language="en" datatype="plaintext">
          <body>
            <trans-unit id="greeting" resname="greeting"><source>Hello</source></trans-unit>
            <trans-unit id="farewell" resname="farewell"><source>Goodbye</source></trans-unit>
          </body>
        </file>
      </xliff>
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "xliff",
      "i18n/[locale].xliff",
      { defaultLocale: "en" },
      [],
      [],
      ["farewell"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data)).toContain("greeting");
    expect(Object.keys(data)).not.toContain("farewell");
  });

  it("xml: should omit ignored keys on pull", async () => {
    const input = `<root><title>Hello</title><description>Desc</description></root>`;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "xml",
      "i18n/[locale].xml",
      { defaultLocale: "en" },
      [],
      [],
      ["root/description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data)).toContain("root/title");
    expect(Object.keys(data)).not.toContain("root/description");
  });

  it("srt: should omit ignored keys on pull", async () => {
    const input = dedent`
      1
      00:00:01,000 --> 00:00:04,000
      Hello

      2
      00:00:05,000 --> 00:00:06,000
      World
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "srt",
      "i18n/[locale].srt",
      { defaultLocale: "en" },
      [],
      [],
      ["1#*"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    // Expect only entry 2 remains
    const keys = Object.keys(data);
    expect(keys.length).toBe(1);
    expect(keys[0].startsWith("2#")).toBe(true);
  });

  it("vtt: should omit ignored keys on pull", async () => {
    const input = dedent`
      WEBVTT

      00:00:00.000 --> 00:00:02.000
      First

      00:00:02.000 --> 00:00:04.000
      Second
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "vtt",
      "i18n/[locale].vtt",
      { defaultLocale: "en" },
      [],
      [],
      ["0#*"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    // One cue should be filtered
    expect(Object.keys(data).length).toBe(1);
  });

  it("php: should omit ignored keys on pull", async () => {
    const input = dedent`
      <?php
      return [
        'title' => 'Submit',
        'description' => 'Desc',
      ];
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "php",
      "i18n/[locale].php",
      { defaultLocale: "en" },
      [],
      [],
      ["description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ title: "Submit" });
  });

  it("vue-json: should omit ignored keys on pull", async () => {
    const input = dedent`
      <template></template>
      <i18n>
      {"en": {"title": "Hello", "description": "Desc"}}
      </i18n>
      <script setup></script>
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "vue-json",
      "i18n/App.vue",
      { defaultLocale: "en" },
      [],
      [],
      ["description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ title: "Hello" });
  });

  it("typescript: should omit ignored keys on pull", async () => {
    const input = dedent`
      export default {
        title: "Submit",
        description: "Desc"
      };
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "typescript",
      "i18n/[locale].ts",
      { defaultLocale: "en" },
      [],
      [],
      ["description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(data).toEqual({ title: "Submit" });
  });

  it("txt: should omit ignored keys on pull", async () => {
    const input = dedent`
      First line
      Second line
    `;
    mockFileOperations(input);

    const loader = createBucketLoader(
      "txt",
      "fastlane/metadata/[locale]/description.txt",
      { defaultLocale: "en" },
      [],
      [],
      ["1"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    expect(Object.keys(data)).toEqual(["2"]);
  });

  it("json-dictionary: should omit ignored keys on pull (wildcard)", async () => {
    const input = JSON.stringify(
      {
        title: { en: "Title" },
        pages: [
          {
            elements: [
              { title: { en: "E1" }, description: { en: "D1" } },
              { title: { en: "E2" }, description: { en: "D2" } },
            ],
          },
        ],
      },
      null,
      2,
    );
    mockFileOperations(input);

    const loader = createBucketLoader(
      "json-dictionary",
      "i18n/[locale].json",
      { defaultLocale: "en" },
      [],
      [],
      ["pages/*/elements/*/description"],
    );
    loader.setDefaultLocale("en");
    const data = await loader.pull("en");
    const keys = Object.keys(data);
    expect(keys).toContain("title");
    expect(keys).toContain("pages/0/elements/0/title");
    expect(keys.find((k) => k.includes("/description"))).toBeUndefined();
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
