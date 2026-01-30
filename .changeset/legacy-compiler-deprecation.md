---
"@lingo.dev/_compiler": patch
---

Add deprecation warnings throughout legacy compiler

The legacy compiler (`@lingo.dev/_compiler`) now shows deprecation warnings when used.
Users are encouraged to migrate to the new compiler (`@lingo.dev/compiler`).

Changes:
- Added runtime deprecation warnings in `next()`, `vite()`, and the Turbopack loader
- Added `@deprecated` JSDoc tags to all public APIs
- Updated package README with migration guide and examples
- The deprecation warning includes information about new compiler features and migration guide link
