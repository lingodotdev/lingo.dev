---
"@lingo.dev/_compiler": minor
"lingo.dev": minor
---

feat: Add OpenAI GPT and Anthropic Claude support for translations

- Added complete OpenAI GPT integration (GPT-4, GPT-4-turbo, GPT-3.5-turbo)
- Added complete Anthropic Claude integration (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku)
- Added comprehensive API key management for both providers (OPENAI_API_KEY, ANTHROPIC_API_KEY)
- Added comprehensive error handling and user guidance for both providers
- Added provider details for troubleshooting both OpenAI and Anthropic
- Added demo configurations and examples for both providers
- Maintains full compatibility with existing providers
- Supports all model parameters including temperature settings
- Fills critical gaps - both providers were in config schema but not implemented