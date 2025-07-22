# Xcode Strings

## Introduction

Lingo.dev CLI translates Xcode .strings files by extracting key-value pairs while preserving the file format and escape sequences used in iOS and macOS applications.

This guide explains how to localize Xcode Strings files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see Xcode Strings localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "xcode-strings" bucket)
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
    "xcode-strings": {
      "include": ["./[locale].lproj/Localizable.strings"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., en.lproj/), create one or more files that match the specified glob pattern.

For example:

```strings
/* General app strings */
"hello" = "Hello!";
"welcome_message" = "Welcome to our app";
"goodbye" = "Goodbye!";

/* Error messages */
"error_network" = "Network error occurred";
"error_generic" = "An unexpected error occurred";

/* Multi-line example */
"long_text" = "This is a long text\nthat spans multiple lines";
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
    "xcode-strings": {
      "include": ["./[locale].lproj/Localizable.strings"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```strings
/* General app strings */
"hello" = "Hello!";
"welcome_message" = "Welcome to our app";
"goodbye" = "Goodbye!";

/* Formatted strings */
"user_greeting" = "Hello, %@!";
"item_count" = "You have %d items";
```

### Output (target locale)

```strings
/* General app strings */
"hello" = "¡Hola!";
"welcome_message" = "Bienvenido a nuestra aplicación";
"goodbye" = "¡Adiós!";

/* Formatted strings */
"user_greeting" = "¡Hola, %@!";
"item_count" = "Tienes %d elementos";
```

## Localization reference

### What is localized

- String values (text after the = sign)
- Multi-line strings with proper escape sequences
- Text content while preserving format specifiers

### What isn't localized

- String keys (text before the = sign)
- Comments (lines starting with /* or //)
- File structure and formatting
- Format specifiers (%@, %d, %s, etc.)

### Variable support

This format supports variable placeholders that are preserved during translation:
- `%@` - Object placeholder
- `%d` - Integer placeholder
- `%s` - String placeholder
- `%f` - Float placeholder
- Positional arguments like `%1$@`, `%2$d`

Variables are automatically detected and remain unchanged in translations.

## Bucket-specific features

- **Xcode Compliance**: Full support for Xcode .strings file format
- **Escape Sequence Handling**: Properly handles `\"`, `\n`, `\\` and other escape sequences
- **Comment Preservation**: Maintains comments and file structure
- **Format Specifier Safety**: Preserves iOS/macOS format specifiers
- **Multi-line Support**: Handles strings that span multiple lines
- **Key-Value Structure**: Maintains the "key" = "value"; format exactly
- **Unicode Support**: Properly handles Unicode characters and encoding

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)