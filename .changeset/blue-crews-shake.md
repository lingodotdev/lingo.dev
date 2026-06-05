---
"@lingo.dev/_sdk": patch
---

Android-format (`pt-rPT`) and underscore (`pt_PT`) locales passed config validation but were sent to the API verbatim, which it rejects with a 400. Normalize `sourceLocale`, `targetLocale`, and `reference` keys to canonical BCP 47 on the wire via a schema transform. File paths are unaffected, so the CLI keeps the original code for Android resource directories (e.g. `values-pt-rPT/`)
