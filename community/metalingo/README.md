# MetaLingo — Translate comments and text in your code

MetaLingo is a VS Code extension that translates comments and selected text in your source files using the Lingo.dev API. It gives you an inline preview before applying changes, so you can confidently localize documentation and in‑code comments without disrupting your flow.

> Note: MetaLingo translates comments and common docstring/triple‑quoted blocks; it does not rewrite executable code.

## Features

- Translate selected text in the editor with an inline Apply/Cancel preview
- Translate all comments/docstrings in the active file in one shot, with a single Apply
- Quick language picker including: English (en), Hindi (hi), Spanish (es), French (fr), German (de), Chinese (zh), Japanese (ja), Russian (ru), Portuguese (pt), Arabic (ar)
- Works across common comment styles: `// …`, `/* … */`, `# …`, and Python‑style triple quotes `""" … """` / `''' … '''`

## Requirements

- VS Code 1.105.0 or newer
- Internet connection
- Lingo.dev API key
  - Configure via Settings: `metalingo.lingoApiKey`

## Getting started

1. Set your Lingo.dev API key

- Open VS Code Settings and set `metalingo.lingoApiKey`
- Alternatively, the extension will prompt for your key on first use and store it in global settings

2. Translate

- Translate selection: select some text, then run “MetaLingo: Translate Selected Text”
- Translate file comments: open a file and run “MetaLingo: Translate Entire File Comments”
- Pick a target language when prompted
- Review the inline preview and click Apply or Cancel

## Commands

These are available in the Command Palette:

- MetaLingo: Translate Selected Text (`metalingo.translateSelection`)
- MetaLingo: Translate Entire File Comments (`metalingo.translateFile`)

Tip: You can also set your API key anytime via Settings (`metalingo.lingoApiKey`).

## Extension settings

This extension contributes the following settings:

- `metalingo.lingoApiKey` (string): Your Lingo.dev API key. Required.
- `metalingo.targetLanguage` (string, default: `hi`): Default target language code (e.g., `hi`, `es`, `fr`). Currently, you’ll still be prompted to pick a language on each run; this default may be used by future flows.

## How it works (high level)

- Selection translation sends just the selected text to Lingo.dev and previews the result inline.
- File translation scans the current document for comments/docstrings (line, block, hash, and triple‑quoted blocks), translates those snippets, and offers a one‑click Apply to update them in place.

Privacy note: Only the selected text or extracted comment/docstring blocks are sent to Lingo.dev for translation.

## Development

Prerequisites: Node.js 18+ and npm.

- Build once: this runs type‑checking, linting, and bundles the extension
  - npm run compile
- Watch mode during development (VS Code Tasks):
  - Tasks: Run Build Task → “watch” (runs TypeScript type‑check + esbuild in watch mode)
- Run tests:
  - npm test

Useful scripts (from `package.json`):

- `compile` — type‑check, lint, and bundle via esbuild
- `watch` — parallel watch for `tsc` and `esbuild`
- `test` — run VS Code extension tests

## Release notes

### 0.0.1

- Initial release with selection translation, full‑file comment/docstring translation, language picker, and inline Apply/Cancel preview.

## Troubleshooting

- “Lingo.dev API key not set” — Add your key in Settings (`metalingo.lingoApiKey`) and retry.
- If nothing happens on translate commands, ensure an editor is active and you’ve selected text (for selection mode) or opened a file (for file mode).

## License

MIT
