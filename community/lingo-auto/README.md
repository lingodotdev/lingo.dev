# Lingo Page Translator

A Chrome Extension (Manifest v3) that translates web pages using the Lingo.dev API.

## Features

- Translate entire web pages to English, Hindi, Japanese, or Spanish
- Secure API key storage using Chrome's local storage
- Only translates visible text (ignores scripts, styles, hidden elements)
- Minimal, clean popup UI
- No auto-translation - only translates when you click the button

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this directory (`Lingo-auto`)

## Setup

1. Click the extension icon in your Chrome toolbar
2. Enter your Lingo.dev API key in the input field
3. Select your target language from the dropdown
4. Click "Translate Page" to translate the current page

## API Configuration

The extension uses the Lingo.dev API endpoint. If the default endpoint doesn't work, you may need to adjust the API URL and request format in `background.js`.

**Current configuration:**
- Endpoint: `https://api.lingo.dev/v1/translate`
- Authorization: `Bearer {apiKey}` header
- Request body: `{ text: "...", target_language: "..." }`
- Expected response: `{ translated_text: "..." }` or similar

**To adjust the API:**
1. Open `background.js`
2. Modify the `apiUrl` variable
3. Adjust headers and request body format as needed
4. Update response parsing based on your API's response format

## File Structure

- `manifest.json` - Extension configuration
- `popup.html` - Popup UI structure
- `popup.css` - Popup styling
- `popup.js` - UI logic and settings management
- `content.js` - Text extraction and replacement on web pages
- `background.js` - Service worker for API calls

## Security

- API keys are stored securely in `chrome.storage.local`
- API keys are never logged or hardcoded
- No data is sent to any server except Lingo.dev API

## Notes

- The extension requires icon files (`icon16.png`, `icon48.png`, `icon128.png`) for proper display. You can create simple placeholder icons or download free icons.
- Translation happens in chunks to handle large pages efficiently
- Only visible text nodes are translated (scripts, styles, and hidden elements are ignored)
