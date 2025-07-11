# bucket-html

## Introduction

This example demonstrates how [Lingo.dev CLI](#) localizes content when using the `"html"` bucket.

## Prerequisites

- ???

## Running the example

1. Sign up for an account at [Lingo.dev](#).
2. Clone this repo:

   ```bash
   git clone git@github.com:lingodotdev/lingo.dev.git
   ```

3. Navigate into this directory:

   ```bash
   cd demo/cli/html
   ```

4. Authenticate with Lingo.dev:

   ```
   npx lingo.dev@latest auth
   ```

5. Localize the HTML files:

   ```bash
   npx lingo.dev@latest i18n
   ```

## File structure

- `en/` - The directory containing the HTML files in the source locale.
- `es/` - The directory containing the HTML files in the target locale.
- `i18n.json` - The configuration that determines what files are translated (and how).
- `i18n.lock` - A lockfile that keeps track of what has already been translated.

## Example

### Configuration (i18n.json)

```json
{
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "html": {
      "include": ["./[locale]/*.html"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input file (source locale)

```html

```

### Output file (target locale)

```html

```

### Diff

```diff

```
