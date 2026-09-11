---
"lingo.dev": patch
"@lingo.dev/_compiler": patch
"@lingo.dev/compiler": patch
---

Clear two `npm audit` advisories that surfaced through transitive dependencies.

`csv-parse` moves from 5.6.0 to 7.0.2, which patches GHSA-8cw4-87c7-c6xx (prototype replacement reachable through the `columns` option). None of the options renamed in csv-parse 6.0.0 were in use, so the CSV loaders are unchanged.

The AI SDK packages move to the latest release of the major they were already on, so that `@ai-sdk/provider-utils` resolves at or above 4.0.33 and clears GHSA-866g-f22w-33x8 (uncontrolled resource consumption). The SDK packages pin `@ai-sdk/provider-utils` to an exact version, so bumping them is the only way to reach it: `ai` goes to 6.0.280 and `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/groq`, `@ai-sdk/mistral` and `@ai-sdk/openai` follow on their 3.x line.

The system prompt moves from a `{ role: "system" }` entry in `messages` to the `system` option on `generateText`. Since `ai` 6.0.170 the former makes the SDK print a prompt-injection warning on every BYOK run.

The basic translator also stops wrapping its system prompt in a serialized `{ role, content }` envelope before handing it over, so the provider now receives the prompt text on its own rather than a line of JSON quoting it. This is the one change here that alters what reaches the model.
