# Debugging the Lingo.dev Compiler

Lingo.dev Compiler is in active development. We use it ourselves and strive to provide the best developer experience for all supported frameworks. However, every project is unique and may present its own challenges.

This guide will help you debug the Compiler locally in your project.

---

## Getting Started: Local Setup

### 1. Clone, Install, and Build

```bash
git clone git@github.com:lingodotdev/lingo.dev.git
cd lingo.dev
pnpm install
pnpm build
```

Lingo.dev uses [pnpm](https://pnpm.io/) as its package manager.

### 2. Link the CLI Package

In the `lingo.dev/packages/cli` directory, link the CLI package using your project's package manager:

```bash
npm link
# or
yarn link
# or
pnpm link
```

Use the package manager that matches your project (npm, yarn, or pnpm).

### 3. Watch for Changes

To enable live-reloading for development, run the following in the root of the `lingo.dev` repo:

```bash
pnpm --filter "./packages/{compiler,react}" dev
```

---

## Using Your Local Build in Your Project

### 1. Install Lingo.dev

If you haven't already, add Lingo.dev to your project:

```bash
npm install lingo.dev
```

For full setup and configuration, see the [Lingo.dev Compiler docs](https://lingo.dev/compiler).

### 2. Link Your Local Library

```bash
npm link lingo.dev
```

### 3. Build Your Project

For local development and testing with the Lingo.dev Compiler:

```bash
npm run dev
```

The exact command may vary depending on your project setup and package manager.

---

## Debugging Tips

You can now use your debugger or classic `console.log` statements in the Compiler and React packages to inspect what happens during your project build.

- The Compiler entry point is at `packages/compiler/src/index.ts`.
- The `load` method:
  - Loads and generates `lingo/dictionary.js` using `LCPServer.loadDictionaries`.
- The `transform` method:
  - Applies mutations to process source code (see methods in `composeMutations`).
  - Generates `lingo/meta.json` based on the translatable content in your app.
  - Injects Compiler-related components (`LingoComponent`, `LingoAttributeComponent`).
  - Replaces the `loadDictionary` method with `loadDictionary_internal`.

---

For more details, check out the [Lingo.dev Compiler documentation](https://lingo.dev/compiler) or [join our Discord](https://lingo.dev/go/discord) for help!
