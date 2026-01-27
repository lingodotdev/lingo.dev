---
"lingo.dev": patch
---

Refactor lockfile deduplication logic to use a single universal function instead of three duplicate implementations. This improves code maintainability and ensures consistent behavior across all lockfile operations. The deduplication automatically handles Git merge conflicts in i18n.lock files.
