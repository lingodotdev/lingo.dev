# Transformation Pipeline Overview

## High-Level Flow

The Lingo compiler automatically transforms React components to inject translation calls at build time. Here's how it works:

```
Source JSX → Babel Parser → AST Transformation → Code Generation → Transformed JSX
                                     ↓
                              Metadata Extraction
                                     ↓
                              .lingo/metadata.json
```

## Pipeline Stages

### 1. File Filtering

**Location**: Plugin entry point (`unplugin.ts` or `next.ts`)

**Purpose**: Determine which files should be transformed

**Process**:

- Check file extension: Only `.tsx` and `.jsx` files
- Skip `node_modules` directory
- Apply custom skip patterns if configured
- Check for `"use i18n"` directive if `useDirective` mode enabled

**Output**: Boolean - should this file be transformed?

---

### 2. Code Parsing

**Location**: `transform/index.ts` → `transformComponent()`

**Purpose**: Convert source code into an Abstract Syntax Tree (AST)

**Process**:

- Use `@babel/parser` to parse JSX/TypeScript code
- Enable plugins: `["jsx", "typescript"]`
- Generate AST that can be traversed and modified

**Output**: Babel AST representing the component structure

---

### 3. Component Detection

**Location**: `transform/babel-plugin.ts` → Babel visitors

**Purpose**: Identify React components in the file

**Detection Rules**:

- Function declarations that return JSX
- Arrow functions that return JSX
- Function expressions that return JSX

**Component Types**:

- **Server Components**: Default for all components (unless marked with `"use client"`)
- **Client Components**: Components with `"use client"` directive

---

### 4. Text Extraction

**Location**: `transform/babel-plugin.ts` → `JSXText` visitor

**Purpose**: Find all translatable text in JSX

**What Gets Transformed**:

```jsx
<div>Hello World</div>        // ✅ Transformed
<h1>Welcome!</h1>              // ✅ Transformed
<p>   </p>                     // ❌ Skipped (whitespace only)
<span>{variable}</span>        // ❌ Skipped (expression)
```

**For Each Text Node**:

1. Extract the text content
2. Generate a unique hash based on:
   - Text content
   - Context (Component name, File path)
3. Create metadata entry with context:
   - Source text
   - Context (Component name, File path)
   - Line/column numbers
   - Timestamp

---

### 5. Code Transformation

**Location**: `transform/babel-plugin.ts` → AST modification

**Purpose**: Replace text with translation calls

**Transformations**:

```jsx
// BEFORE
export function Welcome() {
  return <div>Hello World</div>;
}

// AFTER (Server Component)
import { getServerTranslations } from "@lingo.dev/compiler/react/server";
import __lingoMetadata from "./.lingo/metadata.json";

export async function Welcome() {
  const t = await getServerTranslations({
    metadata: __lingoMetadata,
    sourceLocale: "en",
  });
  return <div>{t("a1b2c3d4e5f6", "Hello World")}</div>;
}
```

**Injection Steps**:

1. Add imports at file level:
   - Translation runtime (`getServerTranslations` or `useTranslation`)
   - Metadata JSON file
2. Make component async (server components only)
3. Inject `const t = ...` at component start
4. Replace text nodes with `{t(hash, fallback)}`

---

### 6. Code Generation

**Location**: `transform/index.ts` → `@babel/generator`

**Purpose**: Convert modified AST back to JavaScript code

**Process**:

- Use `@babel/generator` to generate code from AST
- Generate source maps for debugging
- Preserve formatting where possible

**Output**: Transformed source code + source map

---

### 7. Metadata Management

**Location**: `metadata/manager.ts`

**Purpose**: Track all translatable strings across the application

**Metadata Structure**:

```json
{
  "version": "0.1",
  "entries": {
    "a1b2c3d4e5f6": {
      "sourceText": "Hello World",
      "context": {
        "componentName": "Welcome",
        "filePath": "components/Welcome.tsx",
        "line": 3,
        "column": 10
      },
      "hash": "a1b2c3d4e5f6",
      "addedAt": "2025-01-20T10:00:00.000Z"
    }
  },
  "stats": {
    "totalEntries": 1,
    "lastUpdated": "2025-01-20T10:00:00.000Z"
  }
}
```

**Operations**:

- `loadMetadata()`: Read existing metadata
- `upsertEntries()`: Add or update translation entries
- `saveMetadata()`: Write metadata to disk

**Storage**: `{sourceRoot}/.lingo/metadata.json`

