---
"@lingo.dev/_locales": minor
---

feat: use ISO 639-3 package for comprehensive language code validation

Replaces hardcoded list of ISO 639-1 (2-letter) language codes with the comprehensive iso-639-3 package, which includes:
- All ISO 639-1 codes (2-letter, ~184 languages)
- All ISO 639-2 codes (3-letter bibliographic and terminologic)
- All ISO 639-3 codes (3-letter, ~8,000 languages)

This fixes validation issues with 3-letter language codes like:
- `fil` (Filipino)
- `bar` (Bavarian)
- `nap` (Neapolitan)
- `zgh` (Standard Moroccan Tamazight)

And many other languages that don't have 2-letter ISO 639-1 codes.
