# @lingo.dev/compiler

See the main [README](../README.md) for general information.

## Structure

The compiler is organized into several key modules:

### Core Directories

#### `src/plugin/` - Build-time transformation

- **`transform/`** - Babel AST transformation logic for JSX text extraction
- **`unplugin.ts`** - Universal plugin implementation (Vite, Webpack)
- **`next.ts`** - Next.js-specific plugin with Turbopack and Webpack support
- **`build-translator.ts`** - Batch translation generation at build time
- **`virtual-modules-code-generator.ts`** - Generates code for virtual modules, dev config and locale resolvers for client and server

#### `src/metadata/` - Translation metadata management

- **`manager.ts`** - CRUD operations for `.lingo/metadata.json`
- Thread-safe metadata file operations with file locking
- Manages translation entries with hash-based identifiers

#### `src/translators/` - Translation provider abstraction

- **`lcp/`** - Lingo.dev Engine integration
- **`pseudotranslator/`** - Development-mode fake translator
- **`pluralization/`** - Automatic ICU MessageFormat detection
- **`translator-factory.ts`** - Provider selection and initialization

#### `src/translation-server/` - Development server

- **`translation-server.ts`** - HTTP server for on-demand translations
- **`cli.ts`** - Standalone CLI for translation generation
- WebSocket support for real-time dev widget updates
- Port management (60000-60099 range)

#### `src/react/` - Runtime translation hooks

- **`client/`** - Client-side Context-based hooks
- **`server/`** - Server component cache-based hooks (isomorphic)
- **`server-only/`** - Async server-only API (`getServerTranslations`)
- **`shared/`** - Shared utilities (RichText rendering, Context)
- **`next/`** - Next.js-specific middleware and locale switcher

#### `src/utils/` - Shared utilities

- **`hash.ts`** - Stable hash generation for translation keys
- **`config-factory.ts`** - Configuration defaults and merging
- **`logger.ts`** - Structured logging utilities
- **`path-helpers.ts`** - File path resolution

#### `src/widget/` - Development widget

- In-browser translation editor overlay for development mode

### Support Directories

#### `tests/` - End-to-end testing

- **`e2e/`** - Playwright tests for full build workflows
- **`fixtures/`** - Test applications (Vite, Next.js)
- **`helpers/`** - Test utilities and assertions

#### `benchmarks/` - Performance benchmarks

- Translation speed benchmarks
- Metadata I/O performance tests

#### `old-docs/` - Legacy documentation

- Historical design documents and notes

### Entry Points

- **`src/index.ts`** - Main package exports (plugins, types)
- **`src/types.ts`** - Core TypeScript types

## Contributing

This is a beta package under active development. Feedback and contributions are welcome!

## License

ISC
