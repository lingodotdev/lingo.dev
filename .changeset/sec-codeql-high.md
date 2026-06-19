---
"lingo.dev": patch
"@lingo.dev/_compiler": patch
"@lingo.dev/compiler": patch
---

Resolve high-severity CodeQL code-scanning findings (security hardening):

- `org-id` git-remote parsing now extracts the URL host and matches the platform by exact host or subdomain suffix (`host === "github.com" || host.endsWith(".github.com")`, etc.) instead of a substring `includes()` check. This fixes `js/incomplete-url-substring-sanitization` (cli, compiler, new-compiler) while still recognizing official alt-SSH hosts like `ssh.github.com` / `altssh.gitlab.com` and rejecting look-alikes like `github.com.evil.com`. Platform labels for all real remote forms are preserved.
- Removed a dead `.replace("\n", "")` in the XML loader (an earlier `\s+` collapse already strips newlines), which also clears the `js/incomplete-sanitization` finding there.
