---
"lingo.dev": patch
---

Speed up `lingo.dev run` on projects with many bucket paths and locales.

Every translation task rewrote the whole `i18n.lock`, so a run performed
`patterns × locales` full read-modify-write cycles to persist `patterns`
sections. Since every target locale of a bucket path derives its checksums from
the same source data, all but the first write per pattern stored identical
bytes. A run now writes a pattern's section once, and those writes are
serialized against each other.

Loading the lockfile also ran the deduplication pass — a full CST parse plus a
re-serialization of the entire file — on every load. Deduplication only repairs
a hand-merged lockfile, which is exactly the case `YAML.parse` rejects, so the
load now tries the plain parse first and falls back to the repair path only when
that fails. Malformed and hand-merged lockfiles keep loading exactly as before.

The contents of `i18n.lock` are unchanged.
