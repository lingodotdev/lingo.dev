# MetaLingo Extension Quickstart

This guide helps you build, run, test, and package MetaLingo — an extension that translates comments and selected text using the Lingo.dev API.

## Project structure

| Path                         | Purpose                                           |
| ---------------------------- | ------------------------------------------------- |
| `package.json`               | Extension manifest (commands, settings, scripts). |
| `src/extension.ts`           | Activation + command registrations and UI flow.   |
| `src/translator.ts`          | Lingo.dev integration and API key handling.       |
| `src/codeExtractor.ts`       | Comment/docstring extraction logic.               |
| `src/codelensPreview.ts`     | Inline preview decoration + Apply/Cancel flow.    |
| `src/test/extension.test.ts` | Sample test suite (Mocha).                        |
| `esbuild.cjs`                | Build script (bundles to `dist/extension.js`).    |

## Prerequisites

- Node.js 18+
- VS Code 1.105.0+
- Lingo.dev API key (for translation commands)

## Install dependencies

```bash
npm install
```

## Build

One-off build (type‑check, lint, bundle):

```bash
npm run compile
```

Watch mode (recommended while coding):

```bash
npm run watch
```

This runs `tsc --watch` (type errors) and `esbuild` (bundle) in parallel.

## Launch & debug

1. Press `F5` (Run Extension) to open a new Extension Development Host.
2. Run a command from the Command Palette:
   - `MetaLingo: Translate Selected Text`
   - `MetaLingo: Translate Entire File Comments`
3. Set breakpoints in any `src/*.ts` file; use the Debug Console for logs.

## Configure settings

Open Settings → search “MetaLingo”:

- `metalingo.lingoApiKey`: Set your API key (prompted automatically on first use if empty).
- `metalingo.targetLanguage`: Default language code (currently not auto‑used; you’ll still be prompted each run).

## Commands overview

| Command                                   | ID                             | Description                                                       |
| ----------------------------------------- | ------------------------------ | ----------------------------------------------------------------- |
| MetaLingo: Translate Selected Text        | `metalingo.translateSelection` | Translates current selection and shows inline preview.            |
| MetaLingo: Translate Entire File Comments | `metalingo.translateFile`      | Translates all detected comments/docstrings in the active editor. |

## Running tests

Run once:

```bash
npm test
```

Behind the scenes this compiles tests (`out/`), builds the extension, lints, then runs VS Code test runner.

Watch test compilation (optional while adding tests):

```bash
npm run watch-tests
```

Add new test files under `src/test/` with the pattern `*.test.ts`.

## Packaging for release

Create a production bundle:

```bash
npm run package
```

Output: `dist/extension.js` (minified, sourcemap disabled). Publish with `vsce` (not yet in devDependencies).

## Lingo.dev integration notes

- Only the selected text or extracted comment/docstring content is sent for translation.
- Failures surface a VS Code error message; original text remains unchanged.

## Common development tasks

| Task             | Script                |
| ---------------- | --------------------- |
| Type check only  | `npm run check-types` |
| Lint sources     | `npm run lint`        |
| Build production | `npm run package`     |

## Contributing ideas

Potential enhancements:

- Use `metalingo.targetLanguage` automatically if set (skip prompt).
- Add activation events & command contribution for `metalingo.setApiKey`.
- Provide diff view instead of inline decorations for large files.

## Troubleshooting

| Symptom                 | Fix                                                                           |
| ----------------------- | ----------------------------------------------------------------------------- |
| “API key not set”       | Set `metalingo.lingoApiKey` in Settings or rerun command and enter key.       |
| No preview appears      | Ensure an active editor and a non‑empty selection (for selection command).    |
| Comments not translated | Check file uses supported comment styles (`//`, `/* */`, `#`, triple quotes). |

## Next steps / Publishing

1. Add missing activation events in `package.json` (e.g. `onCommand:metalingo.translateSelection`).
2. Run `vsce package` (after installing `vsce`) to create a `.vsix`.
3. Publish to Marketplace following VS Code docs.

## Reference

VS Code API types: `node_modules/@types/vscode/index.d.ts`

Enjoy building with MetaLingo!
