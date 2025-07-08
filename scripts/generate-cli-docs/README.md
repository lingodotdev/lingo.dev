# generate-cli-docs

## Introduction

This tool automatically generates CLI reference documentation for the Lingo.dev CLI.

## Usage

To generate the CLI documentation:

```bash
pnpm --filter cli-docs-generator run generate
```

## How it works

1. Loads the CLI program from the main CLI package
2. Walks through all commands and subcommands
3. Generates a Markdown file with the complete command reference
