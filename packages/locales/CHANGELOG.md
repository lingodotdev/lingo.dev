# @lingo.dev/\_locales

## 0.2.0

### Minor Changes

- [#1614](https://github.com/lingodotdev/lingo.dev/pull/1614) [`0f6ffbf`](https://github.com/lingodotdev/lingo.dev/commit/0f6ffbf7dafafbead768eb9e52787cb6013aa1c3) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - feat: use ISO 639-3 package for comprehensive language code validation

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

## 0.1.0

### Minor Changes

- [#1124](https://github.com/lingodotdev/lingo.dev/pull/1124) [`40fa69d`](https://github.com/lingodotdev/lingo.dev/commit/40fa69d9525a18c5861b6cce33262968c511ce5a) Thanks [@leen-neel](https://github.com/leen-neel)! - Implemented locales package from #1080
  - Added new `@lingo.dev/_locales` package for locale management
  - Includes locale name parsing and validation utilities
  - Provides integration helpers for various frameworks
  - Supports locale code normalization and fallback handling
