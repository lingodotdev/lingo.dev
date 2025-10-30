# Repository Structure

This document explains the structure of the Lingo.dev monorepo to help contributors navigate the codebase.

## Overview

Lingo.dev uses a **monorepo structure** - all code for the website, CLI, compiler, and SDKs lives in this single repository. There is **no separate frontend repository**.

## Directory Structure

```
lingo.dev/
├── packages/          # Core TypeScript packages
│   ├── cli/          # Command-line tool
│   ├── compiler/     # React localization compiler
│   ├── react/        # React SDK
│   ├── sdk/          # Core SDK
│   ├── spec/         # Specifications
│   └── locales/      # Locale data
├── content/          # Marketing assets and banners
├── demo/             # Demo applications
├── integrations/     # Third-party integrations
├── scripts/          # Build and utility scripts
├── .github/          # GitHub Actions workflows
└── readme/           # Translated README files
```

## Key Packages

### `/packages/cli`
The Lingo.dev CLI tool for translating code and content from the terminal.

**Key files:**
- `src/cli/` - CLI command implementations
- `i18n.json` - Demo configuration

### `/packages/compiler`
Build-time React localization middleware.

**Key files:**
- `src/lib/lcp/` - Lingo Compiler Protocol implementation
- `src/utils/` - Utility functions

### `/packages/react`
React SDK for runtime localization.

### `/packages/sdk`
Core SDK for instant per-request translation.

### `/packages/spec`
TypeScript specifications and type definitions.

**Key files:**
- `src/config.ts` - Configuration schema

## Website & Documentation

The Lingo.dev website (https://lingo.dev) documentation is **not stored in this repository**. The documentation you see at URLs like `https://lingo.dev/en/compiler/quick-start` is hosted separately.

For website-related questions or issues, please:
1. Check the main repository documentation (README.md, CONTRIBUTING.md)
2. Ask in the [Discord server](https://lingo.dev/go/discord)
3. Create an issue describing what you're looking for

## Getting Started

To work on the codebase:

```bash
# Clone the repository
git clone https://github.com/lingodotdev/lingo.dev
cd lingo.dev

# Install dependencies
pnpm install

# Build all packages
pnpm turbo build

# Work on the CLI
cd packages/cli
pnpm run dev
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed setup instructions.

## Finding Specific Code

### Looking for CLI commands?
→ Check `/packages/cli/src/cli/`

### Looking for compiler logic?
→ Check `/packages/compiler/src/`

### Looking for LLM provider integrations?
→ Check `/packages/compiler/src/lib/lcp/api/`

### Looking for configuration schemas?
→ Check `/packages/spec/src/config.ts`

### Looking for tests?
→ Tests are co-located with source files (e.g., `*.test.ts`)

## Related Repositories

- [custom-hack-next-app](https://github.com/lingodotdev/custom-hack-next-app) - Next.js demo application

## Questions?

If you can't find what you're looking for:
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- Join our [Discord server](https://lingo.dev/go/discord)
- Open an [issue](https://github.com/lingodotdev/lingo.dev/issues) with your question
