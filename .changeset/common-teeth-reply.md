---
"@lingo.dev/compiler": patch
---

- Migrate metadata storage from JSON files to LMDB
- New storage locations: .lingo/metadata-dev/ and .lingo/metadata-build/
- Use pure functions with short-lived connections for multi-worker safety
- Update compiler docs
- Remove proper-lockfile dependency
