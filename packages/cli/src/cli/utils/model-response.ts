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
    return JSON.parse(jsonrepair(extracted));
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
