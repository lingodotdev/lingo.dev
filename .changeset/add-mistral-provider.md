---
"lingo.dev": minor
"@lingo.dev/_compiler": minor
"@lingo.dev/_spec": minor
---

feat: add Mistral AI as a supported LLM provider

- Added Mistral AI provider support across the entire lingo.dev ecosystem
- Users can now use Mistral models for localization by setting MISTRAL_API_KEY
- Supports all Mistral models available through the @ai-sdk/mistral package
- Configuration via environment variable or user-wide config: `npx lingo.dev@latest config set llm.mistralApiKey <key>`
