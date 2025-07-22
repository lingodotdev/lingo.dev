# Markdown

## Introduction

Lingo.dev CLI translates Markdown files by extracting frontmatter attributes and content sections while preserving the document structure and formatting.

This guide explains how to localize Markdown files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see Markdown localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "markdown" bucket)
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
    "markdown": {
      "include": ["./i18n/[locale].md"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., i18n/), create one or more files that match the specified glob pattern.

For example:

```md
---
title: Test Markdown
date: 2023-05-25
---

# Heading 1

This is a paragraph.

## Heading 2

Another paragraph with **bold** and *italic* text.
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
    "markdown": {
      "include": ["./docs/[locale].md"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```md
---
title: Test Markdown
date: 2023-05-25
---

# Heading 1

This is a paragraph.

## Heading 2

Another paragraph with **bold** and *italic* text.
```

### Output (target locale)

```md
---
title: Prueba Markdown
date: 2023-05-25
---

# Encabezado 1

Esto es un párrafo.

## Encabezado 2

Otro párrafo con texto en **negrita** y en *cursiva*.
```

## Localization reference

### What is localized

- YAML frontmatter string attributes (prefixed with `fm-attr-`)
- Markdown content sections split by headers and structural elements
- Text content while preserving Markdown formatting
- Headers, paragraphs, lists, and other content blocks

### What isn't localized

- YAML frontmatter non-string values (dates, numbers, booleans)
- Markdown syntax and structural elements (*, #, [], etc.)
- Links URLs and reference paths
- Code blocks and inline code
- Image paths and alt text (unless specifically handled)

## Bucket-specific features

- **Frontmatter Preservation**: Maintains YAML frontmatter with proper formatting
- **Section-based Translation**: Splits content into logical sections for translation
- **Formatting Preservation**: Keeps all Markdown syntax intact (bold, italic, links, etc.)
- **YAML Engine Support**: Uses custom YAML engine for consistent frontmatter handling
- **Content Reconstruction**: Properly rebuilds the document maintaining original structure
- **Mixed Content Support**: Handles documents with both frontmatter and body content
- **Smart Section Detection**: Uses regex to identify headers and structural elements

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)