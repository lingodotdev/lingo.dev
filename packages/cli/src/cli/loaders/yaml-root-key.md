# YAML Root Key

## Introduction

Lingo.dev CLI translates YAML Root Key files by organizing translations under locale root keys within a single file.

This guide explains how to localize YAML Root Key files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see YAML Root Key localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "yaml-root-key" bucket)
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
    "yaml-root-key": {
      "include": ["./example.yml"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

The original file is updated with translations added as new root-level locale keys. No separate locale directories are needed.

To learn more about the available options, see [i18n.json](https://lingo.dev/docs/configuration).

## Step 4. Create the localizable content

Create the file in your project directory with the source language content organized under a locale root key.

For example:

```yaml
en:
  navigation:
    home: "Home"
    about: "About Us"
    contact: "Contact"
  forms:
    title: "Contact Form"
    submit_button: "Send Message"
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
    "yaml-root-key": {
      "include": ["./example.yml"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (before localization)

```yaml
en:
  navigation:
    home: "Home"
    about: "About Us"
    contact: "Contact"
    services: "Services"
  forms:
    title: "Contact Form"
    name_label: "Your Name"
    email_label: "Email Address"
    message_label: "Message"
    submit_button: "Send Message"
    success_message: "Thank you for your message!"
```

### Output (with translations added)

```yaml
en:
  navigation:
    home: "Home"
    about: "About Us"
    contact: "Contact"
    services: "Services"
  forms:
    title: "Contact Form"
    name_label: "Your Name"
    email_label: "Email Address"
    message_label: "Message"
    submit_button: "Send Message"
    success_message: "Thank you for your message!"
es:
  navigation:
    home: "Inicio"
    about: "Acerca de Nosotros"
    contact: "Contacto"
    services: "Servicios"
  forms:
    title: "Formulario de Contacto"
    name_label: "Su Nombre"
    email_label: "Dirección de Correo"
    message_label: "Mensaje"
    submit_button: "Enviar Mensaje"
    success_message: "¡Gracias por su mensaje!"
```

## Localization reference

### What is localized

- String values at any nesting level within the locale root key
- Multi-line strings
- Quoted strings (preserving quote style)
- Special characters and Unicode content

### What isn't localized

- Root-level locale keys (en, es, etc.)
- Object/array structure and hierarchy
- Non-string values (numbers, booleans, null)
- YAML comments and formatting
- Key names at any level

### Variable support

This format supports variable placeholders that are preserved during translation:
- `%s`, `%d` - Printf-style variables
- `{variable}` - Named variables
- `{{variable}}` - Mustache-style variables

Variables are automatically detected and remain unchanged in translations.

### Metadata preservation

Non-string values are preserved exactly as they appear in the source:
- Boolean values (`true`, `false`)
- Numbers (`42`, `3.14`)
- Null values (`null`)
- Arrays and objects (structure preserved)

Only string values within the data structure are translated.

## Bucket-specific features

- **Single file organization**: All locales are stored in one YAML file with locale keys as root-level organizers
- **Quote style preservation**: Maintains original quoting style (plain, single, or double quotes) for both keys and values
- **Hierarchical key support**: Supports deeply nested object structures within each locale
- **Incremental translation**: New target locales are added to the existing file without affecting source content
- **Root key extraction**: Uses the loader's root-key mechanism to extract and merge locale-specific content

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)