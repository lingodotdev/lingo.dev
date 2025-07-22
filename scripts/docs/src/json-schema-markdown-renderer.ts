import type { ListItem, Root, RootContent } from "mdast";
import { unified } from "unified";
import remarkStringify from "remark-stringify";
import type { PropertyInfo } from "./types";

export function makeHeadingNode(fullName: string): RootContent {
  const headingDepth = Math.min(6, 2 + (fullName.split(".").length - 1));
  return {
    type: "heading",
    depth: headingDepth as 1 | 2 | 3 | 4 | 5 | 6,
    children: [{ type: "inlineCode", value: fullName }],
  };
}

export function makeDescriptionNode(description?: string): RootContent | null {
  if (!description) return null;
  return {
    type: "paragraph",
    children: [{ type: "text", value: description }],
  };
}

export function makeTypeBulletNode(type: string): ListItem {
  return {
    type: "listItem",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "Type: " },
          { type: "inlineCode", value: type },
        ],
      },
    ],
  };
}

export function makeRequiredBulletNode(required: boolean): ListItem {
  return {
    type: "listItem",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "Required: " },
          { type: "inlineCode", value: required ? "yes" : "no" },
        ],
      },
    ],
  };
}

export function makeDefaultBulletNode(defaultValue?: unknown): ListItem | null {
  if (defaultValue === undefined) return null;
  return {
    type: "listItem",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "Default: " },
          { type: "inlineCode", value: JSON.stringify(defaultValue) },
        ],
      },
    ],
  };
}

export function makeEnumBulletNode(allowedValues?: unknown[]): ListItem | null {
  if (!allowedValues || allowedValues.length === 0) return null;
  return {
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
        children: allowedValues.map((v) => ({
          type: "listItem",
          children: [
            {
              type: "paragraph",
              children: [{ type: "inlineCode", value: String(v) }],
            },
          ],
        })),
      },
    ],
  };
}

export function makeAllowedKeysBulletNode(allowedKeys?: string[]): ListItem | null {
  if (!allowedKeys || allowedKeys.length === 0) return null;
  return {
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
        children: allowedKeys.map((v) => ({
          type: "listItem",
          children: [
            {
              type: "paragraph",
              children: [{ type: "inlineCode", value: v }],
            },
          ],
        })),
      },
    ],
  };
}

export function makeBullets(property: PropertyInfo): ListItem[] {
  const bullets: ListItem[] = [
    makeTypeBulletNode(property.type),
    makeRequiredBulletNode(property.required),
  ];

  const defaultNode = makeDefaultBulletNode(property.defaultValue);
  if (defaultNode) bullets.push(defaultNode);

  const enumNode = makeEnumBulletNode(property.allowedValues);
  if (enumNode) bullets.push(enumNode);

  const allowedKeysNode = makeAllowedKeysBulletNode(property.allowedKeys);
  if (allowedKeysNode) bullets.push(allowedKeysNode);

  return bullets;
}

export function renderPropertyToMarkdown(property: PropertyInfo): RootContent[] {
  const nodes: RootContent[] = [makeHeadingNode(property.fullPath)];

  // Description node
  const descNode = makeDescriptionNode(property.description);
  if (descNode) nodes.push(descNode);

  // Bullet list node (with all bullets)
  const bulletItems = makeBullets(property);
  nodes.push({
    type: "list",
    ordered: false,
    spread: false,
    children: bulletItems,
  });

  // Recurse for nested properties
  if (property.children) {
    for (const child of property.children) {
      nodes.push(...renderPropertyToMarkdown(child));
    }
  }

  return nodes;
}

export function renderPropertiesToMarkdown(properties: PropertyInfo[]): RootContent[] {
  const children: RootContent[] = [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value:
            "This page describes the complete list of properties that are available within the ",
        },
        { type: "inlineCode", value: "i18n.json" },
        {
          type: "text",
          value: " configuration file. This file is used by ",
        },
        {
          type: "strong",
          children: [{ type: "text", value: "Lingo.dev CLI" }],
        },
        {
          type: "text",
          value: " to configure the behavior of the translation pipeline.",
        },
      ],
    },
  ];

  for (const property of properties) {
    children.push(...renderPropertyToMarkdown(property));

    // Add spacing between top-level sections
    children.push({
      type: "paragraph",
      children: [{ type: "text", value: "" }],
    });
  }

  return children;
}

export function renderMarkdown(properties: PropertyInfo[]): string {
  const children = renderPropertiesToMarkdown(properties);
  const root: Root = { type: "root", children };
  const markdownContent = unified()
    .use(remarkStringify, { fences: true, listItemIndent: "one" })
    .stringify(root);
  
  // Add YAML frontmatter
  const frontmatter = `---
title: i18n.json properties
---

`;
  
  return frontmatter + markdownContent;
}