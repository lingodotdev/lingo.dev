# XLIFF

## Introduction

Lingo.dev CLI translates XLIFF files by localizing text content within `<source>` and `<target>` elements while preserving all XML structure, attributes, and metadata.

This guide explains how to localize XLIFF files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see XLIFF localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "xliff" bucket)
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
    "xliff": {
      "include": ["./[locale]/example.xliff"]
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

```xliff
<?xml version="1.0" encoding="utf-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file original="messages.properties" source-language="en" target-language="en" datatype="plaintext">
    <header>
      <tool tool-id="lingo-dev" tool-name="Lingo.dev" tool-version="1.0"/>
    </header>
    <body>
      <trans-unit id="welcome_message" restype="string" datatype="plaintext">
        <source>Welcome to our application</source>
      </trans-unit>
      <trans-unit id="button_text" restype="string" datatype="plaintext">
        <source>Click here to continue</source>
      </trans-unit>
    </body>
  </file>
</xliff>
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
    "xliff": {
      "include": ["./[locale]/example.xliff"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```xliff
<?xml version="1.0" encoding="utf-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file original="messages.properties" source-language="en" target-language="en" datatype="plaintext">
    <header>
      <tool tool-id="lingo-dev" tool-name="Lingo.dev" tool-version="1.0"/>
    </header>
    <body>
      <trans-unit id="welcome_message" restype="string" datatype="plaintext">
        <source>Welcome to our application</source>
      </trans-unit>
      <trans-unit id="error_message" resname="error.validation" restype="string" datatype="plaintext">
        <source><![CDATA[Please enter a valid <email> address]]></source>
      </trans-unit>
    </body>
  </file>
</xliff>
```

### Output (target locale)

```xliff
<?xml version="1.0" encoding="utf-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file original="messages.properties" source-language="en" target-language="es" datatype="plaintext">
    <header>
      <tool tool-id="lingo-dev" tool-name="Lingo.dev" tool-version="1.0"/>
    </header>
    <body>
      <trans-unit id="welcome_message" restype="string" datatype="plaintext">
        <source>Welcome to our application</source>
        <target state="translated">Bienvenido a nuestra aplicación</target>
      </trans-unit>
      <trans-unit id="error_message" resname="error.validation" restype="string" datatype="plaintext">
        <source><![CDATA[Please enter a valid <email> address]]></source>
        <target state="translated"><![CDATA[Por favor, introduce una dirección de <email> válida]]></target>
      </trans-unit>
    </body>
  </file>
</xliff>
```

## Localization reference

### What is localized

- Text content within `<source>` elements inside `<trans-unit>` elements (XLIFF 1.2)
- Text content within `<source>` elements inside `<segment>` elements (XLIFF 2.0)
- Text content within `<target>` elements (both versions)
- CDATA sections within localizable elements
- Content is extracted and translated while preserving XML structure

### What isn't localized

- XML declarations and processing instructions
- All XML attributes (id, restype, datatype, state, etc.)
- Content within `<header>` elements (XLIFF 1.2)
- Content within `<notes>` elements (XLIFF 2.0)
- XML namespace declarations
- File structure and element hierarchy
- Version attributes and language codes

### Variable support

XLIFF files support variable placeholders that are preserved during translation:
- `%s`, `%d` - Printf-style variables
- `{variable}` - Named variables
- `{{variable}}` - Mustache-style variables
- HTML-like tags within CDATA sections

Variables are automatically detected and remain unchanged in translations.

### Metadata preservation

All XML structure and metadata are preserved exactly:
- Element attributes and their values
- XML namespaces and schema references
- File structure and element hierarchy
- Translation unit IDs and resource names
- State attributes indicating translation status

Only text content within designated localizable elements is translated.

## Bucket-specific features

### XLIFF Version Support

The loader supports both XLIFF 1.2 and 2.0 formats:

**XLIFF 1.2 Features:**
- Uses `<trans-unit>` elements with `<source>` and `<target>` children
- Supports `resname`, `restype`, and `datatype` attributes
- Handles deterministic key generation from `resname`, `id`, or source text
- Preserves `state` attributes on target elements

**XLIFF 2.0 Features:**
- Uses `<unit>` elements with `<segment>` containers
- Supports hierarchical structure with `<group>` elements
- Uses `srcLang` and `trgLang` attributes on root element
- Handles complex key paths for nested structures

### Key Generation Strategy

For XLIFF 1.2, translation keys are generated using this priority:
1. `resname` attribute value
2. `id` attribute value  
3. Source text content as fallback

For XLIFF 2.0, keys use a hierarchical path format:
- `resources/{fileId}/{groupPath}{unitId}/source`

### Language Handling

- **Source locale files**: Only `<source>` elements are processed
- **Target locale files**: Both `<source>` and `<target>` elements are managed
- Target language attributes are automatically updated
- Translation state is set to "translated" for non-empty translations

### CDATA Handling

Content containing XML-sensitive characters (`<`, `>`, `&`, `"`, `'`) is automatically wrapped in CDATA sections to ensure proper XML parsing and preserve formatting.

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)