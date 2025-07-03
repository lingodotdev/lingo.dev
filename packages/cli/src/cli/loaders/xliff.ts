import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import { JSDOM } from "jsdom";

/**
 * Creates a comprehensive XLIFF loader supporting versions 1.2 and 2.0
 * with deterministic key generation and structure preservation
 */
export default function createXliffLoader(): ILoader<
  string,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, input, _ctx, originalLocale) {
      const trimmedInput = (input ?? "").trim();

      if (!trimmedInput) {
        return createEmptyResult(originalLocale, locale);
      }

      try {
        const dom = new JSDOM(trimmedInput, { contentType: "text/xml" });
        const document = dom.window.document;

        // Check for parsing errors
        const parserError = document.querySelector("parsererror");
        if (parserError) {
          throw new Error(`XML parsing failed: ${parserError.textContent}`);
        }

        const xliffElement = document.documentElement;
        if (!xliffElement || xliffElement.tagName !== "xliff") {
          throw new Error("Invalid XLIFF: missing root <xliff> element");
        }

        const version = xliffElement.getAttribute("version") || "1.2";
        const isV2 = version === "2.0";

        if (isV2) {
          return pullV2(xliffElement, locale, originalLocale);
        } else {
          return pullV1(xliffElement, locale, originalLocale);
        }
      } catch (error: any) {
        throw new Error(`Failed to parse XLIFF file: ${error.message}`);
      }
    },

    async push(locale, translations, originalInput, originalLocale, pullInput) {
      if (!originalInput) {
        // Create new file from scratch
        return pushNewFile(locale, translations, originalLocale);
      }

      try {
        const dom = new JSDOM(originalInput, { contentType: "text/xml" });
        const document = dom.window.document;
        const xliffElement = document.documentElement;
        const version = xliffElement.getAttribute("version") || "1.2";
        const isV2 = version === "2.0";

        if (isV2) {
          return pushV2(
            dom,
            xliffElement,
            locale,
            translations,
            originalLocale,
            originalInput,
          );
        } else {
          return pushV1(
            dom,
            xliffElement,
            locale,
            translations,
            originalLocale,
            originalInput,
          );
        }
      } catch (error: any) {
        throw new Error(`Failed to update XLIFF file: ${error.message}`);
      }
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                            Version 1.2 Support                            */
/* -------------------------------------------------------------------------- */

function pullV1(
  xliffElement: Element,
  locale: string,
  originalLocale: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  const fileElement = xliffElement.querySelector("file");

  if (!fileElement) {
    return result;
  }

  const sourceLanguage =
    fileElement.getAttribute("source-language") || originalLocale;
  const isSourceLocale = sourceLanguage === locale;
  const bodyElement = fileElement.querySelector("body");

  if (!bodyElement) {
    return result;
  }

  const transUnits = bodyElement.querySelectorAll("trans-unit");
  const seenKeys = new Set<string>();

  transUnits.forEach((unit) => {
    let key = getTransUnitKey(unit as Element);
    if (!key) return;

    // Handle duplicates deterministically
    if (seenKeys.has(key)) {
      const id = (unit as Element).getAttribute("id")?.trim();
      if (id) {
        key = `${key}#${id}`;
      } else {
        let counter = 1;
        let newKey = `${key}__${counter}`;
        while (seenKeys.has(newKey)) {
          counter++;
          newKey = `${key}__${counter}`;
        }
        key = newKey;
      }
    }
    seenKeys.add(key);

    const elementName = isSourceLocale ? "source" : "target";
    const textElement = (unit as Element).querySelector(elementName);

    if (textElement) {
      result[key] = extractTextContent(textElement);
    } else if (isSourceLocale) {
      result[key] = key; // fallback for source
    } else {
      result[key] = ""; // empty for missing target
    }
  });

  return result;
}

function pushV1(
  dom: JSDOM,
  xliffElement: Element,
  locale: string,
  translations: Record<string, string>,
  originalLocale: string,
  originalInput?: string,
): string {
  const document = dom.window.document;
  const fileElement = xliffElement.querySelector("file");

  if (!fileElement) {
    throw new Error("Invalid XLIFF 1.2: missing <file> element");
  }

  // Update language attributes
  const sourceLanguage =
    fileElement.getAttribute("source-language") || originalLocale;
  const isSourceLocale = sourceLanguage === locale;

  if (!isSourceLocale) {
    fileElement.setAttribute("target-language", locale);
  }

  let bodyElement = fileElement.querySelector("body");
  if (!bodyElement) {
    bodyElement = document.createElement("body");
    fileElement.appendChild(bodyElement);
  }

  // Build current index
  const existingUnits = new Map<string, Element>();
  const seenKeys = new Set<string>();

  bodyElement.querySelectorAll("trans-unit").forEach((unit) => {
    let key = getTransUnitKey(unit as Element);
    if (!key) return;

    if (seenKeys.has(key)) {
      const id = (unit as Element).getAttribute("id")?.trim();
      if (id) {
        key = `${key}#${id}`;
      } else {
        let counter = 1;
        let newKey = `${key}__${counter}`;
        while (seenKeys.has(newKey)) {
          counter++;
          newKey = `${key}__${counter}`;
        }
        key = newKey;
      }
    }
    seenKeys.add(key);
    existingUnits.set(key, unit as Element);
  });

  // Update/create translation units
  Object.entries(translations).forEach(([key, value]) => {
    let unit = existingUnits.get(key);

    if (!unit) {
      unit = document.createElement("trans-unit");
      unit.setAttribute("id", key);
      unit.setAttribute("resname", key);
      unit.setAttribute("restype", "string");
      unit.setAttribute("datatype", "plaintext");

      const sourceElement = document.createElement("source");
      setTextContent(sourceElement, isSourceLocale ? value : key);
      unit.appendChild(sourceElement);

      if (!isSourceLocale) {
        const targetElement = document.createElement("target");
        targetElement.setAttribute("state", value ? "translated" : "new");
        setTextContent(targetElement, value);
        unit.appendChild(targetElement);
      }

      bodyElement.appendChild(unit);
      existingUnits.set(key, unit);
    } else {
      updateTransUnitV1(unit, key, value, isSourceLocale);
    }
  });

  // Remove orphaned units
  const translationKeys = new Set(Object.keys(translations));
  existingUnits.forEach((unit, key) => {
    if (!translationKeys.has(key)) {
      unit.parentNode?.removeChild(unit);
    }
  });

  return serializeWithDeclaration(
    dom,
    extractXmlDeclaration(originalInput || ""),
  );
}

function updateTransUnitV1(
  unit: Element,
  key: string,
  value: string,
  isSourceLocale: boolean,
): void {
  const document = unit.ownerDocument!;

  if (isSourceLocale) {
    let sourceElement = unit.querySelector("source");
    if (!sourceElement) {
      sourceElement = document.createElement("source");
      unit.appendChild(sourceElement);
    }
    setTextContent(sourceElement, value);
  } else {
    let targetElement = unit.querySelector("target");
    if (!targetElement) {
      targetElement = document.createElement("target");
      unit.appendChild(targetElement);
    }

    setTextContent(targetElement, value);
    targetElement.setAttribute("state", value.trim() ? "translated" : "new");
  }
}

/* -------------------------------------------------------------------------- */
/*                            Version 2.0 Support                            */
/* -------------------------------------------------------------------------- */

function pullV2(
  xliffElement: Element,
  locale: string,
  originalLocale: string,
): Record<string, string> {
  const result: Record<string, string> = {};

  // Add source language metadata
  const srcLang = xliffElement.getAttribute("srcLang") || originalLocale;
  result.sourceLanguage = srcLang;

  const fileElements = xliffElement.querySelectorAll("file");

  fileElements.forEach((fileElement) => {
    const fileId = fileElement.getAttribute("id");
    if (!fileId) return;

    traverseUnitsV2(fileElement, fileId, "", result);
  });

  return result;
}

function traverseUnitsV2(
  container: Element,
  fileId: string,
  currentPath: string,
  result: Record<string, string>,
): void {
  Array.from(container.children).forEach((child) => {
    const tagName = child.tagName;

    if (tagName === "unit") {
      const unitId = child.getAttribute("id")?.trim();
      if (!unitId) return;

      const key = `resources/${fileId}/${currentPath}${unitId}/source`;
      const segment = child.querySelector("segment");
      const source = segment?.querySelector("source");

      if (source) {
        result[key] = extractTextContent(source);
      } else {
        result[key] = unitId; // fallback
      }
    } else if (tagName === "group") {
      const groupId = child.getAttribute("id")?.trim();
      const newPath = groupId
        ? `${currentPath}${groupId}/groupUnits/`
        : currentPath;
      traverseUnitsV2(child, fileId, newPath, result);
    }
  });
}

function pushV2(
  dom: JSDOM,
  xliffElement: Element,
  locale: string,
  translations: Record<string, string>,
  originalLocale: string,
  originalInput?: string,
): string {
  const document = dom.window.document;

  // Handle sourceLanguage metadata
  if (translations.sourceLanguage) {
    xliffElement.setAttribute("srcLang", translations.sourceLanguage);
    delete translations.sourceLanguage; // Don't process as regular translation
  }

  // Build index of existing units
  const existingUnits = new Map<string, Element>();
  const fileElements = xliffElement.querySelectorAll("file");

  fileElements.forEach((fileElement) => {
    const fileId = fileElement.getAttribute("id");
    if (!fileId) return;

    indexUnitsV2(fileElement, fileId, "", existingUnits);
  });

  // Update existing units
  Object.entries(translations).forEach(([key, value]) => {
    const unit = existingUnits.get(key);
    if (unit) {
      updateUnitV2(unit, value);
    } else {
      // For new units, we'd need to create the structure
      // This is complex in V2 due to the hierarchical nature
      console.warn(`Cannot create new unit for key: ${key} in XLIFF 2.0`);
    }
  });

  return serializeWithDeclaration(
    dom,
    extractXmlDeclaration(originalInput || ""),
  );
}

function indexUnitsV2(
  container: Element,
  fileId: string,
  currentPath: string,
  index: Map<string, Element>,
): void {
  Array.from(container.children).forEach((child) => {
    const tagName = child.tagName;

    if (tagName === "unit") {
      const unitId = child.getAttribute("id")?.trim();
      if (!unitId) return;

      const key = `resources/${fileId}/${currentPath}${unitId}/source`;
      index.set(key, child);
    } else if (tagName === "group") {
      const groupId = child.getAttribute("id")?.trim();
      const newPath = groupId
        ? `${currentPath}${groupId}/groupUnits/`
        : currentPath;
      indexUnitsV2(child, fileId, newPath, index);
    }
  });
}

function updateUnitV2(unit: Element, value: string): void {
  const document = unit.ownerDocument!;

  let segment = unit.querySelector("segment");
  if (!segment) {
    segment = document.createElement("segment");
    unit.appendChild(segment);
  }

  let source = segment.querySelector("source");
  if (!source) {
    source = document.createElement("source");
    segment.appendChild(source);
  }

  setTextContent(source, value);
}

/* -------------------------------------------------------------------------- */
/*                              Utilities                                     */
/* -------------------------------------------------------------------------- */

function getTransUnitKey(transUnit: Element): string {
  const resname = transUnit.getAttribute("resname")?.trim();
  if (resname) return resname;

  const id = transUnit.getAttribute("id")?.trim();
  if (id) return id;

  const sourceElement = transUnit.querySelector("source");
  if (sourceElement) {
    const sourceText = extractTextContent(sourceElement).trim();
    if (sourceText) return sourceText;
  }

  return "";
}

function extractTextContent(element: Element): string {
  // Handle CDATA sections
  const cdataNode = Array.from(element.childNodes).find(
    (node) => node.nodeType === element.CDATA_SECTION_NODE,
  );

  if (cdataNode) {
    return cdataNode.nodeValue || "";
  }

  return element.textContent || "";
}

function setTextContent(element: Element, content: string): void {
  const document = element.ownerDocument!;

  // Clear existing content
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  // Use CDATA if content contains XML-sensitive characters
  if (/[<>&"']/.test(content)) {
    const cdataSection = document.createCDATASection(content);
    element.appendChild(cdataSection);
  } else {
    element.textContent = content;
  }
}

function extractXmlDeclaration(xmlContent: string): string {
  const match = xmlContent.match(/^<\?xml[^>]*\?>/);
  return match ? match[0] : "";
}

function serializeWithDeclaration(dom: JSDOM, declaration: string): string {
  let serialized = dom.serialize();

  // Add proper indentation for readability
  serialized = formatXml(serialized);

  if (declaration) {
    serialized = `${declaration}\n${serialized}`;
  }

  return serialized;
}

function formatXml(xml: string): string {
  // Parse and reformat XML with proper indentation using JSDOM
  const dom = new JSDOM(xml, { contentType: "text/xml" });
  const doc = dom.window.document;

  function formatElement(element: Element, depth: number = 0): string {
    const indent = "  ".repeat(depth);
    const tagName = element.tagName;
    const attributes = Array.from(element.attributes)
      .map((attr) => `${attr.name}="${attr.value}"`)
      .join(" ");

    const openTag = attributes ? `<${tagName} ${attributes}>` : `<${tagName}>`;

    // Check for CDATA sections first
    const cdataNode = Array.from(element.childNodes).find(
      (node) => node.nodeType === element.CDATA_SECTION_NODE,
    );

    if (cdataNode) {
      return `${indent}${openTag}<![CDATA[${cdataNode.nodeValue}]]></${tagName}>`;
    }

    // Check if element has only text content
    const textContent = element.textContent?.trim() || "";
    const hasOnlyText =
      element.childNodes.length === 1 && element.childNodes[0].nodeType === 3;

    if (hasOnlyText && textContent) {
      return `${indent}${openTag}${textContent}</${tagName}>`;
    }

    // Element has child elements
    const children = Array.from(element.children);
    if (children.length === 0) {
      return `${indent}${openTag}</${tagName}>`;
    }

    let result = `${indent}${openTag}\n`;
    for (const child of children) {
      result += formatElement(child, depth + 1) + "\n";
    }
    result += `${indent}</${tagName}>`;

    return result;
  }

  return formatElement(doc.documentElement);
}

function createEmptyResult(
  originalLocale: string,
  locale: string,
): Record<string, string> {
  return {};
}

function pushNewFile(
  locale: string,
  translations: Record<string, string>,
  originalLocale: string,
): string {
  const skeleton = `<?xml version="1.0" encoding="utf-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file original="" source-language="${originalLocale}" target-language="${locale}" datatype="plaintext">
    <header></header>
    <body></body>
  </file>
</xliff>`;

  const dom = new JSDOM(skeleton, { contentType: "text/xml" });
  const document = dom.window.document;
  const bodyElement = document.querySelector("body")!;

  Object.entries(translations).forEach(([key, value]) => {
    const unit = document.createElement("trans-unit");
    unit.setAttribute("id", key);
    unit.setAttribute("resname", key);
    unit.setAttribute("restype", "string");
    unit.setAttribute("datatype", "plaintext");

    const sourceElement = document.createElement("source");
    setTextContent(sourceElement, key);
    unit.appendChild(sourceElement);

    const targetElement = document.createElement("target");
    targetElement.setAttribute("state", value ? "translated" : "new");
    setTextContent(targetElement, value);
    unit.appendChild(targetElement);

    bodyElement.appendChild(unit);
  });

  return serializeWithDeclaration(
    dom,
    '<?xml version="1.0" encoding="utf-8"?>',
  );
}
