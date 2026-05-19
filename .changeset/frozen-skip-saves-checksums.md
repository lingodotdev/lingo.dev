---
"lingo.dev": patch
---

Fix `--frozen` falsely reporting "Source file has been updated" after a no-op `run`. When `lingo.dev run` finds nothing to translate (source matches target), it now persists source checksums to `i18n.lock` so a subsequent `--frozen` run has a baseline to validate against.
