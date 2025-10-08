import { PROVIDER_METADATA } from "./metadata";

export type { ProviderId } from "./metadata";

// Derive supported providers from metadata keys to prevent drift
export const SUPPORTED_PROVIDERS = Object.freeze(
  Object.keys(PROVIDER_METADATA),
) as readonly string[] as readonly import("./metadata").ProviderId[];
