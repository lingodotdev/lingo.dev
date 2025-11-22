/**
 * Pseudo-localization utility for testing UI internationalization readiness
 * without waiting for actual translations.
 *
 * Implements character replacement with accented versions and optional lengthening,
 * following standard i18n practices used by Google, Microsoft, and Mozilla.
 */

/**
 * Character mapping for pseudo-localization (en-XA style)
 * Each ASCII character is replaced with a visually similar accented version
 */
const PSEUDO_CHAR_MAP: Record<string, string> = {
  a: "ã",
  b: "ƀ",
  c: "ç",
  d: "ð",
  e: "è",
  f: "ƒ",
  g: "ĝ",
  h: "ĥ",
  i: "í",
  j: "ĵ",
  k: "ķ",
  l: "ļ",
  m: "m",
  n: "ñ",
  o: "ø",
  p: "þ",
  q: "q",
  r: "ŕ",
  s: "š",
  t: "ţ",
  u: "û",
  v: "ṽ",
  w: "ŵ",
  x: "x",
  y: "ý",
  z: "ž",

  A: "Ã",
  B: "Ḃ",
  C: "Ĉ",
  D: "Ð",
  E: "È",
  F: "Ḟ",
  G: "Ĝ",
  H: "Ĥ",
  I: "Í",
  J: "Ĵ",
  K: "Ķ",
  L: "Ļ",
  M: "M",
  N: "Ñ",
  O: "Ø",
  P: "Þ",
  Q: "Q",
  R: "Ŕ",
  S: "Š",
  T: "Ţ",
  U: "Û",
  V: "Ṽ",
  W: "Ŵ",
  X: "X",
  Y: "Ý",
  Z: "Ž",
};

/**
 * Pseudo-localizes a string by replacing characters with accented versions
 * and optionally extending the length to simulate expansion.
 *
 * @param text - The text to pseudo-localize
 * @param options - Configuration options
 * @returns The pseudo-localized text
 *
 * @example
 * ```ts
 * pseudoLocalize("Submit") // "Šûbmíţ⚡"
 * pseudoLocalize("Welcome back!", { addLengthMarker: true }) // "Ŵêļçømèƀäçķ!⚡"
 * ```
 */
export function pseudoLocalize(
  text: string,
  options: {
    /**
     * Add a visual marker (⚡) at the end to indicate pseudo-localization
     * @default true
     */
    addMarker?: boolean;
    /**
     * Extend text length by adding padding characters to simulate text expansion.
     * Useful for testing UI layout with longer translations.
     * @default false
     */
    addLengthMarker?: boolean;
    /**
     * The percentage to extend the text (0-100).
     * @default 30
     */
    lengthExpansion?: number;
  } = {},
): string {
  const {
    addMarker = true,
    addLengthMarker = false,
    lengthExpansion = 30,
  } = options;

  if (!text) {
    return text;
  }

  // Replace characters with accented versions
  let result = "";
  for (const char of text) {
    result += PSEUDO_CHAR_MAP[char] ?? char;
  }

  // Add length expansion if requested
  if (addLengthMarker) {
    const extraChars = Math.ceil((text.length * lengthExpansion) / 100);
    // Add combining diacritical marks to simulate expansion
    result += "̌".repeat(extraChars);
  }

  // Add visual marker if requested
  if (addMarker) {
    result += "⚡";
  }

  return result;
}

/**
 * Pseudo-localizes all strings in an object (recursively).
 * Handles nested objects and arrays.
 *
 * @param obj - The object to pseudo-localize
 * @param options - Configuration options for pseudoLocalize
 * @returns A new object with all string values pseudo-localized
 */
export function pseudoLocalizeObject(
  obj: any,
  options?: Parameters<typeof pseudoLocalize>[1],
): any {
  if (typeof obj === "string") {
    return pseudoLocalize(obj, options);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => pseudoLocalizeObject(item, options));
  }

  if (obj !== null && typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = pseudoLocalizeObject(value, options);
    }
    return result;
  }

  return obj;
}
