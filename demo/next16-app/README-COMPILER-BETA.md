# Next.js 16 + Compiler-Beta Demo

This demo app showcases the `@lingo.dev/_compiler-beta` package integration with Next.js 16 and Turbopack.

## What's Configured

### 1. Dependencies

The app includes the compiler-beta package:

```json
{
  "dependencies": {
    "@lingo.dev/_compiler-beta": "workspace:*"
  }
}
```

### 2. Next.js Configuration

The `next.config.ts` is configured to use the compiler-beta loader:

```typescript
experimental: {
  turbo: {
    rules: {
      "*.{tsx,jsx}": {
        loaders: [{
          loader: "@lingo.dev/_compiler-beta/loader",
          options: {
            sourceRoot: "./app",
            lingoDir: ".lingo",
            sourceLocale: "en",
            useDirective: false,
            isDev: process.env.NODE_ENV !== "production",
          },
        }],
        as: "*.js",
      },
    },
  },
}
```

### 3. Test Page

Visit `/compiler-test` to see a demonstration page with various text elements that will be transformed.

## Running the Demo

### Development Mode

```bash
# From the monorepo root
pnpm --filter next16-app dev

# Then visit:
# http://localhost:3000/compiler-test
```

### With Compiler-Beta Watch Mode

For active development on compiler-beta:

**Terminal 1: Watch compiler-beta**

```bash
pnpm --filter @lingo.dev/_compiler-beta dev
```

**Terminal 2: Run Next.js app**

```bash
pnpm --filter next16-app dev
```

This setup allows you to:

1. Make changes to compiler-beta source
2. See automatic rebuilds
3. Refresh the Next.js app to see changes

## What Happens During Transformation

### Before Transformation

```tsx
export default function Page() {
  return <h1>Hello World</h1>;
}
```

### After Transformation

```tsx
import { useTranslation } from "@lingo.dev/runtime";

export default function Page() {
  const t = useTranslation();
  return <h1>{t("a1b2c3d4e5f6")}</h1>;
}
```

### Generated Metadata

Check `.lingo/metadata.json` after building:

```json
{
  "version": "0.1",
  "entries": {
    "a1b2c3d4e5f6": {
      "sourceText": "Hello World",
      "context": {
        "componentName": "Page",
        "filePath": "app/page.tsx",
        "line": 3,
        "column": 12
      },
      "hash": "a1b2c3d4e5f6",
      "addedAt": "2025-01-17T10:00:00.000Z"
    }
  }
}
```

## Checking the Output

### 1. View Metadata

After running the dev server, check:

```bash
cat .lingo/metadata.json
```

You should see all the translatable text from the components.

### 2. Inspect Network Tab

Open DevTools → Network → Check the JavaScript bundles to see the transformed code.

### 3. Build Logs

Watch for console output during development:

```
✨ Lingo: Found 2 translatable text(s) in app/compiler-test/page.tsx
```

## Testing Different Scenarios

### Scenario 1: Simple Text

```tsx
export function Simple() {
  return <div>This will be transformed</div>;
}
```

### Scenario 2: Multiple Elements

```tsx
export function Multiple() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
      <span>Another text</span>
    </div>
  );
}
```

### Scenario 3: With Directive Mode

Change `next.config.ts`:

```typescript
options: {
  useDirective: true, // Now requires 'use i18n' directive
}
```

Then in your component:

```tsx
"use i18n";

export function WithDirective() {
  return <div>Only this file will be transformed</div>;
}
```

## Configuration Options

Edit `next.config.ts` to customize:

| Option         | Description                     | Default       |
| -------------- | ------------------------------- | ------------- |
| `sourceRoot`   | Root directory for source files | `"./app"`     |
| `lingoDir`     | Directory for metadata          | `".lingo"`    |
| `sourceLocale` | Source language                 | `"en"`        |
| `useDirective` | Require 'use i18n' directive    | `false`       |
| `isDev`        | Development mode                | Auto-detected |

## Troubleshooting

### Transformations Not Working

1. **Check loader is configured**:

   - Review `next.config.ts`
   - Ensure experimental.turbo.rules is set

2. **Rebuild compiler-beta**:

   ```bash
   pnpm --filter @lingo.dev/_compiler-beta build
   ```

3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   pnpm dev
   ```

### Metadata Not Generated

1. **Check .lingo directory exists**:

   ```bash
   ls -la .lingo/
   ```

2. **Check file permissions**:

   - Ensure the loader can write to the project directory

3. **Enable debug logging**:
   - Add console.log statements to the loader
   - Check terminal output

### TypeScript Errors

If you see TypeScript errors about `useTranslation`:

```typescript
// Create a stub file: types/lingo-runtime.d.ts
declare module "@lingo.dev/runtime" {
  export function useTranslation(): (hash: string) => string;
}
```

## What's Next

The current implementation:

- ✅ Transforms plain JSX text
- ✅ Generates metadata with hashes
- ✅ Works with Turbopack in Next.js 16

Coming soon:

- [ ] Runtime library for translation lookup
- [ ] Translation API integration
- [ ] Server Component support
- [ ] JSX attribute transformation

## Links

- [Compiler-Beta README](../../packages/compiler-beta/README.md)
- [Development Guide](../../packages/compiler-beta/DEV.md)
- [Examples](../../packages/compiler-beta/EXAMPLE.md)
- [Quick Start](../../packages/compiler-beta/QUICKSTART.md)
