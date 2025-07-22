# EJS

## Introduction

Lingo.dev CLI translates EJS template files by extracting text content while preserving template logic, HTML structure, and dynamic expressions.

This guide explains how to localize EJS files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see EJS localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "ejs" bucket)
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
    "ejs": {
      "include": ["./templates/[locale].ejs"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., templates/), create one or more files that match the specified glob pattern.

For example:

```ejs
<!DOCTYPE html>
<html>
<head>
  <title>Welcome Page</title>
</head>
<body>
  <h1>Hello <%= user.name %>!</h1>
  <% if (user.isLoggedIn) { %>
    <p>Welcome back to our application.</p>
  <% } else { %>
    <p>Please log in to continue.</p>
  <% } %>
  <footer>© 2024 My Company. All rights reserved.</footer>
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
    "ejs": {
      "include": ["./templates/[locale].ejs"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```ejs
<!DOCTYPE html>
<html>
<head>
  <title>Welcome Page</title>
</head>
<body>
  <h1>Hello <%= user.name %>!</h1>
  <p>Welcome to our application.</p>
  <footer>© 2024 My Company. All rights reserved.</footer>
</body>
</html>
```

### Output (target locale)

```ejs
<!DOCTYPE html>
<html>
<head>
  <title>Página de Bienvenida</title>
</head>
<body>
  <h1>Hola <%= user.name %>!</h1>
  <p>Bienvenido a nuestra aplicación.</p>
  <footer>© 2024 Mi Empresa. Todos los derechos reservados.</footer>
</body>
</html>
```

## Localization reference

### What is localized

- Text content within HTML elements
- Static text outside of EJS tags
- Content that appears as plain text between HTML tags
- Text content while preserving surrounding HTML structure

### What isn't localized

- EJS template tags (`<% %>`, `<%= %>`, `<%- %>`)
- JavaScript expressions and logic within EJS tags
- HTML tags and attributes
- Variable names and object properties
- Conditional logic and loops

## Bucket-specific features

- **Template Logic Preservation**: Maintains all EJS template syntax and expressions
- **HTML Structure Preservation**: Keeps HTML tags and structure intact
- **Smart Text Extraction**: Automatically identifies translatable text content
- **Placeholder System**: Uses internal placeholders to safely handle text replacement
- **Mixed Content Support**: Handles files with both static text and dynamic content
- **Fallback Handling**: Gracefully handles malformed templates
- **Context-Aware Processing**: Understands the difference between template logic and content

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)