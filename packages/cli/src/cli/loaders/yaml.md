# YAML

## Introduction

Lingo.dev CLI translates YAML files by extracting string values while preserving the complete document structure, formatting, and data types.

This guide explains how to localize YAML files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see YAML localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "yaml" bucket)
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
    "yaml": {
      "include": ["./i18n/[locale].yaml"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., i18n/), create one or more files that match the specified glob pattern.

For example:

```yaml
greeting: Hello!
welcome:
  message: Welcome to our app
  subtitle: Please enjoy your stay
user:
  name: Name
  email: Email
features:
  - Fast
  - Reliable
  - Secure
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
    "yaml": {
      "include": ["./config/[locale].yaml"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```yaml
greeting: Hello!
welcome:
  message: Welcome to our app
  subtitle: Please enjoy your stay
count: 42
enabled: true
```

### Output (target locale)

```yaml
greeting: ¡Hola!
welcome:
  message: Bienvenido a nuestra aplicación
  subtitle: Por favor disfrute de su estancia
count: 42
enabled: true
```

## Localization reference

### What is localized

- String values throughout the YAML structure
- Nested object string properties
- String elements within arrays and lists
- Quoted and unquoted string values

### What isn't localized

- YAML keys and property names
- Non-string values (numbers, booleans, null)
- YAML structure and indentation
- Comments and document formatting

### Metadata preservation

Non-string values are preserved exactly as they appear in the source:
- Boolean values (`true`, `false`)
- Numbers (`42`, `3.14`)
- Null values (`null`)
- Arrays and objects (structure preserved)

Only string values within the data structure are translated.

## Bucket-specific features

- **Format Preservation**: Maintains original YAML formatting and style
- **Quote Style Detection**: Automatically detects and preserves quote styles (single, double, or none)
- **Key Style Preservation**: Maintains original key formatting (quoted vs unquoted)
- **Structure Integrity**: Preserves complete YAML document structure and nesting
- **Type Safety**: Maintains all non-string data types exactly as they appear
- **Comment Handling**: Preserves comments and document structure
- **Multi-document Support**: Handles YAML files with multiple documents
- **Line Width Control**: Maintains readable formatting without artificial line breaks

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)