import { I18nConfig } from "@lingo.dev/_spec";
import { LocalizerFn } from "./_base";
import { createLingoLocalizer } from "./lingo";
import { createBasicTranslator } from "./basic";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

export default function createProcessor(
  provider: I18nConfig["provider"],
  params: { apiKey: string; apiUrl: string },
): LocalizerFn {
  if (!provider || provider.id === "lingo") {
    const result = createLingoLocalizer(params);
    return result;
  } else {
    const model = getPureModelProvider(provider);
    const result = createBasicTranslator(model, provider.prompt);
    return result;
  }
}

function getPureModelProvider(provider: I18nConfig["provider"]) {
  switch (provider?.id) {
    case "openai":
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not set.");
      }
      return createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: provider.baseUrl,
      })(provider.model);
    case "anthropic":
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not set.");
      }
      return createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })(provider.model);
    default:
      throw new Error(`Unsupported provider: ${provider?.id}`);
  }
}
