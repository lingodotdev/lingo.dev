import { describe, test, expect } from "vitest";
import createHtmlLoader from "./html";

describe("html loader", () => {
  test("should extract text from paragraph", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Hello World</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Hello World");
  });

  test("should extract leaf block with inline HTML", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Text with <strong>emphasis</strong> and <span>spans</span></p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe(
      "Text with <strong>emphasis</strong> and <span>spans</span>",
    );
  });

  test("should extract alt attribute", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<img src="/img/copy.png" alt="copy icon">`;
    const result = await loader.pull("en", input);
    expect(result["0#alt"]).toBe("copy icon");
  });

  test("should extract title attribute from multiple elements", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<button title="Copy checksum">Copy</button><a href="#" title="View details">Link</a>`;
    const result = await loader.pull("en", input);
    expect(result["0#title"]).toBe("Copy checksum");
    expect(result["0"]).toBe("Copy");
    expect(result["1#title"]).toBe("View details");
    expect(result["1"]).toBe("Link");
  });

  test("should extract placeholder from input", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<input type="text" placeholder="Enter your name">`;
    const result = await loader.pull("en", input);
    expect(result["0#placeholder"]).toBe("Enter your name");
  });

  test("should extract placeholder from textarea", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<textarea placeholder="Enter description"></textarea>`;
    const result = await loader.pull("en", input);
    expect(result["0#placeholder"]).toBe("Enter description");
  });

  test("should extract meta content attribute", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<html><head><meta name="description" content="Site description"></head><body></body></html>`;
    const result = await loader.pull("en", input);
    expect(result["head/0#content"]).toBe("Site description");
  });

  test("should handle nested block elements", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<div><h1>Title</h1><p>Paragraph</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Title");
    expect(result["0/1"]).toBe("Paragraph");
  });

  test("should handle multiple paragraphs", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("First paragraph");
    expect(result["1"]).toBe("Second paragraph");
    expect(result["2"]).toBe("Third paragraph");
  });

  test("should skip script tags", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<div><script>var x = 1;</script><p>Hello</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/script"]).toBeUndefined();
    expect(result["0/0"]).toBe("Hello");
  });

  test("should skip style tags", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<div><style>.class { color: red; }</style><p>Hello</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/style"]).toBeUndefined();
    expect(result["0/0"]).toBe("Hello");
  });

  test("should handle HTML fragments without html/body tags", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<div><p>Content</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Content");
  });

  test("should handle full HTML document structure", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<!DOCTYPE html><html><head><title>Page Title</title></head><body><p>Body content</p></body></html>`;
    const result = await loader.pull("en", input);
    expect(result["head/0"]).toBe("Page Title");
    expect(result["body/0"]).toBe("Body content");
  });

  test("should ignore empty elements", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<p></p><p>   </p><p>Content</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBeUndefined();
    expect(result["1"]).toBeUndefined();
    expect(result["2"]).toBe("Content");
  });

  test("should handle list items", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<ul>
<li>First item</li>
<li>Second item</li>
<li>Third item</li>
</ul>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("First item");
    expect(result["0/1"]).toBe("Second item");
    expect(result["0/2"]).toBe("Third item");
  });

  test("should handle table structure", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<table>
<thead>
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
  </tr>
</tbody>
</table>`;
    const result = await loader.pull("en", input);
    expect(result["0/0/0/0"]).toBe("Header 1");
    expect(result["0/0/0/1"]).toBe("Header 2");
    expect(result["0/1/0/0"]).toBe("Cell 1");
    expect(result["0/1/0/1"]).toBe("Cell 2");
  });

  test("should extract leaf block with phrasing elements", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<div><span>Just a span</span></div>`;
    const result = await loader.pull("en", input);
    // The div is a leaf block (no nested blocks), so it's extracted with innerHTML
    expect(result["0"]).toBe("<span>Just a span</span>");
  });

  test("should handle br tags within text", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Line one<br>Line two</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Line one<br>Line two");
  });

  test("should handle abbr with title attribute", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<p>The <abbr title="World Wide Web">WWW</abbr> is great</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe(
      'The <abbr title="World Wide Web">WWW</abbr> is great',
    );
    expect(result["0/0#title"]).toBeUndefined(); // abbr is inline, title extracted from leaf block
  });

  test("should handle links with title", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<a href="#" title="Learn more">Click here</a>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Click here");
    expect(result["0#title"]).toBe("Learn more");
  });

  test("should preserve whitespace structure", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Text   with   spaces</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Text   with   spaces");
  });

  test("should push translations back to HTML", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<p>Hello World</p>`;
    await loader.pull("en", originalInput);

    const translated = { "0": "Hola Mundo" };
    const output = await loader.push("es", translated);

    expect(output).toBe(`<p>Hola Mundo</p>`);
  });

  test("should push translations with inline HTML preserved", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<p>Text with <strong>emphasis</strong></p>`;
    await loader.pull("en", originalInput);

    const translated = { "0": "Texto con <strong>énfasis</strong>" };
    const output = await loader.push("es", translated);

    expect(output).toBe(`<p>Texto con <strong>énfasis</strong></p>`);
  });

  test("should push attribute translations", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<button title="Copy">Copy</button>`;
    await loader.pull("en", originalInput);

    const translated = {
      "0": "Copiar",
      "0#title": "Copiar",
    };
    const output = await loader.push("es", translated);

    expect(output).toContain('title="Copiar"');
    expect(output).toContain(">Copiar</button>");
  });

  test("should set lang attribute on html element", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<!DOCTYPE html><html><head><title>Test</title></head><body><p>Content</p></body></html>`;
    await loader.pull("en", originalInput);

    const translated = {
      "head/0": "Prueba",
      "body/0": "Contenido",
    };
    const output = await loader.push("es", translated);

    expect(output).toContain('<html lang="es">');
    expect(output).toContain("<title>Prueba</title>");
    expect(output).toContain("<p>Contenido</p>");
  });

  test("should handle multiple translations in complex structure", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<div>
<h1>Title</h1>
<p>First paragraph</p>
<p>Second paragraph</p>
<button title="Click me">Submit</button>
</div>`;
    await loader.pull("en", originalInput);

    const translated = {
      "0/0": "Título",
      "0/1": "Primer párrafo",
      "0/2": "Segundo párrafo",
      "0/3": "Enviar",
      "0/3#title": "Haz clic aquí",
    };
    const output = await loader.push("es", translated);

    expect(output).toContain("<h1>Título</h1>");
    expect(output).toContain("<p>Primer párrafo</p>");
    expect(output).toContain("<p>Segundo párrafo</p>");
    expect(output).toContain('title="Haz clic aquí"');
    expect(output).toContain(">Enviar</button>");
  });
});

describe("SVG extraction", () => {
  test("should extract SVG <title> element", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<svg><title>Chart Title</title></svg>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Chart Title");
  });

  test("should extract SVG <text> element", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<svg><text>Label Text</text></svg>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Label Text");
  });

  test("should extract SVG <desc> element", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<svg><desc>Chart Description</desc></svg>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Chart Description");
  });

  test("should skip non-translatable SVG elements", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<svg><rect x="0" y="0" width="100" height="100"/><circle cx="50" cy="50" r="40"/></svg>`;
    const result = await loader.pull("en", input);
    expect(Object.keys(result).length).toBe(0);
  });

  test("should extract only translatable elements from mixed SVG", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<svg><title>Chart</title><rect/><text>Label</text><circle/><desc>Info</desc></svg>`;
    const result = await loader.pull("en", input);
    // Non-translatable elements (rect, circle) still occupy child indices but don't extract content
    expect(result["0/0"]).toBe("Chart");
    expect(result["0/2"]).toBe("Label");
    expect(result["0/4"]).toBe("Info");
    expect(Object.keys(result).length).toBe(3);
  });

  test("should handle nested SVG groups", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<svg><g><g><text>Nested Label</text></g></g></svg>`;
    const result = await loader.pull("en", input);
    expect(result["0/0/0/0"]).toBe("Nested Label");
  });

  test("should handle SVG inside regular HTML", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<div><p>Before</p><svg><title>Chart</title></svg><p>After</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Before");
    expect(result["0/1/0"]).toBe("Chart");
    expect(result["0/2"]).toBe("After");
  });

  test("should handle SVG inside block elements", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<div><svg><rect/><text>Hello <tspan>World</tspan></text></svg></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/0/1"]).toBe("Hello <tspan>World</tspan>");
    expect(result["0"]).toBeUndefined();
  });

  test("should handle SVG inside phrasing elements", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<button><svg><title>Download icon</title><path d="M0,0"/></svg> Download</button>`;
    const result = await loader.pull("en", input);
    expect(result["0/0/0"]).toBe("Download icon");
  });

  test("should handle multiple SVG elements in document", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<div><svg><title>First Chart</title></svg><svg><title>Second Chart</title></svg></div>`;
    const result = await loader.pull("en", input);
    // SVG is a phrasing element, so div with only SVGs is a leaf block
    // The entire innerHTML is extracted as one unit
    const keys = Object.keys(result);
    expect(keys.length).toBeGreaterThan(0);
    // Check if the div is treated as leaf block or if SVGs are processed individually
    if (result["0"]) {
      // Div is a leaf block containing innerHTML with SVG elements
      expect(result["0"]).toContain("First Chart");
      expect(result["0"]).toContain("Second Chart");
    } else {
      // SVGs are processed individually
      expect(result["0/0/0"]).toBe("First Chart");
      expect(result["0/1/0"]).toBe("Second Chart");
    }
  });

  test("should not extract HTML <title> as SVG when outside svg", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<!DOCTYPE html><html><head><title>Page Title</title></head><body></body></html>`;
    const result = await loader.pull("en", input);
    expect(result["head/0"]).toBe("Page Title");
  });

  test("should distinguish between HTML title and SVG title", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `
      <!DOCTYPE html>
      <html>
        <head><title>Page Title</title></head>
        <body>
          <svg><title>SVG Title</title></svg>
        </body>
      </html>
    `;
    const result = await loader.pull("en", input);
    expect(result["head/0"]).toBe("Page Title");
    expect(result["body/0/0"]).toBe("SVG Title");
  });

  test("should handle SVG with inline elements inside text", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `<svg><text>Start <tspan>middle</tspan> end</text></svg>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Start <tspan>middle</tspan> end");
  });

  test("should handle complex SVG", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const input = `
      <svg viewBox="0 0 100 100">
        <title>Sales Chart</title>
        <desc>A bar chart showing sales data</desc>
        <g>
          <rect x="10" y="10" width="20" height="80"/>
          <text x="20" y="95">Q1</text>
        </g>
        <g>
          <rect x="40" y="30" width="20" height="60"/>
          <text x="50" y="95">Q2</text>
        </g>
      </svg>
    `;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Sales Chart");
    expect(result["0/1"]).toBe("A bar chart showing sales data");
    expect(result["0/2/1"]).toBe("Q1");
    expect(result["0/3/1"]).toBe("Q2");
  });
  test("should reconstruct SVG with translated content", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<svg><title>Chart</title><text>Label</text></svg>`;
    await loader.pull("en", originalInput);

    const translated = {
      "0/0": "Gráfico",
      "0/1": "Etiqueta",
    };
    const output = await loader.push("es", translated);

    expect(output).toContain("<title>Gráfico</title>");
    expect(output).toContain("<text>Etiqueta</text>");
  });

  test("should preserve non-translatable SVG elements during push", async () => {
    const loader = createHtmlLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<svg><title>Chart</title><rect x="0" y="0"/></svg>`;
    await loader.pull("en", originalInput);

    const translated = { "0/0": "Gráfico" };
    const output = await loader.push("es", translated);

    expect(output).toContain("<title>Gráfico</title>");
    expect(output).toContain('<rect x="0" y="0"');
  });
});
