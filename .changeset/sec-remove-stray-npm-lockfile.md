---
---

Remove the stray, unused `package-lock.json` from `demo/new-compiler-vite-react-spa` (a pnpm-workspace member managed by the root `pnpm-lock.yaml`). The vestigial npm lockfile was the sole source of all remaining critical/high Dependabot alerts (2 critical + 12 high: shell-quote, vitest, vite, ws, rollup, picomatch, seroval, etc.), pinning long-outdated transitive versions that the build never used. Also gitignore npm/yarn lockfiles in that demo to prevent recurrence. No package, build, or consumer impact.
