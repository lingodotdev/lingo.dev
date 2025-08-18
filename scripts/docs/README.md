# scripts/docs

## Introduction

This directory contains scripts for generating documentation from the Lingo.dev source code.

## generate-cli-docs

This script generates reference documentation for **Lingo.dev CLI**.

### Usage

```bash
pnpm --filter docs run generate-cli-docs [output_file_path]
```

### How it works

1. Loads the CLI program from the `cli` package.
2. Walks through all commands and subcommands.
3. Generates a Markdown file with the complete command reference.

### Notes

- When running inside a GitHub Action, this script comments on the PR with the Markdown content.
- When running outside of a GitHub action, the script writes the Markdown file to disk.

## generate-config-docs

This script generates reference documentation for the `i18n.json` file.

### Usage

```bash
pnpm --filter docs run generate-config-docs [output_file_path]
```

### How it works

1. Converts the Zod schema into a JSON Schema.
2. Walks through all properties on the schema.
3. Generates a Markdown file with the complete property reference.
