# {{FORMAT}}

## Introduction

Lingo.dev CLI translates {{FORMAT}} files {{FORMAT_BEHAVIOR_DESCRIPTION}}.

This guide explains how to localize {{FORMAT}} files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see {{FORMAT}} localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "{{BUCKET_NAME}}" bucket)
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
    "{{BUCKET_NAME}}": {
      "include": [{{FILE_PATTERN_EXAMPLE}}]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

{{LOCALE_PLACEHOLDER_OR_OVERWRITE_EXPLANATION}}

To learn more about the available options, see [i18n.json](https://lingo.dev/docs/configuration).

## Step 4. Create the localizable content

{{FILE_CREATION_INSTRUCTIONS}}

For example:

```{{FILE_EXTENSION}}
{{EXAMPLE_SOURCE_CONTENT}}
```

## Step 5. Run the translation pipeline

```bash
npx lingo.dev@latest i18n
```

## Example

### Configuration

```json
{{EXAMPLE_CONFIG}}
```

### Input{{INPUT_DESCRIPTION}}

```{{FILE_EXTENSION}}
{{EXAMPLE_INPUT}}
```

### Output{{OUTPUT_DESCRIPTION}}

```{{FILE_EXTENSION}}
{{EXAMPLE_OUTPUT}}
```

## Localization reference

### What is localized

{{LOCALIZED_ELEMENTS_LIST}}

### What isn't localized

{{NON_LOCALIZED_ELEMENTS_LIST}}

{{VARIABLE_SUPPORT_SECTION}}

{{METADATA_PRESERVATION_SECTION}}

## Bucket-specific features

{{BUCKET_SPECIFIC_FEATURES}}

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)

---

## Template Variables Reference

### Required Variables
- `{{FORMAT}}` - File format name (e.g., "HTML", "JSON", "Markdown")
- `{{FORMAT_BEHAVIOR_DESCRIPTION}}` - Brief description of how the format is handled
- `{{BUCKET_NAME}}` - The bucket name (usually lowercase format name)
- `{{FILE_PATTERN_EXAMPLE}}` - File pattern with or without `[locale]` placeholder
- `{{LOCALE_PLACEHOLDER_OR_OVERWRITE_EXPLANATION}}` - Explanation of file handling approach
- `{{FILE_CREATION_INSTRUCTIONS}}` - Instructions for where to create files
- `{{FILE_EXTENSION}}` - File extension for code blocks
- `{{EXAMPLE_SOURCE_CONTENT}}` - Simple example content
- `{{EXAMPLE_CONFIG}}` - Full configuration example
- `{{EXAMPLE_INPUT}}` - Input file example
- `{{EXAMPLE_OUTPUT}}` - Translated output example
- `{{LOCALIZED_ELEMENTS_LIST}}` - Bullet list of what gets localized
- `{{NON_LOCALIZED_ELEMENTS_LIST}}` - Bullet list of what doesn't get localized
- `{{BUCKET_SPECIFIC_FEATURES}}` - Format-specific features and behaviors

### Optional Variables (use empty string if not applicable)
- `{{INPUT_DESCRIPTION}}` - Additional context about input (e.g., "(original file)")
- `{{OUTPUT_DESCRIPTION}}` - Additional context about output (e.g., "(with translations added)")
- `{{VARIABLE_SUPPORT_SECTION}}` - Section about variable placeholders (if format supports them)
- `{{METADATA_PRESERVATION_SECTION}}` - Section about preserving non-string values (if applicable)

### Example Values for Different Format Types

#### For formats with `[locale]` directories (HTML, Markdown, etc.):
- `{{FILE_PATTERN_EXAMPLE}}`: `["./[locale]/*.html"]`
- `{{LOCALE_PLACEHOLDER_OR_OVERWRITE_EXPLANATION}}`: `[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.`
- `{{FILE_CREATION_INSTRUCTIONS}}`: `In the directory that contains the source locale content (e.g., en/), create one or more files that match the specified glob pattern.`
- `{{INPUT_DESCRIPTION}}`: ` (source locale)`
- `{{OUTPUT_DESCRIPTION}}`: ` (target locale)`

#### For formats that overwrite files (CSV, Vue JSON, etc.):
- `{{FILE_PATTERN_EXAMPLE}}`: `["./example.csv"]`
- `{{LOCALE_PLACEHOLDER_OR_OVERWRITE_EXPLANATION}}`: `The original file is updated with translations added as new columns/sections. No separate locale directories are needed.`
- `{{FILE_CREATION_INSTRUCTIONS}}`: `Create the file in your project directory with the source language content.`
- `{{INPUT_DESCRIPTION}}`: ` (before localization)`
- `{{OUTPUT_DESCRIPTION}}`: ` (with translations added)`

#### Variable support section example:
```markdown
### Variable support

This format supports variable placeholders that are preserved during translation:
- `%s`, `%d` - Printf-style variables
- `{variable}` - Named variables
- `{{variable}}` - Mustache-style variables

Variables are automatically detected and remain unchanged in translations.
```

#### Metadata preservation section example:
```markdown
### Metadata preservation

Non-string values are preserved exactly as they appear in the source:
- Boolean values (`true`, `false`)
- Numbers (`42`, `3.14`)
- Null values (`null`)
- Arrays and objects (structure preserved)

Only string values within the data structure are translated.
```