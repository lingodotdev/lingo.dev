---
"@lingo.dev/compiler": patch
---

docs: comprehensive README update with LLM configuration, manual overrides, and advanced features

Added extensive documentation covering:
- Complete LLM provider configuration (OpenAI, Anthropic, Google, Groq, Mistral, OpenRouter, Ollama)
- Environment variables for all supported providers
- Locale-pair model mapping with wildcard patterns
- Custom translation prompts
- Manual translation overrides using data-lingo-override attribute
- Build modes (translate vs cache-only) and recommended workflows
- Custom locale resolvers (server and client)
- Configuration options table with defaults
- Development configuration (pseudotranslator, translation server port)
- Locale persistence configuration (cookie settings)
- Pluralization configuration
- Updated feature list
- Fixed demo app paths in examples
