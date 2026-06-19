---
"lingo.dev": patch
"@lingo.dev/_react": patch
"@lingo.dev/_compiler": patch
"@lingo.dev/compiler": patch
---

Resolve all high and critical security advisories. Two layers:

- **Repo tree / `pnpm audit`**: root pnpm `overrides` pin patched, major-capped versions of transitive dependencies (axios, vite, ws, form-data, fast-xml-parser, shell-quote, lodash, serialize-javascript, minimatch, picomatch, tmp, and others), taking `pnpm audit` from 121 high + 5 critical to 0.
- **Published packages (consumer-facing)**: bump the vulnerable runtime dependencies that ship in the published manifests to patched versions so consumers no longer install or run them — `lodash` 4.17.23 → 4.18.1 (`lingo.dev`, `@lingo.dev/_react`, `@lingo.dev/_compiler`, `@lingo.dev/compiler`), `@modelcontextprotocol/sdk` 1.22.0 → 1.26.0 (`lingo.dev`), `ws` 8.18.3 → 8.21.0 (`@lingo.dev/compiler`). All patch/minor in-major bumps; no API changes.
