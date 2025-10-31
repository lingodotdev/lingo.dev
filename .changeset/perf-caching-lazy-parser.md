---
"@lingo.dev/_spec": patch
---

Improve configuration performance in `@lingo.dev/_spec` by introducing:

- ConfigCacheManager (in-memory cache) for parsed configs
- LazyProviderConfigLoader (on-demand loading with de-duplication)
- OptimizedConfigParser (file/JSON parsing + Zod validation)

Integrated the parser into `packages/spec/src/config.ts` without changing the public API. Added unit tests under `src/performance/__tests__`.

This is a non-breaking internal improvement focused on speed and memory.
