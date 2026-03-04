# Translation Server

The Lingo.dev translation server provides on-demand translation generation during development and build time.

## Overview

The translation server is automatically started by the bundler plugins (Vite, Webpack, Next.js) during development. It serves translations via HTTP endpoints and caches results to disk.

### Key Features

**Automatic port detection** - Finds available port starting from 60000 (or the one configured as the start port)
**Server reuse** - Reuses existing server if already running on the same port with same configuration
**Real-time updates** - Notifies connected clients via WebSockets when translations are updated

## Files

```
translation-server/
├── translation-server.ts              # Main HTTP & WebSocket server implementation
├── cli.ts                             # Standalone CLI to start server manually
├── logger.ts                          # Server-specific logging utilities
├── ws-events.ts                       # WebSocket event types for realtime communication with dev widget
└── README.md
```

## Usage

The plugin automatically starts the translation server on port 60000 (or the next available port).

See the [Development](#development) section for details on starting the server manually.

## API Endpoints

### Health Check

```http
GET /health
```

Returns server status and configuration hash.

**Response:**

```json
{
  "port": "http://127.0.0.1:60000",
  "configHash": "a1b2c3d4e5f6"
}
```

### Full Dictionary

```http
GET /translations/:locale
```

Returns all translations for the specified locale. Triggers translation for any missing entries in metadata.

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

Returns translations for specific hashes. Triggers translation for any requested hashes that are not yet in cache.

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

```json
{
  "models": "lingo.dev"
}
```

Requires: `LINGODOTDEV_API_KEY` environment variable

**2. Custom LLM Models**

```json
{
  "models": {
    "en:es": "google:gemini-2.0-flash",
    "*:*": "groq:llama3-8b-8192"
  }
}
```

Requires: Provider-specific API keys (GROQ_API_KEY, GOOGLE_API_KEY, etc.)

**3. Pseudotranslator (Dev/Testing)**

```json
{
  "dev": {
    "usePseudotranslator": true
  }
}
```

No API key required. Outputs pseudolocalized text (e.g., "Hello" → "Ĥéĺĺó").

## Development

### Testing the Server Locally

The main purpose of running the translation server locally is to uncouple the process from the bundler startup which could be tricky.

From the demo project root directory. e.g. `demos/new-compiler-next16` run
```bash
pnpm tsx ../../packages/new-compiler/src/translation-server/cli.ts --port 3456 --target-locales "es,fr,de,ja" --source-locale "en"  --source-root app --lingo-dir ".lingo"
```

Make sure there the `--lingo-dir` option is set to the same directory as in the project settings, and the same for the `--source-root` option.

Set the url returned in logs to the lingo config

```js
export const config = {
  // Other config options...
  dev: {
    usePseudotranslator: true,
    translationServerUrl: "http://127.0.0.1:3456"
  }
}
```

### Server Logs

The translation server writes logs to both:

1. **Console output** - Standard console output
2. **Log file** - `.lingo/translation-server.log` (relative to the project root)

The log file includes:

- Timestamped entries
- Log levels (debug, info, warn, error)
- Full request/response traces in debug mode

**View logs:**

```bash
# Tail the log file
tail -f .lingo/translation-server.log

# Windows (PowerShell)
Get-Content .lingo/translation-server.log -Wait -Tail 50
```

## Troubleshooting

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::60000`

**Solutions:**

1. The server automatically finds the next available port if 60000 is taken.
2. Use CLI with `--port` option to specify a different port.
3. Check if an old server is still running: `lsof -i :60000` (Unix) or `netstat -ano | findstr :60000` (Windows).

## Performance

### Caching Strategy

1. **Disk cache** - `.lingo/cache/{locale}.json`
2. **Cache-first** - Check cache before translating
3. **Lazy loading** - Only translate missing hashes
4. **Metadata reload** - Reloads metadata on dictionary requests to ensure fresh entries
