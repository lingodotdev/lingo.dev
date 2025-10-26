# scripts/docs

## Introduction

This directory contains scripts for generating documentation from the Lingo.dev source code.

## generate-cli-docs

This script generates reference documentation for **Lingo.dev CLI**.

### Usage

```bash
pnpm --filter docs run generate-cli-docs [output_directory]
```

### How it works

1. Loads the CLI program from the `cli` package.
2. Walks through top-level commands and their subcommands.
3. Generates an `.mdx` file for each top-level command with structured reference content.

### Notes

- When running inside a GitHub Action, this script comments on the PR with the Markdown content.
- When running outside of a GitHub action, the script writes one `.mdx` file per top-level command to the provided directory.

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
