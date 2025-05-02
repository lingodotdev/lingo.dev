import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs/promises";
import createAndroidLoader from "./android";
import { createLoader } from "./_utils";

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
      "hello": "Hello World",
      "app_name": "My App"
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
      "planets": ["Mercury", "Venus", "Earth", "Mars"]
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
      "numberOfSongsAvailable": {
        "zero": "No songs found.",
        "one": "1 song found.",
        "few": "%d songs found.",
        "many": "%d songs found.",
        "other": "%d songs found."
      }
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
      "welcome": "Welcome to <b>Android</b>!",
      "formatted": "This is <i>italic</i> and this is <b>bold</b>"
    });
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
      "welcome_messages": "Hello, %1$s! You have %2$d new messages.",
      "complex_format": "Value: %1$.2f, Text: %2$s, Number: %3$d"
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
    
    expect(result).toEqual({
      "apostrophe": "Don\\'t forget me",
      "escaped_quotes": "This has \\'single\\' quotes"
    });
    
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
      "html_content": "<html><body><h1>Title</h1><p>Paragraph</p></body></html>"
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
      "welcome": "Welcome"
    });
    expect(result.app_name).toBeUndefined();
    expect(result.version).toBeUndefined();
  });
  
  it("should correctly push string resources back to XML", async () => {
    const payload = {
      "hello": "Hola",
      "welcome": "Bienvenido"
    };
    
    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", `
      <resources>
        <string name="hello">Hello</string>
        <string name="welcome">Welcome</string>
      </resources>
    `);
    
    const result = await androidLoader.push("es", payload);
    
    expect(result).toContain('<string name="hello">Hola</string>');
    expect(result).toContain('<string name="welcome">Bienvenido</string>');
  });
  
  it("should correctly push string arrays back to XML", async () => {
    const payload = {
      "planets": ["Mercurio", "Venus", "Tierra", "Marte"]
    };
    
    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", `
      <resources>
        <string-array name="planets">
          <item>Mercury</item>
          <item>Venus</item>
          <item>Earth</item>
          <item>Mars</item>
        </string-array>
      </resources>
    `);
    
    const result = await androidLoader.push("es", payload);
    
    expect(result).toContain('<string-array name="planets">');
    expect(result).toContain('<item>Mercurio</item>');
    expect(result).toContain('<item>Venus</item>');
    expect(result).toContain('<item>Tierra</item>');
    expect(result).toContain('<item>Marte</item>');
  });
  
  it("should correctly push plurals back to XML", async () => {
    const payload = {
      "numberOfSongsAvailable": {
        "zero": "No se encontraron canciones.",
        "one": "1 canción encontrada.",
        "few": "%d canciones encontradas.",
        "many": "%d canciones encontradas.",
        "other": "%d canciones encontradas."
      }
    };
    
    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", `
      <resources>
        <plurals name="numberOfSongsAvailable">
          <item quantity="zero">No songs found.</item>
          <item quantity="one">1 song found.</item>
          <item quantity="few">%d songs found.</item>
          <item quantity="many">%d songs found.</item>
          <item quantity="other">%d songs found.</item>
        </plurals>
      </resources>
    `);
    
    const result = await androidLoader.push("es", payload);
    
    expect(result).toContain('<plurals name="numberOfSongsAvailable">');
    expect(result).toContain('<item quantity="zero">No se encontraron canciones.</item>');
    expect(result).toContain('<item quantity="one">1 canción encontrada.</item>');
    expect(result).toContain('<item quantity="few">%d canciones encontradas.</item>');
    expect(result).toContain('<item quantity="many">%d canciones encontradas.</item>');
    expect(result).toContain('<item quantity="other">%d canciones encontradas.</item>');
  });
  
  it("should correctly handle mixed resource types", async () => {
    const payload = {
      "app_name": "Mi Aplicación",
      "planets": ["Mercurio", "Venus", "Tierra", "Marte"],
      "numberOfSongsAvailable": {
        "zero": "No se encontraron canciones.",
        "one": "1 canción encontrada.",
        "other": "%d canciones encontradas."
      }
    };
    
    const androidLoader = createAndroidLoader().setDefaultLocale("en");
    await androidLoader.pull("en", `
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
    `);
    
    const result = await androidLoader.push("es", payload);
    
    expect(result).toContain('<string name="app_name">Mi Aplicación</string>');
    expect(result).toContain('<string-array name="planets">');
    expect(result).toContain('<plurals name="numberOfSongsAvailable">');
  });
});
