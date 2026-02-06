---
"@lingo.dev/compiler": patch
---

- Migrate metadata storage from JSON files to LMDB
- New storage locations: .lingo/metadata-dev/ and .lingo/metadata-build/
- Update new-compiler docs
- Remove proper-lockfile dependency
