---
"lingo.dev": patch
"@lingo.dev/_react": patch
---

fix(deps): reduce npm audit vulnerabilities in the published tree

- `@lingo.dev/_react`: widen the `next` peerDependency from the exact, vulnerable `15.3.8` to `>=15.5.19 <16` so consumers resolve a patched 15.x.
- `lingo.dev`: bump `yaml` (2.8.1 → 2.9.0), `diff` (7.0.0 → 9.0.0), and `@datocms/cma-client-node` (4.0.1 → 5.5.3, pulls a patched `uuid`).

Cuts a fresh consumer `npm audit` from 13 → 8 (critical 1 → 0, high 4 → 1).
