# Lingo.dev AI Coding Agent Instructions

## Project Overview

Lingo.dev is an open-source, AI-powered i18n toolkit providing instant localization with LLMs. This is a **pnpm + Turborepo monorepo** with multiple packages and community examples.

### Core Products

- **@lingo.dev/compiler** (packages/new-compiler): Build-time React localization via bundler plugins (Vite, Webpack, Next.js)
- **lingo.dev** (packages/cli): CLI for one-command localization of files, JSON, YAML, markdown, etc.
- **@lingo.dev/_sdk** (packages/sdk): Runtime SDK for translating user-generated content
- **@lingo.dev/_react** (packages/react): React bindings for the compiler
- **@lingo.dev/_spec** (packages/spec): Type definitions and specifications
- **@lingo.dev/_locales** (packages/locales): Locale data and utilities
- **@lingo.dev/_logging** (packages/logging): Logging utilities

### Architecture Principles

1. **Compiler vs CLI**: The compiler transforms React code at build time (JSX → translated bundles), while the CLI translates static files (JSON, markdown, etc.)
2. **Legacy vs New**: `@lingo.dev/_compiler` (legacy/compiler, packages/compiler) is deprecated. Use `@lingo.dev/compiler` (packages/new-compiler) instead
3. **Virtual modules**: The compiler uses virtual modules like `@lingo.dev/compiler/virtual/config` and `@lingo.dev/compiler/virtual/locale/*` for runtime config injection
4. **Community separation**: community/ contains example apps maintained by contributors, NOT core product code

## Development Workflow

### Essential Commands

```bash
# Install dependencies (MUST use pnpm)
pnpm install

# Build all packages (respects Turbo dependency graph)
pnpm build

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Watch mode for development (compiler + react packages)
pnpm --filter "./packages/{compiler,react}" dev
```

### Local Testing

To test compiler changes in your project:
1. In lingo.dev repo: Link CLI with `npm link` in packages/cli
2. In your project: `npm link lingo.dev`
3. Build and watch: `pnpm --filter "./packages/{new-compiler,react}" dev`
4. Entry points: packages/new-compiler/src/index.ts (load/transform methods)

See [DEBUGGING.md](../DEBUGGING.md) for detailed debugging instructions.

### Pull Request Requirements

**Every PR MUST have** (auto-rejected otherwise):
- **Changeset**: Run `pnpm new` (or `pnpm new:empty` for docs-only changes)
- **Conventional Commits**: Use `feat:`, `fix:`, `chore:`, etc. in PR title
- **Issue assignment**: Must be assigned to the issue BEFORE submitting PR
- **Tests**: Unit tests for main code paths
- **Signed commits**: All commits must be GPG signed

See [CONTRIBUTING.md](../CONTRIBUTING.md) for complete requirements.

## Project-Specific Conventions

### Package Naming

- Public packages: `@lingo.dev/compiler`, `lingo.dev`
- Internal packages (not published standalone): `@lingo.dev/_spec`, `@lingo.dev/_sdk`, etc. (underscore prefix)

### Workspace Structure

```
packages/         # Core product packages
  cli/           # Main CLI (lingo.dev)
  new-compiler/  # Modern compiler (@lingo.dev/compiler)
  compiler/      # LEGACY - being deprecated
  react/         # React bindings
  sdk/           # Runtime SDK
  spec/          # TypeScript types
  locales/       # Locale data
  logging/       # Logging utilities
community/       # Community examples (separate from core)
demo/            # Internal demo apps
legacy/          # Deprecated code
integrations/    # Integration examples
```

### Translation Configuration

Projects using Lingo.dev define config in:
- **Compiler users**: Bundler config (vite.config.ts, next.config.ts) with `sourceLocale`, `targetLocales`, `models`
- **CLI users**: `i18n.json` at project root (see root i18n.json for reference)

Example i18n.json:
```json
{
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "mdx": {
      "include": ["readme/[locale].md"]
    }
  }
}
```

### Compiler Architecture

Key concepts (packages/new-compiler):
- **load method**: Generates `lingo/dictionary.js` via LCPServer.loadDictionaries
- **transform method**: Applies AST mutations to inject LingoComponent, LingoAttributeComponent, and replace loadDictionary calls
- **Translation server**: Dev-time on-demand translation generation
- **Build modes**: 'full' (translate everything), 'cache-only' (use cached only), 'skip' (no translation)

### Common Patterns

1. **Provider placement**: `<LingoProvider>` must wrap the app at the highest level (before RouterProvider in Vite apps, in root layout for Next.js)
2. **Opt-in vs automatic**: Compiler can require `'use i18n'` directive or transform all files automatically
3. **Manual overrides**: Use `data-lingo-override` attribute to override AI translations for specific locales
4. **Pluralization**: Compiler auto-detects and converts to ICU MessageFormat

## CI/CD Integration

The repo includes a GitHub Action (action.yml) for automated translations:
```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Supports auto-commits and PR creation. See [Lingo.dev CI docs](https://lingo.dev/ci).

## Testing & Validation

- Tests must pass: `pnpm test`
- Turbo caches test results; use `--force` to bypass cache
- Changesets validated via `pnpm changeset status --since origin/main`

## Community Contributions

community/ directory has separate rules:
- Use `kebab-case` for folder names
- Each project needs its own README.md
- Tag PRs with `community-submission`
- These are NOT part of core product releases

## Common Pitfalls

1. **Don't use npm/yarn**: This is a pnpm monorepo (`packageManager: "pnpm@9.12.3"`)
2. **Don't edit legacy compiler**: Contributions go to packages/new-compiler
3. **Don't skip changesets**: `pnpm new` is required for every PR
4. **Don't forget issue assignment**: PRs without prior assignment are auto-rejected
5. **Virtual module imports**: When working with compiler, virtual modules are resolved at build time

## Key Files to Reference

- [CONTRIBUTING.md](../CONTRIBUTING.md): Full contribution guidelines
- [DEBUGGING.md](../DEBUGGING.md): Local development setup
- [CLAUDE.md](../CLAUDE.md): Quick reference for Claude agents
- [turbo.json](../turbo.json): Turborepo task pipeline
- [pnpm-workspace.yaml](../pnpm-workspace.yaml): Workspace package locations
- [packages/new-compiler/README.md](../packages/new-compiler/README.md): Compiler documentation
