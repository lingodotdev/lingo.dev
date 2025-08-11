---
"@lingo.dev/_compiler": minor
---

Add TypeScript type definitions for AI model identifiers

- Introduce strongly-typed model identifiers with autocomplete support
- Add `ModelIdentifier` type to replace generic string type
- Support for known models from Google, Groq, Mistral, and OpenRouter
- Add script to auto-generate model types from models.dev API
- Maintain backward compatibility with unknown model identifiers