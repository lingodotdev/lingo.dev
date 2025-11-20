# Translation Server

A standalone HTTP server for serving translations during development and build time.

## Features

- **Automatic Port Discovery**: Finds a free port automatically (starting from 3456)
- **Simple HTTP API**: GET endpoints for translations
- **Reuses Translation Logic**: Uses the same middleware as Vite/Next.js
- **Lightweight**: Built on Node.js `http` module, no external dependencies

## API Endpoints

### Health Check

```
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "port": 3456
}
```

### Get Full Dictionary

```
GET /translations/:locale
```

**Example:**

```bash
curl http://127.0.0.1:3456/translations/de
```

**Response:**

```json
{
  "version": 0.1,
  "locale": "de",
  "files": {
    "__metadata": {
      "entries": {
        "abc123": "Hallo Welt",
        "def456": "Willkommen"
      }
    }
  }
}
```

### Get Single Translation

```
GET /translations/:locale/:hash
```

**Example:**

```bash
curl http://127.0.0.1:3456/translations/de/abc123
```

**Response:**

```json
{
  "hash": "abc123",
  "locale": "de",
  "translation": "Hallo Welt"
}
```

**404 Response (hash not found):**

```json
{
  "error": "Translation not found",
  "hash": "invalid_hash",
  "locale": "de"
}
```

## Programmatic Usage

### Basic Example

```typescript
import { startTranslationServer } from "@lingo.dev/_compiler-beta/server";

const server = await startTranslationServer({
  startPort: 3456,
  config: {
    sourceRoot: "./app",
    lingoDir: ".lingo",
    sourceLocale: "en",
    translator: "pseudo",
    allowProductionGeneration: true,
  },
  onReady: (port) => {
    console.log(`Server running on port ${port}`);
  },
  onError: (error) => {
    console.error("Server error:", error);
  },
});

// Get the port
console.log("Port:", server.getPort());

// Check if running
console.log("Running:", server.isRunning());

// Stop the server
await server.stop();
```

### Using the TranslationServer Class

```typescript
import { TranslationServer } from "@lingo.dev/_compiler-beta/server";

const server = new TranslationServer({
  startPort: 3456,
  config: {
    sourceRoot: "./src",
    lingoDir: ".lingo",
    sourceLocale: "en",
    translator: "pseudo",
    allowProductionGeneration: true,
  },
});

// Start server
const port = await server.start();
console.log(`Server started on port ${port}`);

// Server is now running
// Make HTTP requests to http://127.0.0.1:${port}/translations/:locale

// Stop when done
await server.stop();
```

## Standalone Script

You can also run the server as a standalone process:

```bash
# From the compiler-beta directory
npx tsx src/server/start-server.ts

# With custom options
npx tsx src/server/start-server.ts \
  --port 3500 \
  --source-root ./src \
  --lingo-dir .translations \
  --source-locale en \
  --translator pseudo
```

**Options:**

- `--port <number>`: Starting port (default: 3456)
- `--source-root <path>`: Source root directory (default: ./app)
- `--lingo-dir <path>`: Lingo directory (default: .lingo)
- `--source-locale <locale>`: Source locale (default: en)
- `--translator <type>`: Translator type (default: pseudo)
- `--help, -h`: Show help message

## Testing

Run the test suite:

```bash
cd packages/compiler-beta
npx tsx test-server.ts
```

This will:

1. Start the server
2. Test all endpoints
3. Verify responses
4. Stop the server

## Architecture

The server:

- Binds to `127.0.0.1` (localhost only) for security
- Enables CORS for browser requests
- Reuses `shared-middleware.ts` for translation generation
- Caches translations to `.lingo/cache/*.json`
- Automatically finds available ports using TCP probing

## Port Discovery

The server tries ports sequentially starting from `startPort`:

1. Tries port 3456 (default)
2. If in use, tries 3457
3. Continues up to 100 ports
4. Throws error if no port available

## Security

- **Localhost Only**: Server binds to `127.0.0.1` only
- **No Authentication**: Suitable for local development only
- **CORS Enabled**: Allows browser requests from any origin

⚠️ **Warning**: This server is designed for local development only. Do not expose it to public networks.

## Integration with Bundlers

This server is designed to be started by bundler plugins:

### Vite Plugin Example

```typescript
export function lingoPlugin(config) {
  let server;

  return {
    name: "lingo-compiler",

    async buildStart() {
      server = await startTranslationServer({
        startPort: 3456,
        config: config,
      });

      // Inject port as global
      const port = server.getPort();
      defineGlobal("__LINGO_SERVER_PORT__", port);
    },

    async buildEnd() {
      await server.stop();
    },
  };
}
```

### Next.js Loader Example

```typescript
export function turbopackLoader(source, loaderContext) {
  // Start server on first load
  if (!globalServer) {
    globalServer = await startTranslationServer({
      /* ... */
    });
  }

  // Transform code and inject port
  const port = globalServer.getPort();
  // ...
}
```

## Error Handling

The server handles errors gracefully:

- **Port in use**: Tries next port automatically
- **Translation errors**: Returns 500 with error message
- **Missing metadata**: Returns 500 with ENOENT error
- **Invalid endpoints**: Returns 404 with available endpoints

All errors are logged to console with `[lingo.dev]` prefix.

## Performance

- **Cache hits**: < 1ms (read from disk)
- **Cache miss**: Depends on translator (pseudo: ~10-50ms)
- **Port probe**: < 5ms per port tested

## Future Enhancements

Potential improvements:

- In-memory cache layer (avoid disk reads)
- Keep-alive connections (HTTP/2)
- Process management utilities (PID file, auto-restart)
- Metrics endpoint (cache hit rate, request count)
- Batch translation endpoint (multiple hashes at once)
