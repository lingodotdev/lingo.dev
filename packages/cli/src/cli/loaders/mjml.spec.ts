import { describe, test, expect } from "vitest";
import createMjmlLoader from "./mjml";

// Helper function to find a key by matching content or partial path
function findKeyByContent(result: Record<string, string>, contentOrPath: string): string | undefined {
  // First try exact match
  if (result[contentOrPath]) {
    return contentOrPath;
  }

  // Try to find by content value
  const byValue = Object.keys(result).find(key => result[key] === contentOrPath);
  if (byValue) return byValue;

  // Try to find by partial path (e.g., "mj-text" finds first mj-text key)
  const byPartialPath = Object.keys(result).find(key => key.includes(contentOrPath));
  if (byPartialPath) return byPartialPath;

  return undefined;
}

// Helper to find key by path pattern and element type
function findKeyByPattern(result: Record<string, string>, pattern: string, elementType: string): string | undefined {
  // Match keys that contain the pattern and element type
  return Object.keys(result).find(key =>
    key.includes(pattern) && key.includes(elementType)
  );
}

describe("mjml loader", () => {
  test("should extract text from mj-text component", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello World</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    // Find the mj-text key (now uses content-based hash)
    const textKey = findKeyByContent(result, "Hello World");
    expect(textKey).toBeDefined();
    expect(result[textKey!]).toBe("Hello World");
  });

  test("content-based hash keys should be deterministic across multiple pulls", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello World</mj-text>
        <mj-button>Click Me</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    // Pull twice and compare keys
    const result1 = await loader.pull("en", input);
    const result2 = await loader.pull("en", input);

    console.log("First pull keys:", Object.keys(result1));
    console.log("Second pull keys:", Object.keys(result2));

    // Keys should be identical
    expect(Object.keys(result1).sort()).toEqual(Object.keys(result2).sort());
    // Values should be identical
    expect(result1).toEqual(result2);
  });

  test("should extract text from mj-button component", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-button href="https://example.com">Click Me</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    // Content-based hashing - find the actual key
    const buttonKeys = Object.keys(result).filter(k => k.includes('mj-button'));
    expect(buttonKeys.length).toBe(1);
    expect(result[buttonKeys[0]]).toBe("Click Me");
  });

  test("should extract alt attribute from mj-image component", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="image.jpg" alt="A beautiful image" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-image/0#alt"]).toBe("A beautiful image");
  });

  test("should extract title attribute from mj-button", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-button title="Hover text">Click</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-button/0"]).toBe("Click");
    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-button/0#title"]).toBe("Hover text");
  });

  test("should extract multiple text components", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>First paragraph</mj-text>
        <mj-text>Second paragraph</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0"]).toBe("First paragraph");
    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/1"]).toBe("Second paragraph");
  });

  test("should extract from nested sections and columns", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Column 1</mj-text>
      </mj-column>
      <mj-column>
        <mj-text>Column 2</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0"]).toBe("Column 1");
    expect(result["mjml/mj-body/0/mj-section/0/mj-column/1/mj-text/0"]).toBe("Column 2");
  });

  test("should push translated content back to MJML", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello World</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", input);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0": "Hola Mundo",
    };

    const output = await loader.push("es", translations, input);

    expect(output).toContain("Hola Mundo");
    expect(output).toContain("<mjml>");
    expect(output).toContain("<mj-text>");
  });

  test("should push translated attributes back to MJML", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="image.jpg" alt="A beautiful image" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", input);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-image/0#alt": "Una imagen hermosa",
    };

    const output = await loader.push("es", translations, input);

    expect(output).toContain("Una imagen hermosa");
    expect(output).toContain('alt="Una imagen hermosa"');
  });

  test("should handle mj-title component", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-head>
    <mj-title>Email Title</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-head/0/mj-title/0"]).toBe("Email Title");
  });

  test("should handle mj-preview component", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-head>
    <mj-preview>This is the preview text</mj-preview>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-head/0/mj-preview/0"]).toBe("This is the preview text");
  });

  test("should handle empty text content", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0"]).toBeUndefined();
  });

  test("should extract text from HTML elements inside mj-table", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table>
          <tr>
            <td>
              <p>First steps</p>
              <p>
                How to get started?
                <a href="https://example.com">Read the guide</a>
                and learn more.
              </p>
            </td>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-table/0/tr/0/td/0/p/0"]).toBe("First steps");
    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-table/0/tr/0/td/0/p/1"]).toContain("How to get started?");
    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-table/0/tr/0/td/0/p/1"]).toContain('<a href="https://example.com">Read the guide</a>');
  });

  test("should translate HTML elements inside mj-table", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table>
          <tr>
            <td>
              <p>First steps</p>
            </td>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", input);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-table/0/tr/0/td/0/p/0": "Primeros pasos",
    };

    const output = await loader.push("es", translations, input);

    expect(output).toContain("Primeros pasos");
    expect(output).not.toContain("First steps");
  });

  test("should handle whitespace-only text content", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>   </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0"]).toBeUndefined();
  });

  test("should preserve trailing whitespace in mixed HTML content", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <span>Get started with </span><strong>GitProtect.io</strong>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", input);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0": "Comience con <strong>GitProtect.io</strong>",
    };

    const output = await loader.push("es", translations, input);

    // Should have space between "con" and "<strong>"
    expect(output).toContain("Comience con <strong>GitProtect.io</strong>");
    // Should NOT have missing space (this would be wrong)
    expect(output).not.toContain("Comience con<strong>");
  });

  test("should preserve Razor variables in text content", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello @Model.Name</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", input);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0": "Hola @Model.Name",
    };

    const output = await loader.push("es", translations, input);

    expect(output).toContain("Hola @Model.Name");
    // Verify variable name not translated
    expect(output).not.toContain("@Modelo.Nombre");
  });

  test("should not extract content from mj-raw blocks", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-raw>@foreach (var x in Model.Items) {</mj-raw>
        <mj-text>Item text</mj-text>
        <mj-raw>}</mj-raw>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    // Should NOT extract mj-raw content
    const allValues = Object.values(result);
    expect(allValues.find((v) => v.includes("@foreach"))).toBeUndefined();
    expect(allValues.find((v) => v.includes("}"))).toBeUndefined();

    // Should extract mj-text content
    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0"]).toBe("Item text");
  });

  test("should preserve Razor expressions in attributes", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image
          src='@System.Net.WebUtility.HtmlEncode(Model.LogoUrl ?? "default.png")'
          alt="Company Logo"
        />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", input);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-image/0#alt": "Logo de la empresa",
    };

    const output = await loader.push("es", translations, input);

    // Verify Razor expression preserved in src
    expect(output).toContain("@System.Net.WebUtility.HtmlEncode");
    expect(output).toContain("Model.LogoUrl");
    // Verify translated alt attribute
    expect(output).toContain("Logo de la empresa");
  });

  test("should extract from mj-navbar-link components", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-navbar>
          <mj-navbar-link href="/home">Home</mj-navbar-link>
          <mj-navbar-link href="/about">About</mj-navbar-link>
        </mj-navbar>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-navbar/0/mj-navbar-link/0"]).toBe("Home");
    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-navbar/0/mj-navbar-link/1"]).toBe("About");
  });

  test("should extract from mj-accordion components", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-accordion>
          <mj-accordion-element>
            <mj-accordion-title>FAQ 1</mj-accordion-title>
            <mj-accordion-text>Answer to question 1</mj-accordion-text>
          </mj-accordion-element>
        </mj-accordion>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-accordion/0/mj-accordion-element/0/mj-accordion-title/0"]).toBe("FAQ 1");
    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-accordion/0/mj-accordion-element/0/mj-accordion-text/0"]).toBe("Answer to question 1");
  });

  test("should handle HTML with inline Razor variables", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          Welcome back, <strong>@Model.FirstName</strong>!
          Your last login was @Model.LastLoginDate.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", input);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0":
        "Bienvenido de nuevo, <strong>@Model.FirstName</strong>! Tu último inicio de sesión fue @Model.LastLoginDate.",
    };

    const output = await loader.push("es", translations, input);

    expect(output).toContain("Bienvenido de nuevo");
    expect(output).toContain("@Model.FirstName");
    expect(output).toContain("@Model.LastLoginDate");
  });

  test("should handle mj-wrapper structure", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-wrapper>
      <mj-section>
        <mj-column>
          <mj-text>Wrapped content</mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>`;

    const result = await loader.pull("en", input);

    expect(result["mjml/mj-body/0/mj-wrapper/0/mj-section/0/mj-column/0/mj-text/0"]).toBe("Wrapped content");
  });

  test("should preserve space between text and inline tag (real CloudServiceCreated bug)", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <span>Get started with </span><strong>GitProtect.io by Xopero ONE</strong>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const pulled = await loader.pull("en", input);

    // Translator translates, keeping the HTML structure
    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0": "Comience con <strong>GitProtect.io by Xopero ONE</strong>",
    };

    const output = await loader.push("es", translations, input);

    // Critical: space must be preserved before <strong>
    expect(output).toContain("Comience con <strong>");
    // This would be the bug: missing space
    expect(output).not.toContain("Comience con<strong>");

    // Verify the full text is correct
    expect(output).toContain("Comience con <strong>GitProtect.io by Xopero ONE</strong>");
  });

  test("should preserve trailing space when span ends with space (exact CloudServiceCreated structure)", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    // This is the EXACT structure from CloudServiceCreated.mjml line 148-149
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <span>Get started with </span
          ><strong>GitProtect.io by Xopero ONE</strong>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    const pulled = await loader.pull("en", input);
    const key = "mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0";

    // Check what was extracted
    console.log("Extracted:", JSON.stringify(pulled[key]));

    // The extracted value should preserve the space
    expect(pulled[key]).toContain("Get started with ");

    // Translator provides Spanish without <span> wrapper
    const translations = {
      [key]: "Comience con <strong>GitProtect.io by Xopero ONE</strong>",
    };

    const output = await loader.push("es", translations, input);

    // The output should have space before <strong>
    // Either as: <span>Comience con </span><strong>
    // Or as: Comience con <strong>
    expect(output).toMatch(/Comience con (<\/span>)?<strong>/);
    expect(output).not.toContain("Comience con<strong>");
  });

  test("should handle empty input string in pull", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", "");

    expect(result).toEqual({});
  });

  test("should handle whitespace-only input in pull", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const result = await loader.pull("en", "   \n\t  ");

    expect(result).toEqual({});
  });

  test("should handle empty input string in push", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    // Need to pull first to initialize state
    await loader.pull("en", "");
    const output = await loader.push("es", {}, "");

    expect(output).toBe("");
  });

  test("should handle whitespace-only input in push", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    // Need to pull first to initialize state
    await loader.pull("en", "   \n\t  ");
    const output = await loader.push("es", {}, "   \n\t  ");

    expect(output).toBe("   \n\t  ");
  });

  test("should not add XML declaration to output", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const inputWithoutDeclaration = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello World</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", inputWithoutDeclaration);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0": "Hola Mundo",
    };

    const output = await loader.push("es", translations, inputWithoutDeclaration);

    // Should NOT start with XML declaration
    expect(output).not.toMatch(/^<\?xml/);
    // Should start with <mjml>
    expect(output.trim()).toMatch(/^<mjml>/);
    expect(output).toContain("Hola Mundo");
  });

  test("should handle input with XML declaration and not duplicate it", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    const inputWithDeclaration = `<?xml version="1.0" encoding="UTF-8"?>
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello World</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", inputWithDeclaration);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0": "Hola Mundo",
    };

    const output = await loader.push("es", translations, inputWithDeclaration);

    // Should not duplicate XML declaration
    const declarationMatches = output.match(/<\?xml/g);
    expect(declarationMatches).toBeNull(); // No XML declaration in output
    expect(output).toContain("Hola Mundo");
  });

  test("should match structure of source file without XML declaration", async () => {
    const loader = createMjmlLoader();
    loader.setDefaultLocale("en");

    // Source file format (en-US)
    const sourceInput = `<mjml>
  <mj-body>
    <mj-section padding="26px 0px 86px 45px">
      <mj-column>
        <mj-image
          src="cid:logo.png"
          alt="GitProtect logo"
          width="140px"
          height="35px"
          padding="0"
          align="left"
        />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

    await loader.pull("en", sourceInput);

    const translations = {
      "mjml/mj-body/0/mj-section/0/mj-column/0/mj-image/0#alt": "Logo de GitProtect",
    };

    const output = await loader.push("es", translations, sourceInput);

    // Generated file should match source structure
    expect(output.trim()).toMatch(/^<mjml>/);
    expect(output).not.toMatch(/^<\?xml/);
    expect(output).toContain("Logo de GitProtect");
    expect(output).toContain("<mjml>");
    expect(output).toContain("</mjml>");
  });
});
