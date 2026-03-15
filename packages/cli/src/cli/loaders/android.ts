import { createRequire } from "node:module";
import { parseStringPromise, type XmlDeclarationAttributes } from "xml2js";
import { ILoader } from "./_types";
import { CLIError } from "../utils/errors";
import { createLoader } from "./_utils";

interface SaxParser {
  onopentag: (node: {
    name: string;
    attributes: Record<string, string>;
  }) => void;
  onclosetag: (name: string) => void;
  ontext: (text: string) => void;
  oncdata: (cdata: string) => void;
  write(data: string): SaxParser;
  close(): SaxParser;
}

interface SaxModule {
  parser(
    strict: boolean,
    options?: { trim?: boolean; normalize?: boolean; lowercase?: boolean },
  ): SaxParser;
}

const require = createRequire(import.meta.url);
const sax: SaxModule = require("sax") as SaxModule;

const defaultAndroidResourcesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
</resources>`;

type AndroidResourceType =
  | "string"
  | "string-array"
  | "plurals"
  | "bool"
  | "integer";

type PrimitiveValue = boolean | number | string;

type ContentSegment =
  | { kind: "text"; value: string }
  | { kind: "cdata"; value: string };

interface TextualMeta {
  segments: ContentSegment[];
  hasCdata: boolean;
}

interface ArrayItemMeta extends TextualMeta {
  quantity?: string;
}

interface StringResourceNode {
  type: "string";
  name: string;
  translatable: boolean;
  node: any;
  meta: TextualMeta;
}

interface StringArrayItemNode {
  node: any;
  meta: TextualMeta;
}

interface StringArrayResourceNode {
  type: "string-array";
  name: string;
  translatable: boolean;
  node: any;
  items: StringArrayItemNode[];
}

interface PluralsItemNode {
  node: any;
  quantity: string;
  meta: TextualMeta;
}

interface PluralsResourceNode {
  type: "plurals";
  name: string;
  translatable: boolean;
  node: any;
  items: PluralsItemNode[];
}

interface BoolResourceNode {
  type: "bool";
  name: string;
  translatable: boolean;
  node: any;
  meta: TextualMeta;
}

interface IntegerResourceNode {
  type: "integer";
  name: string;
  translatable: boolean;
  node: any;
  meta: TextualMeta;
}

type AndroidResourceNode =
  | StringResourceNode
  | StringArrayResourceNode
  | PluralsResourceNode
  | BoolResourceNode
  | IntegerResourceNode;

interface AndroidDocument {
  resources: any;
  resourceNodes: AndroidResourceNode[];
}

interface XmlDeclarationOptions {
  xmldec?: XmlDeclarationAttributes;
  headless: boolean;
}

export default function createAndroidLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    async pull(locale, input) {
      try {
        if (!input) {
          return {};
        }

        const document = await parseAndroidDocument(input);
        return buildPullResult(document);
      } catch (error) {
        console.error("Error parsing Android resource file:", error);
        throw new CLIError({
          message: "Failed to parse Android resource file",
          docUrl: "androidResourceError",
        });
      }
    },
    async push(
      locale,
      payload,
      originalInput,
      originalLocale,
      pullInput,
      pullOutput,
    ) {
      try {
        const selectedBase = selectBaseXml(
          locale,
          originalLocale,
          pullInput,
          originalInput,
        );

        const existingDocument = await parseAndroidDocument(selectedBase);
        const sourceDocument = await parseAndroidDocument(originalInput);
        const translatedDocument = buildTranslatedDocument(
          payload,
          existingDocument,
          sourceDocument,
        );

        const referenceXml =
          selectedBase || originalInput || defaultAndroidResourcesXml;
        const declaration = resolveXmlDeclaration(referenceXml);

        return buildAndroidXml(translatedDocument, declaration);
      } catch (error) {
        console.error("Error generating Android resource file:", error);
        throw new CLIError({
          message: "Failed to generate Android resource file",
          docUrl: "androidResourceError",
        });
      }
    },
  });
}

function resolveXmlDeclaration(xml: string | null): XmlDeclarationOptions {
  if (!xml) {
    const xmldec: XmlDeclarationAttributes = {
      version: "1.0",
      encoding: "utf-8",
    };
    return {
      xmldec,
      headless: false,
    };
  }

  const match = xml.match(
    /<\?xml\s+version="([^"]+)"(?:\s+encoding="([^"]+)")?\s*\?>/,
  );
  if (match) {
    const version = match[1] && match[1].trim().length > 0 ? match[1] : "1.0";
    const encoding =
      match[2] && match[2].trim().length > 0 ? match[2] : undefined;
    const xmldec: XmlDeclarationAttributes = encoding
      ? { version, encoding }
      : { version };
    return {
      xmldec,
      headless: false,
    };
  }

  return { headless: true };
}

async function parseAndroidDocument(
  input?: string | null,
): Promise<AndroidDocument> {
  const xmlToParse =
    input && input.trim().length > 0 ? input : defaultAndroidResourcesXml;

  const parsed = await parseStringPromise(xmlToParse, {
    explicitArray: true,
    explicitChildren: true,
    preserveChildrenOrder: true,
    charsAsChildren: true,
    includeWhiteChars: true,
    mergeAttrs: false,
    normalize: false,
    normalizeTags: false,
    trim: false,
    attrkey: "$",
    charkey: "_",
    childkey: "$$",
  });

  if (!parsed || !parsed.resources) {
    return {
      resources: { $$: [] },
      resourceNodes: [],
    };
  }

  const resourcesNode = parsed.resources;
  resourcesNode["#name"] = resourcesNode["#name"] ?? "resources";
  resourcesNode.$$ = resourcesNode.$$ ?? [];

  const metadata = extractResourceMetadata(xmlToParse);

  const resourceNodes: AndroidResourceNode[] = [];
  let metaIndex = 0;

  for (const child of resourcesNode.$$ as any[]) {
    const elementName = child?.["#name"];
    if (!isResourceElementName(elementName)) {
      continue;
    }

    const meta = metadata[metaIndex++];
    if (!meta || meta.type !== elementName) {
      continue;
    }

    const name = child?.$?.name ?? meta.name;
    if (!name) {
      continue;
    }

    const translatable =
      (child?.$?.translatable ?? "").toLowerCase() !== "false";

    switch (meta.type) {
      case "string": {
        resourceNodes.push({
          type: "string",
          name,
          translatable,
          node: child,
          meta: cloneTextMeta(meta.meta),
        });
        break;
      }
      case "string-array": {
        const itemNodes = (child?.item ?? []) as any[];
        const items: StringArrayItemNode[] = [];
        const templateItems = meta.items;

        for (
          let i = 0;
          i < Math.max(itemNodes.length, templateItems.length);
          i++
        ) {
          const nodeItem = itemNodes[i];
          const templateItem =
            templateItems[i] ?? templateItems[templateItems.length - 1];
          if (!nodeItem) {
            continue;
          }
          items.push({
            node: nodeItem,
            meta: cloneTextMeta(templateItem.meta),
          });
        }

        resourceNodes.push({
          type: "string-array",
          name,
          translatable,
          node: child,
          items,
        });
        break;
      }
      case "plurals": {
        const itemNodes = (child?.item ?? []) as any[];
        const templateItems = meta.items;
        const items: PluralsItemNode[] = [];

        for (const templateItem of templateItems) {
          const quantity = templateItem.quantity;
          if (!quantity) {
            continue;
          }
          const nodeItem = itemNodes.find(
            (item: any) => item?.$?.quantity === quantity,
          );
          if (!nodeItem) {
            continue;
          }
          items.push({
            node: nodeItem,
            quantity,
            meta: cloneTextMeta(templateItem.meta),
          });
        }

        resourceNodes.push({
          type: "plurals",
          name,
          translatable,
          node: child,
          items,
        });
        break;
      }
      case "bool": {
        resourceNodes.push({
          type: "bool",
          name,
          translatable,
          node: child,
          meta: cloneTextMeta(meta.meta),
        });
        break;
      }
      case "integer": {
        resourceNodes.push({
          type: "integer",
          name,
          translatable,
          node: child,
          meta: cloneTextMeta(meta.meta),
        });
        break;
      }
    }
  }

  return { resources: resourcesNode, resourceNodes };
}

function buildPullResult(document: AndroidDocument): Record<string, any> {
  const result: Record<string, any> = {};

  for (const resource of document.resourceNodes) {
    if (!isTranslatable(resource)) {
      continue;
    }

    switch (resource.type) {
      case "string": {
        result[resource.name] = decodeAndroidText(
          segmentsToString(resource.meta.segments),
        );
        break;
      }
      case "string-array": {
        result[resource.name] = resource.items.map((item) =>
          decodeAndroidText(segmentsToString(item.meta.segments)),
        );
        break;
      }
      case "plurals": {
        const pluralMap: Record<string, string> = {};
        for (const item of resource.items) {
          pluralMap[item.quantity] = decodeAndroidText(
            segmentsToString(item.meta.segments),
          );
        }
        result[resource.name] = pluralMap;
        break;
      }
      case "bool": {
        const value = segmentsToString(resource.meta.segments).trim();
        result[resource.name] = value === "true";
        break;
      }
      case "integer": {
        const value = parseInt(
          segmentsToString(resource.meta.segments).trim(),
          10,
        );
        result[resource.name] = Number.isNaN(value) ? 0 : value;
        break;
      }
    }
  }

  return result;
}

function isTranslatable(resource: AndroidResourceNode): boolean {
  return resource.translatable;
}

function buildTranslatedDocument(
  payload: Record<string, any>,
  existingDocument: AndroidDocument,
  sourceDocument: AndroidDocument,
): AndroidDocument {
  const templateDocument = sourceDocument;
  const finalDocument = cloneDocumentStructure(templateDocument);

  const templateMap = createResourceMap(templateDocument);
  const existingMap = createResourceMap(existingDocument);
  const payloadEntries = payload ?? {};
  const finalMap = createResourceMap(finalDocument);

  for (const resource of finalDocument.resourceNodes) {
    if (!resource.translatable) {
      continue;
    }

    const templateResource = templateMap.get(resource.name);
    let translationValue: any;

    if (
      Object.prototype.hasOwnProperty.call(payloadEntries, resource.name) &&
      payloadEntries[resource.name] !== undefined &&
      payloadEntries[resource.name] !== null
    ) {
      translationValue = payloadEntries[resource.name];
    } else if (existingMap.has(resource.name)) {
      translationValue = extractValueFromResource(
        existingMap.get(resource.name)!,
      );
    } else {
      translationValue = extractValueFromResource(templateResource ?? resource);
    }

    updateResourceNode(resource, translationValue, templateResource);
  }

  for (const resource of existingDocument.resourceNodes) {
    if (finalMap.has(resource.name)) {
      continue;
    }
    if (!isTranslatable(resource)) {
      continue;
    }
    const cloned = cloneResourceNode(resource);
    appendResourceNode(finalDocument, cloned);
    finalMap.set(cloned.name, cloned);
  }

  for (const [name, value] of Object.entries(payloadEntries)) {
    if (finalMap.has(name)) {
      continue;
    }
    try {
      const inferred = createResourceNodeFromValue(name, value);
      appendResourceNode(finalDocument, inferred);
      finalMap.set(name, inferred);
    } catch (error) {
      if (error instanceof CLIError) {
        throw error;
      }
    }
  }

  return finalDocument;
}

function buildAndroidXml(
  document: AndroidDocument,
  declaration: XmlDeclarationOptions,
): string {
  const xmlBody = serializeElement(document.resources);

  if (declaration.headless) {
    return xmlBody;
  }

  if (declaration.xmldec) {
    const { version, encoding } = declaration.xmldec;
    const encodingPart = encoding ? ` encoding="${encoding}"` : "";
    return `<?xml version="${version}"${encodingPart}?>\n${xmlBody}`;
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n${xmlBody}`;
}

