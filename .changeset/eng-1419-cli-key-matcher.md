---
"lingo.dev": patch
---

Fix `run --key`, which matched nothing and could overwrite unrelated lockfile entries.

`--key` filtered with a raw glob match, but flat buckets join nesting with `/`, so a prefix like `auth/login` matched no key at all and the run reported everything as cached. It now matches on exact key, on a prefix that ends at a `/`, or on a glob. `auth/login` selects `auth/login/title` and leaves `auth/login_url` and `sign-in-error` alone.

A `--key` run also wrote checksums for every source key, not just the translated subset, which marked untouched keys as translated in `i18n.lock`. `--key` now suppresses the checksum write, as `--target-locale` already did, and no longer computes the discarded checksums at all.

The help text for `--key` documented dot-separated paths and an `auth.login` example, neither of which matched real keys. It now states the `/` separator, that a prefix must end at one, and that a glob does not cross one.
