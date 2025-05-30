---
"@lingo.dev/_spec": minor
---

Add v1.9 config schema with optional providers and models

- Made providers and models optional with no default values
- Updated prompt default to translation-focused text
- Added support for multiple providers (groq/openai/anthropic) with flexible configuration
- Implemented locale-specific model selection with "*:*" fallback pattern
- Added migration logic from existing BYOK configurations to new schema structure
