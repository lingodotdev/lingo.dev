---
"@lingo.dev/_spec": minor
"lingo.dev": minor
---

Add support for locked patterns in MDX loader

This change adds support for preserving specific patterns in MDX files during translation, including:

- !params syntax for parameter documentation
- !! parameter_name headings
- !type declarations
- !required flags
- !values lists

The implementation adds a new config version 1.7 with a "lockedPatterns" field that accepts an array of regex patterns to be preserved during translation.
