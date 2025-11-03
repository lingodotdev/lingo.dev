/**
 * ICU MessageFormat conversion utilities for xcstrings pluralization
 *
 * This module handles converting between xcstrings plural format and ICU MessageFormat,
 * preserving format specifier precision and supporting multiple variables.
 */

/**
 * Type guard marker to distinguish ICU objects from user data
 * Using a symbol ensures no collision with user data
 */
const ICU_TYPE_MARKER = Symbol.for("@lingo.dev/icu-plural-object");

export interface PluralWithMetadata {
  icu: string;
  _meta?: {
    variables: {
      [varName: string]: {
        format: string;
        role: "plural" | "other";
      };
    };
  };
  // Type marker for robust detection
  [ICU_TYPE_MARKER]?: true;
}

/**
 * CLDR plural categories as defined by Unicode
 * https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html
 */
const CLDR_PLURAL_CATEGORIES = new Set([
  "zero",
  "one",
  "two",
  "few",
  "many",
  "other",
]);

/**
 * Type guard to check if a value is a valid ICU object with metadata
 * This is more robust than simple key checking
 */
export function isICUPluralObject(value: any): value is PluralWithMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  // Check for type marker (most reliable)
  if (ICU_TYPE_MARKER in value) {
    return true;
  }

  // Fallback: validate structure thoroughly
  if (!("icu" in value) || typeof value.icu !== "string") {
    return false;
  }

  // Must match ICU plural format pattern
  const icuPluralPattern = /^\{[\w]+,\s*plural,\s*.+\}$/;
  if (!icuPluralPattern.test(value.icu)) {
    return false;
  }

  // If _meta exists, validate its structure
  if (value._meta !== undefined) {
    if (
      typeof value._meta !== "object" ||
      !value._meta.variables ||
      typeof value._meta.variables !== "object"
    ) {
      return false;
    }

    // Validate each variable entry
    for (const [varName, varMeta] of Object.entries(value._meta.variables)) {
      if (
        !varMeta ||
        typeof varMeta !== "object" ||
        typeof (varMeta as any).format !== "string" ||
        ((varMeta as any).role !== "plural" &&
          (varMeta as any).role !== "other")
      ) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Type guard to check if an object is a valid plural forms object
 * Ensures ALL keys are CLDR categories to avoid false positives
 */
export function isPluralFormsObject(
  value: any,
): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  // Must have at least one key
  if (keys.length === 0) {
    return false;
  }

  // Check if ALL keys are CLDR plural categories
  const allKeysAreCldr = keys.every((key) => CLDR_PLURAL_CATEGORIES.has(key));

  if (!allKeysAreCldr) {
    return false;
  }

  // Check if all values are strings
  const allValuesAreStrings = keys.every(
    (key) => typeof value[key] === "string",
  );

  if (!allValuesAreStrings) {
    return false;
  }

  // Must have at least "other" form (required in all locales)
  if (!("other" in value)) {
    return false;
  }

  return true;
}

/**
 * Get required CLDR plural categories for a locale
 *
 * @throws {Error} If locale is invalid and cannot be resolved
 */
function getRequiredPluralCategories(locale: string): string[] {
  try {
    const pluralRules = new Intl.PluralRules(locale);
    const categories = pluralRules.resolvedOptions().pluralCategories;

    if (!categories || categories.length === 0) {
      throw new Error(`No plural categories found for locale: ${locale}`);
    }

    return categories;
  } catch (error) {
    // Log warning but use safe fallback
    console.warn(
      `[xcode-xcstrings-icu] Failed to resolve plural categories for locale "${locale}". ` +
        `Using fallback ["one", "other"]. Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return ["one", "other"];
  }
}

/**
 * Map CLDR category names to their numeric values for exact match conversion
 */
const CLDR_CATEGORY_TO_NUMBER: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
};

/**
 * Map numeric values back to CLDR category names
 */
const NUMBER_TO_CLDR_CATEGORY: Record<number, string> = {
  0: "zero",
  1: "one",
  2: "two",
};

/**
 * Convert xcstrings plural forms to ICU MessageFormat with metadata
 *
 * @param pluralForms - Record of plural forms (e.g., { one: "1 item", other: "%d items" })
 * @param sourceLocale - Source language locale (e.g., "en", "ru") to determine required vs optional forms
 * @returns ICU string with metadata for format preservation
 *
 * @example
 * xcstringsToPluralWithMeta({ one: "1 mile", other: "%.1f miles" }, "en")
 * // Returns:
 * // {
 * //   icu: "{count, plural, one {1 mile} other {# miles}}",
 * //   _meta: { variables: { count: { format: "%.1f", role: "plural" } } }
 * // }
 *
 * @example
 * xcstringsToPluralWithMeta({ zero: "No items", one: "1 item", other: "%d items" }, "en")
 * // Returns:
 * // {
 * //   icu: "{count, plural, =0 {No items} one {1 item} other {# items}}",
 * //   _meta: { variables: { count: { format: "%d", role: "plural" } } }
 * // }
 */
export function xcstringsToPluralWithMeta(
  pluralForms: Record<string, string>,
  sourceLocale: string = "en",
): PluralWithMetadata {
  if (!pluralForms || Object.keys(pluralForms).length === 0) {
    throw new Error("pluralForms cannot be empty");
  }

  // Get required CLDR categories for this locale
  const requiredCategories = getRequiredPluralCategories(sourceLocale);

  const variables: Record<
    string,
    { format: string; role: "plural" | "other" }
  > = {};

  // Regex to match format specifiers:
  // %[position$][flags][width][.precision][length]specifier
  // Examples: %d, %lld, %.2f, %@, %1$@, %2$lld
  const formatRegex =
    /(%(?:(\d+)\$)?(?:[+-])?(?:\d+)?(?:\.(\d+))?([lhqLzjt]*)([diuoxXfFeEgGaAcspn@]))/g;

  // Analyze ALL forms to find the one with most variables (typically "other")
  let maxMatches: RegExpMatchArray[] = [];
  let maxMatchText = "";
  for (const [form, text] of Object.entries(pluralForms)) {
    // Skip if text is not a string
    if (typeof text !== "string") {
      console.warn(
        `Warning: Plural form "${form}" has non-string value:`,
        text,
      );
      continue;
    }
    const matches = [...text.matchAll(formatRegex)];
    if (matches.length > maxMatches.length) {
      maxMatches = matches;
      maxMatchText = text;
    }
  }

  let lastNumericIndex = -1;

  // Find which variable is the plural one (heuristic: last numeric format)
  maxMatches.forEach((match, idx) => {
    const specifier = match[5];
    // Numeric specifiers that could be plural counts
    if (/[diuoxXfFeE]/.test(specifier)) {
      lastNumericIndex = idx;
    }
  });

  // Build variable metadata
  let nonPluralCounter = 0;
  maxMatches.forEach((match, idx) => {
    const fullFormat = match[1]; // e.g., "%.2f", "%lld", "%@"
    const position = match[2]; // e.g., "1" from "%1$@"
    const precision = match[3]; // e.g., "2" from "%.2f"
    const lengthMod = match[4]; // e.g., "ll" from "%lld"
    const specifier = match[5]; // e.g., "f", "d", "@"

    const isPluralVar = idx === lastNumericIndex;
    const varName = isPluralVar ? "count" : `var${nonPluralCounter++}`;

    variables[varName] = {
      format: fullFormat,
      role: isPluralVar ? "plural" : "other",
    };
  });

  // Build ICU string for each plural form
  const variableKeys = Object.keys(variables);
  const icuForms = Object.entries(pluralForms)
    .filter(([form, text]) => {
      // Skip non-string values
      if (typeof text !== "string") {
        return false;
      }
      return true;
    })
    .map(([form, text]) => {
      let processed = text as string;
      let vIdx = 0;

      // Replace format specifiers with ICU equivalents
      processed = processed.replace(formatRegex, () => {
        if (vIdx >= variableKeys.length) {
          // Shouldn't happen, but fallback
          vIdx++;
          return "#";
        }

        const varName = variableKeys[vIdx];
        const varMeta = variables[varName];
        vIdx++;

        if (varMeta.role === "plural") {
          // Plural variable uses # in ICU
          return "#";
        } else {
          // Non-plural variables use {varName}
          return `{${varName}}`;
        }
      });

      // Determine if this form is required or optional
      const isRequired = requiredCategories.includes(form);
      const formKey =
        !isRequired && form in CLDR_CATEGORY_TO_NUMBER
          ? `=${CLDR_CATEGORY_TO_NUMBER[form]}` // Convert optional forms to exact matches
          : form; // Keep required forms as CLDR keywords

      return `${formKey} {${processed}}`;
    })
    .join(" ");

  // Find plural variable name
  const pluralVarName =
    Object.keys(variables).find((name) => variables[name].role === "plural") ||
    "count";

  const icu = `{${pluralVarName}, plural, ${icuForms}}`;

  const result: PluralWithMetadata = {
    icu,
    _meta: Object.keys(variables).length > 0 ? { variables } : undefined,
    [ICU_TYPE_MARKER]: true, // Add type marker for robust detection
  };

  return result;
}

/**
 * Convert ICU MessageFormat with metadata back to xcstrings plural forms
 *
 * Uses metadata to restore original format specifiers with full precision.
 *
 * @param data - ICU string with metadata
 * @returns Record of plural forms suitable for xcstrings
 *
 * @example
 * pluralWithMetaToXcstrings({
 *   icu: "{count, plural, one {# километр} other {# километров}}",
 *   _meta: { variables: { count: { format: "%.1f", role: "plural" } } }
 * })
 * // Returns: { one: "%.1f километр", other: "%.1f километров" }
 */
export function pluralWithMetaToXcstrings(
  data: PluralWithMetadata,
): Record<string, string> {
  if (!data.icu) {
    throw new Error("ICU string is required");
  }

  // Parse ICU MessageFormat string
  const ast = parseICU(data.icu);

  if (!ast || ast.length === 0) {
    throw new Error("Invalid ICU format");
  }

  // Find the plural node
  const pluralNode = ast.find((node) => node.type === "plural");

  if (!pluralNode) {
    throw new Error("No plural found in ICU format");
  }

  const forms: Record<string, string> = {};

  // Convert each plural form back to xcstrings format
  for (const [form, option] of Object.entries(pluralNode.options)) {
    let text = "";

    const optionValue = (option as any).value;
    for (const element of optionValue) {
      if (element.type === "literal") {
        // Plain text
        text += element.value;
      } else if (element.type === "pound") {
        // # → look up plural variable format in metadata
        const pluralVar = Object.entries(data._meta?.variables || {}).find(
          ([_, meta]) => meta.role === "plural",
        );

        text += pluralVar?.[1].format || "%lld";
      } else if (element.type === "argument") {
        // {varName} → look up variable format by name
        const varName = element.value;
        const varMeta = data._meta?.variables?.[varName];

        text += varMeta?.format || "%@";
      }
    }

    // Convert exact matches (=0, =1) back to CLDR category names
    let xcstringsFormName = form;
    if (form.startsWith("=")) {
      const numValue = parseInt(form.substring(1), 10);
      xcstringsFormName = NUMBER_TO_CLDR_CATEGORY[numValue] || form;
    }

    forms[xcstringsFormName] = text;
  }

  return forms;
}

/**
 * Simple ICU MessageFormat parser
 *
 * This is a lightweight parser for our specific use case.
 * For production, consider using @formatjs/icu-messageformat-parser
 */
function parseICU(icu: string): any[] {
  // Remove outer braces and split by "plural,"
  const match = icu.match(/\{(\w+),\s*plural,\s*(.+)\}$/);

  if (!match) {
    throw new Error("Invalid ICU plural format");
  }

  const varName = match[1];
  const formsText = match[2];

  // Parse plural forms manually to handle nested braces
  const options: Record<string, any> = {};

  let i = 0;
  while (i < formsText.length) {
    // Skip whitespace
    while (i < formsText.length && /\s/.test(formsText[i])) {
      i++;
    }

    if (i >= formsText.length) break;

    // Read form name (e.g., "one", "other", "few", "=0", "=1")
    let formName = "";

    // Check for exact match syntax (=0, =1, etc.)
    if (formsText[i] === "=") {
      formName += formsText[i];
      i++;
      // Read the number
      while (i < formsText.length && /\d/.test(formsText[i])) {
        formName += formsText[i];
        i++;
      }
    } else {
      // Read word form name
      while (i < formsText.length && /\w/.test(formsText[i])) {
        formName += formsText[i];
        i++;
      }
    }

    if (!formName) break;

    // Skip whitespace and find opening brace
    while (i < formsText.length && /\s/.test(formsText[i])) {
      i++;
    }

    if (i >= formsText.length || formsText[i] !== "{") {
      throw new Error(`Expected '{' after form name '${formName}'`);
    }

    // Find matching closing brace
    i++; // skip opening brace
    let braceCount = 1;
    let formText = "";

    while (i < formsText.length && braceCount > 0) {
      if (formsText[i] === "{") {
        braceCount++;
        formText += formsText[i];
      } else if (formsText[i] === "}") {
        braceCount--;
        if (braceCount > 0) {
          formText += formsText[i];
        }
      } else {
        formText += formsText[i];
      }
      i++;
    }

    if (braceCount !== 0) {
      // Provide detailed error with context
      const preview = formsText.substring(
        Math.max(0, i - 50),
        Math.min(formsText.length, i + 50),
      );
      throw new Error(
        `Unclosed brace for form '${formName}' in ICU MessageFormat.\n` +
          `Expected ${braceCount} more closing brace(s).\n` +
          `Context: ...${preview}...\n` +
          `Full ICU: {${varName}, plural, ${formsText}}`,
      );
    }

    // Parse the form text to extract elements
    const elements = parseFormText(formText);

    options[formName] = {
      value: elements,
    };
  }

  return [
    {
      type: "plural",
      value: varName,
      options,
    },
  ];
}

/**
 * Parse form text into elements (literals, pounds, arguments)
 */
function parseFormText(text: string): any[] {
  const elements: any[] = [];
  let currentText = "";
  let i = 0;

  while (i < text.length) {
    if (text[i] === "#") {
      // Add accumulated text as literal
      if (currentText) {
        elements.push({ type: "literal", value: currentText });
        currentText = "";
      }
      // Add pound element
      elements.push({ type: "pound" });
      i++;
    } else if (text[i] === "{") {
      // Variable reference - need to handle nested braces
      // Add accumulated text as literal
      if (currentText) {
        elements.push({ type: "literal", value: currentText });
        currentText = "";
      }

      // Find matching closing brace (handle nesting)
      let braceCount = 1;
      let j = i + 1;
      while (j < text.length && braceCount > 0) {
        if (text[j] === "{") {
          braceCount++;
        } else if (text[j] === "}") {
          braceCount--;
        }
        j++;
      }

      if (braceCount !== 0) {
        throw new Error("Unclosed variable reference");
      }

      // j is now positioned after the closing brace
      const varName = text.slice(i + 1, j - 1);
      elements.push({ type: "argument", value: varName });

      i = j;
    } else {
      currentText += text[i];
      i++;
    }
  }

  // Add remaining text
  if (currentText) {
    elements.push({ type: "literal", value: currentText });
  }

  return elements;
}