function selectBaseXml(
  locale: string,
  originalLocale: string,
  pullInput: string | null,
  originalInput: string | null,
): string | null {
  if (locale === originalLocale) {
    return pullInput ?? originalInput;
  }
  return pullInput ?? originalInput;
}

function updateResourceNode(
  target: AndroidResourceNode,
  rawValue: any,
  template: AndroidResourceNode | undefined,
): void {
  switch (target.type) {
    case "string": {
      const value = asString(rawValue, target.name);
      const templateMeta =
        template && template.type === "string" ? template.meta : target.meta;
      const useCdata = templateMeta.hasCdata;
      setTextualNodeContent(target.node, value, useCdata);
      target.meta = makeTextMeta([
        { kind: useCdata ? "cdata" : "text", value },
      ]);
      break;
    }
    case "string-array": {
      const values = asStringArray(rawValue, target.name);
      const templateItems =
        template && template.type === "string-array"
          ? template.items
          : target.items;
      const maxLength = Math.max(target.items.length, templateItems.length);
      for (let index = 0; index < maxLength; index++) {
        const targetItem = target.items[index];
        const templateItem =
          templateItems[index] ??
          templateItems[templateItems.length - 1] ??
          target.items[index];
        if (!targetItem || !templateItem) {
          continue;
        }
        const translation =
          index < values.length
            ? values[index]
            : segmentsToString(templateItem.meta.segments);
        const useCdata = templateItem.meta.hasCdata;
        setTextualNodeContent(targetItem.node, translation, useCdata);
        targetItem.meta = makeTextMeta([
          { kind: useCdata ? "cdata" : "text", value: translation },
        ]);
      }
      break;
    }
    case "plurals": {
      const pluralValues = asPluralMap(rawValue, target.name);
      const templateItems =
        template && template.type === "plurals" ? template.items : target.items;
      const templateMap = new Map(
        templateItems.map((item) => [item.quantity, item]),
      );
      for (const item of target.items) {
        const templateItem =
          templateMap.get(item.quantity) ?? templateMap.values().next().value;
        const fallback = templateItem
          ? segmentsToString(templateItem.meta.segments)
          : segmentsToString(item.meta.segments);
        const translation =
          typeof pluralValues[item.quantity] === "string"
            ? pluralValues[item.quantity]
            : fallback;
        const useCdata = templateItem
          ? templateItem.meta.hasCdata
          : item.meta.hasCdata;
        setTextualNodeContent(item.node, translation, useCdata);
        item.meta = makeTextMeta([
          { kind: useCdata ? "cdata" : "text", value: translation },
        ]);
      }
      break;
    }
    case "bool": {
      const boolValue = asBoolean(rawValue, target.name);
      const strValue = boolValue ? "true" : "false";
      setTextualNodeContent(target.node, strValue, false);
      target.meta = makeTextMeta([{ kind: "text", value: strValue }]);
      break;
    }
    case "integer": {
      const intValue = asInteger(rawValue, target.name);
      const strValue = intValue.toString();
      setTextualNodeContent(target.node, strValue, false);
      target.meta = makeTextMeta([{ kind: "text", value: strValue }]);
      break;
    }
  }
}

