/**
 * Transform Component Tests
 *
 * These tests verify the JSX transformation logic using in-memory mocks.
 * No actual files are created - all metadata and config stay in memory.
 *
 * The transformComponent function is pure - it takes code and metadata as input
 * and returns transformed code + new entries. It never touches the filesystem.
 */

import { assert, beforeEach, describe, expect, it } from "vitest";
import { transformComponent } from "./index";
import type {
  AttributeTranslationEntry,
  ContentTranslationEntry,
  LingoConfig,
  MetadataTranslationEntry,
  TranslationEntry,
} from "../../types";
import { createMockConfig } from "../../__test-utils__/mocks";

// Test helpers to safely cast entries (tests know the expected types)
function asContent(entry: TranslationEntry): ContentTranslationEntry {
  expect(entry.type).toBe("content");
  return entry as ContentTranslationEntry;
}

function asAttribute(entry: TranslationEntry): AttributeTranslationEntry {
  expect(entry.type).toBe("attribute");
  return entry as AttributeTranslationEntry;
}

function asMetadata(entry: TranslationEntry): MetadataTranslationEntry {
  expect(entry.type).toBe("metadata");
  return entry as MetadataTranslationEntry;
}

describe("transformComponent", () => {
  let config: LingoConfig;

  beforeEach(() => {
    // Create fresh in-memory mocks for each test
    // No actual files are created during tests
    config = createMockConfig();
  });

  describe("single component", () => {
    it("should transform a simple component with text", () => {
      const code = `
export function Welcome() {
  return <div>Hello World</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Welcome.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].sourceText).toBe("Hello World");
      expect(result.code).toMatchSnapshot();
    });

    it("should transform component with multiple text nodes", () => {
      const code = `
export function Card() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is a description</p>
      <button>Click me</button>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Card.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      expect(result.newEntries).toHaveLength(3);
      assert.isDefined(result.newEntries);
      expect(result.newEntries.map((e) => e.sourceText)).toEqual([
        "Welcome",
        "This is a description",
        "Click me",
      ]);
      expect(result.code).toMatchSnapshot();
    });

    it("should skip whitespace-only text", () => {
      const code = `
export function Spacey() {
  return (
    <div>

      <h1>Title</h1>

    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Spacey.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries?.[0].sourceText).toBe("Title");
      expect(result.code).toMatchSnapshot();
    });
  });

  describe("multiple components in one file", () => {
    it("should transform multiple function components", () => {
      const code = `
export function Header() {
  return <header>Site Header</header>;
}

export function Footer() {
  return <footer>Site Footer</footer>;
}

export function Main() {
  return <main>Main Content</main>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Layout.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(3);
      expect(result.newEntries.map((e) => e.sourceText)).toEqual([
        "Site Header",
        "Site Footer",
        "Main Content",
      ]);

      // Each component should have correct context
      expect(asContent(result.newEntries[0]).context.componentName).toBe(
        "Header",
      );
      expect(asContent(result.newEntries[1]).context.componentName).toBe(
        "Footer",
      );
      expect(asContent(result.newEntries[2]).context.componentName).toBe(
        "Main",
      );

      expect(result.code).toMatchSnapshot();
    });

    it("should transform arrow function components", () => {
      const code = `
const Welcome = () => {
  return <div>Welcome Message</div>;
};

const Goodbye = () => <div>Goodbye Message</div>;

export { Welcome, Goodbye };
`;

      const result = transformComponent({
        code,
        filePath: "src/Messages.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);
      expect(result.newEntries.map((e) => e.sourceText)).toEqual([
        "Welcome Message",
        "Goodbye Message",
      ]);

      // Each component has its own context
      expect(asContent(result.newEntries[0]).context.componentName).toBe(
        "Welcome",
      );
      expect(asContent(result.newEntries[1]).context.componentName).toBe(
        "Goodbye",
      );

      expect(result.code).toMatchSnapshot();
    });

    it("should transform mixed function and arrow components", () => {
      const code = `
export function Title() {
  return <h1>Page Title</h1>;
}

const Subtitle = () => {
  return <h2>Page Subtitle</h2>;
};

export const Description = () => <p>Page Description</p>;

export default function Container() {
  return (
    <div>
      <Title />
      <Subtitle />
      <Description />
      <footer>Footer Text</footer>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Page.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(4);
      expect(result.newEntries.map((e) => e.sourceText)).toEqual([
        "Page Title",
        "Page Subtitle",
        "Page Description",
        "Footer Text",
      ]);

      // Each component has its own context
      expect(asContent(result.newEntries[0]).context.componentName).toBe(
        "Title",
      );
      expect(asContent(result.newEntries[1]).context.componentName).toBe(
        "Subtitle",
      );
      expect(asContent(result.newEntries[2]).context.componentName).toBe(
        "Description",
      );
      expect(asContent(result.newEntries[3]).context.componentName).toBe(
        "Container",
      );

      expect(result.code).toMatchSnapshot();
    });

    it("should handle nested components", () => {
      const code = `
function OuterComponent() {
  function InnerComponent() {
    return <span>Inner Text</span>;
  }

  return (
    <div>
      <h1>Outer Text</h1>
      <InnerComponent />
    </div>
  );
}

export default OuterComponent;
`;

      const result = transformComponent({
        code,
        filePath: "src/Nested.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);
      // Note: Inner component is visited first during AST traversal
      expect(result.newEntries.map((e) => e.sourceText)).toEqual([
        "Inner Text",
        "Outer Text",
      ]);

      expect(result.code).toMatchSnapshot();
    });

    it("should handle deeply nested components", () => {
      const code = `
function OuterComponent() {
  function InnerComponent1() {
    function InnerComponent2() {
        return <span>Inner Text</span>;
    }

    function InnerComponent3() {
        return <span>Inner Text</span>;
    }

    return <span>
      Inner Text
      <InnerComponent2 />
      <InnerComponent3 />
    </span>;
  }

  function InnerComponent1_2() {
    function InnerComponent2() {
        return <span>Inner Text</span>;
    }

    function InnerComponent3() {
        return <span>Inner Text</span>;
    }

    return <span>
      Inner Text
      <InnerComponent2 />
      <InnerComponent3 />
    </span>;
  }

  return (
    <div>
      <h1>Outer Text</h1>
      <InnerComponent />
    </div>
  );
}

export default OuterComponent;
`;

      const result = transformComponent({
        code,
        filePath: "src/Nested.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      expect(result.code).toMatchSnapshot();
    });
  });

  describe("component with existing translation calls", () => {
    it("should not transform text that's already in expressions", () => {
      const code = `
export function AlreadyTranslated() {
  const text = "Some text";
  return <div>{text}</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Already.tsx",
        config,
      });

      expect(result.transformed).toBe(false);
      expect(result.newEntries).toHaveLength(0);
    });
  });

  describe("non-component files", () => {
    it("should not transform files without JSX", () => {
      const code = `
export function regularFunction() {
  return "Hello World";
}
`;

      const result = transformComponent({
        code,
        filePath: "src/utils.ts",
        config,
      });

      expect(result.transformed).toBe(false);
      expect(result.newEntries).toHaveLength(0);
    });

    it("should not transform functions that don't return JSX", () => {
      const code = `
export function notAComponent() {
  const element = document.createElement('div');
  element.textContent = 'Hello';
  return element;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/DomUtils.tsx",
        config,
      });

      expect(result.transformed).toBe(false);
      expect(result.newEntries).toHaveLength(0);
    });
  });

  describe("complex component scenarios", () => {
    it("should handle components with conditional rendering", () => {
      const code = `
export function ConditionalComponent({ showMessage }) {
  return (
    <div>
      <h1>Title</h1>
      {showMessage && <p>Optional Message</p>}
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Conditional.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);
      expect(result.newEntries.map((e) => e.sourceText)).toEqual([
        "Title",
        "Optional Message",
      ]);
      expect(result.code).toMatchSnapshot();
    });

    it("should handle components with map", () => {
      const code = `
export function ListComponent({ items }) {
  return (
    <div>
      <h1>List Title</h1>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/List.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      // Only the h1 should be transformed, not the expression in map
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].sourceText).toBe("List Title");
      expect(result.code).toMatchSnapshot();
    });
  });

  describe("metadata context", () => {
    it("should include correct file path in context", () => {
      const code = `
export function Test() {
  return <div>Test</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/components/Test.tsx",
        config,
      });

      assert.isDefined(result.newEntries);
      expect(result.newEntries[0].location.filePath).toBe(
        "components/Test.tsx",
      );
    });

    it("should include line and column information", () => {
      const code = `
export function Test() {
  return <div>Test</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Test.tsx",
        config,
      });
      assert.isDefined(result.newEntries);
      expect(result.newEntries[0].location.line).toBeDefined();
      expect(result.newEntries[0].location.column).toBeDefined();
    });

    it("should generate consistent hashes", () => {
      const code = `
export function Test() {
  return <div>Hello</div>;
}
`;

      const result1 = transformComponent({
        code,
        filePath: "src/Test.tsx",
        config,
      });

      const result2 = transformComponent({
        code,
        filePath: "src/Test.tsx",
        config,
      });

      assert.isDefined(result1.newEntries);
      assert.isDefined(result2.newEntries);
      expect(result1.newEntries[0].hash).toBe(result2.newEntries[0].hash);
    });
  });

  describe("use directive mode", () => {
    it("should skip files without directive when useDirective is true", () => {
      const directiveConfig = createMockConfig({ useDirective: true });

      const code = `
export function Test() {
  return <div>Hello</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Test.tsx",
        config: directiveConfig,
      });

      expect(result.transformed).toBe(false);
      expect(result.newEntries).toHaveLength(0);
    });

    it("should transform files with 'use i18n' directive", () => {
      const directiveConfig = createMockConfig({ useDirective: true });

      const code = `
"use i18n";

export function Test() {
  return <div>Hello</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Test.tsx",
        config: directiveConfig,
      });

      expect(result.transformed).toBe(true);
      expect(result.newEntries).toHaveLength(1);
      expect(result.code).toMatchSnapshot();
    });
  });

  describe("metadata transformation", () => {
    it("should transform static metadata export to generateMetadata", () => {
      const nextConfig = createMockConfig();

      const code = `
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page Title",
  description: "This is my page description",
};

export default function Page() {
  return <div>Content</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should have 3 entries: 2 metadata strings + 1 component text
      expect(result.newEntries).toHaveLength(3);

      // Check metadata entries
      const metadataEntries = result.newEntries.filter(
        (e) => e.type === "metadata",
      );
      expect(metadataEntries).toHaveLength(2);
      expect(metadataEntries.map((e) => e.sourceText)).toEqual([
        "My Page Title",
        "This is my page description",
      ]);
      expect(metadataEntries[0].type).toBe("metadata");
      expect(metadataEntries[1].type).toBe("metadata");
      expect(metadataEntries[0].context.fieldPath).toBe("title");
      expect(metadataEntries[1].context.fieldPath).toBe("description");

      expect(result.code).toMatchSnapshot();
    });

    it("should transform existing generateMetadata function", () => {
      const nextConfig = createMockConfig();

      const code = `
export async function generateMetadata({ params }) {
  return {
    title: "Dynamic Title",
    description: "Dynamic Description",
  };
}

export default function Page() {
  return <div>Content</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should have 3 entries: 2 metadata strings + 1 component text
      expect(result.newEntries).toHaveLength(3);

      // Check metadata entries
      const metadataEntries = result.newEntries.filter(
        (e) => e.type === "metadata",
      );
      expect(metadataEntries).toHaveLength(2);
      expect(metadataEntries.map((e) => e.sourceText)).toEqual([
        "Dynamic Title",
        "Dynamic Description",
      ]);

      expect(result.code).toMatchSnapshot();
    });

    it("should handle nested metadata objects (openGraph, twitter)", () => {
      const nextConfig = createMockConfig();

      const code = `
export const metadata = {
  title: "Page Title",
  description: "Page Description",
  openGraph: {
    title: "OG Title",
    description: "OG Description",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter Title",
    description: "Twitter Description",
  },
};
`;

      const result = transformComponent({
        code,
        filePath: "src/app/layout.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should extract only translatable fields (6 total, excluding "twitter.card")
      expect(result.newEntries).toHaveLength(6);

      const metadataEntries = result.newEntries.filter(
        (e) => e.type === "metadata",
      );
      expect(metadataEntries).toHaveLength(6);

      // Check field paths (twitter.card should be excluded)
      expect(metadataEntries.map((e) => e.context.fieldPath)).toEqual([
        "title",
        "description",
        "openGraph.title",
        "openGraph.description",
        "twitter.title",
        "twitter.description",
      ]);

      expect(metadataEntries.map((e) => e.sourceText)).toEqual([
        "Page Title",
        "Page Description",
        "OG Title",
        "OG Description",
        "Twitter Title",
        "Twitter Description",
      ]);

      expect(result.code).toMatchSnapshot();
    });

    it("should handle metadata with template literals (static only)", () => {
      const nextConfig = createMockConfig();

      const code = `
export const metadata = {
  title: \`Static Title\`,
  description: "Regular Description",
};
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should extract both strings
      expect(result.newEntries).toHaveLength(2);
      expect(result.newEntries.map((e) => e.sourceText)).toEqual([
        "Static Title",
        "Regular Description",
      ]);

      expect(result.code).toMatchSnapshot();
    });

    it("should skip metadata with no translatable strings", () => {
      const nextConfig = createMockConfig();

      const code = `
export const metadata = {
  robots: { index: true, follow: true },
  viewport: { width: 1024 },
};

export default function Page() {
  return <div>Content</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      // Only the component text should be transformed
      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].type).not.toBe("metadata");
      expect(result.newEntries[0].sourceText).toBe("Content");

      // Metadata export should remain unchanged
      expect(result.code).toContain("export const metadata");
      expect(result.code).not.toContain("generateMetadata");
    });

    it("should not transform generateMetadata without translatable content", () => {
      const nextConfig = createMockConfig();

      const code = `
export async function generateMetadata() {
  return {
    robots: { index: true },
  };
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/layout.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(false);
      expect(result.newEntries).toHaveLength(0);

      // Code should remain unchanged
      expect(result.code).not.toContain("getServerTranslations");
    });

    it("should generate consistent hashes for metadata fields", () => {
      const nextConfig = createMockConfig();

      const code = `
export const metadata = {
  title: "Test Title",
};
`;

      const result1 = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      const result2 = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      assert.isDefined(result1.newEntries);
      assert.isDefined(result2.newEntries);
      expect(result1.newEntries[0].hash).toBe(result2.newEntries[0].hash);
    });

    it("should translate title.template and title.default", () => {
      const nextConfig = createMockConfig();

      const code = `
export const metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme',
  },
  description: "Company site",
};
`;

      const result = transformComponent({
        code,
        filePath: "src/app/layout.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(3);

      const metadataEntries = result.newEntries.filter(
        (e) => e.type === "metadata",
      );
      expect(metadataEntries.map((e) => e.context.fieldPath)).toEqual([
        "title.template",
        "title.default",
        "description",
      ]);
      expect(metadataEntries.map((e) => e.sourceText)).toEqual([
        // TODO (AleksandrSl 27/11/2025): Ensure correct translation of this, so that the tempalte structure is preserved.
        "%s | Acme",
        "Acme",
        "Company site",
      ]);
    });

    it("should translate openGraph.images[].alt", () => {
      const nextConfig = createMockConfig();

      const code = `
export const metadata = {
  openGraph: {
    images: [
      {
        url: 'https://example.com/image1.jpg',
        alt: 'First image description',
      },
      {
        url: 'https://example.com/image2.jpg',
        alt: 'Second image description',
      },
    ],
  },
};
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      const metadataEntries = result.newEntries.filter(
        (e) => e.type === "metadata",
      );
      expect(metadataEntries.map((e) => e.context.fieldPath)).toEqual([
        "openGraph.images[0].alt",
        "openGraph.images[1].alt",
      ]);
      expect(metadataEntries.map((e) => e.sourceText)).toEqual([
        "First image description",
        "Second image description",
      ]);

      // URLs should NOT be translated
      expect(result.code).toContain("'https://example.com/image1.jpg'");
      expect(result.code).toContain("'https://example.com/image2.jpg'");
    });

    it("should translate twitter.images[].alt", () => {
      const nextConfig = createMockConfig();

      const code = `
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://example.com/twitter.jpg',
        alt: 'Twitter card image',
      },
    ],
  },
};
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const metadataEntry = asMetadata(result.newEntries[0]);
      expect(metadataEntry.context.fieldPath).toBe("twitter.images[0].alt");
      expect(metadataEntry.sourceText).toBe("Twitter card image");

      // URL and card should NOT be translated
      expect(result.code).toContain("'https://example.com/twitter.jpg'");
      expect(result.code).toContain("'summary_large_image'");
    });

    it("should translate appleWebApp.title", () => {
      const nextConfig = createMockConfig();

      const code = `
export const metadata = {
  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
  },
};
`;

      const result = transformComponent({
        code,
        filePath: "src/app/layout.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const metadataEntry = asMetadata(result.newEntries[0]);
      expect(metadataEntry.context.fieldPath).toBe("appleWebApp.title");
      expect(metadataEntry.sourceText).toBe("Apple Web App");

      // statusBarStyle should NOT be translated
      expect(result.code).toContain("'black-translucent'");
    });
  });

  describe("mixed content (rich text)", () => {
    it("should transform JSX with text and expressions", () => {
      const code = `
export default function Welcome() {
  const name = "John";
  return <div>Hello {name}, welcome!</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Welcome.tsx",
        config: createMockConfig(),
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = asContent(result.newEntries[0]);
      expect(entry.sourceText).toBe("Hello {name}, welcome!");
      expect(entry.context.componentName).toBe("Welcome");

      // Should generate rich text t() call
      expect(result.code).toContain("t(");
      expect(result.code).toContain('"Hello {name}, welcome!"');
      expect(result.code).toContain("name");
      expect(result.code).toMatchSnapshot();
    });

    it("should transform JSX with text, expressions, and nested elements", () => {
      const code = `
export default function Message() {
  const name = "Alice";
  const count = 5;
  return <div>Hello {name}, you have <strong>{count}</strong> messages</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Message.tsx",
        config: createMockConfig(),
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = asContent(result.newEntries[0]);
      expect(entry.sourceText).toBe(
        "Hello {name}, you have <strong0>{count}</strong0> messages",
      );
      expect(entry.context.componentName).toBe("Message");

      expect(result.code).toMatchSnapshot();
    });

    it("should handle multiple same-type nested elements", () => {
      const code = `
export default function Links() {
  return <p>Click <a href="/home">here</a> or <a href="/about">there</a></p>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Links.tsx",
        config: createMockConfig(),
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.sourceText).toBe("Click <a0>here</a0> or <a1>there</a1>");

      // Should have two separate component renderers
      expect(result.code).toContain("a0:");
      expect(result.code).toContain("a1:");
      expect(result.code).toMatchSnapshot();
    });

    it("should keep text separated by void elements as the single translation", () => {
      const code = `
export default function Links() {
  return <p>Click <br />there</p>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Links.tsx",
        config: createMockConfig(),
      });

      expect(result.code).toMatchSnapshot();
    });

    it("should handle fragments", () => {
      const code = `
export default function Simple() {
  return <>
  <b>Mixed</b> content <i>fragment</i>
</>
}
`;
      const result = transformComponent({
        code,
        filePath: "src/Simple.tsx",
        config: createMockConfig(),
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      expect(result.code).toMatchSnapshot();
    });

    it("should not transform simple text-only elements", () => {
      const code = `
export default function Simple() {
  return <div>Just plain text</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Simple.tsx",
        config: createMockConfig(),
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.sourceText).toBe("Just plain text");

      // Should generate simple t() call, not rich text
      expect(result.code).toContain("t(");
      expect(result.code).not.toContain("chunks");
      expect(result.code).toMatchSnapshot();
    });

    it('should handle string literal expressions like {" "}', () => {
      const code = `
export default function Spaced() {
  return <p>Click <a href="/home">here</a>{" "}or{" "}<a href="/about">there</a></p>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Spaced.tsx",
        config: createMockConfig(),
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      // String literals like {" "} should be included directly in the text
      expect(entry.sourceText).toBe("Click <a0>here</a0> or <a1>there</a1>");
      expect(entry.sourceText).not.toContain("{expression}");

      // Should generate rich text t() call
      expect(result.code).toContain("t(");
      expect(result.code).toContain("a0:");
      expect(result.code).toContain("a1:");
      expect(result.code).toMatchSnapshot();
    });

    it("should NOT treat void elements (like Image) as rich text", () => {
      const code = `
import Image from "next/image";

export default function Button() {
  return (
    <a href="/deploy">
      <Image src="/icon.svg" alt="Icon" width={16} height={16} />
      Deploy Now
    </a>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config: createMockConfig(),
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should translate both the alt attribute and "Deploy Now" as simple text, not as rich text
      // The Image should remain in its original position
      expect(result.newEntries).toHaveLength(2);

      const altEntry = result.newEntries.find(
        (e) => e.type === "attribute" && e.context.attributeName === "alt",
      );
      expect(altEntry?.sourceText).toBe("Icon");

      const textEntry = result.newEntries.find((e) => e.type === "content");
      expect(textEntry?.sourceText).toBe("Deploy Now");

      // Should NOT generate rich text with Image0
      expect(result.code).not.toContain("Image0:");
      expect(result.code).not.toContain("chunks =>");
      expect(result.code).toMatchSnapshot();
    });

    it("should handle expressions in JSX attributes", () => {
      const code = `
function Home() {
  const { locale, translations } = useTranslationContext();
  return (
    <div>
      <h1>Home Page</h1>
      <p>Current locale: {locale}</p>
      <p>Translations loaded: {JSON.stringify(translations)}</p>
    </div>
  );
}`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config: createMockConfig(),
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("server components", () => {
    it("should transform server component with multiple text nodes in paragraph", () => {
      const nextConfig = createMockConfig();

      const code = `
export default async function ServerPage() {
  return (
    <div>
      <h1>Welcome to our site</h1>
      <p>This is a paragraph with three short strings inside it.</p>
      <button>Click here</button>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(3);
      expect(result.newEntries.map((e) => e.sourceText)).toEqual([
        "Welcome to our site",
        "This is a paragraph with three short strings inside it.",
        "Click here",
      ]);

      // Should inject getServerTranslations import
      expect(result.code).toContain("import { getServerTranslations } from");

      // Should inject await getServerTranslations with hashes array
      expect(result.code).toContain("await getServerTranslations");
      expect(result.code).toContain("hashes:");

      // Should make component async
      expect(result.code).toContain("async function ServerPage");

      expect(result.code).toMatchSnapshot();
    });

    it("should inject correct hash array for server component", () => {
      const nextConfig = createMockConfig();

      const code = `
export async function ServerCard() {
  return (
    <div>
      <h2>Title</h2>
      <p>Description</p>
      <span>Footer</span>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/components/ServerCard.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(3);

      // Should have all three hashes in the array
      const hashes = result.newEntries.map((e) => e.hash);
      for (const hash of hashes) {
        expect(result.code).toContain(hash);
      }

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("isomorphic hooks (unified useTranslation)", () => {
    it("should use unified hook for non-async server component", () => {
      const nextConfig = createMockConfig();

      const code = `
export default function ServerPage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is a non-async server component</p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      // Should use unified hook import (not getServerTranslations!)
      expect(result.code).toContain("import { useTranslation } from");
      expect(result.code).not.toContain("import { getServerTranslations }");

      // Should use useTranslation hook (not await getServerTranslations!)
      expect(result.code).toContain("useTranslation(");
      expect(result.code).not.toContain("await getServerTranslations");

      // Function should NOT be made async
      expect(result.code).toContain("function ServerPage()");
      expect(result.code).not.toContain("async function ServerPage()");

      expect(result.code).toMatchSnapshot();
    });

    it("should use unified hook for client component with 'use client' directive", () => {
      const nextConfig = createMockConfig();

      const code = `
'use client';

export default function ClientPage() {
  return (
    <div>
      <h1>Client Component</h1>
      <p>This uses the same API</p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/components/ClientPage.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      // Should use unified hook (same as server!)
      expect(result.code).toContain("import { useTranslation } from");
      expect(result.code).toContain("useTranslation(");

      // Should NOT use async API
      expect(result.code).not.toContain("getServerTranslations");
      expect(result.code).not.toContain("async function");

      expect(result.code).toMatchSnapshot();
    });

    it("should still use async API for truly async server components", () => {
      const nextConfig = createMockConfig();

      const code = `
export default async function AsyncServerPage() {
  const data = await fetchData();
  return (
    <div>
      <h1>Async Server Component</h1>
      <p>Data: {data}</p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      // Should use async API (getServerTranslations)
      expect(result.code).toContain("import { getServerTranslations } from");
      expect(result.code).toContain("await getServerTranslations");

      // Should remain async
      expect(result.code).toContain("async function AsyncServerPage");

      expect(result.code).toMatchSnapshot();
    });

    it("should handle mixed async and non-async components in same file", () => {
      const nextConfig = createMockConfig();

      const code = `
export async function AsyncCard() {
  const data = await fetchData();
  return <div>Async: {data}</div>;
}

export function RegularCard() {
  return <div>Regular Hello</div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/components/Cards.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      // Should have BOTH imports!
      expect(result.code).toContain("import { useTranslation } from");
      expect(result.code).toContain("import { getServerTranslations } from");

      // AsyncCard uses async API
      expect(result.code).toMatch(
        /async function AsyncCard.*await getServerTranslations/s,
      );

      // RegularCard uses unified hook
      expect(result.code).toMatch(/function RegularCard.*useTranslation/s);

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("attributes translation", () => {
    it("should translate title attribute", () => {
      const code = `
export function Button() {
  return <button title="Click to submit">Submit</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      // Check attribute entry
      const attrEntry = result.newEntries.find((e) => e.type === "attribute");
      assert.isDefined(attrEntry);
      expect(attrEntry.sourceText).toBe("Click to submit");
      expect(attrEntry.context.componentName).toBe("Button");

      // Check text entry
      const textEntry = result.newEntries.find((e) => e.type === "content");
      expect(textEntry?.sourceText).toBe("Submit");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate alt attribute", () => {
      const code = `
export function Image() {
  return <img src="/logo.png" alt="Company logo" width={100} />;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Image.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);
      const entry = asAttribute(result.newEntries[0]);
      expect(entry.sourceText).toBe("Company logo");
      expect(entry.context.attributeName).toBe("alt");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate aria-label attribute", () => {
      const code = `
export function CloseButton() {
  return <button aria-label="Close dialog">×</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/CloseButton.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      const attrEntry = result.newEntries.find((e) => e.type === "attribute");

      assert.isDefined(attrEntry);
      expect(attrEntry.context.attributeName).toBe("aria-label");
      expect(attrEntry.sourceText).toBe("Close dialog");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate aria-description attribute", () => {
      const code = `
export function InfoIcon() {
  return <span aria-description="Additional information about this feature">ℹ️</span>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/InfoIcon.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      const attrEntry = result.newEntries.find((e) => e.type === "attribute");
      assert.isDefined(attrEntry);
      expect(attrEntry.context.attributeName).toBe("aria-description");
      expect(attrEntry.sourceText).toBe(
        "Additional information about this feature",
      );

      expect(result.code).toMatchSnapshot();
    });

    it("should translate placeholder attribute", () => {
      const code = `
export function SearchBox() {
  return <input type="text" placeholder="Search products..." />;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/SearchBox.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);
      const entry = asAttribute(result.newEntries[0]);
      expect(entry.sourceText).toBe("Search products...");
      expect(entry.context.attributeName).toBe("placeholder");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate label attribute", () => {
      const code = `
export function CustomInput() {
  return <CustomComponent label="Enter your name" />;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/CustomInput.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);
      const entry = asAttribute(result.newEntries[0]);
      expect(entry.sourceText).toBe("Enter your name");
      expect(entry.context.attributeName).toBe("label");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate description attribute", () => {
      const code = `
export function Card() {
  return <Card description="This is a product description" />;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Card.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);
      const entry = asAttribute(result.newEntries[0]);
      expect(entry.sourceText).toBe("This is a product description");
      expect(entry.context.attributeName).toBe("description");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate content attribute", () => {
      const code = `
export function MetaTag() {
  return <meta name="description" content="Website description" />;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/MetaTag.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);
      const entry = asAttribute(result.newEntries[0]);
      expect(entry.sourceText).toBe("Website description");
      expect(entry.context.attributeName).toBe("content");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate multiple attributes on same element", () => {
      const code = `
export function Input() {
  return <input
    type="text"
    title="Name field"
    placeholder="Enter your name"
    aria-label="User name input"
  />;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Input.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(3);

      const attributeNames = result.newEntries
        .filter((e) => e.type === "attribute")
        .map((e) => e.context.attributeName);
      expect(attributeNames).toContain("title");
      expect(attributeNames).toContain("placeholder");
      expect(attributeNames).toContain("aria-label");

      const sourceTexts = result.newEntries.map((e) => e.sourceText);
      expect(sourceTexts).toContain("Name field");
      expect(sourceTexts).toContain("Enter your name");
      expect(sourceTexts).toContain("User name input");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate attributes across multiple elements", () => {
      const code = `
export function Form() {
  return (
    <form>
      <input placeholder="Username" />
      <input placeholder="Password" type="password" />
      <button title="Submit form">Submit</button>
    </form>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Form.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(4);

      const attrEntries = result.newEntries.filter(
        (e) => e.type === "attribute",
      );
      expect(attrEntries).toHaveLength(3);

      const sourceTexts = attrEntries.map((e) => e.sourceText);
      expect(sourceTexts).toContain("Username");
      expect(sourceTexts).toContain("Password");
      expect(sourceTexts).toContain("Submit form");

      expect(result.code).toMatchSnapshot();
    });

    it("should not translate non-whitelisted attributes", () => {
      const code = `
export function Link() {
  return <a href="/home" className="link" data-testid="home-link" title="Go home">Home</a>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Link.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      // Only title should be translated
      const attrEntry = result.newEntries.find((e) => e.type === "attribute");
      assert.isDefined(attrEntry);
      expect(attrEntry.context.attributeName).toBe("title");
      expect(attrEntry.sourceText).toBe("Go home");

      // href, className, data-testid should remain unchanged
      expect(result.code).toContain('href="/home"');
      expect(result.code).toContain('className="link"');
      expect(result.code).toContain('data-testid="home-link"');

      expect(result.code).toMatchSnapshot();
    });

    it("should not translate attributes with expression values", () => {
      const code = `
export function DynamicButton() {
  const tooltip = "Click me";
  return <button title={tooltip}>Submit</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/DynamicButton.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Only the text "Submit" should be translated, not the title expression
      expect(result.newEntries).toHaveLength(1);
      const entry = asContent(result.newEntries[0]);
      expect(entry.sourceText).toBe("Submit");

      // Expression should remain unchanged
      expect(result.code).toContain("title={tooltip}");
      expect(result.code).toMatchSnapshot();
    });

    it("should not translate empty attribute values", () => {
      const code = `
export function EmptyAttr() {
  return <input title="" placeholder="Type here" />;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/EmptyAttr.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Only placeholder should be translated (title is empty)
      expect(result.newEntries).toHaveLength(1);
      const entry = asAttribute(result.newEntries[0]);
      expect(entry.sourceText).toBe("Type here");
      expect(entry.context.attributeName).toBe("placeholder");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate attributes in nested components", () => {
      const code = `
export function Card() {
  return (
    <div title="Card container">
      <h1>Title</h1>
      <img src="/icon.png" alt="Card icon" />
      <button title="Click to expand">Expand</button>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Card.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(5);

      const attrEntries = result.newEntries.filter(
        (e) => e.type === "attribute",
      );
      expect(attrEntries).toHaveLength(3);

      const sourceTexts = attrEntries.map((e) => e.sourceText);
      expect(sourceTexts).toContain("Card container");
      expect(sourceTexts).toContain("Card icon");
      expect(sourceTexts).toContain("Click to expand");

      expect(result.code).toMatchSnapshot();
    });

    it("should translate attributes with whitespace normalization", () => {
      const code = `
export function Button() {
  return <button title="  Click   to   submit  ">Submit</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      const attrEntry = result.newEntries.find((e) => e.type === "attribute");
      expect(attrEntry).toBeDefined();
      // Whitespace should be normalized
      expect(attrEntry?.sourceText).toBe("Click to submit");

      expect(result.code).toMatchSnapshot();
    });

    it("should generate consistent hashes for attributes", () => {
      const code = `
export function Button() {
  return <button title="Submit button">Submit</button>;
}
`;

      const result1 = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      const result2 = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      assert.isDefined(result1.newEntries);
      assert.isDefined(result2.newEntries);

      const attr1 = result1.newEntries.find((e) => e.type === "attribute");
      const attr2 = result2.newEntries.find((e) => e.type === "attribute");

      expect(attr1?.hash).toBe(attr2?.hash);
    });

    it("should translate attributes in components with mixed content", () => {
      const code = `
export function Message() {
  const name = "Alice";
  return (
    <div title="User message">
      Hello {name}, you have <strong title="Message count">5</strong> messages
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Message.tsx",
        config,
      });

      // expect(result.transformed).toBe(true);
      // assert.isDefined(result.newEntries);
      //
      // // Should have: 2 attributes (title on div and strong) + 1 rich text
      // expect(result.newEntries).toHaveLength(3);
      //
      // const attrEntries = result.newEntries.filter(e => e.context.attributeName);
      // expect(attrEntries).toHaveLength(2);
      //
      // const sourceTexts = attrEntries.map(e => e.sourceText);
      // expect(sourceTexts).toContain("User message");
      // expect(sourceTexts).toContain("Message count");

      expect(result.code).toMatchSnapshot();
    });

    it("should include correct context information for attributes", () => {
      const code = `
export function TestComponent() {
  return <button title="Test title">Click me</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/components/TestComponent.tsx",
        config,
      });

      assert.isDefined(result.newEntries);
      const attrEntry = result.newEntries.find((e) => e.type === "attribute");

      expect(attrEntry).toBeDefined();
      expect(attrEntry?.context.attributeName).toBe("title");
      expect(attrEntry?.context.componentName).toBe("TestComponent");
      expect(attrEntry?.location.filePath).toBe("components/TestComponent.tsx");
      expect(attrEntry?.location.line).toBeDefined();
      expect(attrEntry?.location.column).toBeDefined();
    });

    it("should translate attributes in server components", () => {
      const nextConfig = createMockConfig();

      const code = `
export default async function ServerPage() {
  return (
    <div>
      <h1 title="Page title">Welcome</h1>
      <input placeholder="Search..." />
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      const attrEntries = result.newEntries.filter(
        (e) => e.type === "attribute",
      );
      expect(attrEntries).toHaveLength(2);

      expect(attrEntries.map((e) => e.sourceText)).toEqual([
        "Page title",
        "Search...",
      ]);

      // Should use async API
      expect(result.code).toContain("getServerTranslations");
      expect(result.code).toMatchSnapshot();
    });

    it("should translate attributes in non-async server components using unified hook", () => {
      const nextConfig = createMockConfig();

      const code = `
export default function ServerPage() {
  return (
    <div>
      <img src="/logo.png" alt="Company logo" />
      <button title="Click me">Action</button>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      const attrEntries = result.newEntries.filter(
        (e) => e.type === "attribute",
      );
      expect(attrEntries).toHaveLength(2);

      // Should use unified hook
      expect(result.code).toContain("useTranslation");
      expect(result.code).not.toContain("getServerTranslations");
      expect(result.code).toMatchSnapshot();
    });
  });

  describe("skip translation", () => {
    it("should skip translation for <code> elements", () => {
      const code = `
export function Example() {
  return (
    <div>
      <p>Install using <code>npm install package</code> command</p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Example.tsx",
        config,
      });

      expect(result.code).toMatchSnapshot();

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should only translate the outer text, not the code content
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].sourceText).toContain("Install using");
      expect(result.newEntries[0].sourceText).toContain("command");

      // Code element content should remain untransformed
      expect(result.code).toContain("<code>npm install package</code>");
    });

    it("should skip translation for <pre> elements", () => {
      const code = `
export function CodeBlock() {
  return (
    <div>
      <h2>Example Code</h2>
      <pre>const x = 10;
function test() {}</pre>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/CodeBlock.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should only translate the h2 text
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].sourceText).toBe("Example Code");

      // Pre element content should remain untransformed
      expect(result.code).toContain("<pre>const x = 10;");
    });

    it('should skip translation for elements with translate="no"', () => {
      const code = `
export function Product() {
  return (
    <div>
      <h1>Product Name</h1>
      <p translate="no">SKU-12345-XYZ</p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Product.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should only translate the h1 text
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].sourceText).toBe("Product Name");

      // SKU should remain untransformed
      expect(result.code).toContain('translate="no">SKU-12345-XYZ</p>');
    });

    it("should skip translation for elements with data-lingo-skip", () => {
      const code = `
export function ApiDocs() {
  return (
    <div>
      <h1>API Documentation</h1>
      <div data-lingo-skip>
        POST /api/users
      </div>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/ApiDocs.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should only translate the h1 text
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].sourceText).toBe("API Documentation");

      // API endpoint should remain untransformed
      expect(result.code).toContain("POST /api/users");
    });

    it("should skip translation for multiple non-translatable element types", () => {
      const code = `
export function TechDoc() {
  return (
    <div>
      <p>Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to copy</p>
      <p>Variable <var>x</var> represents the value</p>
      <p>Sample output: <samp>Hello World</samp></p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/TechDoc.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should translate the outer text but not kbd, var, samp content
      // The non-translatable elements are skipped from the translation string
      expect(result.newEntries).toHaveLength(3);
      const sourceTexts = result.newEntries.map((e) => e.sourceText);
      expect(sourceTexts[0]).toContain("Press");
      expect(sourceTexts[0]).toContain("to copy");
      expect(sourceTexts[1]).toContain("Variable");
      expect(sourceTexts[1]).toContain("represents the value");
      expect(sourceTexts[2]).toContain("Sample output:");

      // Technical elements should remain untransformed
      expect(result.code).toContain("<kbd>Ctrl</kbd>");
      expect(result.code).toContain("<kbd>C</kbd>");
      expect(result.code).toContain("<var>x</var>");
      expect(result.code).toContain("<samp>Hello World</samp>");
    });

    it("should skip translation for nested code in rich text", () => {
      const code = `
export function Tutorial() {
  return (
    <div>
      <p>
        Run the command <code>npm start</code> to begin.
        You can also use <code>yarn start</code> instead.
      </p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Tutorial.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should translate the text but preserve code elements
      // Code elements are skipped from the translation string
      expect(result.newEntries).toHaveLength(1);
      const sourceText = result.newEntries[0].sourceText;
      expect(sourceText).toContain("Run the command");
      expect(sourceText).toContain("to begin");
      expect(sourceText).toContain("You can also use");
      expect(sourceText).toContain("instead");
      // Code content should NOT be in the translation string
      expect(sourceText).not.toContain("npm start");
      expect(sourceText).not.toContain("yarn start");

      // Code elements should remain untransformed in output
      expect(result.code).toContain("<code>npm start</code>");
      expect(result.code).toContain("<code>yarn start</code>");
    });

    it('should combine translate="no" with other attributes', () => {
      const code = `
export function Branded() {
  return (
    <div>
      <h1>Welcome to our app</h1>
      <span className="brand" translate="no">TechCorp™</span>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Branded.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should only translate the h1
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].sourceText).toBe("Welcome to our app");

      // Brand name should remain untransformed with className preserved
      expect(result.code).toContain('className="brand"');
      expect(result.code).toContain('translate="no"');
      expect(result.code).toContain("TechCorp™");
    });

    it('should not skip translation for translate="yes"', () => {
      const code = `
export function ExplicitTranslate() {
  return <p translate="yes">This should be translated</p>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/ExplicitTranslate.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      // Should translate the text
      expect(result.newEntries).toHaveLength(1);
      expect(result.newEntries[0].sourceText).toBe("This should be translated");
    });
  });

  describe("fragments", () => {
    it("should translate fragments", () => {
      const code = `
export default function Home() {
  const translatableText = <>Hello World</>;
  return (
    <main>
      <div>
        To translate it you have to wrap it into the {translatableText}
      </div>
    </main>
    )
 }
 `;
      const result = transformComponent({
        code,
        filePath: "src/FunctionExpression.tsx",
        config,
      });

      expect(result.code).toMatchSnapshot();
    });

    it("should translate both <> and <Fragment>", () => {
      const code = `
export default function Home() {
  const translatableText = <>
    <>These two pieces of text.</>
    <Fragment>Considered separate, because no one in the world should write this code.</Fragment>
  </>;

  return (
    <div>
      {translatableText}
    </div>
  )
 }
 `;
      const result = transformComponent({
        code,
        filePath: "src/FunctionExpression.tsx",
        config,
      });

      expect(result.code).toMatchSnapshot();
    });

    it("should handle separate fragments used in expressions correctly", () => {
      const code = `
export default function Home() {
  const translatableMixedContextFragment = (
    <>
      <b>Mixed</b> content <i>fragment</i>
    </>
  );

  return (
    <main>
      <div>
        Content that has text and other tags inside will br translated as a
        single entity: {translatableMixedContextFragment}
      </div>
    </main>
    )
 }
 `;

      const result = transformComponent({
        code,
        filePath: "src/FunctionExpression.tsx",
        config,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("corner cases", () => {
    it("should handle function expressions correctly", () => {
      const code = `
export const Button = function() { return <button>Click me</button>; }
`;

      const result = transformComponent({
        code,
        filePath: "src/FunctionExpression.tsx",
        config,
      });

      expect(result.code).toMatchSnapshot();
    });

    it("should escape literal angle brackets in text", () => {
      const code = `
export default function Help() {
  return (
    <div>
      To wrap text, write &lt;&gt;content&lt;/&gt;
      <p>Or use &lt;Fragment&gt;content&lt;/Fragment&gt;</p>
      or wrap it into the {"<>"}{content}{"</>"}
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Help.tsx",
        config,
      });

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("translation overrides (data-lingo-override)", () => {
    it("should parse override attribute with object expression", () => {
      const code = `
export function Button() {
  return <button data-lingo-override={{ de: "Klicken Sie hier", fr: "Cliquez ici" }}>Click here</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.sourceText).toBe("Click here");
      expect(entry.overrides).toEqual({
        de: "Klicken Sie hier",
        fr: "Cliquez ici",
      });

      // Override attribute should be removed from output
      expect(result.code).not.toContain("data-lingo-override");
      expect(result.code).toMatchSnapshot();
    });

    it("should handle partial overrides (only some locales)", () => {
      const code = `
export function Message() {
  return <p data-lingo-override={{ de: "Spezialtext" }}>Special text</p>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Message.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.sourceText).toBe("Special text");
      expect(entry.overrides).toEqual({ de: "Spezialtext" });

      expect(result.code).toMatchSnapshot();
    });

    it("should handle overrides with locale region codes", () => {
      const code = `
export function Welcome() {
  return <h1 data-lingo-override={{ "en-US": "Welcome USA", "en-GB": "Welcome UK" }}>Welcome</h1>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Welcome.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.overrides).toEqual({
        "en-US": "Welcome USA",
        "en-GB": "Welcome UK",
      });

      expect(result.code).toMatchSnapshot();
    });

    it("should handle overrides in mixed content (rich text)", () => {
      const code = `
export function Message() {
  const name = "Alice";
  return (
    <div data-lingo-override={{
      de: "Willkommen {name}, Sie haben <strong0>{count}</strong0> Nachrichten",
      fr: "Bienvenue {name}, vous avez <strong0>{count}</strong0> messages"
    }}>
      Welcome {name}, you have <strong>{count}</strong> messages
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Message.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.sourceText).toContain("Welcome {name}");
      expect(entry.overrides).toBeDefined();
      expect(entry.overrides?.de).toContain("Willkommen {name}");
      expect(entry.overrides?.fr).toContain("Bienvenue {name}");

      expect(result.code).not.toContain("data-lingo-override");
      expect(result.code).toMatchSnapshot();
    });

    it("should handle multiple elements with different overrides", () => {
      const code = `
export function Page() {
  return (
    <div>
      <h1 data-lingo-override={{ de: "Titel", fr: "Titre" }}>Title</h1>
      <p data-lingo-override={{ de: "Beschreibung", es: "Descripción" }}>Description</p>
      <button data-lingo-override={{ de: "Klicken" }}>Click</button>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Page.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(3);

      // Check each entry has correct overrides
      const titleEntry = result.newEntries.find(
        (e) => e.sourceText === "Title",
      );
      expect(titleEntry?.overrides).toEqual({ de: "Titel", fr: "Titre" });

      const descEntry = result.newEntries.find(
        (e) => e.sourceText === "Description",
      );
      expect(descEntry?.overrides).toEqual({
        de: "Beschreibung",
        es: "Descripción",
      });

      const buttonEntry = result.newEntries.find(
        (e) => e.sourceText === "Click",
      );
      expect(buttonEntry?.overrides).toEqual({ de: "Klicken" });

      expect(result.code).not.toContain("data-lingo-override");
      expect(result.code).toMatchSnapshot();
    });

    it("should handle override alongside other attributes", () => {
      const code = `
export function Button() {
  return (
    <button
      className="primary"
      onClick={handleClick}
      data-lingo-override={{ de: "Absenden" }}
      disabled={false}
    >
      Submit
    </button>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.overrides).toEqual({ de: "Absenden" });

      // Other attributes should remain
      expect(result.code).toContain('className="primary"');
      expect(result.code).toContain("onClick={handleClick}");
      expect(result.code).toContain("disabled={false}");
      expect(result.code).not.toContain("data-lingo-override");

      expect(result.code).toMatchSnapshot();
    });

    it("should handle brand names and technical terms", () => {
      const code = `
export function Header() {
  return (
    <div>
      <h1 data-lingo-override={{ de: "Lingo.dev", fr: "Lingo.dev", es: "Lingo.dev" }}>
        Lingo.dev
      </h1>
      <p data-lingo-override={{ de: "Der JWT-Token ist ungültig", fr: "Le jeton JWT est invalide" }}>
        JWT token is invalid
      </p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Header.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      // Brand name should have overrides
      const brandEntry = result.newEntries.find(
        (e) => e.sourceText === "Lingo.dev",
      );
      expect(brandEntry?.overrides).toEqual({
        de: "Lingo.dev",
        fr: "Lingo.dev",
        es: "Lingo.dev",
      });

      // Technical term should have overrides
      const techEntry = result.newEntries.find(
        (e) => e.sourceText === "JWT token is invalid",
      );
      expect(techEntry?.overrides?.de).toBe("Der JWT-Token ist ungültig");

      expect(result.code).toMatchSnapshot();
    });

    it("should not add overrides field when override is invalid", () => {
      const code = `
export function Button() {
  return <button data-lingo-override={null}>Click</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.overrides).toBeUndefined();

      expect(result.code).toMatchSnapshot();
    });

    it("should not add overrides field when override is empty object", () => {
      const code = `
export function Button() {
  return <button data-lingo-override={{}}>Click</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.overrides).toBeUndefined();

      expect(result.code).toMatchSnapshot();
    });

    it("should handle overrides in server components with async", () => {
      const nextConfig = createMockConfig();

      const code = `
export default async function ServerPage() {
  const data = await fetchData();
  return (
    <div>
      <h1 data-lingo-override={{ de: "Willkommen", fr: "Bienvenue" }}>Welcome</h1>
      <p>Data: {data}</p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);

      const welcomeEntry = result.newEntries.find(
        (e) => e.sourceText === "Welcome",
      );
      expect(welcomeEntry?.overrides).toEqual({
        de: "Willkommen",
        fr: "Bienvenue",
      });

      // Should use async API
      expect(result.code).toContain("getServerTranslations");
      expect(result.code).not.toContain("data-lingo-override");
      expect(result.code).toMatchSnapshot();
    });

    it("should handle overrides in non-async server components with unified hook", () => {
      const nextConfig = createMockConfig();

      const code = `
export default function ServerPage() {
  return (
    <div>
      <h1 data-lingo-override={{ de: "Willkommen" }}>Welcome</h1>
      <p data-lingo-override={{ fr: "Description" }}>Description</p>
    </div>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/app/page.tsx",
        config: nextConfig,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(2);

      result.newEntries.forEach((entry) => {
        expect(entry.overrides).toBeDefined();
      });

      // Should use unified hook
      expect(result.code).toContain("useTranslation");
      expect(result.code).not.toContain("data-lingo-override");
      expect(result.code).toMatchSnapshot();
    });

    it("should validate locale codes and reject invalid ones", () => {
      const code = `
export function Button() {
  return <button data-lingo-override={{ german: "Klicken", "en_US": "Click" }}>Click</button>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Button.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      // Invalid locale codes should be rejected
      const entry = result.newEntries[0];
      expect(entry.overrides).toBeUndefined();

      expect(result.code).toMatchSnapshot();
    });

    it("should handle template literals in override values", () => {
      const code = `
export function Message() {
  return <p data-lingo-override={{ de: \`Nachricht\`, fr: \`Message\` }}>Message</p>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Message.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.overrides).toEqual({
        de: "Nachricht",
        fr: "Message",
      });

      expect(result.code).toMatchSnapshot();
    });

    it("should not apply overrides to elements without translatable content", () => {
      const code = `
export function Empty() {
  return <div data-lingo-override={{ de: "Text" }}></div>;
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Empty.tsx",
        config,
      });

      expect(result.transformed).toBe(false);
      expect(result.newEntries).toHaveLength(0);
      expect(result.code).toMatchSnapshot();
    });

    it("should handle overrides with special characters", () => {
      const code = `
export function Legal() {
  return (
    <p data-lingo-override={{ de: "Gemäß §15 DSGVO...", fr: "Conformément à l'article 15..." }}>
      In accordance with GDPR Article 15...
    </p>
  );
}
`;

      const result = transformComponent({
        code,
        filePath: "src/Legal.tsx",
        config,
      });

      expect(result.transformed).toBe(true);
      assert.isDefined(result.newEntries);
      expect(result.newEntries).toHaveLength(1);

      const entry = result.newEntries[0];
      expect(entry.overrides?.de).toBe("Gemäß §15 DSGVO...");
      expect(entry.overrides?.fr).toBe("Conformément à l'article 15...");

      expect(result.code).toMatchSnapshot();
    });
  });
});