---

## Bundler Integration

The transformation pipeline integrates with different bundlers through **unplugin**:

### Universal Plugin Architecture

```
┌─────────────────────────────────────────┐
│          unplugin Core                  │
│  (shared transformation logic)          │
└─────────────────────────────────────────┘
                   │
      ┌────────────┼────────────┬──────────┐
      │            │            │          │
   ┌──▼──┐    ┌───▼───┐   ┌───▼───┐  ┌───▼────┐
   │Vite │    │Webpack│   │Rollup │  │esbuild │
   └─────┘    └───────┘   └───────┘  └────────┘
```

### Plugin Hooks

**buildStart**:

- Start translation server (for dev mode)
- Initialize configuration

**transformInclude**:

- Filter files (tsx/jsx only)
- Skip node_modules

**transform**:

- Run the transformation pipeline
- Update metadata
- Return transformed code

**buildEnd**:

- Pre-generate translations for specified locales
- Shut down translation server

---

## Runtime Integration

After transformation, the runtime provides the actual translation functionality:

### Server Components

```tsx
const t = await getServerTranslations({
  metadata: __lingoMetadata,
  sourceLocale: "en",
});
```

**How it works**:

1. Reads metadata to know what translations are needed
2. Loads translation file for current locale from `.lingo/{locale}.json`
3. Returns `t()` function that maps hashes to translated strings
4. Falls back to source text if translation missing

### Client Components

```tsx
const t = useTranslation();
```

**How it works**:

1. Gets locale from `LingoProvider` context
2. Loads translations from API endpoint or preloaded bundle
3. Returns `t()` function that looks up translations by hash
4. Falls back to source text if translation missing

---

## Translation Generation

When translations are requested for a new locale:

```
Request locale → Check cache → Generate if missing → Return translations
                                      │
                                      ├→ Pseudo: Transform text algorithmically
                                      ├→ LLM: Use AI model to translate
                                      └→ Lingo.dev: Use Lingo.dev Engine
```

**Translation Server**:

- Runs on ports 60000-60099
- Handles on-demand translation generation
- Caches results to `.lingo/{locale}.json`

---

## Key Design Principles

1. **Build-Time Transformation**: All text extraction happens at build time, zero runtime cost for detection

2. **Hash-Based System**: Each translatable string gets a stable hash, allowing translations to persist across code changes

3. **Context-Aware**: Every translation includes context (component, file, location) to help translators

4. **Fallback Safety**: Transformed code includes original text as fallback, so missing translations don't break the app

5. **Metadata-Driven**: Single source of truth (`metadata.json`) tracks all translatable content

6. **Universal Compatibility**: Same transformation logic works across Vite, Webpack, Rollup, esbuild, and Next.js

---

## Example: Full Transformation Flow

```jsx
// 1. ORIGINAL SOURCE
export function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// 2. DETECTION
// - Found component: "Greeting"
// - Found text: "Hello, "
// - Generated hash: "a1b2c3d4e5f6"

// 3. METADATA CREATED
{
  "a1b2c3d4e5f6": {
    "sourceText": "Hello, ",
    "context": { "componentName": "Greeting", "filePath": "src/Greeting.tsx" }
  }
}

// 4. TRANSFORMED OUTPUT
import { getServerTranslations } from "@lingo.dev/compiler/react/server";
import __lingoMetadata from "./.lingo/metadata.json";

export async function Greeting({ name }) {
  const t = await getServerTranslations({
    metadata: __lingoMetadata,
    sourceLocale: "en"
  });
  return <h1>{t("a1b2c3d4e5f6", "Hello, ")}{name}!</h1>;
}

// 5. RUNTIME EXECUTION
// - t("a1b2c3d4e5f6", "Hello, ") looks up translation
// - Returns "Hola, " for Spanish locale
// - Falls back to "Hello, " if translation missing
```

---

## Performance Considerations

- **Caching**: Metadata is loaded once per file transformation
- **Selective Transformation**: Only JSX text nodes are modified, expressions are untouched
- **Parallel Processing**: Each bundler can transform files concurrently
- **Incremental**: Only changed files are retransformed (bundler's responsibility)
- **Source Maps**: Generated to preserve debugging capability

---

## Error Handling

**Parse Errors**: If Babel fails to parse, return original code unchanged

**Transform Errors**: Log error and return original code to avoid breaking builds

**Metadata Errors**: Create empty metadata if file doesn't exist

**Translation Errors**: Runtime falls back to source text if translation fails
