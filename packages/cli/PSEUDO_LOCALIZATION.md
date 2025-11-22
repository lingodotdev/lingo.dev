# Pseudo-Localization Mode

## Overview

Pseudo-localization is a testing technique that helps developers verify that their applications are ready for internationalization (i18n) without waiting for actual translations. Instead of using real translated text, pseudo-localization automatically replaces characters with accented versions and adds visual markers.

This is a standard practice used by Google, Microsoft, and Mozilla in their localization pipelines.

## When to Use

Pseudo-localization is ideal for:

- **Early UI Testing**: Test your UI before translations are complete
- **Layout Issue Detection**: Identify truncation, overflow, and text expansion problems
- **CI/CD Integration**: Validate i18n readiness in continuous integration pipelines
- **Development Workflow**: Catch i18n issues before deployment
- **Rapid Iteration**: Quickly test UI changes without external API calls

## Usage

### Via CLI

Run the localization pipeline in pseudo-localization mode:

```bash
pnpx lingo.dev run --pseudo
```

This will:

1. Extract all translatable strings from your source code
2. Pseudo-translate them by replacing characters with accented versions
3. Write the pseudo-translated strings to your target locale files
4. Mark each pseudo-translation with a **⚡** symbol for easy identification

### Example

**Input files:**
```jsx
// app.jsx
<>
  <h1>Submit</h1>
  <p>Welcome back!</p>
</>
```

**Output with `--pseudo` flag:**
```json
// en-XA/messages.json
{
  "submit": "Šûbmíţ⚡",
  "welcome_back": "Ŵèļçømèƀäçķ!⚡"
}
```

## How It Works

### Character Replacement

Each ASCII letter is replaced with a visually similar accented character:

| Original | Replacement | Original | Replacement |
|----------|-------------|----------|-------------|
| a        | ã           | A        | Ã           |
| e        | è           | E        | È           |
| i        | í           | I        | Í           |
| o        | ø           | O        | Ø           |
| u        | û           | U        | Û           |
| s        | š           | S        | Š           |
| t        | ţ           | T        | Ţ           |

And so on for all letters. Non-alphabetic characters (numbers, punctuation, spaces) are preserved as-is.

### Visual Marker

A ⚡ symbol is appended to each pseudo-translated string, making it immediately visible which text has been pseudo-localized.

## Configuration

Currently, pseudo-localization only supports the `--pseudo` CLI flag. Support for configuration in `i18n.json` is planned for a future release.

## Key Features

✅ **No External API Calls**: Run completely offline
✅ **Instant Feedback**: Pseudo-translate instantly without waiting
✅ **Character Replacement**: Uses accent-based character mapping (en-XA style)
✅ **Visual Markers**: Easy to identify pseudo-translated strings
✅ **Recursive Object Handling**: Works with nested structures and arrays
✅ **Preserves Structure**: Maintains JSON/object structure and types

## What Pseudo-Localization Tests

### ✅ Catches These Issues

- **Text Truncation**: UI elements that cut off text
- **Layout Overflow**: Components that break with longer text
- **Font Support**: Missing glyph support for special characters
- **Text Direction**: Issues with RTL content (though accents don't change direction)
- **String Concatenation**: Hardcoded text that should be translatable
- **Placeholder Text**: Missing localization in form fields or labels

### ❌ Does NOT Replace

- **Actual Translation**: Pseudo-localization is for testing, not production use
- **Translation Memory**: Use Lingo.dev or other providers for real translations
- **Quality Assurance**: Manual review of actual translations is still needed
- **Cultural Adaptation**: Different cultures have different needs beyond character replacement

## Advanced Usage

### Combining with Other Flags

```bash
# Pseudo-localize only specific locales
pnpx lingo.dev run --pseudo --target-locale es --target-locale fr

# Pseudo-localize only specific buckets
pnpx lingo.dev run --pseudo --bucket json --bucket yaml

# Pseudo-localize specific files
pnpx lingo.dev run --pseudo --file messages.json --file labels.json

# Force re-pseudo-translation
pnpx lingo.dev run --pseudo --force
```

### With Watch Mode

```bash
# Automatically pseudo-translate when files change
pnpx lingo.dev run --pseudo --watch
```

## Implementation Details

### Locale Code Convention

Pseudo-localized content uses the special locale code `en-XA` (following Google's convention), where:
- **en** = English (source language)
- **XA** = Pseudo-Accents

This is recognized by many i18n libraries and tools.

### API Usage

For programmatic use, the pseudo-localization functions are available:

```typescript
import { pseudoLocalize, pseudoLocalizeObject } from "lingo.dev/utils";

// Pseudo-localize a single string
const result = pseudoLocalize("Hello World");
// Result: "Ĥèļļø Ŵøŕļð⚡"

// Pseudo-localize an entire object
const messages = { greeting: "hello", farewell: "goodbye" };
const pseudoMessages = pseudoLocalizeObject(messages);
// Result: { greeting: "ĥèļļø⚡", farewell: "ĝøøðßýè⚡" }
```

## Troubleshooting

### My UI still looks fine with pseudo-localization

This might indicate:

- **Hardcoded strings**: Some text might not be extracted properly. Check your extraction configuration.
- **Flexible layouts**: Your UI might be designed to handle text expansion. Good news for i18n!
- **Font issues**: Ensure your font supports accented characters. Test with a web-safe font first.

### The ⚡ marker is being cut off

This is exactly what pseudo-localization is meant to catch! It means:

- Your UI has truncation issues with longer text
- You need to expand text containers or reduce font size for translations
- Consider using `max-width` or `line-clamp` CSS properties carefully

### I want to customize the character mapping

Currently, character mapping is fixed to the en-XA style. For custom mappings, you can use the library functions directly and modify the mapping as needed.

## Examples

### React Component Testing

```jsx
// Before pseudo-localization
<button>{t("submit")}</button>

// After pseudo-localization
<button>Šûbmíţ⚡</button>

// You'll immediately see if the button is too small!
```

### Form Labels

```jsx
// Before
<label>{t("email")}</label>

// After (pseudo-localized)
<label>èmãíļ⚡</label>

// Check for proper alignment and spacing
```

## Performance

Pseudo-localization is extremely fast:

- **No network requests**: Everything happens locally
- **Minimal processing**: Simple character replacement
- **Instant results**: Suitable for development and CI/CD

## Comparison with Alternatives

| Method | Speed | Accuracy | Cost | Configuration |
|--------|-------|----------|------|---------------|
| Pseudo-localization | ⚡ Instant | Simulates expansion | Free | CLI flag only |
| AI Translation | ⏱️ Seconds | Good (OpenAI, etc.) | $ | API key required |
| Human Translation | 🐢 Days | Excellent | $$$$ | Translation service |

## Related Resources

- [Google's Pseudo-translation](https://google.github.io/styleguide/tsqm.html)
- [Mozilla's Pseudo-localization](https://mozilla-l10n.github.io/documentation/tools/pseudo/)
- [i18n Best Practices](https://www.w3.org/International/questions/qa-i18n)

## Next Steps

After pseudo-localizing:

1. **Test your UI**: Navigate your application with pseudo-localized content
2. **Identify issues**: Look for truncated text, overflows, or layout problems
3. **Fix UI**: Adjust CSS, layouts, or text containers as needed
4. **Run actual translations**: Once UI is i18n-ready, use Lingo.dev with real translations
5. **Deploy with confidence**: Your app is now ready for international users!

## Feedback & Issues

Found a bug or have a feature request? Open an issue on [GitHub](https://github.com/LingoDotDev/lingo.dev).
