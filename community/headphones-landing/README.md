# LingoBuds Pro - Multimedia Landing Page

A premium product landing page for "LingoBuds Pro" translation headphones, built with Next.js 14, Tailwind CSS, and the Lingo.dev SDK for real-time localization.

## Features

- **Dynamic Content**: All text content is managed via a centralized configuration and translated dynamically.
- **Real-time Translation**: Uses the [Lingo.dev SDK](https://lingo.dev) to automatically translate the landing page into multiple languages using AI.
- **Premium Design**: Modern aesthetic with smooth animations (Reveal on scroll), glassmorphism, and responsive layout.
- **Internationalization**: Simple context-based language switcher that triggers server-side translation.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Localization**: Lingo.dev SDK
- **Animation**: Custom CSS + React Reveal hooks

## Getting Started

1.  **Clone the repository**

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file and add your Lingo.dev API key:
    ```env
    LINGODOTDEV_API_KEY=your_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open in Browser**:
    Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/content.ts`: Central source of truth for all text content.
- `src/actions/translate.ts`: Server Action that calls the Lingo SDK.
- `src/components/TranslationContext.tsx`: Client-side state for current locale and content.
- `src/components/`: UI components (Navbar, Hero, Features, etc.) designed to accept content props.
