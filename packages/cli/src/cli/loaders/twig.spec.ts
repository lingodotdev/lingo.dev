import { describe, test, expect } from "vitest";
import createTwigLoader from "./twig";

describe("twig loader", () => {
  test("should extract text from paragraph", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Hello World</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Hello World");
  });

  test("should preserve Twig variables in text", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Welcome {{ user.name }}</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Welcome {{ user.name }}");
  });

  test("should extract leaf block with inline HTML", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Text with <strong>emphasis</strong> and <span>spans</span></p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Text with <strong>emphasis</strong> and <span>spans</span>");
  });

  test("should preserve Twig control blocks", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `{% set name = 'John' %}<p>Hello {{ name }}</p>{% if showMore %}<p>More content</p>{% endif %}`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Hello {{ name }}");
    expect(result["1"]).toBe("More content");
  });

  test("should preserve Twig comments", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `{# This is a comment #}<p>Hello World</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Hello World");
  });

  test("should extract alt attribute", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<img src="/img/copy.png" alt="copy icon">`;
    const result = await loader.pull("en", input);
    expect(result["0#alt"]).toBe("copy icon");
  });

  test("should extract title attribute from multiple elements", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<button title="Copy checksum">Copy</button><a href="#" title="View details">Link</a>`;
    const result = await loader.pull("en", input);
    expect(result["0#title"]).toBe("Copy checksum");
    expect(result["0"]).toBe("Copy");
    expect(result["1#title"]).toBe("View details");
    expect(result["1"]).toBe("Link");
  });

  test("should extract aria-label attribute", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<button aria-label="Close dialog">X</button>`;
    const result = await loader.pull("en", input);
    expect(result["0#aria-label"]).toBe("Close dialog");
    expect(result["0"]).toBe("X");
  });

  test("should extract placeholder from input", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<input type="text" placeholder="Enter your name">`;
    const result = await loader.pull("en", input);
    expect(result["0#placeholder"]).toBe("Enter your name");
  });

  test("should extract placeholder from textarea", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<textarea placeholder="Enter description"></textarea>`;
    const result = await loader.pull("en", input);
    expect(result["0#placeholder"]).toBe("Enter description");
  });

  test("should extract meta content attribute", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<html><head><meta name="description" content="Site description"></head><body></body></html>`;
    const result = await loader.pull("en", input);
    expect(result["head/0#content"]).toBe("Site description");
  });

  test("should handle nested block elements", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<div><h1>Title</h1><p>Paragraph</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Title");
    expect(result["0/1"]).toBe("Paragraph");
  });

  test("should handle multiple paragraphs", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("First paragraph");
    expect(result["1"]).toBe("Second paragraph");
    expect(result["2"]).toBe("Third paragraph");
  });

  test("should skip script tags", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<div><script>var x = 1;</script><p>Hello</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/script"]).toBeUndefined();
    expect(result["0/0"]).toBe("Hello");
  });

  test("should skip style tags", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<div><style>.class { color: red; }</style><p>Hello</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/style"]).toBeUndefined();
    expect(result["0/0"]).toBe("Hello");
  });

  test("should handle HTML fragments without html/body tags", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<div><p>Content</p></div>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Content");
  });

  test("should handle full HTML document structure", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<!DOCTYPE html><html><head><title>Page Title</title></head><body><p>Body content</p></body></html>`;
    const result = await loader.pull("en", input);
    expect(result["head/0"]).toBe("Page Title");
    expect(result["body/0"]).toBe("Body content");
  });

  test("should ignore empty elements", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p></p><p>   </p><p>Content</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBeUndefined();
    expect(result["1"]).toBeUndefined();
    expect(result["2"]).toBe("Content");
  });

  test("should handle Twig filters", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>{{ data|dateSort[0] }}</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("{{ data|dateSort[0] }}");
  });

  test("should handle Twig set block", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `{% set up = data|dateSort[0] %}<p>{{ up['name'] }}</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("{{ up['name'] }}");
  });

  test("should handle Twig for loops", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `{% for item in items %}<p>{{ item.name }}</p>{% endfor %}`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("{{ item.name }}");
  });

  test("should handle complex real-world template", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `{% set up = data|dateSort[0] %}
<div>
  <p>{{ up['name'] }}</p>
  <a href="#" data-toggle="modal">View changelog</a>
  <p id="checksum">SHA256 Checksum: <span>{{ value.checksum }}</span></p>
  <button aria-label="Copy checksum" title="Copy checksum">
    <img src="/img/copy.png" alt="copy">
  </button>
  {% if up['beta'] %}
    <h3>BETA Version. Do not use in production environments</h3>
  {% endif %}
</div>`;
    const result = await loader.pull("en", input);

    expect(result["0/0"]).toBe("{{ up['name'] }}");
    expect(result["0/1"]).toBe("View changelog");
    expect(result["0/2"]).toBe("SHA256 Checksum: <span>{{ value.checksum }}</span>");
    expect(result["0/3#aria-label"]).toBe("Copy checksum");
    expect(result["0/3#title"]).toBe("Copy checksum");
    expect(result["0/3/0#alt"]).toBe("copy");
    expect(result["0/4"]).toBe("BETA Version. Do not use in production environments");
  });

  test("should push translations back to template", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<p>Hello World</p>`;
    await loader.pull("en", originalInput);

    const translated = { "0": "Hola Mundo" };
    const output = await loader.push("es", translated);

    expect(output).toBe(`<p>Hola Mundo</p>`);
  });

  test("should push translations with Twig variables", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<p>Welcome {{ user.name }}</p>`;
    await loader.pull("en", originalInput);

    const translated = { "0": "Bienvenido {{ user.name }}" };
    const output = await loader.push("es", translated);

    expect(output).toBe(`<p>Bienvenido {{ user.name }}</p>`);
  });

  test("should push translations with inline HTML preserved", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<p>Text with <strong>emphasis</strong></p>`;
    await loader.pull("en", originalInput);

    const translated = { "0": "Texto con <strong>énfasis</strong>" };
    const output = await loader.push("es", translated);

    expect(output).toBe(`<p>Texto con <strong>énfasis</strong></p>`);
  });

  test("should push attribute translations", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<button title="Copy">Copy</button>`;
    await loader.pull("en", originalInput);

    const translated = {
      "0": "Copiar",
      "0#title": "Copiar"
    };
    const output = await loader.push("es", translated);

    expect(output).toContain('title="Copiar"');
    expect(output).toContain('>Copiar</button>');
  });

  test("should push translations preserving Twig blocks", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const originalInput = `{% set name = 'John' %}<p>Hello {{ name }}</p>{% if true %}<p>More</p>{% endif %}`;
    await loader.pull("en", originalInput);

    const translated = {
      "0": "Hola {{ name }}",
      "1": "Más"
    };
    const output = await loader.push("es", translated);

    expect(output).toContain("{% set name = 'John' %}");
    expect(output).toContain("<p>Hola {{ name }}</p>");
    expect(output).toContain("{% if true %}");
    expect(output).toContain("<p>Más</p>");
    expect(output).toContain("{% endif %}");
  });

  test("should set lang attribute on html element", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const originalInput = `<!DOCTYPE html><html><head><title>Test</title></head><body><p>Content</p></body></html>`;
    await loader.pull("en", originalInput);

    const translated = {
      "head/0": "Prueba",
      "body/0": "Contenido"
    };
    const output = await loader.push("es", translated);

    expect(output).toContain('<html lang="es">');
    expect(output).toContain("<title>Prueba</title>");
    expect(output).toContain("<p>Contenido</p>");
  });

  test("should handle multiple translations in complex structure", async () => {
    const loader = createTwigLoader();
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
      "0/3#title": "Haz clic aquí"
    };
    const output = await loader.push("es", translated);

    expect(output).toContain("<h1>Título</h1>");
    expect(output).toContain("<p>Primer párrafo</p>");
    expect(output).toContain("<p>Segundo párrafo</p>");
    expect(output).toContain('title="Haz clic aquí"');
    expect(output).toContain(">Enviar</button>");
  });

  test("should handle Twig array access syntax", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>{{ up['name'] }} and {{ data['value'] }}</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("{{ up['name'] }} and {{ data['value'] }}");
  });

  test("should handle mixed Twig and HTML", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<div>
  {% if condition %}
    <p>Show this <strong>text</strong> with {{ variable }}</p>
  {% else %}
    <p>Show that</p>
  {% endif %}
</div>`;
    const result = await loader.pull("en", input);
    expect(result["0/0"]).toBe("Show this <strong>text</strong> with {{ variable }}");
    expect(result["0/1"]).toBe("Show that");
  });

  test("should handle list items", async () => {
    const loader = createTwigLoader();
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
    const loader = createTwigLoader();
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
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<div><span>Just a span</span></div>`;
    const result = await loader.pull("en", input);
    // The div is a leaf block (no nested blocks), so it's extracted with innerHTML
    expect(result["0"]).toBe("<span>Just a span</span>");
  });

  test("should handle br tags within text", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Line one<br>Line two</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Line one<br>Line two");
  });

  test("should handle abbr with title attribute", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>The <abbr title="World Wide Web">WWW</abbr> is great</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("The <abbr title=\"World Wide Web\">WWW</abbr> is great");
    expect(result["0/0#title"]).toBeUndefined(); // abbr is inline, title extracted from leaf block
  });

  test("should handle links with title", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<a href="#" title="Learn more">Click here</a>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Click here");
    expect(result["0#title"]).toBe("Learn more");
  });

  test("should preserve whitespace structure", async () => {
    const loader = createTwigLoader();
    loader.setDefaultLocale("en");
    const input = `<p>Text   with   spaces</p>`;
    const result = await loader.pull("en", input);
    expect(result["0"]).toBe("Text   with   spaces");
  });
});
