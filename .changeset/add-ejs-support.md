---
"lingo.dev": minor
"@lingo.dev/_spec": minor
---

feat: add EJS (Embedded JavaScript) templating engine support

- Added EJS loader to support parsing and translating EJS template files
- EJS loader extracts translatable text while preserving EJS tags and expressions
- Updated spec package to include "ejs" in supported bucket types
- Added comprehensive test suite covering various EJS scenarios including conditionals, loops, includes, and mixed content
- Automatically installed EJS dependency (@types/ejs) for TypeScript support