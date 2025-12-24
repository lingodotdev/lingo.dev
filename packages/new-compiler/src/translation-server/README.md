# Translation Server

The Lingo.dev translation server provides on-demand translation generation during development.

## Overview

The translation server is automatically started by the bundler plugins (Vite, Webpack, Next.js) during development. It serves translations via HTTP endpoints and caches results to disk.

## Architecture

### Two Implementations

1. **Raw HTTP Server** (`translation-server.ts`) - Original implementation
2. **Hono Server** (`translation-server-hono.ts`) - **Recommended** modern implementation ✨

See [HONO_COMPARISON.md](./HONO_COMPARISON.md) for detailed comparison.

### Key Features

✅ **Automatic port detection** - Finds available port starting from 60000
✅ **Server reuse** - Reuses existing server if already running
✅ **Built-in timeouts** - Prevents hanging requests (Hono only)
✅ **Global error handling** - Catches all errors automatically (Hono only)
✅ **Metadata reload** - Always uses latest translation entries
✅ **Multiple translation providers** - Lingo.dev, Groq, Google, OpenRouter, Mistral, Ollama

## Files

```
translation-server/
├── translation-server.ts              # Raw HTTP implementation
├── translation-server-hono.ts         # Hono implementation (recommended)
├── cli.ts                             # Standalone CLI
├── README.md                          # This file
├── CLI.md                             # CLI documentation
├── HONO_COMPARISON.md                 # Implementation comparison
├── lingo.config.example.json          # Example config (Lingo.dev)
└── lingo.config.llm.example.json      # Example config (custom LLMs)
```

## Usage

### Option 1: Automatic (Bundler Plugin)

**Next.js:**

```typescript
// next.config.ts
import { withLingo } from "@lingo.dev/compiler/next";

export default withLingo(
  { reactStrictMode: true },
  {
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
  },
);
```

**Vite:**

```typescript
// vite.config.ts
import { lingoPlugin } from "@lingo.dev/compiler/vite";

export default {
  plugins: [
    lingoPlugin({
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
    }),
  ],
};
```

The plugin automatically starts the translation server on port 60000.

### Option 2: Standalone CLI

The CLI can automatically detect and read your existing Next.js or Vite configuration:

```bash
# Auto-detects next.config.ts or vite.config.ts in current directory
npx lingo-translation-server

# Override specific options
npx lingo-translation-server --port 3456 --use-pseudo

# Use explicit config file (legacy)
npx lingo-translation-server --config ./lingo.config.json
```

**Auto-detection order:**

1. Explicit `--config` file if provided
2. Auto-detect `next.config.ts` / `vite.config.ts`
3. Defaults + CLI options

See [CLI.md](./CLI.md) for complete CLI documentation.

## API Endpoints

### Health Check

```http
GET /health
```

Returns server status and uptime.

**Response:**

```json
{
  "status": "ok",
  "port": "http://127.0.0.1:60000",
  "uptime": 123.45,
  "memory": { ... }
}
```

### Full Dictionary

```http
GET /translations/:locale
```

Returns all translations for the specified locale.

**Response:**

```json
{
  "locale": "es",
  "translations": {
    "abc123": "Hola Mundo",
    "def456": "Bienvenido"
  },
  "errors": []
}
```

### Batch Translation

```http
POST /translations/:locale
Content-Type: application/json

{
  "hashes": ["abc123", "def456"]
}
```

Returns translations for specific hashes.

**Response:**

```json
{
  "locale": "es",
  "translations": {
    "abc123": "Hola Mundo",
    "def456": "Bienvenido"
  },
  "errors": []
}
```

## Configuration

### Translation Providers

**1. Lingo.dev Engine (Recommended)**

```typescript
{
  models: "lingo.dev";
}
```

Requires: `LINGODOTDEV_API_KEY` environment variable

**2. Custom LLM Models**

```typescript
{
  models: {
    "es": "groq:llama3-70b",
    "fr": "google:gemini-pro",
    "de": "openrouter:anthropic/claude-3-haiku"
  }
}
```

Requires: Provider-specific API keys (GROQ_API_KEY, GOOGLE_API_KEY, etc.)

**3. Pseudotranslator (Dev/Testing)**

```typescript
{
  dev: {
    usePseudotranslator: true;
  }
}
```

