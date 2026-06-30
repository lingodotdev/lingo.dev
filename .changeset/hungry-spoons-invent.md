---
"@lingo.dev/_compiler": patch
"@lingo.dev/_spec": patch
"lingo.dev": patch
"@lingo.dev/_sdk": patch
---

Bump `zod` to `4.4.3` so it satisfies the `zod@^4.3.5` peer requirement of `@openrouter/ai-sdk-provider`. The previously pinned `4.1.12` caused `npm install` to fail with `ERESOLVE` when `strict-peer-deps` was enabled.
