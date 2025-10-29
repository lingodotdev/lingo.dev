export const DEFAULT_CONTEXT_ATTRIBUTE = "data-lingo-id";

export function resolveContextAttributeName(
  configuredName?: string | null,
): { name: string; usedFallback: boolean } {
  const trimmed = configuredName?.trim() ?? "";

  if (trimmed.startsWith("data-")) {
    return { name: trimmed, usedFallback: false };
  }

  return {
    name: DEFAULT_CONTEXT_ATTRIBUTE,
    usedFallback: Boolean(trimmed),
  };
}
