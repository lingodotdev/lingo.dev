import { jsonrepair } from "jsonrepair";

export function parseModelResponse(
  text: string,
): ReturnType<typeof JSON.parse> {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  const extracted =
    firstBrace !== -1 && lastBrace >= firstBrace
      ? text.slice(firstBrace, lastBrace + 1)
      : text;

  try {
    return JSON.parse(extracted);
  } catch {
    try {
      return JSON.parse(jsonrepair(extracted));
    } catch {
      // Models (notably Claude Sonnet) occasionally emit string values
      // containing unescaped double quotes that jsonrepair can't recover on
      // its own. Escape those quotes and retry before giving up — this keeps
      // the response usable instead of triggering a costly fallback retranslation.
      return JSON.parse(jsonrepair(escapeUnescapedQuotes(extracted)));
    }
  }
}

/**
 * Escape double quotes that appear inside JSON string values but were left
 * unescaped by the model. A quote is treated as a real string terminator only
 * when the next non-whitespace character is a structural delimiter (`:`, `,`,
 * `}`, `]`) or the end of input; any other quote inside a string is escaped.
 */
export function escapeUnescapedQuotes(input: string): string {
  let out = "";
  let inString = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (!inString) {
      out += ch;
      if (ch === '"') inString = true;
      continue;
    }

    if (ch === "\\") {
      // Preserve already-escaped sequences verbatim.
      out += ch;
      if (i + 1 < input.length) {
        out += input[i + 1];
        i++;
      }
      continue;
    }

    if (ch === '"') {
      let j = i + 1;
      while (j < input.length && /\s/.test(input[j])) j++;
      const next = input[j];
      if (
        next === undefined ||
        next === ":" ||
        next === "," ||
        next === "}" ||
        next === "]"
      ) {
        out += ch;
        inString = false;
      } else {
        out += '\\"';
      }
      continue;
    }

    out += ch;
  }

  return out;
}

export function extractLocalizedData(text: string): Record<string, any> {
  let result: ReturnType<typeof JSON.parse>;
  try {
    result = parseModelResponse(text);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `The model returned a response that is not valid JSON (${detail}). Please try again.`,
    );
  }

  // Handle object responses
  if (typeof result?.data === "object" && result.data !== null) {
    return result.data;
  }

  if (
    typeof result === "object" &&
    result !== null &&
    !Array.isArray(result) &&
    !("data" in result) &&
    !("role" in result && "content" in result)
  ) {
    return result;
  }

  // Handle string responses - extract and repair JSON
  if (typeof result?.data === "string") {
    const index = result.data.indexOf("{");
    const lastIndex = result.data.lastIndexOf("}");
    if (index !== -1 && lastIndex > index) {
      try {
        const trimmed = result.data.slice(index, lastIndex + 1);
        const inner = JSON.parse(jsonrepair(trimmed));
        if (typeof inner?.data === "object" && inner.data !== null) {
          return inner.data;
        }
      } catch {
        // fall through to the error below
      }
    }
  }

  throw new Error(
    'The model returned a response without translation data (expected a "data" object). Please try again.',
  );
}
