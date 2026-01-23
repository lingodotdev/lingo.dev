# Lingo.dev MCP Integration Documentation

## Overview

This document explains how the **Lingo.dev MCP (Model Context Protocol)** integration is implemented in CodeBridge to provide AI-powered translation for code comments, README files, and documentation.

## What is Lingo.dev MCP?

Lingo.dev MCP uses AI-powered translation engines to provide context-aware, high-quality translations that:

- **Preserve code formatting** and syntax
- **Understand technical terminology** in software development
- **Maintain markdown formatting** in documentation
- **Auto-detect source languages** for better accuracy
- **Batch process** multiple items efficiently

## Architecture

### Translation Service (`src/services/translator.js`)

The core translation service initializes the Lingo.dev SDK and provides translation functions:

```javascript
import { LingoDotDevEngine } from "lingo.dev/sdk";

// Initialize engine with API key
const lingoEngine = new LingoDotDevEngine({
  apiKey: import.meta.env.VITE_LINGO_API_KEY,
  batchSize: 100,
  idealBatchItemSize: 1000,
});
```

### Key Features

#### 1. **README Translation**

Translates entire markdown documents while preserving formatting:

```javascript
const translated = await translateReadme(markdown, "es");
```

#### 2. **Code Comment Translation**

Extracts and translates code comments in batch:

```javascript
const translatedComments = await translateComments(comments, "ja");
```

#### 3. **Locale Mapping**

Maps UI language codes to Lingo.dev locale codes:

- `en` → `en-US`
- `es` → `es-ES`
- `fr` → `fr-FR`
- `ja` → `ja-JP`
- `hi` → `hi-IN`

## Setup Instructions

### 1. Get Your Lingo.dev API Key

1. Visit [lingo.dev](https://lingo.dev)
2. Sign up or log in to your account
3. Navigate to API settings
4. Generate a new API key

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
# Lingo.dev API Key for MCP translation
VITE_LINGO_API_KEY=your_actual_api_key_here

# Optional: GitHub token for higher rate limits
VITE_GITHUB_TOKEN=your_github_token_here
```

### 3. Start Development Server

```bash
npm install
npm run dev
```

The app will automatically detect if the API key is configured and show the status in the header.

## Usage

### Translating README Files

1. Load any GitHub repository
2. Select a README.md file
3. Choose your target language from the header dropdown
4. Click the **"Translate"** button
5. View the translated content with preserved markdown formatting

### Translating Code Comments

1. Load a code file (`.js`, `.py`, `.java`, etc.)
2. Select your target language
3. Click **"Translate"**
4. The system will:
   - Extract all comments using language-specific parsers
   - Batch translate them via Lingo.dev MCP
   - Inject translations back into the code
   - Display the result with syntax highlighting

### Switching Languages

Click the language selector in the header to change the UI language. This affects:

- All UI text (via Lingo.dev CLI translations)
- Target language for content translation

## API Methods Used

### `localizeText(text, params)`

Translates a single text string with AI-powered intelligence.

**Parameters:**

- `text` (string): Text to translate
- `params.sourceLocale` (string|null): Source language or null for auto-detect
- `params.targetLocale` (string): Target language code
- `params.fast` (boolean): Use fast mode (we use `false` for quality)

### `localizeStringArray(strings, params)`

Batch translates multiple strings efficiently.

**Parameters:**

- `strings` (string[]): Array of strings to translate
- `params`: Same as `localizeText`

**Benefits:**

- Single API call for multiple items
- Better context understanding
- Lower latency than multiple individual calls

## Error Handling

The implementation includes robust error handling:

1. **SDK Not Initialized**: Shows user-friendly message with setup instructions
2. **Translation Errors**: Falls back to original content with error notification
3. **Network Issues**: Gracefully degrades with console logging
4. **Invalid Input**: Validates text before sending to API

## Performance Optimizations

### 1. Batch Processing

Uses `localizeStringArray` to translate multiple comments in one API call.

### 2. Smart Caching

- Translation results could be cached in localStorage (future enhancement)
- Reduces API calls for frequently viewed files

### 3. Conditional Translation

- Only translates when target language ≠ English
- Skips empty or whitespace-only content

### 4. Efficient Comment Parsing

Uses regex patterns optimized for each programming language.

## Supported Languages

### UI Languages (Lingo.dev CLI)

- English (en)
- Spanish (es)
- French (fr)
- Japanese (ja)
- Hindi (hi)

### Programming Languages (Comment Parsing)

- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- PHP
- Ruby
- Go
- Rust
- HTML/CSS

## Code Examples

### Example 1: Translating a README

```javascript
import { translateReadme } from "./services/translator";

const markdown = `# My Project\nThis is a great project!`;
const translated = await translateReadme(markdown, "ja");
// Returns: "# 私のプロジェクト\nこれは素晴らしいプロジェクトです！"
```

### Example 2: Translating Code Comments

```javascript
import { extractComments } from "./utils/codeParser";
import { translateComments } from "./services/translator";

const code = `
// Calculate the total sum
function sum(a, b) {
  return a + b;
}
`;

const comments = extractComments(code, "javascript");
const translated = await translateComments(comments, "es");
// Returns: comments with translatedText: "Calcular la suma total"
```

## Visual Feedback

### MCP Status Indicator

The header shows a live status badge:

- ✅ **"Lingo.dev MCP"** (Green): Translation API is active
- ⚠️ **"MCP Inactive"** (Orange): API key not configured

Hover over the badge to see the configuration status.

## Troubleshooting

### Issue: "MCP Inactive" Badge Shows

**Solution:**

1. Check if `.env` file exists
2. Verify `VITE_LINGO_API_KEY` is set correctly
3. Ensure the key is not the placeholder value
4. Restart dev server after adding the key

### Issue: Translation Fails

**Check:**

- API key is valid and not expired
- Internet connection is stable
- API usage limits not exceeded
- Console for specific error messages

### Issue: Comments Not Detected

**Reasons:**

- File language not supported
- Comments use non-standard syntax
- File is minified or obfuscated

## Future Enhancements

1. **Translation Caching**: Store translations in IndexedDB
2. **Offline Mode**: Use cached translations when offline
3. **Custom Glossaries**: Allow users to define technical term mappings
4. **Translation History**: Track and review past translations
5. **Export Translated Files**: Download translated README/docs

## Technical Details

### Translation Quality Settings

We use `fast: false` for all translations to ensure:

- High-quality, context-aware results
- Proper handling of technical terminology
- Accurate preservation of formatting

For production deployments with high volume, consider:

- Implementing a caching layer
- Using `fast: true` for non-critical content
- Setting up translation rate limiting

### API Rate Limits

Lingo.dev API may have rate limits depending on your plan:

- Free tier: Check lingo.dev documentation
- Paid tiers: Higher limits available

The implementation includes error handling for rate limit responses.

## Resources

- [Lingo.dev Official Site](https://lingo.dev)
- [Lingo.dev Documentation](https://lingo.dev/docs)
- [GitHub Repository](https://github.com/lingodotdev/lingo.dev)
- [MCP Specification](https://modelcontextprotocol.io)

## Support

For issues related to:

- **MCP Integration**: Check this documentation and console logs
- **Lingo.dev API**: Contact lingo.dev support
- **CodeBridge App**: Open an issue on the project repository

---

**Last Updated**: 2026-01-22  
**Version**: 1.0.0  
**Author**: CodeBridge Team