No API key required. Outputs pseudolocalized text (e.g., "Hello" → "Ĥéĺĺó").

### Timeouts

All timeouts are configurable via `DEFAULT_TIMEOUTS` in `utils/timeout.ts`:

| Operation          | Default | Configurable          |
| ------------------ | ------- | --------------------- |
| File I/O           | 10s     | Yes                   |
| Metadata load/save | 15s     | Yes                   |
| AI API calls       | 60s     | Yes                   |
| HTTP requests      | 30s     | Yes (CLI `--timeout`) |
| Server startup     | 30s     | Yes                   |

## Development

### Testing the Server Locally

```bash
# Quick start with defaults
pnpm server

# Show help
pnpm server:help

# With options
pnpm server -- --port 3456 --use-pseudo
```

### Server Logs

The translation server writes logs to both:

1. **Console output** - Standard console.log output
2. **Log file** - `.lingo/translation-server.log`

The log file includes:

- Timestamped entries
- All log levels (debug, info, warn, error)
- Formatted JSON objects
- Full request/response traces

**View logs:**

```bash
# Tail the log file
tail -f .lingo/translation-server.log

# Windows (PowerShell)
Get-Content .lingo/translation-server.log -Wait -Tail 50
```

**Note:** The log file is appended to on each server start, so you may want to clear it periodically:

```bash
# Unix
rm .lingo/translation-server.log

# Windows
del .lingo\translation-server.log
```

### Switching to Hono Implementation

The loader already uses Hono by default (see `dev-server-loader.ts`):

```typescript
import { startOrGetTranslationServerHono } from "../translation-server/translation-server-hono";

const server = await startOrGetTranslationServerHono({ ... });
```

## Troubleshooting

### Port Already in Use

**Problem:** `Error: Port 60000 is already in use`

**Solutions:**

1. The plugin automatically finds the next available port
2. Or use CLI with `--port` option to specify a different port
3. Check if an old server is still running: `lsof -i :60000` (Unix) or `netstat -ano | findstr :60000` (Windows)

### Compilation Freezes When Switching Locale

**Fixed!** We added comprehensive timeouts to prevent hanging:

1. ✅ File I/O operations timeout after 10-15s
2. ✅ AI API calls timeout after 60s
3. ✅ HTTP requests timeout after 30s
4. ✅ Server startup times out after 30s
5. ✅ Hono provides global request timeout

See commit history and `utils/timeout.ts` for implementation.

### Metadata Not Found

**Normal!** Metadata is created during file transformation. The server will work once you:

1. Start your dev server
2. Files get transformed by the bundler
3. Metadata is generated in `.lingo/metadata.json`

## Migration Guide

### From Raw HTTP to Hono

Already done in `dev-server-loader.ts`! If you have custom code:

**Before:**

```typescript
import { startOrGetTranslationServer } from "./translation-server";
const { server, url } = await startOrGetTranslationServer(options);
```

**After:**

```typescript
import { startOrGetTranslationServerHono } from "./translation-server-hono";
const { server, url } = await startOrGetTranslationServerHono(options);
```

Same API, drop-in replacement! ✨

## Performance

### Caching Strategy

1. **Disk cache** - `.lingo/cache/{locale}.json`
2. **Cache-first** - Check cache before translating
3. **Lazy loading** - Only translate missing hashes
4. **Metadata reload** - Ensures fresh entries on every request

### Translation Speed

Typical times (100 entries):

- **Pseudotranslator**: ~100ms (instant)
- **Cached**: ~50ms (disk read)
- **Lingo.dev Engine**: ~2-5s (API call)
- **LLM (Groq/Google)**: ~3-10s (API call)

## Security Notes

⚠️ **Development Only**

This server is NOT designed for production:

- No authentication
- Binds to localhost only
- No rate limiting
- No request validation (beyond basics)
- Regenerates on every request

For production, use build-time translation generation (automatic in Next.js plugin).

## Related Documentation

- [CLI.md](./CLI.md) - Standalone CLI usage
- [HONO_COMPARISON.md](./HONO_COMPARISON.md) - Implementation comparison
- [../README.md](../README.md) - Main compiler documentation
- [lingo.config.example.json](./lingo.config.example.json) - Example config
