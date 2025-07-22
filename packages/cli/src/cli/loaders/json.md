# JSON

## Introduction

Lingo.dev CLI translates JSON files by extracting string values while preserving the complete data structure, including nested objects and arrays.

This guide explains how to localize JSON files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see JSON localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "json" bucket)
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
    "json": {
      "include": ["./i18n/[locale].json"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., i18n/), create one or more files that match the specified glob pattern.

For example:

```json
{
  "button.title": "Submit",
  "welcome.message": "Welcome to our app",
  "user": {
    "name": "Name",
    "email": "Email"
  },
  "features": [
    "Fast",
    "Reliable",
    "Secure"
  ]
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
    "json": {
      "include": ["./i18n/[locale].json"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```json
{
  "button.title": "Submit",
  "welcome.message": "Welcome to our app",
  "user": {
    "name": "Name",
    "email": "Email"
  },
  "count": 42,
  "enabled": true
}
```

### Output (target locale)

```json
{
  "button.title": "Enviar",
  "welcome.message": "Bienvenido a nuestra aplicación",
  "user": {
    "name": "Nombre",
    "email": "Correo electrónico"
  },
  "count": 42,
  "enabled": true
}
```

## Localization reference

### What is localized

- String values throughout the JSON structure
- Nested object string properties
- String elements within arrays
- Keys are flattened using forward slash notation (e.g., "user/name", "features/0")

### What isn't localized

- Object keys and property names
- Non-string values (numbers, booleans, null)
- JSON structure and nesting
- Array indices and object hierarchy

### Metadata preservation

Non-string values are preserved exactly as they appear in the source:
- Boolean values (`true`, `false`)
- Numbers (`42`, `3.14`)
- Null values (`null`)
- Arrays and objects (structure preserved)

Only string values within the data structure are translated.

## Bucket-specific features

- **Structure Preservation**: Maintains complete JSON structure including nested objects and arrays
- **Automatic Repair**: Uses jsonrepair to handle malformed JSON input
- **Flat Key Generation**: Converts nested structures to flat keys for translation (e.g., "user/name")
- **Type Safety**: Preserves all non-string data types exactly as they appear
- **Pretty Formatting**: Outputs formatted JSON with 2-space indentation
- **Locale Injection**: Supports injecting locale codes into specific JSON paths
- **Locked Keys**: Supports locking specific keys from being translated
- **Array Handling**: Properly handles arrays with mixed content types
- **Numeric Key Support**: Handles objects with numeric keys correctly

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)