---
"@lingo.dev/compiler": patch
---

compiler: stop translations drifting to Spanish with custom OpenAI-compatible models

The bundled few-shot example was always English→Spanish, so a weaker model could copy it and translate cache misses into Spanish regardless of the requested target locale (e.g. `zh-Hans`). The compiler now only sends a few-shot example whose language matches the target — curated examples ship for common languages (incl. Simplified/Traditional Chinese, Japanese, Korean) and any other target gets none rather than a wrong-language one — and it names the target language in the system prompt via `Intl.DisplayNames`. Fixes #2041.
