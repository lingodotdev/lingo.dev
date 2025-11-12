import { i18nSchema, type I18nConfig } from "./schema.js";
import { suggestionsFromError } from "./suggest.js";
import { ZodError } from "zod";

export type ValidationResult = {
  ok: boolean;
  errors?: string[];
  suggestions?: string[];
  parsed?: I18nConfig;
};

export type { I18nConfig } from "./schema.js";

export function validateI18nConfig(raw: unknown): ValidationResult {
  try {
    const parsed = i18nSchema.parse(raw);

    const checks: string[] = [];

    // Custom validation for [locale] placeholders
    if (parsed.buckets) {
      for (const [bucketName, bucket] of Object.entries(parsed.buckets)) {
        if (bucket.include) {
          for (const inc of bucket.include) {
            const path = typeof inc === "string" ? inc : inc.path;
            if (!/\[locale\]/.test(path)) {
              checks.push(
                `Bucket "${bucketName}" include pattern "${path}" does not contain the [locale] placeholder — include "[locale]" if files are per-locale.`,
              );
            }
          }
        }
        
        // Validate exclude patterns too
        if (bucket.exclude) {
          for (const exc of bucket.exclude) {
            const path = typeof exc === "string" ? exc : exc.path;
            if (!/\[locale\]/.test(path)) {
              checks.push(
                `Bucket "${bucketName}" exclude pattern "${path}" does not contain the [locale] placeholder — include "[locale]" if files are per-locale.`,
              );
            }
          }
        }
      }
    }

    if (checks.length > 0) {
      return { ok: false, errors: checks, suggestions: checks };
    }

    return { ok: true, parsed };
  } catch (err) {
    if (err instanceof ZodError) {
      const errs = err.issues.map(
        (e) => `${e.path.join(".") || "root"}: ${e.message}`,
      );
      const suggestions = suggestionsFromError(err);
      return { ok: false, errors: errs, suggestions };
    }
    return { ok: false, errors: [String(err)] };
  }
}
