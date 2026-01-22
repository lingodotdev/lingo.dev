# DevFolio Global

A modern, high-performance developer portfolio template that demonstrates the power of the **Lingo.dev Compiler**.

This project showcases how to build a fully internationalized (i18n) Next.js application **without manually wrapping text in translation functions**.

## Features

* **Zero-Runtime i18n:** Built using the Lingo.dev Compiler.
* **Instant Translation:** Switch between English, Spanish, French, and Japanese.
* **Modern Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS.

## How to Run Locally

1.  **Navigate to the project:**
    ```bash
    cd community/devfolio-global
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Lingo.dev:**
    * Get your API key from [lingo.dev](https://lingo.dev).
    * Create a `.env.local` file in this directory:
    ```env
    LINGODOTDEV_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit `http://localhost:3000` and try the language switcher!

## Lingo.dev Integration

This project uses the `@lingo.dev/compiler`. No manual `t()` functions were used in the code. The compiler automatically extracts hardcoded text from the React components and generates translations at build time.

Check `next.config.ts` and `lingo.json` to see the configuration.