# Development Guide - Next16-App with Compiler-Beta

Quick guide for developing and testing compiler-beta with this demo app.

## Quick Start

### Option 1: Run Demo Only

```bash
# From monorepo root
pnpm --filter next16-app dev

# Visit http://localhost:3000/compiler-test
```

### Option 2: Watch Compiler-Beta + Run Demo

**Terminal 1: Watch compiler-beta for changes**

```bash
pnpm --filter @lingo.dev/_compiler-beta dev
```

**Terminal 2: Run Next.js app**

```bash
pnpm --filter next16-app dev
```

**Terminal 3: (Optional) Watch compiler-beta tests**

```bash
cd packages/compiler-beta
pnpm test:watch
```

## Development Workflow

### Make Changes to Compiler-Beta

1. **Edit source files** in `packages/compiler-beta/src/`
2. **Watch automatic rebuild** in Terminal 1
3. **Refresh browser** to see changes in the demo app

### Example: Add Debug Logging

Edit `packages/compiler-beta/src/transform/babel-plugin.ts`:

```typescript
JSXText(path: NodePath<t.JSXText>, state: any) {
  const text = path.node.value.trim();

  // Add debug logging
  console.log('[COMPILER-BETA] Transforming text:', text);

  // ... rest of the code
}
```

Save → Watch rebuild → Check Next.js terminal for logs

### Test New Transformations

1. **Create a new page** in `demo/next16-app/app/`
2. **Add JSX text** to transform
3. **Run dev server** and see transformation
4. **Check metadata** in `.lingo/metadata.json`

Example test component:

```tsx
// demo/next16-app/app/test/page.tsx
export default function TestPage() {
  return (
    <div>
      <h1>Test Heading</h1>
      <p>Test paragraph</p>
    </div>
  );
}
```

Visit: `http://localhost:3000/test`

## Checking Transformation Results

### 1. View Build Logs

In the Next.js terminal, you should see:

```
✨ Lingo: Found 2 translatable text(s) in app/test/page.tsx
```

### 2. Check Metadata File

```bash
cat demo/next16-app/.lingo/metadata.json
```

Should show all transformed texts with hashes.

### 3. Inspect Transformed Code

The transformed code is in the built bundles. You can:

- Check browser DevTools → Sources
- Look for the injected `useTranslation()` calls
- See `t("hash")` calls instead of plain text

### 4. View in Browser

Open DevTools → Console and you might see transformation logs (if you added debug logging).

## Testing Different Configurations

### Enable Directive Mode

Edit `next.config.ts`:

```typescript
options: {
  useDirective: true, // Require 'use i18n' directive
}
```

Then create a test file:

```tsx
"use i18n";

export default function DirectiveTest() {
  return <div>This WILL be transformed</div>;
}
```

And another without the directive:

```tsx
export default function NoDirective() {
  return <div>This will NOT be transformed</div>;
}
```

### Change Source Root

If you want to transform files outside `app/`:

```typescript
options: {
  sourceRoot: "./",  // Root of the project
}
```

### Add Skip Patterns

```typescript
options: {
  skipPatterns: [
    /node_modules/,
    /\.spec\./,
    /\.test\./,
    /\/ignore-me\//, // Skip specific directory
  ],
}
```

## Troubleshooting

### Transformations Not Happening

**Check 1: Is loader configured?**

```bash
cat demo/next16-app/next.config.ts
```

Should have `experimental.turbo.rules` section.

**Check 2: Is compiler-beta built?**

```bash
ls packages/compiler-beta/build/
```

Should have `index.cjs`, `index.mjs`, etc.

**Check 3: Rebuild compiler-beta**

```bash
pnpm --filter @lingo.dev/_compiler-beta build
```

**Check 4: Clear Next.js cache**

```bash
cd demo/next16-app
rm -rf .next
pnpm dev
```

### No Logs in Terminal

Add debug logging to the loader:

```typescript
// packages/compiler-beta/src/loader.ts
export default async function lingoLoader(
  this: any,
  source: string,
): Promise<void> {
  console.log("[LOADER] Processing file:", this.resourcePath);

  // ... rest of the code
}
```

### Metadata Not Generated

**Check permissions:**

```bash
ls -la demo/next16-app/.lingo/
```

**Manually create directory:**

```bash
mkdir -p demo/next16-app/.lingo
```

**Check loader options:**

```typescript
// In next.config.ts
options: {
  lingoDir: ".lingo", // Should match your directory
}
```

## Performance Tips

### Use Watch Mode Efficiently

- Keep Terminal 1 (compiler-beta watch) always running
- Only restart Terminal 2 (Next.js) when needed
- Use `pnpm dev --turbo` for faster rebuilds

### Skip Unnecessary Files

Configure skip patterns to avoid transforming:

- Test files
- Third-party components
- Static/documentation pages

### Check Build Times

```bash
# With time command
time pnpm --filter next16-app build

# Or check Next.js output
# Look for "Compiled successfully" messages
```

## Common Development Tasks

### Add a New Feature to Compiler-Beta

1. Edit `packages/compiler-beta/src/transform/babel-plugin.ts`
2. Add tests in `.spec.ts` file
3. Run tests: `pnpm test`
4. Test in demo: refresh browser
5. Check `.lingo/metadata.json`

### Debug a Transformation Issue

1. Add `console.log` in babel-plugin.ts
2. Rebuild: automatic in watch mode
3. Restart Next.js dev server
4. Check terminal output
5. Inspect browser DevTools

### Update Loader Options

1. Edit `demo/next16-app/next.config.ts`
2. Restart Next.js dev server (Ctrl+C, then `pnpm dev`)
3. Changes take effect immediately

## File Structure Reference

```
demo/next16-app/
├── app/
│   ├── compiler-test/         # Demo page for compiler-beta
│   │   └── page.tsx
│   ├── page.tsx               # Home page
│   └── layout.tsx
├── .lingo/
│   └── metadata.json          # Generated metadata
├── next.config.ts             # Compiler-beta loader config
├── package.json               # Includes @lingo.dev/_compiler-beta
├── README-COMPILER-BETA.md    # Main README
└── DEVELOPMENT.md             # This file
```

## Next Steps

1. **Browse the test page**: Visit `/compiler-test`
2. **Create new test pages**: Add files to `app/`
3. **Modify compiler-beta**: Edit source in `packages/compiler-beta/src/`
4. **Check metadata**: View `.lingo/metadata.json`
5. **Add features**: Enhance the transformation logic

## Useful Commands

```bash
# Start demo with watch mode
pnpm --filter next16-app dev

# Build demo app
pnpm --filter next16-app build

# Watch compiler-beta
pnpm --filter @lingo.dev/_compiler-beta dev

# Test compiler-beta
pnpm --filter @lingo.dev/_compiler-beta test

# Clean everything and rebuild
pnpm --filter @lingo.dev/_compiler-beta clean
pnpm --filter @lingo.dev/_compiler-beta build
rm -rf demo/next16-app/.next
pnpm --filter next16-app dev
```

---

**Happy coding!** 🚀

For more details:

- [Compiler-Beta README](../../packages/compiler-beta/README.md)
- [Compiler-Beta Dev Guide](../../packages/compiler-beta/DEV.md)
- [Transformation Examples](../../packages/compiler-beta/EXAMPLE.md)
