/**
 * Auto-generated model identifiers from models.dev
 * Last updated: 2025-07-12T12:30:13.086Z
 * Total models: 65
 * 
 * @see https://models.dev for latest model information
 */

/**
 * GROQ models available via GROQ API
 * @see https://console.groq.com/docs/errors for API documentation
 */
export type GROQModels = 
  | "deepseek-r1-distill-llama-70b"
  | "gemma2-9b-it"
  | "llama-3.1-8b-instant"
  | "llama-3.3-70b-versatile"
  | "llama-guard-3-8b"
  | "llama3-70b-8192"
  | "llama3-8b-8192"
  | "meta-llama/llama-4-maverick-17b-128e-instruct"
  | "meta-llama/llama-4-scout-17b-16e-instruct"
  | "meta-llama/llama-guard-4-12b"
  | "mistral-saba-24b"
  | "qwen-qwq-32b"
  | "qwen/qwen3-32b";

/**
 * Mistral models available via Mistral API
 * @see https://docs.mistral.ai for API documentation
 */
export type MistralModels = 
  | "codestral-latest"
  | "devstral-medium-2507"
  | "devstral-small-2505"
  | "devstral-small-2507"
  | "magistral-medium-latest"
  | "magistral-small"
  | "ministral-3b-latest"
  | "ministral-8b-latest"
  | "mistral-large-latest"
  | "mistral-medium-latest"
  | "mistral-nemo"
  | "mistral-small-latest"
  | "open-mistral-7b"
  | "open-mixtral-8x22b"
  | "open-mixtral-8x7b"
  | "pixtral-12b"
  | "pixtral-large-latest";

/**
 * OpenRouter models available via OpenRouter API
 * @see https://openrouter.ai/docs for API documentation
 */
export type OpenRouterModels = 
  | "anthropic/claude-3.7-sonnet"
  | "anthropic/claude-4-sonnet-20250522"
  | "anthropic/claude-opus-4"
  | "google/gemini-2.0-flash-001"
  | "google/gemini-2.5-flash-preview-04-17"
  | "google/gemini-2.5-flash-preview-05-20"
  | "google/gemini-2.5-pro"
  | "google/gemini-2.5-pro-preview-05-06"
  | "google/gemini-2.5-pro-preview-06-05"
  | "mistralai/devstral-medium-2507"
  | "mistralai/devstral-small-2505"
  | "mistralai/devstral-small-2505:free"
  | "mistralai/devstral-small-2507"
  | "moonshotai/kimi-k2"
  | "openai/gpt-4.1"
  | "openai/gpt-4.1-mini"
  | "openai/gpt-4o-mini"
  | "openai/o4-mini"
  | "x-ai/grok-3"
  | "x-ai/grok-3-beta"
  | "x-ai/grok-3-mini"
  | "x-ai/grok-3-mini-beta"
  | "x-ai/grok-4";

/**
 * Google models available via Google API
 * @see https://ai.google.dev/gemini-api/docs/troubleshooting for API documentation
 */
export type GoogleModels = 
  | "gemini-1.5-flash"
  | "gemini-1.5-flash-8b"
  | "gemini-1.5-pro"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite-preview-06-17"
  | "gemini-2.5-flash-preview-04-17"
  | "gemini-2.5-flash-preview-05-20"
  | "gemini-2.5-pro"
  | "gemini-2.5-pro-preview-05-06"
  | "gemini-2.5-pro-preview-06-05";

/**
 * All known model identifiers from supported providers
 */
export type KnownModelIdentifiers = 
  | `groq:${GROQModels}`
  | `mistral:${MistralModels}`
  | `openrouter:${OpenRouterModels}`
  | `google:${GoogleModels}`;

/**
 * Enhanced ModelIdentifier type with auto-completion for known models
 * while maintaining backward compatibility with arbitrary strings
 */
export type ModelIdentifier = KnownModelIdentifiers | `${string}:${string}`;

/**
 * Type guard to check if a string is a valid model identifier format
 */
export function isValidModelIdentifier(model: string): model is ModelIdentifier {
  return /^[^:]+:[^:]+$/.test(model);
}

/**
 * Type guard to check if a model identifier is a known model
 */
export function isKnownModelIdentifier(model: string): model is KnownModelIdentifiers {
  // This would need runtime validation against the known models
  // For now, just validate format
  return isValidModelIdentifier(model);
}
