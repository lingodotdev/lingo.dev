---
---

Remove prettier and formatter commands from project tooling

This change removes prettier as a dev dependency and development tool from the repository. The prettier formatter is still available as a runtime dependency for the CLI tool to format translation files.

Changes:
- Removed `format` and `format:check` scripts from root package.json
- Removed prettier and lint-staged dev dependencies from root package.json
- Removed .prettierrc and .prettierignore configuration files
- Removed pre-commit hook that ran lint-staged
- Removed format check step from GitHub Actions CI workflow
- Updated CONTRIBUTING.md to remove format:check from check commands
- Removed prettier dependencies from demo/adonisjs package.json
