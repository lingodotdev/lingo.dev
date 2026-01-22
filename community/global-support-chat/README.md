# Global Support Chat Demo

A real-time multilingual customer support dashboard built with Next.js 16, Tailwind v4, and **Lingo.dev**.

## Overview
This application simulates a support agent dashboard where:
- The agent speaks English.
- The customers speak various languages (Spanish, German, Japanese, etc.).
- **Lingo.dev SDK** translates messages in real-time.
- **Ollama** (optional) powers AI simulated responses in the customer's native language.

## Features Highlights
- **Real-time Translation**: Instant translation of bidirectional chat using Lingo.dev.
- **Hybrid AI Simulation**: Uses local LLMs to generate context-aware foreign language replies.
- **Modern UI**: Built with Tailwind CSS v4 and React 19.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Run Locally**:
    ```bash
    pnpm dev
    ```
    Open http://localhost:3000.

3.  **AI Setup (Optional)**:
    To enable the AI responses, ensure you have [Ollama](https://ollama.ai/) running:
    ```bash
    ollama serve
    ollama pull qwen3:4b
    ```
    Then toggle "AI Responses" in the UI.

4.  **Lingo API Key (Optional)**:
    For best translation quality, create a `.env.local` file:
    ```
    LINGO_API_KEY=your_key_here
    ```
    (The app works with mock fallbacks without a key).

## Tech Stack
-   **Framework**: Next.js 16 (App Router)
-   **Styling**: Tailwind CSS v4
-   **Translation**: Lingo.dev SDK (via API routes)
-   **AI**: Ollama