function appendResourceNode(
  document: AndroidDocument,
  resourceNode: AndroidResourceNode,
): void {
  document.resources.$$ = document.resources.$$ ?? [];
  const children = document.resources.$$ as any[];

  if (
    children.length === 0 ||
    (children[children.length - 1]["#name"] !== "__text__" &&
      children[children.length - 1]["#name"] !== "__comment__")
  ) {
    children.push({ "#name": "__text__", _: "\n    " });
  }

  children.push(resourceNode.node);
  children.push({ "#name": "__text__", _: "\n" });
  document.resourceNodes.push(resourceNode);
}

function setTextualNodeContent(
  node: any,
  value: string,
  useCdata: boolean,
): void {
  // CDATA needs apostrophe escaping but not XML entity escaping
  const escapedValue = useCdata
    ? escapeApostrophesOnly(value)
    : escapeAndroidString(value);
  node._ = escapedValue;

  // Replace entire children array to avoid duplicating inline HTML elements
  // When inline HTML exists (e.g., <b>text</b>), xml2js creates element nodes
  // in node.$$ that would otherwise be serialized alongside the escaped text
  node.$$ = [
    { "#name": useCdata ? "__cdata" : "__text__", _: escapedValue }
  ];
}

function buildResourceNameMap(
  document: AndroidDocument,
): Map<string, AndroidResourceNode> {
  const map = new Map<string, AndroidResourceNode>();
  for (const node of document.resourceNodes) {
    if (!map.has(node.name)) {
      map.set(node.name, node);
    }
  }
  return map;
}

