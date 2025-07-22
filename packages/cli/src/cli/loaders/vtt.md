# VTT

## Introduction

Lingo.dev CLI translates VTT (WebVTT subtitle) files by extracting subtitle text content while preserving timing, positioning, and style attributes.

This guide explains how to localize VTT files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see VTT localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "vtt" bucket)
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
    "vtt": {
      "include": ["./[locale]/*.vtt"]
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

```vtt
WEBVTT

1
00:00:01.000 --> 00:00:03.500
This subtitle text is localized

subtitle-2
00:00:04.000 --> 00:00:07.200
This text with an identifier is also localized
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
    "vtt": {
      "include": [
        "./[locale]/example.vtt"
      ]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```vtt
WEBVTT

NOTE
This is a VTT file demonstrating localization behavior

1
00:00:01.000 --> 00:00:03.500
This subtitle text is localized

subtitle-2
00:00:04.000 --> 00:00:07.200
This text with an identifier is also localized

3
00:00:08.500 --> 00:00:12.000 align:middle line:90%
This styled subtitle text is localized

00:00:13.000 --> 00:00:16.500
Multiple lines of text
are both localized

final-cue
00:00:17.000 --> 00:00:20.000 position:25% align:start
The last subtitle text is localized
```

### Output (target locale)

```vtt
WEBVTT

1
00:00:01.000 --> 00:00:03.500
Este texto de subtítulo está localizado

subtitle-2
00:00:04.000 --> 00:00:07.200
Este texto con un identificador también está localizado

3
00:00:08.500 --> 00:00:12.000
Este texto de subtítulo con estilo está localizado

00:00:13.000 --> 00:00:16.500
Múltiples líneas de texto
están ambas localizadas

final-cue
00:00:17.000 --> 00:00:20.000
El último texto de subtítulo está localizado
```

## Localization reference

### What is localized

- Subtitle text content within cues
- Multi-line subtitle text (each line is translated together as a unit)
- Text content regardless of whether cues have identifiers or not

### What isn't localized

- WEBVTT header declaration
- Timing information (start and end times)
- Cue identifiers
- Positioning and styling attributes (align, line, position, etc.)
- NOTE blocks and comments
- Cue settings and styling information

## Bucket-specific features

### WebVTT Format Support

The VTT loader fully supports the WebVTT specification while preserving the structural integrity of subtitle files:

- **Timing Preservation**: All start and end times are preserved exactly as specified in the source file
- **Identifier Support**: Optional cue identifiers are maintained across translations
- **Styling Attributes**: Cue positioning and styling attributes (align, line, position, etc.) are preserved
- **Multi-line Cues**: Subtitle text spanning multiple lines is treated as a single translatable unit
- **NOTE Blocks**: Comment blocks using the NOTE keyword are preserved but not translated

### File Structure

VTT files use a locale-based directory structure where each language has its own folder containing the translated subtitle files. This approach ensures clear separation between different language versions while maintaining the same file naming conventions.

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)