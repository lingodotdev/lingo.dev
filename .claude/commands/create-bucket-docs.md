---
argument-hint: <analysis-output>
description: Create documentation for a Lingo.dev bucket type using analysis output
---

Using the bucket analysis output provided at the end of this prompt, create documentation for the specified bucket type in Lingo.dev CLI.

## Template Structure

````markdown
---
title: "[BUCKET_TYPE in title case]"
subtitle: "[Brief description of what this bucket type is for]"
---

[BUCKET_TYPE in title case] files are [BRIEF DESCRIPTION OF THE FILE FORMAT, ITS PURPOSE AND PRIMARY USE CASE]. [ONE SENTENCE ABOUT STRUCTURE OR KEY CHARACTERISTICS].

**Lingo.dev CLI** uses LLMs to translate your [BUCKET_TYPE] files across multiple locales. This guide shows you how to set up and run translations for [TYPICAL USE CASE].

## Quickstart

### Step 1: Install Lingo.dev CLI

```bash
# Install globally
npm install -g lingo.dev@latest

# Or run directly with npx
npx lingo.dev@latest --version
```

### Step 2: Authenticate

Log in to your Lingo.dev account:

```bash
npx lingo.dev@latest login
```

This opens your browser for authentication. Your API key is stored locally for future use.

### Step 3: Initialize Project

Create your base configuration:

```bash
npx lingo.dev@latest init
```

This generates an `i18n.json` file with default settings.

### Step 4: Configure [BUCKET_TYPE] Bucket

Update your `i18n.json` to add [BUCKET_TYPE] support:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "[BUCKET_TYPE]": {
      "include": ["[PATH_PATTERN]"]
    }
  }
}
```

[IF separate-files: **Note**: Keep `[locale]` as-is in the config — it's replaced with actual locale codes at runtime.]
[IF in-place: DO NOT include any note about [locale]]

### Step 5: Create File Structure

[FOR separate-files:]
Organize your [BUCKET_TYPE] files by locale:

```
[directory]/
├── en/
│   └── [filename]      # Source file
└── es/                 # Target directory (empty initially)
```

Place your source [BUCKET_TYPE] files in the `en/` directory. The `es/` directory can be empty — translated files will be created there automatically.

[FOR in-place:]
Place your [BUCKET_TYPE] file in your project:

```
[directory]/
└── [filename]          # Contains all locales
```

This single file will contain translations for all configured locales.

### Step 6: Run Translation

Execute the translation command:

```bash
npx lingo.dev@latest i18n
```

The CLI will:

- Read [BUCKET_TYPE] files from your source locale
- Translate content to target locales using LLMs
- [FOR separate-files: Create new files in target directories (e.g., `es/[filename]`)]
- [FOR in-place: Update the file with translations for all configured locales]

[FOR separate-files: **Note**: Unlike some bucket types that modify files in place, the [BUCKET_TYPE] bucket creates separate files for each locale. Your source files remain unchanged.]
[FOR in-place: **Note**: The [BUCKET_TYPE] bucket modifies the source file directly, adding translations for all target locales to the same file.]

### Step 7: Verify Results

Check the translation status:

```bash
npx lingo.dev@latest status
```

[FOR separate-files: Review generated files in your target locale directory (`es/`).]
[FOR in-place: Review the updated [filename] file which now contains all locales.]

## [Feature Sections - ONLY include supported features]

[IF Locked Keys = YES:]

## Locked Content

The [BUCKET_TYPE] bucket supports locking specific keys to prevent translation:

```json
"[BUCKET_TYPE]": {
  "include": ["[PATH_PATTERN]"],
  "lockedKeys": ["key1", "key2", "nested/key3"]
}
```

This feature is available for [BUCKET_TYPE] and other structured format buckets where specific keys need to remain untranslated.

[IF Ignored Keys = YES:]

## Ignored Keys

The [BUCKET_TYPE] bucket supports ignoring keys entirely during processing:

```json
"[BUCKET_TYPE]": {
  "include": ["[PATH_PATTERN]"],
  "ignoredKeys": ["debug", "internal/*"]
}
```

Unlike locked keys which preserve content, ignored keys are completely skipped during the translation process.

[IF Inject Locale = YES:]

## Inject Locale

The [BUCKET_TYPE] bucket supports automatically injecting locale codes into specific keys:

```json
"[BUCKET_TYPE]": {
  "include": ["[PATH_PATTERN]"],
  "injectLocale": ["settings/language", "config/locale"]
}
```

These keys will automatically have their values replaced with the current locale code during translation.

[IF Translator Notes = YES:]

## Translator Notes

The [BUCKET_TYPE] bucket supports providing context hints to improve translation quality:

[Show bucket-specific format for translator notes]

## Example

**Configuration** (`i18n.json`):

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "[BUCKET_TYPE]": {
      "include": ["[REALISTIC_PATH]"]
    }
  }
}
```

[FOR separate-files:]
**Input** (`[path]/en/[filename]`):

```[format]
[Source content in appropriate format]
```

**Output** (`[path]/es/[filename]`):

```[format]
[Translated content in appropriate format]
```

[FOR in-place:]
**Before translation** (`[path]/[filename]`):

```[format]
[Source content showing only English]
```

**After translation** (`[path]/[filename]`):

```[format]
[Same file now containing both English and Spanish]
```
````

## Critical Adaptation Rules

### For Separate-Files Buckets

1. **Always use `[locale]` placeholder** in paths
2. Step 5: Show source (`en/`) and target (`es/`) directories
3. Step 6: Explain "creates new files"
4. Include the [locale] note in Step 4
5. Example: Show input as `path/en/file.ext` and output as `path/es/file.ext`

### For In-Place Buckets

1. **Never use `[locale]` placeholder** anywhere in the document
2. **Never include the [locale] note** in Step 4
3. Step 5: Show single file path
4. Step 6: Explain "modifies the file directly"
5. Example: Use "Before translation" and "After translation" labels
6. Example: Show the same file path for both states

### Feature Sections

- Only include sections for features marked YES
- Locked Keys: Content is preserved unchanged
- Ignored Keys: Keys are skipped entirely during processing
- Inject Locale: Keys automatically get the locale code as their value
- Translator Notes: Format varies significantly by bucket type

### Path Conventions

Choose realistic paths for the bucket type:

- iOS: `ios/Resources/`, `[AppName]/`
- Android: `app/src/main/res/values-[locale]/`
- Web: `locales/`, `i18n/`, `translations/`
- Flutter: `lib/l10n/`
- Java: `src/main/resources/`

### Writing Rules

- Match the concise, direct tone of the template
- No marketing language or unnecessary adjectives
- Don't document what specifically gets translated
- Don't include generic features (exclude patterns, multiple directories)
- Focus only on bucket-specific behavior
- Use only `en` → `es` in all examples
- Keep examples minimal but representative

## Instructions

1. Parse the bucket analysis output provided in the arguments to determine:

   - Bucket type name
   - File organization (separate-files if uses [locale] placeholder, in-place if not)
   - Supported features (lockedKeys, ignoredKeys, injectLocale, hints/notes)
   - Typical file extension and paths

2. Based on the analysis, fill in the template with appropriate:

   - Description of the file format
   - Realistic path patterns
   - Only the features that are actually supported
   - Appropriate examples for the format

3. Generate the complete Markdown documentation following the specifications exactly.

---

## Bucket Analysis Output

$ARGUMENTS
