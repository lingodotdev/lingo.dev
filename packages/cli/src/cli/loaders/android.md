# Android

## Introduction

Lingo.dev CLI translates Android resource files by extracting and localizing string resources from XML files following Android's resource structure.

This guide explains how to localize Android files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see Android localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "android" bucket)
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
    "android": {
      "include": ["values-[locale]/strings.xml"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., values-en/), create one or more files that match the specified glob pattern.

For example:

```xml
<resources>
  <string name="app_name">My App</string>
  <string name="hello">Hello World</string>
  <string-array name="planets">
    <item>Mercury</item>
    <item>Venus</item>
    <item>Earth</item>
  </string-array>
  <plurals name="songs">
    <item quantity="one">1 song</item>
    <item quantity="other">%d songs</item>
  </plurals>
</resources>
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
    "android": {
      "include": ["values-[locale]/strings.xml"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```xml
<resources>
  <string name="button_title">Submit</string>
  <string name="welcome">Welcome to <b>Android</b>!</string>
  <plurals name="items_count">
    <item quantity="one">1 item</item>
    <item quantity="other">%d items</item>
  </plurals>
</resources>
```

### Output (target locale)

```xml
<resources>
  <string name="button_title">Enviar</string>
  <string name="welcome">¡Bienvenido a <b>Android</b>!</string>
  <plurals name="items_count">
    <item quantity="one">1 elemento</item>
    <item quantity="other">%d elementos</item>
  </plurals>
</resources>
```

## Localization reference

### What is localized

- `<string>` element text content
- `<string-array>` item text content
- `<plurals>` item text content for different quantities
- HTML markup within strings is preserved
- Format placeholders (%s, %d, %1$s) are preserved

### What isn't localized

- Elements with `translatable="false"` attribute
- Element names and attributes
- XML structure and formatting
- `<bool>` and `<integer>` element values (preserved as-is)
- CDATA sections (content is extracted but structure preserved)

### Variable support

This format supports variable placeholders that are preserved during translation:
- `%s`, `%d` - Printf-style variables
- `%1$s`, `%2$d` - Positional printf-style variables
- HTML markup tags like `<b>`, `<i>`, `<u>`

Variables are automatically detected and remain unchanged in translations.

## Bucket-specific features

- **Translatable Attribute Support**: Respects `translatable="false"` to skip certain strings
- **Multiple Resource Types**: Handles strings, string arrays, plurals, booleans, and integers
- **HTML Markup Preservation**: Maintains HTML tags within string values
- **CDATA Handling**: Properly processes CDATA sections in XML
- **Format String Support**: Preserves Android format placeholders
- **Plural Quantity Support**: Full support for Android's plural quantity system (zero, one, two, few, many, other)
- **XML Entity Decoding**: Properly handles XML entities (&lt;, &gt;, &amp;, etc.)

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)