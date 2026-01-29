---
"@lingo.dev/compiler": patch
---

Fixed metadata file lock contention errors (ELOCKED) during parallel builds by increasing lock retry count and timeouts
