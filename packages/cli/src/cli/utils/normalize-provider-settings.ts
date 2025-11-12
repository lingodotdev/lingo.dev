export type ProviderModelSettings = {
  temperature?: number;
  response_mime_type?: "application/json" | "text/x.enum";
  response_schema?: Record<string, unknown>;
};

export type NormalizedModelSettings = {
  temperature?: number;
  responseMimeType?: "application/json" | "text/x.enum";
  responseSchema?: Record<string, unknown>;
};

export function normalizeProviderSettings(
  providerId: string | undefined,
  settings?: ProviderModelSettings | null,
): NormalizedModelSettings {
  if (!settings) {
    return {};
  }

  const normalized: NormalizedModelSettings = {};

  if (typeof settings.temperature === "number") {
    normalized.temperature = settings.temperature;
  }

  if (providerId === "google") {
    if (settings.response_mime_type) {
      normalized.responseMimeType = settings.response_mime_type;
    }
    if (settings.response_schema) {
      normalized.responseSchema = settings.response_schema;
    }
  }

  return normalized;
}
