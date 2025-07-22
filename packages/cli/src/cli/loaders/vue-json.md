# Vue JSON

## Introduction

Lingo.dev CLI translates Vue JSON files by extracting and localizing JSON data within `<i18n>` blocks in Vue Single File Components.

This guide explains how to localize Vue JSON files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see Vue JSON localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "vue-json" bucket)
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
    "vue-json": {
      "include": ["./src/components/*.vue"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

The original file is updated with translations added as new locale sections within the `<i18n>` block. No separate locale directories are needed.

## Step 4. Create the localizable content

Create the Vue file in your project directory with the source language content in an `<i18n>` block.

For example:

```vue
<template>
  <div id="app">
    <p>{{ $t('hello') }}</p>
  </div>
</template>

<i18n>
{
  "en": {
    "hello": "hello world!"
  }
}
</i18n>

<script>
export default {
  name: 'app'
}
</script>
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
    "vue-json": {
      "include": ["./src/components/*.vue"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (before localization)

```vue
<template>
  <div id="app">
    <p>{{ $t('hello') }}</p>
  </div>
</template>

<i18n>
{
  "en": {
    "hello": "hello world!"
  }
}
</i18n>

<script>
export default {
  name: 'app'
}
</script>
```

### Output (with translations added)

```vue
<template>
  <div id="app">
    <p>{{ $t('hello') }}</p>
  </div>
</template>

<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "es": {
    "hello": "hola mundo!"
  },
  "fr": {
    "hello": "bonjour le monde!"
  }
}
</i18n>

<script>
export default {
  name: 'app'
}
</script>
```

## Localization reference

### What is localized

- String values within the source locale object in the `<i18n>` block
- Nested object structures are preserved with only leaf string values translated

### What isn't localized

- Template content outside the `<i18n>` block
- Script sections
- Style sections
- Non-string values (numbers, booleans, null, arrays)
- Object keys and structure

### Metadata preservation

Non-string values are preserved exactly as they appear in the source:
- Boolean values (`true`, `false`)
- Numbers (`42`, `3.14`)
- Null values (`null`)
- Arrays and objects (structure preserved)

Only string values within the JSON structure are translated.

## Bucket-specific features

- **Vue SFC Integration**: Seamlessly works with Vue Single File Components
- **JSON Structure Preservation**: Maintains the exact structure of the JSON within `<i18n>` blocks
- **Automatic Repair**: Uses jsonrepair to handle malformed JSON in `<i18n>` blocks
- **Non-destructive**: Files without `<i18n>` blocks are left unchanged
- **In-place Updates**: Translations are added directly to the existing file rather than creating separate locale files

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)