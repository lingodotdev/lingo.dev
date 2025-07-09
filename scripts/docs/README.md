# scripts/docs

## Introduction

This directory contains scripts for auto-generating documentation from the Lingo.dev source code.

## generate-cli-docs

This script automatically generates CLI reference documentation for the Lingo.dev CLI.

### Usage

```bash
pnpm --filter docs run generate-cli-docs
```

### How it works

1. Loads the CLI program from the `cli` package.
2. Walks through all commands and subcommands.
3. Generates a Markdown file with the complete command reference.
