---
"@lingo.dev/compiler": minor
"@lingo.dev/_compiler": minor
"lingo.dev": minor
"@lingo.dev/_spec": minor
---

feat: add OrcaRouter as a named LLM provider

Adds **OrcaRouter** ([orcarouter.ai](https://www.orcarouter.ai)) as a first-class translation provider across the CLI and both compilers, mirroring the existing OpenRouter wiring:

- New `orcarouter` case in `createAiModel` (new compiler) that builds an OpenAI-compatible client pointed at `https://api.orcarouter.ai/v1` (overridable via `ORCAROUTER_BASE_URL`) with `ORCAROUTER_API_KEY`.
- New `orcarouter` entry in `providerDetails` (new + legacy compiler) with key metadata and docs links.
- CLI processor and explicit localizer accept `orcarouter` as a provider id.
- CLI settings schema, env loading and `config set` support `llm.orcarouterApiKey` / `ORCAROUTER_API_KEY`.
- `@lingo.dev/_spec` provider enum accepts `orcarouter`.
- Docs and tests updated.
