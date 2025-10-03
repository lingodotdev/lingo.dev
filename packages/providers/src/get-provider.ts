import { ProviderId } from "./constants";
import { ProviderMetadata, PROVIDER_METADATA } from "./metadata";
import { createProviderClient, ClientOptions } from "./factory";
import { LanguageModel } from "ai";

export function getProvider(
  providerId: ProviderId,
  modelId: string,
  options?: ClientOptions,
): { client: LanguageModel; metadata: ProviderMetadata } {
  const client = createProviderClient(providerId, modelId, options);
  const metadata = PROVIDER_METADATA[providerId];
  return { client, metadata };
}
