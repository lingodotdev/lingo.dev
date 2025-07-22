# Properties

## Introduction

Lingo.dev CLI translates Java Properties files by extracting key-value pairs while preserving the file structure and comments.

This guide explains how to localize Properties files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see Properties localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "properties" bucket)
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
    "properties": {
      "include": ["./i18n/[locale].properties"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., i18n/), create one or more files that match the specified glob pattern.

For example:

```properties
# General messages
welcome.message=Welcome to our application!
error.message=An error has occurred. Please try again later.

# User-related messages
user.login=Please enter your username and password.
user.username=Username
user.password=Password
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
    "properties": {
      "include": ["./i18n/[locale].properties"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```properties
# General messages
welcome.message=Welcome to our application!
error.message=An error has occurred. Please try again later.

# User-related messages
user.login=Please enter your username and password.
user.username=Username
user.password=Password
```

### Output (target locale)

```properties
welcome.message=Bienvenido a nuestra aplicación!
error.message=Se ha producido un error. Por favor, inténtelo de nuevo más tarde.
user.login=Por favor, introduzca su nombre de usuario y contraseña.
user.username=Nombre de usuario
user.password=Contraseña
```

## Localization reference

### What is localized

- Property values (text after the = sign)
- Multi-line values (when properly escaped)
- Values containing special characters

### What isn't localized

- Property keys (text before the = sign)
- Comments (lines starting with #)
- Empty lines and whitespace formatting
- Special escape sequences

## Bucket-specific features

- **Comment Preservation**: Maintains all comment lines during translation
- **Key-Value Parsing**: Properly handles key=value syntax with robust parsing
- **Multi-line Support**: Handles values that span multiple lines
- **Whitespace Handling**: Preserves formatting and spacing appropriately
- **Special Character Support**: Handles Unicode and escaped characters in values
- **Robust Parsing**: Tolerates various formatting styles and edge cases

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)