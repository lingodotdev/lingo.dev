import { ZodError } from "zod";

export function suggestionsFromError(err: ZodError): string[] {
  const suggestions: string[] = [];

  for (const issue of err.issues) {
    const path = issue.path.join(".");
    const msg = issue.message;

    // Handle required field errors
    if (
      msg.includes("Required") ||
      msg.includes("expected string, received undefined") ||
      msg.includes("expected array, received undefined")
    ) {
      if (path === "locale.source") {
        suggestions.push(
          'Add `locale.source`, e.g. "en" (BCP 47 language code).',
        );
      } else if (path === "locale.targets") {
        suggestions.push(
          'Add at least one `locale.targets` entry, e.g. ["es", "fr"].',
        );
      } else if (path.startsWith("buckets") && path.endsWith("include")) {
        suggestions.push(
          'Each bucket should have `include` patterns with `[locale]` placeholder, e.g. "locales/[locale].json".',
        );
      } else {
        suggestions.push(`Add missing field: ${path}`);
      }
    }

    // Handle array length validation (Zod "too small" wording)
    else if (
      msg.toLowerCase().includes("too small") ||
      msg.toLowerCase().includes("must contain at least")
    ) {
      if (path === "locale.targets") {
        suggestions.push('Add at least one target locale, e.g. ["es", "fr"].');
      } else {
        suggestions.push(`${path} must not be empty.`);
      }
    }

    // Handle enum validation (Zod wording: "Invalid enum value" or "Invalid option")
    else if (
      msg.includes("Invalid enum value") ||
      msg.includes("Invalid option")
    ) {
      if (path === "provider.id") {
        suggestions.push(
          'Use a supported provider: "openai", "anthropic", "google", "ollama", "openrouter", or "mistral".',
        );
      } else if (path === "formatter") {
        suggestions.push('Use a supported formatter: "prettier" or "biome".');
      } else {
        suggestions.push(`${path}: ${msg}`);
      }
    }

    // Handle number validation (Zod changed "Too big/small" phrasing)
    else if (
      msg.includes("Too big") ||
      msg.includes("Too small") ||
      msg.includes("less than or equal") ||
      msg.includes("greater than or equal")
    ) {
      if (path.includes("temperature")) {
        suggestions.push(
          "Temperature must be between 0 and 2 (0=deterministic, 2=very random).",
        );
      } else {
        suggestions.push(`${path}: ${msg}`);
      }
    }

    // Handle type mismatches
    else if (msg.includes("Expected")) {
      suggestions.push(`${path}: ${msg}`);
    }

    // Fallback for other errors
    else {
      suggestions.push(`${path || "root"}: ${msg}`);
    }
  }

  return suggestions;
}
