/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT IT MANUALLY.
 */

/**
 * The AI model to use for localization.
 */
export type ModelIdentifier = KnownModelIdentifier | UnknownModelIdentifier;

/**
 * An AI model that Lingo.dev Compiler is known to support.
 */
export type KnownModelIdentifier =
  | `google:${GoogleModel}`
  | `groq:${GroqModel}`
  | `mistral:${MistralModel}`
  | `openrouter:${OpenRouterModel}`;

/**
 * An AI model that Lingo.dev Compiler is not known to support.
 *
 * @remarks
 * Even if support is unknown, model identifiers from any of the supported
 * providers should still work. Whether or not a model identifier is listed as
 * known depends on how recently these types were regenerated.
 */
export type UnknownModelIdentifier = `${string}:${string}` & {};

/**
 * A model identifier from Google.
 *
 * @see https://ai.google.dev/gemini-api/docs/troubleshooting
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
 * A model identifier from Groq.
 *
 * @see https://console.groq.com/docs/errors
 */
export type GroqModel =
  | "deepseek-r1-distill-llama-70b"
  | "gemma2-9b-it"
  | "llama-3.1-8b-instant"
  | "llama-3.3-70b-versatile"
  | "llama3-70b-8192"
  | "llama3-8b-8192"
  | "meta-llama/llama-4-maverick-17b-128e-instruct"
  | "meta-llama/llama-4-scout-17b-16e-instruct"
  | "mistral-saba-24b"
  | "moonshotai/kimi-k2-instruct"
  | "openai/gpt-oss-120b"
  | "openai/gpt-oss-20b"
  | "qwen-qwq-32b"
  | "qwen/qwen3-32b";

/**
 * A model identifier from Mistral.
 *
 * @see https://docs.mistral.ai
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
 * A model identifier from OpenRouter.
 *
 * @see https://openrouter.ai/docs
 */
export type OpenRouterModel =
  | "anthropic/claude-3.5-haiku"
  | "anthropic/claude-3.7-sonnet"
  | "anthropic/claude-4-sonnet-20250522"
  | "anthropic/claude-opus-4"
  | "anthropic/claude-opus-4.1"
  | "cognitivecomputations/dolphin3.0-mistral-24b"
  | "cognitivecomputations/dolphin3.0-r1-mistral-24b"
  | "deepseek/deepseek-chat-v3-0324"
  | "deepseek/deepseek-r1-0528-qwen3-8b:free"
  | "deepseek/deepseek-r1-0528:free"
  | "deepseek/deepseek-r1-distill-llama-70b"
  | "deepseek/deepseek-r1-distill-qwen-14b"
  | "deepseek/deepseek-r1:free"
  | "featherless/qwerky-72b"
  | "google/gemini-2.0-flash-001"
  | "google/gemini-2.0-flash-exp:free"
  | "google/gemini-2.5-flash"
  | "google/gemini-2.5-pro"
  | "google/gemini-2.5-pro-preview-05-06"
  | "google/gemini-2.5-pro-preview-06-05"
  | "google/gemma-2-9b-it:free"
  | "google/gemma-3-12b-it"
  | "google/gemma-3-27b-it"
  | "google/gemma-3n-e4b-it"
  | "google/gemma-3n-e4b-it:free"
  | "meta-llama/llama-3.2-11b-vision-instruct"
  | "meta-llama/llama-3.3-70b-instruct:free"
  | "meta-llama/llama-4-scout:free"
  | "microsoft/mai-ds-r1:free"
  | "mistralai/codestral-2508"
  | "mistralai/devstral-medium-2507"
  | "mistralai/devstral-small-2505"
  | "mistralai/devstral-small-2505:free"
  | "mistralai/devstral-small-2507"
  | "mistralai/mistral-7b-instruct:free"
  | "mistralai/mistral-nemo:free"
  | "mistralai/mistral-small-3.1-24b-instruct"
  | "mistralai/mistral-small-3.2-24b-instruct"
  | "mistralai/mistral-small-3.2-24b-instruct:free"
  | "moonshotai/kimi-dev-72b:free"
  | "moonshotai/kimi-k2"
  | "moonshotai/kimi-k2:free"
  | "nousresearch/deephermes-3-llama-3-8b-preview"
  | "openai/gpt-4.1"
  | "openai/gpt-4.1-mini"
  | "openai/gpt-4o-mini"
  | "openai/gpt-5"
  | "openai/gpt-5-chat"
  | "openai/gpt-5-mini"
  | "openai/gpt-5-nano"
  | "openai/gpt-oss-120b"
  | "openai/gpt-oss-20b"
  | "openai/o4-mini"
  | "openrouter/cypher-alpha:free"
  | "openrouter/horizon-alpha"
  | "openrouter/horizon-beta"
  | "qwen/qwen-2.5-coder-32b-instruct"
  | "qwen/qwen2.5-vl-32b-instruct:free"
  | "qwen/qwen2.5-vl-72b-instruct"
  | "qwen/qwen2.5-vl-72b-instruct:free"
  | "qwen/qwen3-14b:free"
  | "qwen/qwen3-235b-a22b-07-25"
  | "qwen/qwen3-235b-a22b-07-25:free"
  | "qwen/qwen3-235b-a22b-thinking-2507"
  | "qwen/qwen3-235b-a22b:free"
  | "qwen/qwen3-30b-a3b-instruct-2507"
  | "qwen/qwen3-30b-a3b:free"
  | "qwen/qwen3-32b:free"
  | "qwen/qwen3-8b:free"
  | "qwen/qwen3-coder"
  | "qwen/qwen3-coder:free"
  | "qwen/qwq-32b:free"
  | "rekaai/reka-flash-3"
  | "sarvamai/sarvam-m:free"
  | "thudm/glm-z1-32b:free"
  | "tngtech/deepseek-r1t2-chimera:free"
  | "x-ai/grok-3"
  | "x-ai/grok-3-beta"
  | "x-ai/grok-3-mini"
  | "x-ai/grok-3-mini-beta"
  | "x-ai/grok-4"
  | "z-ai/glm-4.5"
  | "z-ai/glm-4.5-air"
  | "z-ai/glm-4.5-air:free";
