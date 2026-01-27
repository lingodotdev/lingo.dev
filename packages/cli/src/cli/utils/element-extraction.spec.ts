import { describe, test, expect } from "vitest";
import {
  getSvgExtractionStrategy,
  createElementExtractor,
  ExtractionContext,
} from "./element-extraction";
import { parseDocument } from "htmlparser2";
import { Element } from "domhandler";
import * as DomSerializer from "dom-serializer";

describe("getSvgExtractionStrategy", () => {
  test("SVG translatable: should return 'extract' for <title> inside <svg>", () => {
    const dom = parseDocument("<svg><title>Chart Title</title></svg>");
    const svg = dom.children[0] as Element;
    const title = svg.children[0] as Element;

    expect(getSvgExtractionStrategy(title)).toBe("extract");
  });

  test("SVG translatable: should return 'extract' for <text> inside <svg>", () => {
    const dom = parseDocument("<svg><text>Label</text></svg>");
    const svg = dom.children[0] as Element;
    const text = svg.children[0] as Element;

    expect(getSvgExtractionStrategy(text)).toBe("extract");
  });

  test("SVG translatable: should return 'extract' for <desc> inside <svg>", () => {
    const dom = parseDocument("<svg><desc>Description</desc></svg>");
    const svg = dom.children[0] as Element;
    const desc = svg.children[0] as Element;

    expect(getSvgExtractionStrategy(desc)).toBe("extract");
  });

  test("SVG translatable: should return 'extract' for nested translatable elements", () => {
    const dom = parseDocument("<svg><g><text>Nested</text></g></svg>");
    const svg = dom.children[0] as Element;
    const g = svg.children[0] as Element;
    const text = g.children[0] as Element;

    expect(getSvgExtractionStrategy(text)).toBe("extract");
  });

  test("SVG non-translatable: should return 'skip-recurse' for <svg> element itself", () => {
    const dom = parseDocument("<svg></svg>");
    const svg = dom.children[0] as Element;

    expect(getSvgExtractionStrategy(svg)).toBe("skip-recurse");
  });

  test("SVG non-translatable: should return 'skip-recurse' for <path> inside <svg>", () => {
    const dom = parseDocument("<svg><path d='M 10 10'/></svg>");
    const svg = dom.children[0] as Element;
    const path = svg.children[0] as Element;

    expect(getSvgExtractionStrategy(path)).toBe("skip-recurse");
  });

  test("Non-SVG: should return 'process-normal' for <div>", () => {
    const dom = parseDocument("<div>Content</div>");
    const div = dom.children[0] as Element;

    expect(getSvgExtractionStrategy(div)).toBe("process-normal");
  });

  test("Non-SVG: should return 'process-normal' for <title> outside SVG", () => {
    const dom = parseDocument("<head><title>Page Title</title></head>");
    const head = dom.children[0] as Element;
    const title = head.children[0] as Element;

    expect(getSvgExtractionStrategy(title)).toBe("process-normal");
  });

  test("Non-SVG: should return 'process-normal' for <span>", () => {
    const dom = parseDocument("<span>Text</span>");
    const span = dom.children[0] as Element;

    expect(getSvgExtractionStrategy(span)).toBe("process-normal");
  });

  test("Complex: should handle deeply nested SVG structure", () => {
    const dom = parseDocument(
      "<svg><g><g><text>Deep text</text></g></g></svg>",
    );
    const svg = dom.children[0] as Element;
    const g1 = svg.children[0] as Element;
    const g2 = g1.children[0] as Element;
    const text = g2.children[0] as Element;

    expect(getSvgExtractionStrategy(g1)).toBe("skip-recurse");
    expect(getSvgExtractionStrategy(g2)).toBe("skip-recurse");
    expect(getSvgExtractionStrategy(text)).toBe("extract");
  });

  test("Complex: should handle SVG with mixed translatable and non-translatable elements", () => {
    const dom = parseDocument(
      "<svg><title>Chart</title><rect x='0' y='0'/><text>Label</text><circle cx='50' cy='50'/><desc>A description</desc></svg>",
    );
    const svg = dom.children[0] as Element;
    const title = svg.children[0] as Element;
    const rect = svg.children[1] as Element;
    const text = svg.children[2] as Element;
    const circle = svg.children[3] as Element;
    const desc = svg.children[4] as Element;

    expect(getSvgExtractionStrategy(title)).toBe("extract");
    expect(getSvgExtractionStrategy(rect)).toBe("skip-recurse");
    expect(getSvgExtractionStrategy(text)).toBe("extract");
    expect(getSvgExtractionStrategy(circle)).toBe("skip-recurse");
    expect(getSvgExtractionStrategy(desc)).toBe("extract");
  });

  test("Complex: should handle SVG nested in regular HTML", () => {
    const dom = parseDocument(
      "<div><p>Before</p><svg><title>Chart</title></svg><p>After</p></div>",
    );
    const div = dom.children[0] as Element;
    const pBefore = div.children[0] as Element;
    const svg = div.children[1] as Element;
    const svgTitle = svg.children[0] as Element;
    const pAfter = div.children[2] as Element;

    expect(getSvgExtractionStrategy(div)).toBe("process-normal");
    expect(getSvgExtractionStrategy(pBefore)).toBe("process-normal");
    expect(getSvgExtractionStrategy(svg)).toBe("skip-recurse");
    expect(getSvgExtractionStrategy(svgTitle)).toBe("extract");
    expect(getSvgExtractionStrategy(pAfter)).toBe("process-normal");
  });
});

