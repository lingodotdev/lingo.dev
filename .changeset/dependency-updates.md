---
"lingo.dev": patch
"@lingo.dev/_react": patch
"@lingo.dev/compiler": patch
---

fix(deps): reduce npm audit vulnerabilities and update dependencies

Security (cuts a fresh consumer `npm audit` from 13 → 8, critical 1 → 0, high 4 → 1):

- `@lingo.dev/_react`: widen the `next` peerDependency from the exact vulnerable `15.3.8` to `>=15.5.19 <16`.
- `lingo.dev`: `yaml` 2.8.1 → 2.9.0, `diff` 7.0.0 → 9.0.0, `@datocms/cma-client-node` 4.0.1 → 5.5.3 (patched `uuid`).

Dependency maintenance (consolidated from dependabot, build + tests verified):

- `lingo.dev`: `ink` 4.2.0 → 7.1.0, `unist-util-visit` 5.0.0 → 5.1.0, `@biomejs/wasm-nodejs` 2.4.6 → 2.5.0.
- `@lingo.dev/compiler`: `@babel/core` 7.26.0 → 7.29.6, `ai-sdk-ollama` 3.0.0 → 3.8.8.
