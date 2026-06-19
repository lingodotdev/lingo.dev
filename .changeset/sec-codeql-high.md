---
"lingo.dev": patch
"@lingo.dev/_compiler": patch
"@lingo.dev/compiler": patch
---

Resolve high-severity CodeQL code-scanning findings (security hardening, no behavior change):

- `org-id` git-remote parsing now extracts the URL host and compares it exactly (`=== "github.com"` etc.) instead of a substring `includes()` check, fixing `js/incomplete-url-substring-sanitization` (cli, compiler, new-compiler). Platform labels are unchanged.
- XML loader newline stripping uses a global regex (`/\n/g`), fixing `js/incomplete-sanitization` in `xml.ts`.
