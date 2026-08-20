---
"lingo.dev": patch
---

Fix `run --key`, which matched nothing and could overwrite unrelated lockfile entries.

`--key` filtered with a raw glob match, but nested keys are joined with `/`, so a prefix like `auth/login` matched no key at all and the run reported everything as cached. It now uses the same matcher the rest of the CLI uses: exact, separator-bounded prefix, or glob. `auth/login` matches `auth/login/title` and leaves `auth/login_url` alone.

A `--key` run also wrote checksums for every source key, not just the translated subset, which marked untouched keys as translated in `i18n.lock`. `--key` now suppresses the checksum write, as `--target-locale` already did.

The help text for `--key` documented dot-separated paths and an `auth.login` example, neither of which matched real keys.