function createResourceMap(
  document: AndroidDocument,
): Map<string, AndroidResourceNode> {
  return buildResourceNameMap(document);
}

function cloneResourceNode(resource: AndroidResourceNode): AndroidResourceNode {
  switch (resource.type) {
    case "string": {
      const nodeClone = deepClone(resource.node);
      return {
        type: "string",
        name: resource.name,
        translatable: resource.translatable,
        node: nodeClone,
        meta: cloneTextMeta(resource.meta),
      };
    }
    case "string-array": {
      const nodeClone = deepClone(resource.node);
      const itemNodes = (nodeClone.item ?? []) as any[];
      const items: StringArrayItemNode[] = itemNodes.map((itemNode, index) => {
        const templateMeta =
          resource.items[index]?.meta ??
          resource.items[resource.items.length - 1]?.meta ??
          makeTextMeta([]);
        return {
          node: itemNode,
          meta: cloneTextMeta(templateMeta),
        };
      });
      return {
        type: "string-array",
        name: resource.name,
        translatable: resource.translatable,
        node: nodeClone,
        items,
      };
    }
    case "plurals": {
      const nodeClone = deepClone(resource.node);
      const itemNodes = (nodeClone.item ?? []) as any[];
      const items: PluralsItemNode[] = [];
      for (const templateItem of resource.items) {
        const cloneNode = itemNodes.find(
          (item: any) => item?.$?.quantity === templateItem.quantity,
        );
        if (!cloneNode) {
          continue;
        }
        items.push({
          node: cloneNode,
          quantity: templateItem.quantity,
          meta: cloneTextMeta(templateItem.meta),
        });
      }
      return {
        type: "plurals",
        name: resource.name,
        translatable: resource.translatable,
        node: nodeClone,
        items,
      };
    }
    case "bool": {
      const nodeClone = deepClone(resource.node);
      return {
        type: "bool",
        name: resource.name,
        translatable: resource.translatable,
        node: nodeClone,
        meta: cloneTextMeta(resource.meta),
      };
    }
    case "integer": {
      const nodeClone = deepClone(resource.node);
      return {
        type: "integer",
        name: resource.name,
        translatable: resource.translatable,
        node: nodeClone,
        meta: cloneTextMeta(resource.meta),
      };
    }
  }
}

