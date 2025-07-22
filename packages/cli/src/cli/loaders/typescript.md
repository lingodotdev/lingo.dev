# TypeScript

## Introduction

Lingo.dev CLI translates TypeScript files by extracting and localizing string literals from default exports while preserving TypeScript syntax, type annotations, and code structure.

This guide explains how to localize TypeScript files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see TypeScript localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "typescript" bucket)
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
    "typescript": {
      "include": ["./[locale]/*.ts"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

To learn more about the available options, see [i18n.json](https://lingo.dev/docs/configuration).

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., en/), create one or more TypeScript files that match the specified glob pattern.

For example:

```typescript
const messages = {
  greeting: "Hello, world!",
  farewell: "Goodbye!"
};

export default messages;
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
    "typescript": {
      "include": ["./[locale]/example.ts"],
      "lockedKeys": ["locked_key_1"],
      "ignoredKeys": ["ignored_key_1"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```typescript

const messages = {
  navigation: {
    home: "Home",
    about: "About Us",
    contact: "Contact Us",
    services: "Our Services"
  },
  
  forms: {
    title: "Contact Form",
    nameLabel: "Your Name",
    emailLabel: "Email Address",
    messageLabel: "Your Message",
    submitButton: "Send Message",
    successMessage: "Thank you for your message!",
    locked_key_1: "This value is locked and should not be changed",
    ignored_key_1: "This value is ignored and should not be processed"
  },
};

export default messages;
```

### Output (target locale)

```typescript
const messages = {
  navigation: {
    home: "Inicio",
    about: "Sobre nosotros",
    contact: "Contáctenos",
    services: "Nuestros servicios",
  },
  forms: {
    title: "Formulario de contacto",
    nameLabel: "Su nombre",
    emailLabel: "Dirección de correo electrónico",
    messageLabel: "Su mensaje",
    submitButton: "Enviar mensaje",
    successMessage: "¡Gracias por su mensaje!",
    locked_key_1: "This value is locked and should not be changed",
    ignored_key_1: "This value is ignored and should not be processed",
  },
};
export default messages;
```

## Localization reference

### What is localized

- String literals in object properties (`"Hello, world!"`)
- Template literals without expressions (`` `Hello, world!` ``)
- String values in nested objects and arrays
- String literals in default exported objects
- String literals in variables exported as default

### What isn't localized

- TypeScript type annotations and interfaces
- Function declarations and implementations
- Import/export statements (except the exported values)
- Variable names and object keys
- Comments and whitespace
- Non-string primitives (numbers, booleans, null, undefined)
- Template literals with expressions
- Function calls and expressions

### Metadata preservation

Non-string values are preserved exactly as they appear in the source:
- Boolean values (`true`, `false`)
- Numbers (`42`, `3.14`)
- Null values (`null`)
- Arrays and objects (structure preserved)
- TypeScript type annotations and assertions

Only string values within the data structure are translated.

## Bucket-specific features

### TypeScript syntax support

The TypeScript loader uses Babel with TypeScript plugin to parse and generate code, providing full support for:

- Type annotations (`const messages: Record<string, string> = {...}`)
- Type assertions (`export default messages as const`)
- Interface declarations (preserved in output)
- Generic types and complex type expressions
- Modern TypeScript features

### Default export patterns

The loader supports multiple default export patterns:

1. **Direct object export**: `export default { key: "value" }`
2. **Variable export**: `const messages = {...}; export default messages;`
3. **Type assertions**: `export default { key: "value" } as const`
4. **Nested structures**: Objects and arrays with arbitrary nesting depth

### Code preservation

- Original code formatting and structure is maintained
- TypeScript syntax and type information is preserved
- Comments and whitespace are retained
- Only string literal values are modified during translation

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)