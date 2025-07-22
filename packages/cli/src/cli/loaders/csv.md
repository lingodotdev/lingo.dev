# CSV

## Introduction

Lingo.dev CLI translates CSV files by adding translations as new columns while preserving the existing data structure and key-value relationships.

This guide explains how to localize CSV files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see CSV localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "csv" bucket)
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
    "csv": {
      "include": ["./translations.csv"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

The original file is updated with translations added as new columns. No separate locale directories are needed.

## Step 4. Create the localizable content

Create the CSV file in your project directory with the source language content.

For example:

```csv
id,en
hello,Hello World
welcome,Welcome to our app
button_submit,Submit
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
    "csv": {
      "include": ["./i18n.csv"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (before localization)

```csv
id,en
hello,Hello World
welcome,Welcome to our app
button_submit,Submit
```

### Output (with translations added)

```csv
id,en,es,fr
hello,Hello World,Hola Mundo,Bonjour le monde
welcome,Welcome to our app,Bienvenido a nuestra aplicación,Bienvenue dans notre application
button_submit,Submit,Enviar,Soumettre
```

## Localization reference

### What is localized

- Text values in the source locale column
- Only rows with non-empty values in the source locale are translated
- New translation keys are automatically added as new rows

### What isn't localized

- Column headers (except when new locale columns are added)
- The key column (first column by default)
- Empty values are preserved as empty
- Existing translation values are preserved unless explicitly updated

## Bucket-specific features

- **Automatic Key Detection**: Automatically detects the key column (first column or falls back to "KEY")
- **Dynamic Column Addition**: Automatically adds new locale columns as needed
- **Incremental Updates**: Preserves existing translations while adding new ones
- **Flexible Key Column**: Supports custom key column names (id, key, KEY, etc.)
- **Empty Value Handling**: Skips translating empty source values
- **Row Preservation**: Maintains all existing rows and their order
- **New Key Support**: Automatically adds new translation keys as additional rows

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)