function cloneTextMeta(meta: TextualMeta): TextualMeta {
  return {
    hasCdata: meta.hasCdata,
    segments: meta.segments.map((segment) => ({ ...segment })),
  };
}

function asString(value: any, name: string): string {
  if (typeof value === "string") {
    return value;
  }
  throw new CLIError({
    message: `Expected string value for resource "${name}"`,
    docUrl: "androidResourceError",
  });
}

function asStringArray(value: any, name: string): string[] {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }
  throw new CLIError({
    message: `Expected array of strings for resource "${name}"`,
    docUrl: "androidResourceError",
  });
}

function asPluralMap(value: any, name: string): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const result: Record<string, string> = {};
    for (const [quantity, pluralValue] of Object.entries(value)) {
      if (typeof pluralValue !== "string") {
        throw new CLIError({
          message: `Expected plural item "${quantity}" of "${name}" to be a string`,
          docUrl: "androidResourceError",
        });
      }
      result[quantity] = pluralValue;
    }
    return result;
  }
  throw new CLIError({
    message: `Expected object value for plurals resource "${name}"`,
    docUrl: "androidResourceError",
  });
}

function asBoolean(value: any, name: string): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    if (value === "true" || value === "false") {
      return value === "true";
    }
  }
  throw new CLIError({
    message: `Expected boolean value for resource "${name}"`,
    docUrl: "androidResourceError",
  });
}

function asInteger(value: any, name: string): number {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  throw new CLIError({
    message: `Expected number value for resource "${name}"`,
    docUrl: "androidResourceError",
  });
}

function escapeAndroidString(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(?<!\\)'/g, "\\'");
}

