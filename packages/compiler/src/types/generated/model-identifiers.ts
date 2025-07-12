/**
 * Model identifier types for supported AI providers
 *
 * This module provides TypeScript types for AI model identifiers,
 * enabling auto-completion and type safety when specifying models.
 *
 * Generated from models.dev API
 * Last updated: 2025-07-12T12:52:20.786Z
 * Total models: 65
 *
 * @see https://models.dev for latest model information
 */

/**
 * Model identifier that supports both known models and custom ones
 *
 * Provides auto-completion for known models while allowing any
 * valid "provider:model" format for flexibility.
 *
 * @example
 * // Known model with auto-completion
 * const knownModel: ModelIdentifier = "anthropic:claude-3-sonnet";
 *
 * // Custom model
 * const customModel: ModelIdentifier = "custom-provider:my-model";
 */
export type ModelIdentifier = KnownModelIdentifier | UnknownModelIdentifier;

/**
 * All supported model identifiers with provider prefixes
 *
 * Use these complete identifiers when configuring your application.
 * Format: "provider:model-name"
 *
 * @example
 * const myModel: KnownModelIdentifier = "openai:gpt-4";
 */
export type KnownModelIdentifier =
  | `google:${GoogleModel}`
  | `groq:${GroqModel}`
  | `mistral:${MistralModel}`
  | `openrouter:${OpenRouterModel}`;

/**
 * Generic model identifier for custom providers
 *
 * Use this type when you need to specify a model from a provider
 * not included in the known providers list.
 *
 * @example
 * const customModel: UnknownModelIdentifier = "custom-provider:my-model";
 */
export type UnknownModelIdentifier = `${string}:${string}` & {};

/**
 * Google model identifiers
 *
 * Use these strings to specify Google models in your application.
 *
 * @example
 * const model: GoogleModel = "gemini-1.5-flash";
 *
 * @see https://ai.google.dev/gemini-api/docs/troubleshooting for complete model documentation
 */
export type GoogleModel =
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
 * Groq model identifiers
 *
 * Use these strings to specify Groq models in your application.
 *
 * @example
 * const model: GroqModel = "deepseek-r1-distill-llama-70b";
 *
 * @see https://console.groq.com/docs/errors for complete model documentation
 */
export type GroqModel =
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
 * Mistral model identifiers
 *
 * Use these strings to specify Mistral models in your application.
 *
 * @example
 * const model: MistralModel = "codestral-latest";
 *
 * @see https://docs.mistral.ai for complete model documentation
 */
export type MistralModel =
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
 * OpenRouter model identifiers
 *
 * Use these strings to specify OpenRouter models in your application.
 *
 * @example
 * const model: OpenRouterModel = "anthropic/claude-3.7-sonnet";
 *
 * @see https://openrouter.ai/docs for complete model documentation
 */
export type OpenRouterModel =
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
