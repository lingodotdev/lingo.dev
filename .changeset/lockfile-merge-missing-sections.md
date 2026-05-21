---
"lingo.dev": minor
---

Change the default behavior of `lingo.dev lockfile` so it fills in missing `i18n.lock` sections additively instead of bailing out. Without `--force`, sections that already contain checksums are left untouched (preserving the divergence signal that `--frozen` relies on), and any pathPattern whose section is missing or empty is populated from the current source. `--force` still rebuilds the entire lock as before.

Update the `--frozen` validation error to point users at the recovery command: messages now read "Run `lingo.dev lockfile` to refresh i18n.lock, or run without --frozen."

Together these surface a fix for the false-positive `--frozen` failures that PR #2091 did not cover (new files under `**` globs, new buckets, prior `--target-locale` runs that don't write checksums, and pre-existing empty lock sections).
