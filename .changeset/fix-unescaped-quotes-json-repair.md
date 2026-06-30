---
"lingo.dev": patch
---

Recover from unescaped quotes in model translation responses during JSON repair. When `jsonrepair` can't parse a response (e.g. Claude Sonnet emitting unescaped double quotes inside string values), the parser now escapes those quotes and retries before failing, avoiding a costly fallback retranslation.
