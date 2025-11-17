# @lingo.dev/\_compiler-beta

Beta version of the Lingo.dev compiler with automatic translation support.

This package provides a Babel-based loader for Turbopack/Webpack that automatically transforms React components to inject translation calls. It uses a hash-based metadata system to track translatable text across your application.

## Features

- 🔄 **Automatic JSX text transformation** - Automatically detects and transforms translatable text in JSX
- 📝 **Hash-based metadata** - Generates unique hashes for each translatable text based on content, component name, and file path
- 🎯 **Opt-in or automatic** - Configure whether to require `'use i18n'` directive or transform all files
- 🔌 **Turbopack/Webpack compatible** - Works as a standard loader
- 🏗️ **Reusable architecture** - Core logic separated from loader for future Vite support
- 📊 **Metadata tracking** - Maintains `.lingo/metadata.json` with all translatable content

## Installation

```bash
pnpm add @lingo.dev/_compiler-beta
```

## Usage with Turbopack (Next.js 16+)

### 1. Configure Next.js

```javascript
// next.config.js
module.exports = {
  turbopack: {
    rules: {
      "*.{tsx,jsx}": {
        loaders: [
          {
            loader: "@lingo.dev/_compiler-beta/loader",
            options: {
              sourceRoot: "./src", // Root directory of source code
              lingoDir: ".lingo", // Directory for metadata
              sourceLocale: "en", // Source language
              useDirective: false, // Set to true to require 'use i18n' directive
              skipPatterns: [/node_modules/, /\.spec\./], // Files to skip
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};
```

### 2. (Optional) Use directive mode

If you set `useDirective: true`, add the directive to files you want to translate:

```tsx
"use i18n";

export function MyComponent() {
  return <div>This text will be translated</div>;
}
```

### 3. Write components normally

```tsx
// src/components/Welcome.tsx
export function Welcome() {
  return (
    <div>
      <h1>Welcome to our site</h1>
      <p>This text will be automatically translated</p>
    </div>
  );
}
```

### 4. Build and see transformations

After build, the code will be transformed to:

```tsx
import { useTranslation } from "@lingo.dev/runtime";

export function Welcome() {
  const t = useTranslation();
  return (
    <div>
      <h1>{t("a1b2c3d4e5f6")}</h1>
      <p>{t("f6e5d4c3b2a1")}</p>
    </div>
  );
}
```

And metadata will be saved to `.lingo/metadata.json`:

```json
{
  "version": "0.1",
  "entries": {
    "a1b2c3d4e5f6": {
      "sourceText": "Welcome to our site",
      "context": {
        "componentName": "Welcome",
        "filePath": "src/components/Welcome.tsx",
        "line": 4,
        "column": 10
      },
      "hash": "a1b2c3d4e5f6",
      "addedAt": "2025-01-17T10:00:00.000Z"
    },
    "f6e5d4c3b2a1": {
      "sourceText": "This text will be automatically translated",
      "context": {
        "componentName": "Welcome",
        "filePath": "src/components/Welcome.tsx",
        "line": 5,
        "column": 10
      },
      "hash": "f6e5d4c3b2a1",
      "addedAt": "2025-01-17T10:00:00.000Z"
    }
  },
  "stats": {
    "totalEntries": 2,
    "lastUpdated": "2025-01-17T10:00:00.000Z"
  }
}
```

## Programmatic API

You can also use the transformation functions directly:

```typescript
import {
  transformComponent,
  loadMetadata,
  saveMetadata,
  generateTranslationHash,
  type LoaderConfig,
} from "@lingo.dev/_compiler-beta";

// Transform a component
const config: LoaderConfig = {
  sourceRoot: "./src",
  lingoDir: ".lingo",
  sourceLocale: "en",
};

const metadata = await loadMetadata(config);

const result = transformComponent({
  code: `export function Hello() { return <div>Hello World</div>; }`,
  filePath: "src/Hello.tsx",
  config,
  metadata,
});

console.log(result.code); // Transformed code
console.log(result.newEntries); // New translation entries found

// Save updated metadata
if (result.newEntries && result.newEntries.length > 0) {
  const updatedMetadata = upsertEntries(metadata, result.newEntries);
  await saveMetadata(config, updatedMetadata);
}
```

## Architecture

The compiler-beta is designed with a reusable architecture:

- **`src/types.ts`** - TypeScript types and interfaces
- **`src/utils/hash.ts`** - Hash generation utilities
- **`src/metadata/manager.ts`** - Metadata file management
- **`src/transform/babel-plugin.ts`** - Core Babel AST transformation
- **`src/transform/index.ts`** - High-level transformation API
- **`src/loader.ts`** - Turbopack/Webpack loader wrapper

This separation allows the core transformation logic to be reused for other bundlers (e.g., Vite) in the future.

## Configuration Options

| Option         | Type       | Default                                    | Description                   |
| -------------- | ---------- | ------------------------------------------ | ----------------------------- |
| `sourceRoot`   | `string`   | `process.cwd()`                            | Root directory of source code |
| `lingoDir`     | `string`   | `'.lingo'`                                 | Directory for Lingo files     |
| `sourceLocale` | `string`   | `'en'`                                     | Source language code          |
| `useDirective` | `boolean`  | `false`                                    | Require 'use i18n' directive  |
| `isDev`        | `boolean`  | Auto-detect                                | Development mode flag         |
| `skipPatterns` | `RegExp[]` | `[/node_modules/, /\.spec\./, /\.test\./]` | Patterns to skip              |

## How It Works

1. **Detection**: Scans JSX files for React components
2. **Extraction**: Finds plain text JSX children (e.g., `<div>Hello</div>`)
3. **Hashing**: Generates unique hash from `sourceText + componentName + filePath`
4. **Transformation**: Replaces text with `{t("hash")}`
5. **Injection**: Adds `const t = useTranslation()` to component
6. **Metadata**: Saves entry to `.lingo/metadata.json`

## Limitations (Current Version)

- Only transforms **plain text** JSX children (no nested elements yet)
- Skips text with only whitespace/newlines
- Requires manual runtime setup (TranslationProvider, etc.)
- Client components only (Server Component support coming)

## Roadmap

- [x] Hash-based metadata system
- [x] Babel transformation plugin
- [x] Turbopack loader
- [ ] Server Component detection and transformation
- [ ] Vite plugin support
- [ ] Runtime library integration
- [ ] Translation API integration (hybrid LCP)
- [ ] JSX attribute translation (alt, title, placeholder)
- [ ] Nested JSX content support

## Contributing

This is a beta package under active development. Feedback and contributions are welcome!

## License

ISC
