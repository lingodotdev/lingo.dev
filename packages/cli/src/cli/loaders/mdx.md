# MDX

## Introduction

Lingo.dev CLI translates MDX files by extracting frontmatter attributes and content sections while preserving React components, JSX syntax, and document structure.

This guide explains how to localize MDX files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see MDX localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "mdx" bucket)
- Configure the files to localize

For example:

```json
{
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "mdx": {
      "include": ["./docs/[locale].mdx"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., docs/), create one or more files that match the specified glob pattern.

For example:

```mdx
---
title: Getting Started
description: Learn how to use our product
---

import { CalloutBox } from '../components/CalloutBox'

# Getting Started

Welcome to our documentation! This guide will help you get started.

<CalloutBox type="info">
  This is an important note about setup.
</CalloutBox>

## Installation

Run the following command to install:

```bash
npm install our-package
```

## Usage

Here's how to use the basic features:

- Feature 1: Does something amazing
- Feature 2: Provides great functionality
```

## Step 5. Run the translation pipeline

```bash
npx lingo.dev@latest i18n
```

## Example

### Configuration

```json
{
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es", "fr"]
  },
  "buckets": {
    "mdx": {
      "include": ["./docs/[locale].mdx"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```mdx
---
title: Getting Started
description: Learn how to use our product
---

import { CalloutBox } from '../components/CalloutBox'

# Getting Started

Welcome to our documentation!

<CalloutBox type="info">
  This is an important note.
</CalloutBox>
```

### Output (target locale)

```mdx
---
title: Comenzando
description: Aprende a usar nuestro producto
---

import { CalloutBox } from '../components/CalloutBox'

# Comenzando

¡Bienvenido a nuestra documentación!

<CalloutBox type="info">
  Esta es una nota importante.
</CalloutBox>
```

## Localization reference

### What is localized

- YAML frontmatter string attributes (under `meta/` keys)
- Markdown content sections split by structural elements
- Text content while preserving Markdown and JSX formatting
- Content within JSX components that contains plain text

### What isn't localized

- JSX component names and props
- Import statements and module paths
- Code blocks and inline code
- YAML frontmatter non-string values (dates, numbers, booleans)
- Component attributes and configurations
- URLs and reference paths

## Bucket-specific features

- **JSX Preservation**: Maintains all React components and JSX syntax
- **Code Block Protection**: Automatically excludes code blocks from translation
- **Frontmatter Support**: Handles YAML frontmatter with proper formatting
- **Section-based Processing**: Splits content into logical sections for translation
- **Component-aware**: Understands JSX structure and preserves component boundaries
- **Import Safety**: Preserves all import statements and module references
- **Locked Patterns**: Supports locking specific patterns from being translated
- **Advanced Pipeline**: Uses sophisticated multi-stage processing for accuracy

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)