import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs/promises";
import createAndroidLoader from "./android";

describe("android loader", () => {
  const setupMocks = (input: string) => {
    vi.mock("fs/promises");
    vi.mocked(fs.readFile).mockResolvedValue(input);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should correctly handle basic string resources", async () => {
    const input = `
      <resources>
        <string name="hello">Hello World</string>
        <string name="app_name">My App</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      hello: "Hello World",
      app_name: "My App",
    });
  });

  it("should correctly handle string arrays", async () => {
    const input = `
      <resources>
        <string-array name="planets">
          <item>Mercury</item>
          <item>Venus</item>
          <item>Earth</item>
          <item>Mars</item>
        </string-array>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      planets: ["Mercury", "Venus", "Earth", "Mars"],
    });
  });

  it("should correctly handle plurals with different quantity types", async () => {
    const input = `
      <resources>
        <plurals name="numberOfSongsAvailable">
          <item quantity="zero">No songs found.</item>
          <item quantity="one">1 song found.</item>
          <item quantity="few">%d songs found.</item>
          <item quantity="many">%d songs found.</item>
          <item quantity="other">%d songs found.</item>
        </plurals>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      numberOfSongsAvailable: {
        zero: "No songs found.",
        one: "1 song found.",
        few: "%d songs found.",
        many: "%d songs found.",
        other: "%d songs found.",
      },
    });
  });

  it("should correctly handle HTML markup in strings", async () => {
    const input = `
      <resources>
        <string name="welcome">Welcome to <b>Android</b>!</string>
        <string name="formatted">This is <i>italic</i> and this is <b>bold</b></string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      welcome: "Welcome to <b>Android</b>!",
      formatted: "This is <i>italic</i> and this is <b>bold</b>",
    });
  });

  it("should correctly handle HTML markup in strings during push without duplication", async () => {
    const input = `
      <resources>
        <string name="terms_of_use"><u>Terms of Use</u></string>
        <string name="welcome">Welcome to <b>Android</b>!</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");

    // Pull first to initialize loader state
    await androidLoader.pull("en", input);

    // Push translated content with HTML
    const pushed = await androidLoader.push("es", {
      terms_of_use: "<u>Términos de uso</u>",
      welcome: "Bienvenido a <b>Android</b>!",
    });

    // Verify no duplication - should only contain escaped HTML, not both escaped and unescaped
    expect(pushed).toContain("&lt;u&gt;Términos de uso&lt;/u&gt;");
    expect(pushed).not.toContain("<u>Términos de uso</u>&lt;u&gt;");
    expect(pushed).not.toContain("&lt;u&gt;Terms of Use&lt;/u&gt;&lt;u&gt;Términos de uso&lt;/u&gt;");

    expect(pushed).toContain("&lt;b&gt;Android&lt;/b&gt;");
    expect(pushed).not.toContain("<b>Android</b>&lt;b&gt;");
  });

  it("should correctly handle format strings", async () => {
    const input = `
      <resources>
        <string name="welcome_messages">Hello, %1$s! You have %2$d new messages.</string>
        <string name="complex_format">Value: %1$.2f, Text: %2$s, Number: %3$d</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      welcome_messages: "Hello, %1$s! You have %2$d new messages.",
      complex_format: "Value: %1$.2f, Text: %2$s, Number: %3$d",
    });
  });

  it("should correctly handle single quote escaping", async () => {
    const input = `
      <resources>
        <string name="apostrophe">Don\\'t forget me</string>
        <string name="escaped_quotes">This has \\'single\\' quotes</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    // Now expect normalized apostrophes in the JS object
    expect(result).toEqual({
      apostrophe: "Don't forget me",
      escaped_quotes: "This has 'single' quotes",
    });

    // When pushing back, apostrophes should be escaped again
    const pushed = await androidLoader.push("en", result);
    expect(pushed).toContain("Don\\'t forget me");
    expect(pushed).toContain("This has \\'single\\' quotes");
  });

  it("should correctly handle CDATA sections", async () => {
    const input = `
      <resources>
        <string name="html_content"><![CDATA[<html><body><h1>Title</h1><p>Paragraph</p></body></html>]]></string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      html_content: "<html><body><h1>Title</h1><p>Paragraph</p></body></html>",
    });
  });

  it("should correctly handle multiple CDATA sections in a single string", async () => {
    const input = `
      <resources>
        <string name="multiple_cdata"><![CDATA[<first>section</first>]]><![CDATA[<second>section</second>]]></string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      multiple_cdata: "<first>section</first><second>section</second>",
    });
  });

  it("should correctly handle nested HTML tags with attributes", async () => {
    const input = `
      <resources>
        <string name="complex_html">This is <span style="color:red">red text</span> and <a href="https://example.com">a link</a></string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      complex_html:
        'This is <span style="color:red">red text</span> and <a href="https://example.com">a link</a>',
    });
  });

  it("should correctly handle XML entities in strings", async () => {
    const input = `
      <resources>
        <string name="entities">This string contains &lt;brackets&gt; and &amp;ampersands</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      entities: "This string contains <brackets> and &ampersands",
    });
  });

  it("should correctly handle empty strings", async () => {
    const input = `
      <resources>
        <string name="empty"></string>
        <string name="whitespace">   </string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      empty: "",
      whitespace: "   ",
    });
  });

  it("should correctly handle very long strings", async () => {
    const longText = "This is a very long string.".repeat(100);
    const input = `
      <resources>
        <string name="long_text">${longText}</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      long_text: longText,
    });
  });

  it("should correctly handle strings with newlines and whitespace", async () => {
    const input = `
      <resources>
        <string name="multiline">Line 1
Line 2
  Line 3 with indent</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      multiline: "Line 1\nLine 2\n  Line 3 with indent",
    });
  });

  it("should correctly handle Unicode characters", async () => {
    const input = `
      <resources>
        <string name="unicode">Unicode: 你好, こんにちは, Привет, مرحبا, 안녕하세요</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      unicode: "Unicode: 你好, こんにちは, Привет, مرحبا, 안녕하세요",
    });
  });

  it("should skip non-translatable strings", async () => {
    const input = `
      <resources>
        <string name="app_name" translatable="false">My App</string>
        <string name="welcome">Welcome</string>
        <string name="version" translatable="false">1.0.0</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      welcome: "Welcome",
    });
    expect(result.app_name).toBeUndefined();
    expect(result.version).toBeUndefined();
  });

  it("should correctly push string resources back to XML", async () => {
    const payload = {
      hello: "Hola",
      welcome: "Bienvenido",
    };

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull(
      "en",
      `
      <resources>
        <string name="hello">Hello</string>
        <string name="welcome">Welcome</string>
      </resources>
    `,
    );

    const result = await androidLoader.push("es", payload);

    expect(result).toContain('<string name="hello">Hola</string>');
    expect(result).toContain('<string name="welcome">Bienvenido</string>');
  });

  it("should correctly push string arrays back to XML", async () => {
    const payload = {
      planets: ["Mercurio", "Venus", "Tierra", "Marte"],
    };

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull(
      "en",
      `
      <resources>
        <string-array name="planets">
          <item>Mercury</item>
          <item>Venus</item>
          <item>Earth</item>
          <item>Mars</item>
        </string-array>
      </resources>
    `,
    );

    const result = await androidLoader.push("es", payload);

    expect(result).toContain('<string-array name="planets">');
    expect(result).toContain("<item>Mercurio</item>");
    expect(result).toContain("<item>Venus</item>");
    expect(result).toContain("<item>Tierra</item>");
    expect(result).toContain("<item>Marte</item>");
  });

  it("should correctly push plurals back to XML", async () => {
    const payload = {
      numberOfSongsAvailable: {
        zero: "No se encontraron canciones.",
        one: "1 canción encontrada.",
        few: "%d canciones encontradas.",
        many: "%d canciones encontradas.",
        other: "%d canciones encontradas.",
      },
    };

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull(
      "en",
      `
      <resources>
        <plurals name="numberOfSongsAvailable">
          <item quantity="zero">No songs found.</item>
          <item quantity="one">1 song found.</item>
          <item quantity="few">%d songs found.</item>
          <item quantity="many">%d songs found.</item>
          <item quantity="other">%d songs found.</item>
        </plurals>
      </resources>
    `,
    );

    const result = await androidLoader.push("es", payload);

    expect(result).toContain('<plurals name="numberOfSongsAvailable">');
    expect(result).toContain(
      '<item quantity="zero">No se encontraron canciones.</item>',
    );
    expect(result).toContain(
      '<item quantity="one">1 canción encontrada.</item>',
    );
    expect(result).toContain(
      '<item quantity="few">%d canciones encontradas.</item>',
    );
    expect(result).toContain(
      '<item quantity="many">%d canciones encontradas.</item>',
    );
    expect(result).toContain(
      '<item quantity="other">%d canciones encontradas.</item>',
    );
  });

  it("should correctly handle mixed resource types", async () => {
    const payload = {
      app_name: "Mi Aplicación",
      planets: ["Mercurio", "Venus", "Tierra", "Marte"],
      numberOfSongsAvailable: {
        zero: "No se encontraron canciones.",
        one: "1 canción encontrada.",
        other: "%d canciones encontradas.",
      },
    };

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull(
      "en",
      `
      <resources>
        <string name="app_name">My App</string>
        <string-array name="planets">
          <item>Mercury</item>
          <item>Venus</item>
          <item>Earth</item>
          <item>Mars</item>
        </string-array>
        <plurals name="numberOfSongsAvailable">
          <item quantity="zero">No songs found.</item>
          <item quantity="one">1 song found.</item>
          <item quantity="other">%d songs found.</item>
        </plurals>
      </resources>
    `,
    );

    const result = await androidLoader.push("es", payload);

    expect(result).toContain('<string name="app_name">Mi Aplicación</string>');
    expect(result).toContain('<string-array name="planets">');
    expect(result).toContain('<plurals name="numberOfSongsAvailable">');
  });

  it("should correctly handle Unicode escape sequences", async () => {
    const input = `
      <resources>
        <string name="unicode_escape">Unicode escape: \\u0041\\u0042\\u0043 and \\u65e5\\u672c\\u8a9e</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      unicode_escape:
        "Unicode escape: \\u0041\\u0042\\u0043 and \\u65e5\\u672c\\u8a9e",
    });

    const pushed = await androidLoader.push("en", result);
    expect(pushed).toContain(
      "Unicode escape: \\u0041\\u0042\\u0043 and \\u65e5\\u672c\\u8a9e",
    );
  });

  it("should correctly handle double quote escaping", async () => {
    const input = `
      <resources>
        <string name="double_quotes">He said, \\"Hello World\\"</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      double_quotes: 'He said, \\"Hello World\\"',
    });

    const pushed = await androidLoader.push("en", result);
    expect(pushed).toContain('He said, \\"Hello World\\"');
  });

  it("should correctly handle resource references", async () => {
    const input = `
      <resources>
        <string name="welcome_message">Welcome to @string/app_name</string>
        <string name="app_name">My App</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      welcome_message: "Welcome to @string/app_name",
      app_name: "My App",
    });

    const pushed = await androidLoader.push("en", result);
    expect(pushed).toContain(
      '<string name="welcome_message">Welcome to @string/app_name</string>',
    );
  });

  it("should correctly handle tools namespace attributes", async () => {
    const input = `
      <resources>
        <string name="debug_only" tools:ignore="MissingTranslation">Debug message</string>
        <string name="normal">Normal message</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      debug_only: "Debug message",
      normal: "Normal message",
    });
  });

  it("should correctly handle whitespace preservation with double quotes", async () => {
    const input = `
      <resources>
        <string name="preserved_whitespace">"   This string preserves    whitespace   "</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      preserved_whitespace: '"   This string preserves    whitespace   "',
    });

    const pushed = await androidLoader.push("en", result);
    expect(pushed).toContain(
      '<string name="preserved_whitespace">"   This string preserves    whitespace   "</string>',
    );
  });

  it("should correctly handle special characters that need escaping", async () => {
    const input = `
      <resources>
        <string name="special_chars">Special chars: \\@, \\?, \\#, \\$, \\%</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    expect(result).toEqual({
      special_chars: "Special chars: \\@, \\?, \\#, \\$, \\%",
    });

    const pushed = await androidLoader.push("en", result);
    expect(pushed).toContain("Special chars: \\@, \\?, \\#, \\$, \\%");
  });

  it("should correctly handle apostrophes in text", async () => {
    const input = `
      <resources>
        <string name="sign_in_agreement_text_1">J\'accepte les</string>
        <string name="sign_in_agreement_text_2"> et je reconnais la </string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    // During pull, escaped apostrophes should be normalized to simple apostrophes
    expect(result).toEqual({
      sign_in_agreement_text_1: "J'accepte les",
      sign_in_agreement_text_2: " et je reconnais la ",
    });

    // When pushing back, apostrophes should be escaped with backslash
    const pushed = await androidLoader.push("en", result);
    expect(pushed).toContain("J\\'accepte les");
    expect(pushed).toContain(" et je reconnais la ");
  });

  it("should escape apostrophes even in strings wrapped with double quotes", async () => {
    const input = `
      <resources>
        <string name="quoted_apostrophe">"J'accepte les terms"</string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    // During pull, the double quotes around the content should be preserved
    expect(result).toEqual({
      quoted_apostrophe: '"J\'accepte les terms"',
    });

    // When pushing back, apostrophes should be escaped even in double-quoted strings
    const pushed = await androidLoader.push("en", result);
    expect(pushed).toContain('"J\\\'accepte les terms"');
  });

  it("should correctly handle strings with apostrophes and avoid double escaping", async () => {
    const input = `
      <resources>
        <string name="welcome_message">Please don't hesitate to contact us</string>
        <item quantity="one">- %d user\'s item</item>
        <item quantity="other">- %d user\'s items</item>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const result = await androidLoader.pull("en", input);

    // During pull, escaped apostrophes should be properly handled
    expect(result.welcome_message).toBe("Please don't hesitate to contact us");

    // When pushing back, apostrophes should be escaped but not double-escaped
    const pushed = await androidLoader.push("en", {
      welcome_message: "Please don't hesitate to contact us",
      item_count: {
        one: "- %d user's item",
        other: "- %d user's items",
      },
    });

    expect(pushed).toContain("Please don\\'t hesitate to contact us");
    expect(pushed).toContain("- %d user\\'s item");
    expect(pushed).not.toContain("- %d user\\\\'s item");
  });

  // Tests for Issue Fixes

  it("should preserve whitespace in array items during pull and push", async () => {
    const input = `
      <resources>
        <string-array name="mixed_items">
          <item>  Item with spaces  </item>
          <item>    </item>
        </string-array>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const pulled = await androidLoader.pull("en", input);

    expect(pulled.mixed_items).toEqual(["  Item with spaces  ", "    "]);

    const pushed = await androidLoader.push("en", {
      mixed_items: ["  Elemento con espacios  ", "    "],
    });

    expect(pushed).toContain("<item>  Elemento con espacios  </item>");
    expect(pushed).toContain("<item>    </item>");
  });

  it("should retain CDATA wrappers for translated strings", async () => {
    const input = `
      <resources>
        <string name="cdata_example"><![CDATA[Special <tag> ]]></string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", input);

    const pushed = await androidLoader.push("es", {
      cdata_example: "Especial <tag> ",
    });

    expect(pushed).toContain(
      '<string name="cdata_example"><![CDATA[Especial <tag> ]]></string>',
    );
  });

  it("should escape apostrophes in CDATA sections", async () => {
    const input = `
      <resources>
        <string name="review_info"><![CDATA[Hosts can't see your review until they've written one. <u>Learn more</u>]]></string>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const pulled = await androidLoader.pull("en", input);

    expect(pulled.review_info).toBe(
      "Hosts can't see your review until they've written one. <u>Learn more</u>",
    );

    const pushed = await androidLoader.push("fr", {
      review_info:
        "Les hôtes ne peuvent voir votre avis qu'après en avoir écrit un. <u>En savoir plus</u>",
    });

    // Apostrophes must be escaped even inside CDATA (Android AAPT requirement)
    expect(pushed).toContain("qu\\'après");
    expect(pushed).toContain("<![CDATA[");
    expect(pushed).toContain("]]>");
    // HTML tags should NOT be escaped inside CDATA
    expect(pushed).toContain("<u>En savoir plus</u>");
    expect(pushed).not.toContain("&lt;u&gt;");
  });

  it("should preserve resource ordering after push", async () => {
    const input = `
      <resources>
        <string name="first">First</string>
        <string-array name="colors">
          <item>Red</item>
          <item>Green</item>
        </string-array>
        <plurals name="messages">
          <item quantity="one">%d message</item>
          <item quantity="other">%d messages</item>
        </plurals>
        <bool name="show_tutorial">true</bool>
        <integer name="retry_count">3</integer>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    const roundTrip = await androidLoader.pull("en", input);
    const pushed = await androidLoader.push("en", roundTrip);

    const order = Array.from(
      pushed.matchAll(
        /<(string|string-array|plurals|bool|integer)\s+name="([^"]+)"/g,
      ),
    ).map(([, , name]) => name);

    expect(order).toEqual([
      "first",
      "colors",
      "messages",
      "show_tutorial",
      "retry_count",
    ]);
  });

  it("should preserve XML declaration from source file", async () => {
    const input = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="test">Test</string>
</resources>`;

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", input);

    const result = await androidLoader.push("es", { test: "Prueba" });

    expect(result).toMatch(/^<\?xml version="1\.0" encoding="utf-8"\?>/);
  });

  it('should exclude translatable="false" items from target locale', async () => {
    const input = `
      <resources>
        <string name="app_name">My App</string>
        <string name="api_url" translatable="false">https://api.example.com</string>
        <string name="debug_key" translatable="false">DEBUG_KEY</string>
        <string-array name="colors">
          <item>Red</item>
        </string-array>
        <string-array name="urls" translatable="false">
          <item>https://example.com</item>
        </string-array>
        <plurals name="items">
          <item quantity="one">%d item</item>
          <item quantity="other">%d items</item>
        </plurals>
        <plurals name="bytes" translatable="false">
          <item quantity="one">%d byte</item>
          <item quantity="other">%d bytes</item>
        </plurals>
        <bool name="show_tutorial">true</bool>
        <bool name="is_debug" translatable="false">false</bool>
        <integer name="timeout">30</integer>
        <integer name="version" translatable="false">42</integer>
      </resources>
    `.trim();

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", input);

    const result = await androidLoader.push("es", {
      app_name: "Mi Aplicación",
      colors: ["Rojo"],
      items: { one: "%d elemento", other: "%d elementos" },
      show_tutorial: true,
      timeout: 30,
    });

    // Check that translatable="false" items are NOT included
    expect(result).not.toContain('name="api_url"');
    expect(result).not.toContain("https://api.example.com");
    expect(result).not.toContain('name="debug_key"');
    expect(result).not.toContain("DEBUG_KEY");
    expect(result).not.toContain('name="urls"');
    expect(result).not.toContain('name="bytes"');
    expect(result).not.toContain('name="is_debug"');
    expect(result).not.toContain('name="version"');

    // Check that translatable items are translated
    expect(result).toContain("Mi Aplicación");
    expect(result).toContain("Rojo");
    expect(result).toContain("elemento");
    expect(result).toContain('name="app_name"');
    expect(result).toContain('name="colors"');
    expect(result).toContain('name="items"');
    expect(result).toContain('name="show_tutorial"');
    expect(result).toContain('name="timeout"');
  });

  it("should use 4-space indentation by default", async () => {
    const input = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="test">Test</string>
    <string name="another">Another</string>
</resources>`;

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", input);

    const result = await androidLoader.push("es", {
      test: "Prueba",
      another: "Otro",
    });

    // Check for 4-space indentation (default)
    // Note: Users should use formatters (Prettier/Biome) for custom indentation
    expect(result).toContain('\n    <string name="test">');
    expect(result).toContain('\n    <string name="another">');
  });

  it("should preserve XML declaration encoding from source file", async () => {
    const inputUtf8 = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="test">Test</string>
</resources>`;

    const inputUpperUTF8 = `<?xml version="1.0" encoding="UTF-8"?>
<resources>
    <string name="test">Test</string>
</resources>`;

    const inputISO = `<?xml version="1.0" encoding="ISO-8859-1"?>
<resources>
    <string name="test">Test</string>
</resources>`;

    const androidLoader = createAndroidLoader().setDefaultLocale("en");

    // Test lowercase utf-8
    await androidLoader.pull("en", inputUtf8);
    let result = await androidLoader.push("es", { test: "Prueba" });
    expect(result).toMatch(/^<\?xml version="1\.0" encoding="utf-8"\?>/);

    // Test uppercase UTF-8
    await androidLoader.pull("en", inputUpperUTF8);
    result = await androidLoader.push("es", { test: "Prueba" });
    expect(result).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);

    // Test ISO-8859-1
    await androidLoader.pull("en", inputISO);
    result = await androidLoader.push("es", { test: "Prueba" });
    expect(result).toMatch(/^<\?xml version="1\.0" encoding="ISO-8859-1"\?>/);
  });

  it("should preserve XML version from source file", async () => {
    const inputV10 = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="test">Test</string>
</resources>`;

    const inputV11 = `<?xml version="1.1" encoding="utf-8"?>
<resources>
    <string name="test">Test</string>
</resources>`;

    const androidLoader = createAndroidLoader().setDefaultLocale("en");

    // Test version 1.0
    await androidLoader.pull("en", inputV10);
    let result = await androidLoader.push("es", { test: "Prueba" });
    expect(result).toMatch(/^<\?xml version="1\.0"/);

    // Test version 1.1
    await androidLoader.pull("en", inputV11);
    result = await androidLoader.push("es", { test: "Prueba" });
    expect(result).toMatch(/^<\?xml version="1\.1"/);
  });

  it("should omit XML declaration when source has none", async () => {
    const inputNoDeclaration = `<resources>
    <string name="test">Test</string>
</resources>`;

    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", inputNoDeclaration);

    const result = await androidLoader.push("es", { test: "Prueba" });

    // Should start immediately with the root element (no declaration)
    expect(result).not.toMatch(/^<\?xml/);
    expect(result.trim().startsWith("<resources>")).toBe(true);
  });
});
