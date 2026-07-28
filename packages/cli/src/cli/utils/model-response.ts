import { jsonrepair } from "jsonrepair";

/** Characters that may legally follow a closing string quote in JSON. */
const CAN_FOLLOW_STRING = new Set([",", ":", "}", "]", '"']);

const isWhitespace = (char: string | undefined): boolean =>
  char !== undefined && /\s/.test(char);

/** Index of the next non-whitespace character at or after `from`. */
function skipWhitespace(text: string, from: number): number {
  let index = from;
  while (index < text.length && isWhitespace(text[index])) index++;
  return index;
}

/**
 * True when the brace at `index` opens an ICU placeholder (`{title}`) rather
 * than a JSON object — no quotes and no colon inside it.
 */
function opensPlaceholder(text: string, index: number): boolean {
  const end = text.indexOf("}", index);
  return end !== -1 && /^[A-Za-z0-9_.\-]+$/.test(text.slice(index + 1, end));
}

/** True when the brace at `index` opens an object, i.e. a key or `}` follows. */
function opensObject(text: string, index: number): boolean {
  const next = text[skipWhitespace(text, index + 1)];
  return next === '"' || next === "}";
}

/**
 * Rewrites the two ways a model breaks JSON around a quoted ICU placeholder.
 *
 * The source string `"Attach '{title}'?"` becomes `„{title}" anhängen?` in
 * German: the language's word order moves the placeholder to the front of the
 * sentence and its typography wraps it in quotes. Models emit those quotes
 * unescaped, so the JSON string closes early and the placeholder's `{` lands
 * where a value belongs — `Unexpected character "{"`. Some responses instead
 * drop the value's opening quote altogether (`"confirm_title":{title}" …"`),
 * which jsonrepair reads as an object and reports as `Colon expected`.
 *
 * Both are repaired in one pass: a quote only terminates a string when the next
 * non-whitespace character could legally follow one, and a placeholder sitting
 * where a value is expected starts a string instead of an object.
 */
function repairPlaceholderQuoting(text: string): string {
  let out = "";
  let inString = false;
  let expectingValue = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (char === "\\") {
        out += char + (text[i + 1] ?? "");
        i++;
        continue;
      }

      if (char !== '"') {
        out += char;
        continue;
      }

      const following = text[skipWhitespace(text, i + 1)];
      if (following === undefined || CAN_FOLLOW_STRING.has(following)) {
        out += char;
        inString = false;
      } else {
        out += '\\"';
      }
      continue;
    }

    if (char === '"') {
      out += char;
      inString = true;
      expectingValue = false;
      continue;
    }

    if (expectingValue && char === "{" && opensPlaceholder(text, i)) {
      // An unquoted value that begins with a placeholder: open the string for it.
      out += `"${char}`;
      inString = true;
      expectingValue = false;
      continue;
    }

    out += char;
    if (char === ":") expectingValue = true;
    else if (!isWhitespace(char)) expectingValue = false;
  }

  return out;
}

/**
 * Slices out the JSON object, preferring the first brace that actually opens one.
 * A preamble such as `Hier ist die Übersetzung für {title}:` would otherwise
 * hand jsonrepair the placeholder's brace and fail with `Colon expected`.
 */
function extractObject(text: string): string {
  const lastBrace = text.lastIndexOf("}");
  const firstBrace = text.indexOf("{");
  if (firstBrace === -1 || lastBrace < firstBrace) return text;

  for (
    let start = firstBrace;
    start !== -1 && start < lastBrace;
    start = text.indexOf("{", start + 1)
  ) {
    if (opensObject(text, start)) return text.slice(start, lastBrace + 1);
  }

  return text.slice(firstBrace, lastBrace + 1);
}

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
    // jsonrepair handles structural slips (trailing commas, missing colons) but
    // gives up on quoting damage, so that repair runs last — and only once
    // jsonrepair has failed, keeping it away from responses it already fixes.
    try {
      return JSON.parse(jsonrepair(extracted));
    } catch (repairError) {
      try {
        return JSON.parse(
          jsonrepair(repairPlaceholderQuoting(extractObject(text))),
        );
      } catch {
        // Report what the model actually returned, not the rewritten variant.
        throw repairError;
      }
    }
  }
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
        const inner = parseModelResponse(trimmed);
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
