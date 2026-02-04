---
"@lingo.dev/_spec": patch
"lingo.dev": patch
---

Add `preservedKeys` configuration option to buckets. Preserved keys are added to targets using source values as placeholders, but once present in the target file, they are never overwritten by the CLI. This is useful for values like URLs or emails that should be copied initially but then customized per locale.
