# XML

## Introduction

Lingo.dev CLI translates XML files by localizing text content within XML elements and attributes while preserving the overall document structure and formatting.

This guide explains how to localize XML files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see XML localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "xml" bucket)
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
    "xml": {
      "include": ["./[locale]/*.xml"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

[locale] is a placeholder that gets replaced with the actual locale code (e.g., "en", "es") to match your file structure.

To learn more about the available options, see [i18n.json](https://lingo.dev/docs/configuration).

## Step 4. Create the localizable content

In the directory that contains the source locale content (e.g., en/), create one or more XML files that match the specified glob pattern.

For example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <title>Welcome to our application</title>
  <description>
    <summary>A brief summary</summary>
    <details>Detailed information here</details>
  </description>
  <image src="logo.png" alt="Company logo" title="Our logo"/>
</root>
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
    "targets": [
      "es"
    ]
  },
  "buckets": {
    "xml": {
      "include": [
        "./[locale]/example.xml"
      ]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <!-- Text content of XML elements is localized -->
  <title>This title text is localized</title>
  
  <!-- Text content in nested elements is localized -->
  <description>
    <summary>This summary text is localized</summary>
    <details>These detail contents are also localized</details>
  </description>
  
  <!-- XML element attributes are localized -->
  <image src="photo.jpg" alt="This alt attribute is localized" title="This title attribute is localized"/>
  
  <!-- Mixed content with both text and attributes is localized -->
  <link href="example.com" label="This label attribute is localized">This link text is also localized</link>
  
  <!-- Multiple attributes on the same element are localized -->
  <button type="submit" value="This value is localized" placeholder="This placeholder is localized">This button text is localized</button>
  
  <!-- Deeply nested elements with text content are localized -->
  <section>
    <article>
      <paragraph>
        <sentence>This deeply nested text is localized</sentence>
      </paragraph>
    </article>
  </section>
  
  <!-- Empty elements with only attributes are localized -->
  <meta name="description" content="This meta content is localized"/>
  
  <!-- Elements with multiple child text nodes are localized -->
  <message>
    <greeting>Hello, this greeting is localized</greeting>
    <body>This message body is also localized</body>
    <signature>This signature text is localized too</signature>
  </message>
</root>
```

### Output (target locale)

```xml
<root><title>Este texto de título está localizado</title><description><summary>Este texto de resumen está localizado</summary><details>Estos contenidos detallados también están localizados</details></description><image src="photo.jpg" alt="Este atributo alt está localizado" title="Este atributo de título está localizado"/><link href="example.com" label="Este atributo de etiqueta está localizado">Este texto de enlace también está localizado</link><button type="submit" value="Este valor está localizado" placeholder="Este marcador de posición está localizado">Este texto de botón está localizado</button><section><article><paragraph><sentence>Este texto profundamente anidado está localizado</sentence></paragraph></article></section><meta name="description" content="Este contenido meta está localizado"/><message><greeting>Hola, este saludo está localizado</greeting><body>Este cuerpo del mensaje también está localizado</body><signature>Esta firma también está localizada</signature></message></root>
```

## Localization reference

### What is localized

- Text content within XML elements
- Attribute values (all attribute types including alt, title, value, placeholder, etc.)
- Text content in nested elements at any depth
- Mixed content (elements with both text and attributes)
- Text content in elements with multiple child text nodes

### What isn't localized

- XML declaration and processing instructions
- Element names and tag structure
- Attribute names (only their values are localized)
- XML comments (content within `<!-- -->`)
- CDATA sections
- Document structure and hierarchy
- Whitespace and formatting (output is normalized)

## Bucket-specific features

### XML parsing and structure preservation

The XML loader uses the xml2js library with specific configuration options:
- **Structure preservation**: The overall XML document structure is maintained
- **Attribute handling**: All attributes are preserved with their values localized
- **Nested content**: Text content at any nesting level is localized
- **Normalization**: Output XML is normalized (whitespace collapsed, formatting simplified)

### CDATA and special content handling

- CDATA sections are preserved without localization
- XML comments are preserved as-is
- Processing instructions and XML declarations remain unchanged
- Mixed content (text + child elements) is properly handled

### Output formatting

The translated XML output is normalized:
- Whitespace is collapsed and standardized
- Elements are compacted without extra spacing
- The XML declaration is omitted from the output (headless mode)
- The overall structure remains valid and well-formed

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [HTML localization](https://lingo.dev/docs/html)