import { Fragment, type ReactNode } from "react";
import IntlMessageFormat, { type FormatXMLElementFn } from "intl-messageformat";
import { logger } from "../../utils/logger";
import type { LocaleCode } from "lingo.dev/spec";

/**
 * Component renderer function for rich text translation
 */
export type ComponentRenderer = FormatXMLElementFn<ReactNode>;

/**
 * Rich text parameters for translation
 */
export type RichTextParams = Record<string, ReactNode | ComponentRenderer>;

/**
 * Wraps a FormatXMLElementFn to automatically assign keys to parts
 */
function assignUniqueKeysToParts(
  formatXMLElementFn: FormatXMLElementFn<ReactNode>,
): FormatXMLElementFn<ReactNode> {
  return function (parts: Array<ReactNode>) {
    return formatXMLElementFn(parts);
  };
}

/**
 * Wraps all FormatXMLElementFn values in params with key assignment
 */
function assignUniqueKeysToParams(params: RichTextParams): RichTextParams {
  const result: RichTextParams = {};

  for (const [key, value] of Object.entries(params)) {
    // Check if value is a FormatXMLElementFn (function that's not a React component)
    if (typeof value === "function") {
      result[key] = assignUniqueKeysToParts(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
//

/**
 * Parse rich text translation string with placeholders (server-side version)
 *
 * Supports:
 * - ICU MessageFormat: {count, plural, one {# item} other {# items}}
 * - Variable placeholders: {name}
 * - Component placeholders: <tag0>content</tag0>
 *
 * @param text - The translation string with placeholders
 * @param params - Object with variable values and component renderers
 * @param locale
 * @returns React nodes or string
 */
export function renderRichText(
  text: string,
  params: RichTextParams,
  locale: LocaleCode,
): ReactNode {
  try {
    const formatter = new IntlMessageFormat(text, locale);
    const keyedParams = assignUniqueKeysToParams(params);
    const result = formatter.format<ReactNode>(keyedParams);

    if (Array.isArray(result)) {
      // Making all elements keyed here somehow fixes all the things. Maybe I also need to key everything in toKeyedReactNodeArray and I just don't get the error because I don't have a corner case for it? Need to investigate
      return result.map((item, index) => {
        // Each item gets wrapped in Fragment with unique key
        // This handles strings, React elements (like <>text</>), everything
        return <Fragment key={index}>{item}</Fragment>;
      });
    }

    return result;
  } catch (error) {
    // It's better to render at least something than break the whole app.
    logger.warn(`Error rendering rich text (${text}): ${error}`);
    return text;
  }
}