function escapeApostrophesOnly(value: string): string {
  // Even inside CDATA, apostrophes must be escaped for Android AAPT
  return value.replace(/(?<!\\)'/g, "\\'");
}

function segmentsToString(segments: ContentSegment[]): string {
  return segments.map((segment) => segment.value).join("");
}

function makeTextMeta(segments: ContentSegment[]): TextualMeta {
  return {
    segments,
    hasCdata: segments.some((segment) => segment.kind === "cdata"),
  };
}

function createResourceNodeFromValue(
  name: string,
  value: any,
): AndroidResourceNode {
  const inferredType = inferTypeFromValue(value);

  switch (inferredType) {
    case "string": {
      const stringValue = asString(value, name);
      const escaped = escapeAndroidString(stringValue);
      const node = {
        "#name": "string",
        $: { name },
        _: escaped,
        $$: [{ "#name": "__text__", _: escaped }],
      };
      return {
        type: "string",
        name,
        translatable: true,
        node,
        meta: makeTextMeta([{ kind: "text", value: stringValue }]),
      };
    }
    case "string-array": {
      const items = asStringArray(value, name);
      const node = {
        "#name": "string-array",
        $: { name },
        $$: [] as any[],
        item: [] as any[],
      };
      const itemNodes: StringArrayItemNode[] = [];
      for (const itemValue of items) {
        const escaped = escapeAndroidString(itemValue);
        const itemNode = {
          "#name": "item",
          _: escaped,
          $$: [{ "#name": "__text__", _: escaped }],
        };
        node.$$!.push(itemNode);
        node.item!.push(itemNode);
        itemNodes.push({
          node: itemNode,
          meta: makeTextMeta([{ kind: "text", value: itemValue }]),
        });
      }
      return {
        type: "string-array",
        name,
        translatable: true,
        node,
        items: itemNodes,
      };
    }
    case "plurals": {
      const pluralMap = asPluralMap(value, name);
      const node = {
        "#name": "plurals",
        $: { name },
        $$: [] as any[],
        item: [] as any[],
      };
      const items: PluralsItemNode[] = [];
      for (const [quantity, pluralValue] of Object.entries(pluralMap)) {
        const escaped = escapeAndroidString(pluralValue);
        const itemNode = {
          "#name": "item",
          $: { quantity },
          _: escaped,
          $$: [{ "#name": "__text__", _: escaped }],
        };
        node.$$!.push(itemNode);
        node.item!.push(itemNode);
        items.push({
          node: itemNode,
          quantity,
          meta: makeTextMeta([{ kind: "text", value: pluralValue }]),
        });
      }
      return {
        type: "plurals",
        name,
        translatable: true,
        node,
        items,
      };
    }
    case "bool": {
      const boolValue = asBoolean(value, name);
      const textValue = boolValue ? "true" : "false";
      const node = {
        "#name": "bool",
        $: { name },
        _: textValue,
        $$: [{ "#name": "__text__", _: textValue }],
      };
      return {
        type: "bool",
        name,
        translatable: true,
        node,
        meta: makeTextMeta([{ kind: "text", value: textValue }]),
      };
    }
    case "integer": {
      const intValue = asInteger(value, name);
      const textValue = intValue.toString();
      const node = {
        "#name": "integer",
        $: { name },
        _: textValue,
        $$: [{ "#name": "__text__", _: textValue }],
      };
      return {
        type: "integer",
        name,
        translatable: true,
        node,
        meta: makeTextMeta([{ kind: "text", value: textValue }]),
      };
    }
  }
}

function cloneDocumentStructure(document: AndroidDocument): AndroidDocument {
  // Filter first - only keep translatable resources
  const translatableResources = document.resourceNodes.filter(isTranslatable);

  const resourcesClone = deepClone(document.resources);
  const lookup = buildResourceLookup(resourcesClone);
  const resourceNodes: AndroidResourceNode[] = [];

  for (const resource of translatableResources) {
    const cloned = cloneResourceNodeFromLookup(resource, lookup);
    resourceNodes.push(cloned);
  }

  // Clean up XML structure - only keep translatable resource nodes
  if (resourcesClone.$$ && Array.isArray(resourcesClone.$$)) {
    const includedKeys = new Set(
      resourceNodes.map((r) => resourceLookupKey(r.type, r.name)),
    );

    // Filter out non-translatable resources
    let filtered = resourcesClone.$$.filter((child: any) => {
      const elementName = child?.["#name"];
      const name = child?.$?.name;
      if (!isResourceElementName(elementName) || !name) {
        return true; // Keep whitespace, comments, etc.
      }
      return includedKeys.has(resourceLookupKey(elementName, name));
    });

    // Remove consecutive whitespace nodes (fixes extra blank lines)
    const cleaned: any[] = [];
    let lastWasWhitespace = false;

    for (const child of filtered) {
      const isWhitespace =
        child?.["#name"] === "__text__" && (!child._ || child._.trim() === "");

      if (isWhitespace) {
        if (!lastWasWhitespace) {
          cleaned.push(child);
          lastWasWhitespace = true;
        }
        // Skip consecutive whitespace
      } else {
        cleaned.push(child);
        lastWasWhitespace = false;
      }
    }

    resourcesClone.$$ = cleaned;
  }

  return {
    resources: resourcesClone,
    resourceNodes,
  };
}

function buildResourceLookup(resources: any): Map<string, any[]> {
  const lookup = new Map<string, any[]>();
  const children = Array.isArray(resources.$$) ? resources.$$ : [];
  for (const child of children) {
    const type = child?.["#name"];
    const name = child?.$?.name;
    if (!type || !name || !isResourceElementName(type)) {
      continue;
    }
    const key = resourceLookupKey(type, name);
    if (!lookup.has(key)) {
      lookup.set(key, []);
    }
    lookup.get(key)!.push(child);
  }
  return lookup;
}

function cloneResourceNodeFromLookup(
  resource: AndroidResourceNode,
  lookup: Map<string, any[]>,
): AndroidResourceNode {
  const node = takeResourceNode(lookup, resource.type, resource.name);
  if (!node) {
    return cloneResourceNode(resource);
  }

  switch (resource.type) {
    case "string": {
      return {
        type: "string",
        name: resource.name,
        translatable: resource.translatable,
        node,
        meta: cloneTextMeta(resource.meta),
      };
    }
    case "string-array": {
      const childItems = (Array.isArray(node.$$) ? node.$$ : []).filter(
        (child: any) => child?.["#name"] === "item",
      );
      node.item = childItems;
      if (childItems.length < resource.items.length) {
        return cloneResourceNode(resource);
      }
      const items: StringArrayItemNode[] = resource.items.map((item, index) => {
        const nodeItem = childItems[index];
        if (!nodeItem) {
          return {
            node: deepClone(item.node),
            meta: cloneTextMeta(item.meta),
          };
        }
        return {
          node: nodeItem,
          meta: cloneTextMeta(item.meta),
        };
      });
      return {
        type: "string-array",
        name: resource.name,
        translatable: resource.translatable,
        node,
        items,
      };
    }
    case "plurals": {
      const childItems = (Array.isArray(node.$$) ? node.$$ : []).filter(
        (child: any) => child?.["#name"] === "item",
      );
      node.item = childItems;
      const itemMap = new Map<string, any>();
      for (const item of childItems) {
        if (item?.$?.quantity) {
          itemMap.set(item.$.quantity, item);
        }
      }
      const items: PluralsItemNode[] = [];
      for (const templateItem of resource.items) {
        const nodeItem = itemMap.get(templateItem.quantity);
        if (!nodeItem) {
          return cloneResourceNode(resource);
        }
        items.push({
          node: nodeItem,
          quantity: templateItem.quantity,
          meta: cloneTextMeta(templateItem.meta),
        });
      }
      return {
        type: "plurals",
        name: resource.name,
        translatable: resource.translatable,
        node,
        items,
      };
    }
    case "bool": {
      return {
        type: "bool",
        name: resource.name,
        translatable: resource.translatable,
        node,
        meta: cloneTextMeta(resource.meta),
      };
    }
    case "integer": {
      return {
        type: "integer",
        name: resource.name,
        translatable: resource.translatable,
        node,
        meta: cloneTextMeta(resource.meta),
      };
    }
  }
}

function takeResourceNode(
  lookup: Map<string, any[]>,
  type: AndroidResourceType,
  name: string,
): any | undefined {
  const key = resourceLookupKey(type, name);
  const list = lookup.get(key);
  if (!list || list.length === 0) {
    return undefined;
  }
  return list.shift();
}

function resourceLookupKey(type: string, name: string): string {
  return `${type}:${name}`;
}

function extractValueFromResource(resource: AndroidResourceNode): any {
  switch (resource.type) {
    case "string":
      return decodeAndroidText(segmentsToString(resource.meta.segments));
    case "string-array":
      return resource.items.map((item) =>
        decodeAndroidText(segmentsToString(item.meta.segments)),
      );
    case "plurals": {
      const result: Record<string, string> = {};
      for (const item of resource.items) {
        result[item.quantity] = decodeAndroidText(
          segmentsToString(item.meta.segments),
        );
      }
      return result;
    }
    case "bool": {
      const value = segmentsToString(resource.meta.segments).trim();
      return value === "true";
    }
    case "integer": {
      const value = parseInt(
        segmentsToString(resource.meta.segments).trim(),
        10,
      );
      return Number.isNaN(value) ? 0 : value;
    }
  }
}

function inferTypeFromValue(value: any): AndroidResourceType {
  if (typeof value === "string") {
    return "string";
  }
  if (Array.isArray(value)) {
    return "string-array";
  }
  if (value && typeof value === "object") {
    return "plurals";
  }
  if (typeof value === "boolean") {
    return "bool";
  }
  if (typeof value === "number" && Number.isInteger(value)) {
    return "integer";
  }
  throw new CLIError({
    message: "Unable to infer Android resource type from payload",
    docUrl: "androidResourceError",
  });
}

function extractResourceMetadata(xml: string) {
  interface StackEntry {
    name: string;
    rawName: string;
    attributes: Record<string, string>;
    segments: ContentSegment[];
    items: Array<{ quantity?: string; meta: TextualMeta }>;
  }

  interface StringMeta {
    type: "string";
    name: string;
    translatable: boolean;
    meta: TextualMeta;
  }

  interface StringArrayMeta {
    type: "string-array";
    name: string;
    translatable: boolean;
    items: Array<{ meta: TextualMeta }>;
  }

  interface PluralsMeta {
    type: "plurals";
    name: string;
    translatable: boolean;
    items: Array<{ quantity: string; meta: TextualMeta }>;
  }

  interface BoolMeta {
    type: "bool";
    name: string;
    translatable: boolean;
    meta: TextualMeta;
  }

  interface IntegerMeta {
    type: "integer";
    name: string;
    translatable: boolean;
    meta: TextualMeta;
  }

  type ResourceMeta =
    | StringMeta
    | StringArrayMeta
    | PluralsMeta
    | BoolMeta
    | IntegerMeta;

  const parser = sax.parser(true, {
    trim: false,
    normalize: false,
    lowercase: false,
  });

  const stack: StackEntry[] = [];
  const result: ResourceMeta[] = [];

  parser.onopentag = (node) => {
    const lowerName = node.name.toLowerCase();
    const attributes: Record<string, string> = {};
    for (const [key, value] of Object.entries(node.attributes ?? {})) {
      attributes[key.toLowerCase()] = String(value);
    }
    stack.push({
      name: lowerName,
      rawName: node.name,
      attributes,
      segments: [],
      items: [],
    });

    if (
      lowerName !== "resources" &&
      lowerName !== "item" &&
      !isResourceElementName(lowerName)
    ) {
      const attrString = Object.entries(node.attributes ?? {})
        .map(
          ([key, value]) => ` ${key}="${escapeAttributeValue(String(value))}"`,
        )
        .join("");
      appendSegmentToNearestResource(stack, {
        kind: "text",
        value: `<${node.name}${attrString}>`,
      });
    }
  };

  parser.ontext = (text) => {
    if (!text) {
      return;
    }
    appendSegmentToNearestResource(stack, { kind: "text", value: text });
  };

  parser.oncdata = (cdata) => {
    appendSegmentToNearestResource(stack, { kind: "cdata", value: cdata });
  };

  parser.onclosetag = () => {
    const entry = stack.pop();
    if (!entry) {
      return;
    }

    const parent = stack[stack.length - 1];

    if (entry.name === "item" && parent) {
      const meta = makeTextMeta(entry.segments);
      parent.items.push({
        quantity: entry.attributes.quantity,
        meta,
      });
      return;
    }

    if (
      entry.name !== "resources" &&
      entry.name !== "item" &&
      !isResourceElementName(entry.name)
    ) {
      appendSegmentToNearestResource(stack, {
        kind: "text",
        value: `</${entry.rawName}>`,
      });
      return;
    }

    if (!isResourceElementName(entry.name)) {
      return;
    }

    const name = entry.attributes.name;
    if (!name) {
      return;
    }

    const translatable =
      (entry.attributes.translatable ?? "").toLowerCase() !== "false";

    switch (entry.name) {
      case "string": {
        result.push({
          type: "string",
          name,
          translatable,
          meta: makeTextMeta(entry.segments),
        });
        break;
      }
      case "string-array": {
        result.push({
          type: "string-array",
          name,
          translatable,
          items: entry.items.map((item) => ({
            meta: cloneTextMeta(item.meta),
          })),
        });
        break;
      }
      case "plurals": {
        const items: Array<{ quantity: string; meta: TextualMeta }> = [];
        for (const item of entry.items) {
          if (!item.quantity) {
            continue;
          }
          items.push({
            quantity: item.quantity,
            meta: cloneTextMeta(item.meta),
          });
        }
        result.push({
          type: "plurals",
          name,
          translatable,
          items,
        });
        break;
      }
      case "bool": {
        result.push({
          type: "bool",
          name,
          translatable,
          meta: makeTextMeta(entry.segments),
        });
        break;
      }
      case "integer": {
        result.push({
          type: "integer",
          name,
          translatable,
          meta: makeTextMeta(entry.segments),
        });
        break;
      }
    }
  };

  parser.write(xml).close();

  return result;
}

function appendSegmentToNearestResource(
  stack: Array<{
    name: string;
    segments: ContentSegment[];
    attributes: Record<string, string>;
  }>,
  segment: ContentSegment,
) {
  for (let index = stack.length - 1; index >= 0; index--) {
    const entry = stack[index];
    if (
      entry.name === "string" ||
      entry.name === "item" ||
      entry.name === "bool" ||
      entry.name === "integer"
    ) {
      entry.segments.push(segment);
      return;
    }
  }
}

function isResourceElementName(
  value: string | undefined,
): value is AndroidResourceType {
  return (
    value === "string" ||
    value === "string-array" ||
    value === "plurals" ||
    value === "bool" ||
    value === "integer"
  );
}

function deepClone<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function serializeElement(node: any): string {
  if (!node) {
    return "";
  }

  const name = node["#name"] ?? "resources";

  if (name === "__text__") {
    return node._ ?? "";
  }

  if (name === "__cdata") {
    return `<![CDATA[${node._ ?? ""}]]>`;
  }

  if (name === "__comment__") {
    return `<!--${node._ ?? ""}-->`;
  }

  const attributes = node.$ ?? {};
  const attrString = Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${escapeAttributeValue(String(value))}"`)
    .join("");

  const children = Array.isArray(node.$$) ? node.$$ : [];

  if (children.length === 0) {
    const textContent = node._ ?? "";
    return `<${name}${attrString}>${textContent}</${name}>`;
  }

  const childContent = children.map(serializeElement).join("");
  return `<${name}${attrString}>${childContent}</${name}>`;
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&apos;");
}

function decodeAndroidText(value: string): string {
  return value.replace(/\\'/g, "'");
}
