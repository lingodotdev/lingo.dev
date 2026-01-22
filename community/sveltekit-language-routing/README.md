# Lingo.dev SvelteKit Language Routing

This is an official community boilerplate demonstrating how to integrate the [Lingo.dev JavaScript SDK](https://lingo.dev) into a **SvelteKit** application. It showcases AI-powered real-time translation, language-based routing, and server-side language detection.

## Features

- **Dynamic AI Translation**: Uses `lingo.dev` SDK to translate text and nested objects on-the-fly.
- **Language-Based Routing**: Implements `/[lang]/` patterns (e.g., `/en`, `/es`, `/fr`) using SvelteKit dynamic parameters.
- **Server-Side Language Detection**: Automatically detects user preference via `accept-language` headers and redirects appropriately.
- **Optimized Performance**: Includes a client-side caching layer for both string and object translations.
- **Svelte 5 Runes**: Built using the latest Svelte 5 patterns (`$state`, `$derived`, `$effect`) and `$app/state`.
- **Tailwind CSS**: Pre-configured with Tailwind CSS v4 for modern styling.

## Project Structure

- `src/lib/i18n.ts`: Core translation stores and helpers (`translateText`, `translateObject`).
- `src/routes/api/translate/+server.ts`: Secure server-side endpoint for the Lingo.dev SDK.
- `src/routes/[lang]/`: Dynamic language routes for Home and About pages.
- `src/hooks.server.ts`: Server-side hook to manage the `<html>` lang attribute.
- `src/routes/+page.server.ts`: Root redirect logic for language detection.

## Prerequisites

- **Node.js**: v20.x or higher.
- **Lingo.dev API Key**: Required for AI translations. Get yours at [lingo.dev](https://lingo.dev).

## Getting Started

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Create a `.env` file in the root (see `.env.example`):

    ```env
    LINGODOTDEV_API_KEY=your_api_key_here
    ```

3.  **Run Development Server**:

    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## ⚖️ License & Disclaimer

This project is a community contribution for educational purposes. It is maintained by the community and is intended to showcase integration patterns for Lingo.dev.

---

Part of the [Lingo.dev Community Contributions](https://github.com/lingodotdev/lingo.dev).