describe("createElementExtractor", () => {
  const createMockContext = (
    overrides: Partial<ExtractionContext> = {},
  ): ExtractionContext => ({
    getInnerHTML: (element: Element) =>
      element.children
        .map((child) => DomSerializer.default(child, { encodeEntities: false }))
        .join(""),
    extractAttributes: () => {},
    ...overrides,
  });

  test("should skip elements inside unlocalizable tags (script)", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<script><p>Test</p></script>");
    extractor(dom.children[0] as Element, [0]);

    expect(Object.keys(result).length).toBe(0);
  });

  test("should extract content from SVG translatable elements", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<svg><title>Chart</title></svg>");
    const svg = dom.children[0] as Element;
    extractor(svg, [0]);

    expect(result["0/0"]).toBe("Chart");
  });

  test("should recurse into SVG non-translatable elements", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<svg><g><text>Label</text></g></svg>");
    const svg = dom.children[0] as Element;
    extractor(svg, [0]);

    expect(result["0/0/0"]).toBe("Label");
  });

  test("should extract leaf block elements (p)", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<p>Hello World</p>");
    extractor(dom.children[0] as Element, [0]);

    expect(result["0"]).toBe("Hello World");
  });

  test("should extract phrasing elements with content (span)", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<span>Text</span>");
    extractor(dom.children[0] as Element, [0]);

    expect(result["0"]).toBe("Text");
  });

  test("should skip phrasing elements without content", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<span></span>");
    extractor(dom.children[0] as Element, [0]);

    expect(Object.keys(result).length).toBe(0);
  });

  test("should call extractAttributes for elements", () => {
    const result: Record<string, string> = {};
    let attributesCalled = false;
    let calledPath = "";

    const context = createMockContext({
      extractAttributes: (_: Element, path: string) => {
        attributesCalled = true;
        calledPath = path;
      },
    });

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument('<img alt="test">');
    extractor(dom.children[0] as Element, [0]);

    expect(attributesCalled).toBe(true);
    expect(calledPath).toBe("0");
  });

  test("should recurse into container elements (div with p children)", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<div><p>A</p><p>B</p></div>");
    extractor(dom.children[0] as Element, [0]);

    expect(result["0/0"]).toBe("A");
    expect(result["0/1"]).toBe("B");
  });

  test("should generate correct path from pathParts", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<p>Text</p>");
    extractor(dom.children[0] as Element, ["body", 0, 1]);

    expect(result["body/0/1"]).toBe("Text");
  });

  test("should not extract empty content after trim", () => {
    const result: Record<string, string> = {};
    const context = createMockContext();

    const extractor = createElementExtractor(context, result);
    const dom = parseDocument("<p>   </p>");
    extractor(dom.children[0] as Element, [0]);

    expect(Object.keys(result).length).toBe(0);
  });
});
