export const safeJsonParse = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const formatToolPayload = (value: unknown) => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const clampText = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }
  return `${value.slice(0, limit)}…`;
};
