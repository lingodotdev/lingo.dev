# Flutter

## Introduction

Lingo.dev CLI translates Flutter ARB (Application Resource Bundle) files by extracting localizable messages while preserving metadata and placeholder definitions.

This guide explains how to localize Flutter files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see Flutter localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "flutter" bucket)
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
    "flutter": {
      "include": ["./lib/l10n/app_[locale].arb"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., lib/l10n/), create one or more files that match the specified glob pattern.

For example:

```json
{
  "@@locale": "en",
  "greeting": "Hello, {name}!",
  "@greeting": {
    "description": "A greeting with a name placeholder",
    "placeholders": {
      "name": {
        "type": "String",
        "example": "John"
      }
    }
  },
  "itemCount": "{count, plural, =0{No items} =1{One item} other{{count} items}}",
  "@itemCount": {
    "description": "Number of items",
    "placeholders": {
      "count": {
        "type": "int"
      }
    }
  }
}
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
    "flutter": {
      "include": ["./lib/l10n/app_[locale].arb"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```json
{
  "@@locale": "en",
  "greeting": "Hello, {name}!",
  "@greeting": {
    "description": "A greeting with a name placeholder",
    "placeholders": {
      "name": {
        "type": "String",
        "example": "John"
      }
    }
  },
  "welcome": "Welcome to our app"
}
```

### Output (target locale)

```json
{
  "@@locale": "es",
  "greeting": "¡Hola, {name}!",
  "@greeting": {
    "description": "A greeting with a name placeholder",
    "placeholders": {
      "name": {
        "type": "String",
        "example": "John"
      }
    }
  },
  "welcome": "Bienvenido a nuestra aplicación"
}
```

## Localization reference

### What is localized

- Message strings (keys without @ prefix)
- Text content within ICU message format expressions
- Placeholder text while preserving placeholder syntax

### What isn't localized

- Metadata keys (starting with @)
- Placeholder definitions and type information
- ICU message format syntax (`{count, plural, ...}`)
- Special properties like `@@locale` (automatically updated)
- Description and example fields in metadata

### Variable support

This format supports variable placeholders that are preserved during translation:
- `{variable}` - Named variables
- `{count, plural, =0{...} other{...}}` - ICU plural format
- `{gender, select, male{...} female{...} other{...}}` - ICU select format

Variables are automatically detected and remain unchanged in translations.

### Metadata preservation

Non-message content is preserved exactly as it appears in the source:
- Message metadata (`@messageName`)
- Placeholder definitions
- Type information and examples
- Description fields

Only the actual message strings are translated.

## Bucket-specific features

- **ARB Format Compliance**: Full support for Flutter's Application Resource Bundle format
- **Metadata Preservation**: Maintains all @ prefixed metadata keys and their content
- **Locale Auto-Update**: Automatically updates `@@locale` to match target locale
- **ICU Message Format**: Preserves complex message formatting including plurals and selects
- **Placeholder Safety**: Maintains placeholder syntax and type definitions
- **JSON Structure**: Handles nested JSON structures for complex message definitions

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)