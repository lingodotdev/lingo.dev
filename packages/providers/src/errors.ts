import { ProviderId } from "./metadata";

export class ProviderKeyMissingError extends Error {
  constructor(
    public providerId: ProviderId,
    public envVar?: string,
    public configKey?: string,
  ) {
    super(
      `API key for provider "${providerId}" not found` +
        (envVar ? ` (env: ${envVar})` : "") +
        (configKey ? ` (rc: ${configKey})` : ""),
    );
    this.name = "ProviderKeyMissingError";
  }
}

export class ProviderAuthFailedError extends Error {
  constructor(
    public providerId: ProviderId,
    public originalError: Error,
  ) {
    super(`Authentication failed for provider "${providerId}": ${originalError.message}`);
    this.name = "ProviderAuthFailedError";
  }
}

export class UnsupportedProviderError extends Error {
  constructor(public providerId: string) {
    super(`Unsupported provider: ${providerId}`);
    this.name = "UnsupportedProviderError";
  }
}
