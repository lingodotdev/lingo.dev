import { describe, expect, it } from "vitest";
import type { RootContent } from "mdast";
import {
  makeHeadingNode,
  makeDescriptionNode,
  makeTypeBulletNode,
  makeRequiredBulletNode,
  makeDefaultBulletNode,
  makeEnumBulletNode,
  makeAllowedKeysBulletNode,
  makeBullets,
  renderPropertyToMarkdown,
  renderPropertiesToMarkdown,
  renderMarkdown,
} from "./markdown-renderer";
import type { PropertyInfo } from "./types";

describe("makeHeadingNode", () => {
  it("should create heading with correct depth for top-level property", () => {
    const node = makeHeadingNode("version");
    expect(node).toEqual({
      type: "heading",
      depth: 2,
      children: [{ type: "inlineCode", value: "version" }],
    });
  });

  it("should create deeper heading for nested property", () => {
    const node = makeHeadingNode("config.debug.level");
    expect(node).toEqual({
      type: "heading",
      depth: 4,
      children: [{ type: "inlineCode", value: "config.debug.level" }],
    });
  });

  it("should cap heading depth at 6", () => {
    const node = makeHeadingNode("a.b.c.d.e.f.g.h");
    expect(node).toEqual({
      type: "heading",
      depth: 6,
      children: [{ type: "inlineCode", value: "a.b.c.d.e.f.g.h" }],
    });
  });
});

describe("makeDescriptionNode", () => {
  it("should create paragraph node for description", () => {
    const node = makeDescriptionNode("This is a description");
    expect(node).toEqual({
      type: "paragraph",
      children: [{ type: "text", value: "This is a description" }],
    });
  });

  it("should return null for empty description", () => {
    expect(makeDescriptionNode("")).toBeNull();
    expect(makeDescriptionNode(undefined)).toBeNull();
  });
});

describe("makeTypeBulletNode", () => {
  it("should create list item with type information", () => {
    const node = makeTypeBulletNode("string");
    expect(node).toEqual({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Type: " },
            { type: "inlineCode", value: "string" },
          ],
        },
      ],
    });
  });
});

describe("makeRequiredBulletNode", () => {
  it("should create list item for required property", () => {
    const node = makeRequiredBulletNode(true);
    expect(node).toEqual({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Required: " },
            { type: "inlineCode", value: "yes" },
          ],
        },
      ],
    });
  });

  it("should create list item for optional property", () => {
    const node = makeRequiredBulletNode(false);
    expect(node).toEqual({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Required: " },
            { type: "inlineCode", value: "no" },
          ],
        },
      ],
    });
  });
});

describe("makeDefaultBulletNode", () => {
  it("should create list item for default value", () => {
    const node = makeDefaultBulletNode("default value");
    expect(node).toEqual({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Default: " },
            { type: "inlineCode", value: '"default value"' },
          ],
        },
      ],
    });
  });

  it("should handle numeric default", () => {
    const node = makeDefaultBulletNode(42);
    expect(node).toBeDefined();
    if (node && "children" in node && node.children[0] && "children" in node.children[0]) {
      expect(node.children[0].children[1]).toEqual({
        type: "inlineCode",
        value: "42",
      });
    }
  });

  it("should return null for undefined default", () => {
    expect(makeDefaultBulletNode(undefined)).toBeNull();
  });
});

describe("makeEnumBulletNode", () => {
  it("should create list item with enum values", () => {
    const node = makeEnumBulletNode(["red", "green", "blue"]);
    expect(node).toEqual({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Allowed values:" }],
        },
        {
          type: "list",
          ordered: false,
          spread: false,
          children: [
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "inlineCode", value: "red" }],
                },
              ],
            },
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "inlineCode", value: "green" }],
                },
              ],
            },
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "inlineCode", value: "blue" }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("should return null for empty array", () => {
    expect(makeEnumBulletNode([])).toBeNull();
    expect(makeEnumBulletNode(undefined)).toBeNull();
  });
});

