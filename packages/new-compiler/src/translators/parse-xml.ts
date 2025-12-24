import { XMLParser, XMLBuilder } from "fast-xml-parser";

// Generic tag names used in XML output
const TAG_OBJECT = "object";
const TAG_ARRAY = "array";
const TAG_VALUE = "value";

/**
 * Converts a JavaScript value to a generic XML node structure
 */
function toGenericNode(value: any, key?: string): Record<string, any> {
  if (Array.isArray(value)) {
    const children = value.map((item) => toGenericNode(item));
    return {
      [TAG_ARRAY]: {
        ...(key ? { key } : {}),
        ...groupChildren(children),
      },
    };
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    const children = Object.entries(value).map(([k, v]) => toGenericNode(v, k));
    return {
      [TAG_OBJECT]: {
        ...(key ? { key } : {}),
        ...groupChildren(children),
      },
    };
  }

  return {
    [TAG_VALUE]: {
      ...(key ? { key } : {}),
      "#text": value ?? "",
    },
  };
}

/**
 * Groups nodes by tag name for proper XML array handling
 */
function groupChildren(nodes: Record<string, any>[]): Record<string, any> {
  const grouped: Record<string, any[]> = {};

  for (const node of nodes) {
    const tag = Object.keys(node)[0];
    if (!grouped[tag]) {
      grouped[tag] = [];
    }
    grouped[tag].push(node[tag]);
  }

  return grouped;
}

/**
 * Recursively converts a generic XML node back to a JavaScript value
 */
function fromGenericNode(tag: string, data: any): any {
  if (tag === TAG_VALUE) {
    if (data && typeof data === "object" && "#text" in data) {
      return data["#text"] ?? "";
    }
    // For self-closing tags like <value key="x" />, data is { key: "x" }
    // We should return empty string, not the attributes object
    if (data && typeof data === "object") {
      return "";
    }
    return data ?? "";
  }

  if (tag === TAG_ARRAY) {
    const result: any[] = [];
    for (const childTag of [TAG_VALUE, TAG_OBJECT, TAG_ARRAY]) {
      const childNodes = Array.isArray(data[childTag])
        ? data[childTag]
        : data[childTag]
          ? [data[childTag]]
          : [];
      for (const child of childNodes) {
        result.push(fromGenericNode(childTag, child));
      }
    }
    return result;
  }

  // TAG_OBJECT
  const obj: Record<string, any> = {};
  for (const childTag of [TAG_VALUE, TAG_OBJECT, TAG_ARRAY]) {
    const childNodes = Array.isArray(data[childTag])
      ? data[childTag]
      : data[childTag]
        ? [data[childTag]]
        : [];
    for (const child of childNodes) {
      const key = child.key || "";
      obj[key] = fromGenericNode(childTag, child);
    }
  }
  return obj;
}

export function obj2xml<T>(obj: T): string {
  const rootNode = toGenericNode(obj)[TAG_OBJECT];
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    format: true,
    suppressEmptyNode: true,
  });
  return builder.build({ [TAG_OBJECT]: rootNode });
}

export function parseXmlFromResponseText<T = any>(text: string): T {
  const xmlStart = text.indexOf("<");
  const xmlEnd = text.lastIndexOf(">") + 1;

  if (xmlStart !== -1 && xmlEnd > xmlStart) {
    text = text.substring(xmlStart, xmlEnd);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseTagValue: true,
    parseAttributeValue: false,
    processEntities: true,
    isArray: (name) => [TAG_VALUE, TAG_ARRAY, TAG_OBJECT].includes(name),
  });
  const parsed = parser.parse(text);

  // Remove XML declaration
  const { "?xml": _, ...withoutDeclaration } = parsed;

  const rootTag = Object.keys(withoutDeclaration)[0];
  const rootNode = Array.isArray(withoutDeclaration[rootTag])
    ? withoutDeclaration[rootTag][0]
    : withoutDeclaration[rootTag];

  return fromGenericNode(rootTag, rootNode);
}
