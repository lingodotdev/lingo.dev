---
"lingo.dev": patch
---

Fix prettier formatter loaders after prettier config removal

Restores prettier as a runtime dependency for the CLI package and restores the `.prettierrc` config file needed by the formatter loaders. This fixes failing tests for HTML, JSON, and Markdown bucket loaders that depend on prettier for formatting translation files.
