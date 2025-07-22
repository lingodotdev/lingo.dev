# PHP

## Introduction

Lingo.dev CLI translates PHP files that return arrays containing localizable string content.

This guide explains how to localize PHP files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see PHP localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "php" bucket)
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
    "php": {
      "include": ["./[locale]/*.php"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

To learn more about the available options, see [i18n.json](https://lingo.dev/docs/configuration).

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., en/), create one or more files that match the specified glob pattern.

For example:

```php
<?php

return [
    'welcome_message' => 'Welcome to our application',
    'navigation' => [
        'home' => 'Home',
        'about' => 'About',
        'contact' => 'Contact',
    ],
];
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
    "targets": ["es"]
  },
  "buckets": {
    "php": {
      "include": ["./[locale]/example.php"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```php
<?php

return [
    'This positional string is localised',
    'Another positional string',
    'welcome_message' => 'This welcome message is localised',
    'error_text' => 'This error text is localised',
    'navigation' => [
        'home' => 'This home label is localised',
        'about' => 'This about label is localised',
        'contact' => 'This contact label is localised',
    ],
    'mixed_content' => [
        'title' => 'This title is localised',
        'count' => 42,
        'enabled' => true,
        'nothing_here' => null,
        'description' => 'This description is localised',
    ],
];
```

### Output (target locale)

```php
<?php

return [
  '0' => 'Esta cadena posicional está localizada',
  '1' => 'Otra cadena posicional',
  '2' => [
    'welcome_message' => 'Este mensaje de bienvenida está localizado'
  ],
  '3' => [
    'error_text' => 'Este texto de error está localizado'
  ],
  '4' => [
    'navigation' => [
      'home' => 'Esta etiqueta de inicio está localizada',
      'about' => 'Esta etiqueta de acerca de está localizada',
      'contact' => 'Esta etiqueta de contacto está localizada'
    ]
  ],
  '5' => [
    'mixed_content' => [
      'title' => 'Este título está localizado',
      'count' => 42,
      'enabled' => true,
      'nothing_here' => null,
      'description' => 'Esta descripción está localizada'
    ]
  ]
];
```

## Localization reference

### What is localized

- String values within the returned array (both positional and associative)
- String values in nested arrays at any depth
- Escaped characters within strings (quotes, backslashes, newlines, etc.)

### What isn't localized

- Array keys (remain unchanged)
- Numeric values
- Boolean values (`true`, `false`)
- Null values (`null`)
- Comments within the array structure
- PHP code structure and syntax

### Metadata preservation

Non-string values are preserved exactly as they appear in the source:
- Boolean values (`true`, `false`)
- Numbers (`42`, `3.14`)
- Null values (`null`)
- Array structure (nested arrays preserved)

Only string values within the data structure are translated.

## Bucket-specific features

The PHP loader has several unique behaviors:

### Array syntax preservation
- Automatically detects and preserves the original array syntax (short `[]` or traditional `array()`)
- Maintains consistent formatting based on the source file

### String escaping
- Properly handles escaped characters in strings (`\'`, `\"`, `\\`, `\n`, `\r`, `\t`)
- Preserves escape sequences in translated content

### File structure preservation
- Maintains the PHP opening tag and any content before the `return` statement
- Preserves indentation and formatting style

### Mixed array handling
- When arrays contain both positional and associative elements, the structure may be reorganized in the output
- Positional elements followed by associative elements get wrapped in numbered keys to maintain proper PHP array structure

### Comment handling
- Comments within the returned array are stripped during processing
- Comments outside the array structure are preserved

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)