# HTML

## Introduction

Lingo.dev CLI translates HTML files by extracting text content and localizable attributes while preserving the document structure and markup.

This guide explains how to localize HTML files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see HTML localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "html" bucket)
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
    "html": {
      "include": ["./[locale]/*.html"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., en/), create one or more files that match the specified glob pattern.

For example:

```html
<html>
  <head>
    <title>My Page</title>
    <meta name="description" content="Page description" />
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>
      This is a paragraph with a 
      <a href="https://example.com">link</a>
      and <b>bold text</b>.
    </p>
  </body>
</html>
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
    "html": {
      "include": ["./i18n/[locale].html"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```html
<html>
  <head>
    <title>My Page</title>
    <meta name="description" content="Page description" />
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>Welcome to our website!</p>
  </body>
</html>
```

### Output (target locale)

```html
<html lang="es">
  <head>
    <title>Mi Página</title>
    <meta name="description" content="Descripción de la página" />
  </head>
  <body>
    <h1>¡Hola, mundo!</h1>
    <p>¡Bienvenido a nuestro sitio web!</p>
  </body>
</html>
```

## Localization reference

### What is localized

- Text content within HTML elements
- Localizable attributes:
  - `content` attribute on `<meta>` elements
  - `alt` attribute on `<img>` elements  
  - `placeholder` attribute on `<input>` elements
  - `title` attribute on `<a>` elements
- Text nodes are extracted while preserving surrounding markup

### What isn't localized

- HTML tags and element structure
- Non-localizable attributes (href, src, class, id, etc.)
- Content within `<script>` and `<style>` tags
- Comments and CDATA sections
- Empty text nodes or whitespace-only content

## Bucket-specific features

- **Structure Preservation**: Maintains complete HTML document structure and nesting
- **Attribute Localization**: Selectively localizes specific attributes based on element type
- **Automatic Lang Attribute**: Sets the `lang` attribute on the HTML element to match target locale
- **Markup Preservation**: Preserves all HTML formatting and nested element structure
- **Path-based Addressing**: Uses hierarchical paths to identify and replace specific text nodes
- **Smart Text Extraction**: Only extracts meaningful text content, ignoring whitespace-only nodes
- **Script/Style Exclusion**: Automatically skips translating content within script and style tags

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)