# lingo-docs

A CLI tool to translate markdown documentation to multiple languages using [Lingo.dev](https://lingo.dev).

Perfect for open-source maintainers who want to make their README and docs accessible to international users.

## What it does

```bash
lingo-docs translate example/SAMPLE.md --langs es,ja
```

```
╭───────────────────────────────── lingo-docs ─────────────────────────────────╮
│ SAMPLE.md → es, ja                                                           │
╰──────────────────────────── Powered by Lingo.dev ────────────────────────────╯

        Translation Results
┏━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Language ┃ Output File  ┃ Status ┃
┡━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━┩
│ Español  │ SAMPLE.es.md │ ✓      │
│ 日本語   │ SAMPLE.ja.md │ ✓      │
└──────────┴──────────────┴────────┘
```

**Features:**
- Translates markdown files while preserving code blocks
- Generates language selector badges for your README
- Supports many languages (see table below)
- Clean, focused CLI with beautiful output

## Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (recommended) or pip
- Lingo.dev API key (free tier: 10,000 translated words/month)

## Setup

1. Clone and navigate to this directory:
   ```bash
   cd community/lingo-docs
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```
   Or with pip:
   ```bash
   pip install -e .
   ```

3. Get your Lingo.dev API key:
   - Sign up or log in at https://lingo.dev/en/auth?redirect=%2Fen%2Fapp
   - Navigate to Project Settings → API Keys
   - Click "Create API Key" and copy the generated key

4. Set up environment:
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

## Usage

**Translate a file to multiple languages:**
```bash
lingo-docs translate README.md --langs es,ja,zh-CN
```

**Specify source language (default: en):**
```bash
lingo-docs translate README.md --langs fr,de --source en
```

**Add language selector badge to original file:**
```bash
lingo-docs translate README.md --langs es,ja --badge
```

This adds a badge like:
```
[English](README.md) | [Español](README.es.md) | [日本語](README.ja.md)
```

**Generate badge without translating:**
```bash
lingo-docs badge example/SAMPLE.md --langs es,ja,zh-CN
```

```
╭─────────────────────────────── Language Badge ───────────────────────────────╮
│ [English](SAMPLE.md) | [Español](SAMPLE.es.md) | [日本語](SAMPLE.ja.md) |    │
│ [简体中文](SAMPLE.zh-CN.md)                                                  │
╰─────────────────────────────── For SAMPLE.md ────────────────────────────────╯
```

## Supported Languages

| Code | Language | Code | Language |
|------|----------|------|----------|
| en | English | ja | 日本語 |
| es | Español | ko | 한국어 |
| fr | Français | zh-CN | 简体中文 |
| de | Deutsch | zh-TW | 繁體中文 |
| pt | Português | ar | العربية |
| it | Italiano | hi | हिन्दी |
| ru | Русский | nl | Nederlands |

And more...

## Lingo.dev Features Demonstrated

- **[Python SDK](https://lingo.dev/en/sdk/python)**: Uses `LingoDotDevEngine` for AI-powered translation
- **Async Translation**: Leverages async/await for efficient API calls
- **Context Preservation**: Maintains markdown structure and code blocks during translation

## Example

See the `example/` directory for a sample README you can test with:

```bash
lingo-docs translate example/SAMPLE.md --langs es,ja --badge
```

## License

MIT
