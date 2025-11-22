import { describe, test, expect } from "vitest";
import createMjmlLoader from "./mjml";

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

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-text/0"]).toBe("Hello World");
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

    expect(result["mjml/mj-body/0/mj-section/0/mj-column/0/mj-button/0"]).toBe("Click Me");
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
});