describe("makeAllowedKeysBulletNode", () => {
  it("should create list item with allowed keys", () => {
    const node = makeAllowedKeysBulletNode(["key1", "key2"]);
    expect(node).toEqual({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Allowed keys:" }],
        },
        {
          type: "list",
          ordered: false,
          spread: false,
          children: [
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "inlineCode", value: "key1" }],
                },
              ],
            },
            {
              type: "listItem",
              children: [
                {
                  type: "paragraph",
                  children: [{ type: "inlineCode", value: "key2" }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("should return null for empty/undefined array", () => {
    expect(makeAllowedKeysBulletNode([])).toBeNull();
    expect(makeAllowedKeysBulletNode(undefined)).toBeNull();
  });
});

describe("makeBullets", () => {
  it("should create all relevant bullets for a property", () => {
    const property: PropertyInfo = {
      name: "test",
      fullPath: "test",
      type: "string",
      required: true,
      defaultValue: "default",
      allowedValues: ["a", "b"],
      allowedKeys: ["key1"],
    };

    const bullets = makeBullets(property);
    expect(bullets).toHaveLength(5); // type, required, default, enum, allowedKeys
  });

  it("should only create necessary bullets", () => {
    const property: PropertyInfo = {
      name: "test",
      fullPath: "test",
      type: "string",
      required: false,
    };

    const bullets = makeBullets(property);
    expect(bullets).toHaveLength(2); // only type and required
  });
});

describe("renderPropertyToMarkdown", () => {
  it("should render simple property", () => {
    const property: PropertyInfo = {
      name: "version",
      fullPath: "version",
      type: "string",
      required: true,
      description: "The version number",
    };

    const nodes = renderPropertyToMarkdown(property);
    expect(nodes).toHaveLength(3); // heading, description, bullets list
    expect(nodes[0].type).toBe("heading");
    expect(nodes[1].type).toBe("paragraph");
    expect(nodes[2].type).toBe("list");
  });

  it("should render property without description", () => {
    const property: PropertyInfo = {
      name: "test",
      fullPath: "test",
      type: "string",
      required: false,
    };

    const nodes = renderPropertyToMarkdown(property);
    expect(nodes).toHaveLength(2); // heading, bullets list (no description)
  });

  it("should render property with children", () => {
    const property: PropertyInfo = {
      name: "config",
      fullPath: "config",
      type: "object",
      required: true,
      children: [
        {
          name: "debug",
          fullPath: "config.debug",
          type: "boolean",
          required: false,
        },
      ],
    };

    const nodes = renderPropertyToMarkdown(property);
    expect(nodes.length).toBeGreaterThan(2); // includes child nodes
    
    // Find child heading node
    const childHeading = nodes.find(
      (node: RootContent) => node.type === "heading" && 
      node.type === "heading" && "children" in node && 
      node.children[0] && "value" in node.children[0] && 
      node.children[0].value === "config.debug"
    );
    expect(childHeading).toBeDefined();
  });
});

describe("renderPropertiesToMarkdown", () => {
  it("should render complete document with header", () => {
    const properties: PropertyInfo[] = [
      {
        name: "version",
        fullPath: "version",
        type: "string",
        required: true,
      },
    ];

    const nodes = renderPropertiesToMarkdown(properties);
    expect(nodes[0]).toEqual({
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: "i18n.json properties" }],
    });
    expect(nodes[1].type).toBe("paragraph"); // intro paragraph
  });

  it("should add spacing between top-level properties", () => {
    const properties: PropertyInfo[] = [
      {
        name: "prop1",
        fullPath: "prop1",
        type: "string",
        required: true,
      },
      {
        name: "prop2",
        fullPath: "prop2",
        type: "string",
        required: false,
      },
    ];

    const nodes = renderPropertiesToMarkdown(properties);
    // Should have spacing paragraphs between properties
    const spacingNodes = nodes.filter(
      (node: RootContent) => node.type === "paragraph" && 
      "children" in node && node.children[0] && 
      "value" in node.children[0] && node.children[0].value === ""
    );
    expect(spacingNodes).toHaveLength(2); // One after each property
  });
});

describe("renderMarkdown", () => {
  it("should generate valid markdown string", () => {
    const properties: PropertyInfo[] = [
      {
        name: "version",
        fullPath: "version",
        type: "string",
        required: true,
        description: "The version",
      },
    ];

    const markdown = renderMarkdown(properties);
    expect(typeof markdown).toBe("string");
    expect(markdown).toContain("# i18n.json properties");
    expect(markdown).toContain("## `version`");
    expect(markdown).toContain("The version");
    expect(markdown).toContain("* Type: `string`");
    expect(markdown).toContain("* Required: `yes`");
  });

  it("should handle empty properties array", () => {
    const markdown = renderMarkdown([]);
    expect(markdown).toContain("# i18n.json properties");
    expect(markdown).toContain("This page describes the complete list");
  });
});