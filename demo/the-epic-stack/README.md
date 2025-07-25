# Lingo.dev Compiler with The Epic Stack

## Introduction

This example demonstrates how to set up [Lingo.dev Compiler](https://lingo.dev/en/compiler/) with [The Epic Stack](https://github.com/epicweb-dev/epic-stack).

## Running this example

To run this example:

1. Set the `LINGODOTDEV_API_KEY` environment variable:

   ```bash
   export LINGODOTDEV_API_KEY="<your_api_key>"
   ```

   To get an API key, sign up for a free account at [lingo.dev](https://lingo.dev).

2. Navigate into this example's directory:

   ```bash
   cd demo/the-epic-stack
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Run the development server:

   ```bash
   pnpm run dev
   ```

5. Navigate to <http://localhost:3000>.

## Changed files

These are the files that were changed to get **Lingo.dev Compiler** up and running:

- [app/routes/_marketing+/index.tsx](./app/routes/_marketing+/index.tsx)
- [app/root.tsx](./app/root.tsx)
- [vite.config.ts](./vite.config.ts)

You can use these files as a reference when setting up the compiler in your own project.
