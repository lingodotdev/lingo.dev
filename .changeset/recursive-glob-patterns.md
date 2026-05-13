---
"lingo.dev": minor
---

Support recursive glob patterns (`**`) in bucket `include`/`exclude`.

Patterns like `config/locales/**/[locale].yml` or `src/**/[locale]/strings/*.json` now match files at any depth, so you no longer need to enumerate every nesting level. The previous restriction that rejected any pattern containing `**` has been removed.

Two safety nets ship with this change, both scoped to patterns that actually use `**`:

- For `**` patterns only, `node_modules`, `.git`, `dist`, `build`, `.next`, and `.turbo` are excluded by default so a broad pattern like `**/[locale].json` does not descend into vendored or build trees. Existing patterns without `**` keep the previous traversal behavior exactly as before. Add your own `exclude` entries on top as needed.
- When a matched file cannot be unambiguously mapped back to the `[locale]` placeholder (for example, a pattern with multiple wildcards around `[locale]` that admits more than one valid restoration), the CLI now throws a clear error instead of silently returning a malformed path.
