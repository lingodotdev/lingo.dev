---
"lingo.dev": patch
---

Fix Windows: translations now generate for mixed-case source locales (e.g. `en-US`). The placeholder reinsertion regex in `buckets.ts` was case-sensitive while paths were lowercased on Windows, so `[locale]` was lost from the matched pattern and only the source file was rewritten.
