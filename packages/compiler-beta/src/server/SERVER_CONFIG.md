# Translation Server Configuration Guide

The translation server now supports dynamic translator configuration. You can choose between PseudoTranslator (testing) or LCPTranslator (production AI translations).

## Quick Start

### Pseudolocalization (Default)

```bash
node packages/compiler-beta/src/server/start-server.ts
```

### Real AI Translations (Lingo.dev)

```bash
export LINGODOTDEV_API_KEY=your_key
node packages/compiler-beta/src/server/start-server.ts --translator lcp --models "lingo.dev"
```

### Custom LLM Provider

```bash
export GOOGLE_API_KEY=your_key
node packages/compiler-beta/src/server/start-server.ts --translator lcp --models '{"*:*":"google:gemini-2.0-flash"}'
```

## Configuration Options

| Option            | Type          | Default       | Description                 |
| ----------------- | ------------- | ------------- | --------------------------- |
| `--translator`    | `pseudo\|lcp` | `pseudo`      | Type of translator to use   |
| `--models`        | string/JSON   | `"lingo.dev"` | Model configuration for LCP |
| `--prompt`        | string        | -             | Custom translation prompt   |
| `--port`          | number        | `3456`        | Starting port number        |
| `--source-root`   | path          | `./app`       | Source code directory       |
| `--lingo-dir`     | path          | `.lingo`      | Lingo files directory       |
| `--source-locale` | string        | `en`          | Source locale code          |

## Environment Variables

```env
# Lingo.dev Engine
LINGODOTDEV_API_KEY=your_key

# Or direct LLM providers
GOOGLE_API_KEY=your_key
GROQ_API_KEY=your_key
OPENROUTER_API_KEY=your_key
MISTRAL_API_KEY=your_key
```

## Examples

See full examples in the SERVER_CONFIG.md file in this directory.
