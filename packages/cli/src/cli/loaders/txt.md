# TXT

## Introduction

Lingo.dev CLI translates TXT files by treating each line as a separate translatable unit while preserving the file structure and empty lines.

This guide explains how to localize TXT files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see TXT localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "txt" bucket)
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
    "txt": {
      "include": ["./fastlane/metadata/[locale]/description.txt"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., fastlane/metadata/en/), create one or more files that match the specified glob pattern.

For example:

```txt
Welcome to our application!
This is a sample text file for fastlane metadata.
It contains app description that needs to be translated.
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
    "txt": {
      "include": ["./fastlane/metadata/[locale]/description.txt"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```txt
Welcome to our application!
This is a sample text file for fastlane metadata.
It contains app description that needs to be translated.
```

### Output (target locale)

```txt
¡Bienvenido a nuestra aplicación!
Este es un archivo de texto de muestra para metadatos de fastlane.
Contiene la descripción de la aplicación que necesita ser traducida.
```

## Localization reference

### What is localized

- Each line of text content
- Non-empty lines are treated as separate translatable units
- Line content while preserving line structure

### What isn't localized

- Empty lines (preserved in their original positions)
- File structure and line ordering
- Whitespace formatting between lines

## Bucket-specific features

- **Line-by-Line Processing**: Each line is treated as an independent translation unit
- **Empty Line Preservation**: Maintains empty lines in their original positions
- **Structure Integrity**: Preserves the overall file structure and formatting
- **Simple Format**: Ideal for plain text content like app descriptions or simple documentation
- **Numeric Indexing**: Uses line numbers as keys for translation mapping
- **Reconstruction Accuracy**: Rebuilds files with exact line positioning

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)