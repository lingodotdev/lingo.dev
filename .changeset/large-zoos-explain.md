---
"@lingo.dev/_compiler": minor
---

### Whitespace Normalization Fix

- Improved `normalizeJsxWhitespace` logic to preserve leading spaces inside JSX elements while removing unnecessary formatting whitespace and extra lines.
- Ensured explicit whitespace (e.g., `{" "}`) is handled correctly without introducing double spaces.
- Added targeted tests (`jsx-content-whitespace.spec.ts`) to verify whitespace handling.
- Cleaned up unnecessary debug/test files created during development.
