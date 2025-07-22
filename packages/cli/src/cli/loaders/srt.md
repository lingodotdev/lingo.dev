# SRT

## Introduction

Lingo.dev CLI translates SRT files while preserving the timing structure and subtitle formatting of video subtitles.

This guide explains how to localize SRT files with Lingo.dev CLI.

## Demo

Try the [interactive demo](https://lingo.dev/demo) to see SRT localization in action.

## Step 1. Get an API key

Sign up for an account at [Lingo.dev](https://lingo.dev) and get your API key from the dashboard.

## Step 2. Initialize a Lingo.dev project

```bash
npx lingo.dev@latest init
```

## Step 3. Configure the translation pipeline

At a minimum:

- Define the bucket (in this case, the "srt" bucket)
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
    "srt": {
      "include": ["./[locale]/*.srt"]
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

```srt
1
00:00:01,000 --> 00:00:03,500
This subtitle text is localized

2
00:00:04,000 --> 00:00:06,500
Multiple lines of subtitle text
are also localized
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
    "srt": {
      "include": [
        "./[locale]/example.srt"
      ]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Input (source locale)

```srt
1
00:00:01,000 --> 00:00:03,500
This subtitle text is localized

2
00:00:04,000 --> 00:00:06,500
Multiple lines of subtitle text
are also localized

3
00:00:07,000 --> 00:00:09,500
Special characters like émojis 🎬 are localized

4
00:00:10,000 --> 00:00:12,500
Numbers in text like "5 minutes" are localized

5
00:00:13,000 --> 00:00:15,500
HTML tags in <i>subtitle text</i> are localized
```

### Output (target locale)

```srt
1
00:00:01,000 --> 00:00:03,500
Este texto de subtítulo está localizado

2
00:00:04,000 --> 00:00:06,500
Múltiples líneas de texto de subtítulo
también están localizadas

3
00:00:07,000 --> 00:00:09,500
Caracteres especiales como émojis 🎬 están localizados

4
00:00:10,000 --> 00:00:12,500
Números en el texto como "5 minutos" están localizados

5
00:00:13,000 --> 00:00:15,500
Las etiquetas HTML en <i>texto de subtítulo</i> están localizadas
```

## Localization reference

### What is localized

- Subtitle text content
- Multi-line subtitle text blocks
- Text containing special characters and emojis
- HTML formatting tags within subtitle text
- Numbers and text within subtitle content

### What isn't localized

- Sequential subtitle IDs (1, 2, 3, etc.)
- Timing information (start and end timestamps)
- Time format structure (HH:MM:SS,mmm --> HH:MM:SS,mmm)
- SRT file format structure and spacing

## Bucket-specific features

The SRT loader provides specialized handling for video subtitle files:

- **Timing preservation**: All timestamp information is preserved exactly, ensuring subtitles remain synchronized with video content
- **Sequential ID maintenance**: Subtitle sequence numbers are maintained to preserve playback order
- **Multi-line support**: Subtitle entries spanning multiple lines are properly handled while preserving line breaks
- **HTML tag support**: Basic HTML formatting tags (like `<i>`, `<b>`) within subtitle text are preserved and the content is localized
- **Format compliance**: Output maintains strict SRT format compliance for compatibility with video players and editing software

## Next steps

Learn about other file formats:
- [Markdown localization](https://lingo.dev/docs/markdown)
- [JSON localization](https://lingo.dev/docs/json)
- [XML localization](https://lingo.dev/docs/xml)