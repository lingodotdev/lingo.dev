# PO (Gettext)

## Introduction

Lingo.dev CLI translates PO (Portable Object) files used by GNU gettext by extracting message strings while preserving metadata, comments, and file structure.

This guide explains how to localize PO files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see PO localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "po" bucket)
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
    "po": {
      "include": ["./i18n/[locale].po"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., i18n/), create one or more files that match the specified glob pattern.

For example:

```po
# Translation file for our application
# Copyright (C) 2024 Our Company
#
msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\n"
"Language: en\n"

#: hello.py:1
msgid "Hello world"
msgstr "Hello world"

#: hello.py:5
msgid "You have %(count)d items"
msgstr "You have %(count)d items"

#: hello.py:10
msgid "Welcome"
msgstr "Welcome"
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
    "po": {
      "include": ["./locale/[locale]/LC_MESSAGES/messages.po"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```po
# Translation file for our application
#
msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\n"
"Language: en\n"

#: hello.py:1
msgid "Hello world"
msgstr "Hello world"

#: hello.py:5
msgid "You have %(count)d items"
msgstr "You have %(count)d items"
```

### Output (target locale)

```po
# Translation file for our application
#
msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\n"
"Language: es\n"

#: hello.py:1
msgid "Hello world"
msgstr "Hola mundo"

#: hello.py:5
msgid "You have %(count)d items"
msgstr "Tienes %(count)d elementos"
```

## Localization reference

### What is localized

- `msgstr` values (translation strings)
- Singular and plural forms of messages
- Messages with context (`msgctxt`)
- Variable placeholders are preserved during translation

### What isn't localized

- `msgid` values (source strings)
- File metadata and headers
- Comments (lines starting with #)
- Context strings (`msgctxt` values)
- Obsolete entries (marked with #~)
- File structure and formatting

### Variable support

This format supports variable placeholders that are preserved during translation:
- `%(variable)s`, `%(count)d` - Python-style variables
- `%s`, `%d` - Printf-style variables
- Variables are automatically detected and remain unchanged in translations

## Bucket-specific features

- **Gettext Compliance**: Full support for GNU gettext PO file format
- **Metadata Preservation**: Maintains all headers and file metadata
- **Comment Handling**: Preserves translator comments, extracted comments, and references
- **Context Support**: Handles `msgctxt` for disambiguating identical source strings
- **Plural Forms**: Supports `msgid_plural` and multiple `msgstr` entries
- **Variable Extraction**: Automatically detects and preserves Python-style variables
- **Section Structure**: Maintains logical grouping of related messages
- **Obsolete Entry Handling**: Properly handles obsolete translations marked with #~

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)