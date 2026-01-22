
export interface ParsedJsonResult {
  data: Record<string, string> | null;
  error: string | null;
}

export function parseJson(input: string): ParsedJsonResult {
  if (!input || typeof input !== "string") {
    return {
      data: null,
      error: "Input is empty or not a valid string.",
    };
  }

  try {
    const parsed = JSON.parse(input);


    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {
        data: null,
        error: "JSON must be an object with key-value pairs.",
      };
    }

    const normalized: Record<string, string> = {};

    for (const [key, value] of Object.entries(parsed)) {

      if (typeof key !== "string") {
        return {
          data: null,
          error: "All translation keys must be strings.",
        };
      }

      if (typeof value !== "string") {
        return {
          data: null,
          error: `Value for key "${key}" must be a string.`,
        };
      }

      normalized[key] = value;
    }

    return {
      data: normalized,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: "Invalid JSON format. Please check your syntax.",
    };
  }
}
