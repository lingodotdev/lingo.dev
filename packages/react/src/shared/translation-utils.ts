/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Gets the translated text for a given entry and applies variable/expression substitutions
 */
export function getTranslation(
  dictionary: any,
  fileKey: string,
  entryKey: string,
  variables?: Record<string, any>,
  functions?: Record<string, Function>,
  expressions?: any[]
): string {
  if (!dictionary) return "";

  const entry = dictionary.data?.[fileKey]?.[entryKey];
  if (!entry) return "";

  let text = entry;

  // Replace variables with proper regex escaping
  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      const escapedKey = escapeRegExp(key);
      text = text.replace(new RegExp(`\\{${escapedKey}\\}`, "g"), String(value));
    });
  }

  // Handle function placeholders: {fn:functionName}
  // Functions can be used in translations for dynamic content generation
  if (functions) {
    text = text.replace(/\{fn:([a-zA-Z0-9_]+)\}/g, (_match: string, fnName: string) => {
      if (typeof functions[fnName] === "function") {
        try {
          // Call function with context (variables and expressions)
          return String(functions[fnName](variables, expressions));
        } catch (e) {
          console.error(`Error calling function ${fnName}:`, e);
          return "";
        }
      }
      return "";
    });
  }

  // Handle expressions (indexed placeholders)
  if (expressions) {
    expressions.forEach((expr, index) => {
      text = text.replace(`{${index}}`, String(expr));
    });
  }

  return text;
}

