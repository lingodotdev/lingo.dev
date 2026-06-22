---
"lingo.dev": patch
---

fix(deps): drop external-editor and gray-matter to clear remaining npm audit findings

These two dependencies were the only remaining source of the high/moderate `tmp` and `js-yaml` advisories in a consumer `npm audit`:

- `external-editor` pulled a vulnerable `tmp@^0.0.33` (high, path traversal). Replaced its single use (the interactive editor prompt in the deprecated `i18n` command) with a small `node:fs`/`node:child_process` helper that uses `mkdtempSync` — no `tmp` package, no path-traversal surface.
- `gray-matter` pulled `js-yaml@3` (moderate). Both call sites already injected the patched `yaml` package as gray-matter's engine, so its bundled `js-yaml` was dead weight. Replaced with a tiny front-matter helper built on `yaml`; `gray-matter` is kept only as a `devDependency` test oracle that the loader specs assert equivalence against.

Net effect on a fresh consumer `npm audit`: removes the last `high` (`tmp`) plus the `js-yaml`/`gray-matter`/`external-editor` findings.
