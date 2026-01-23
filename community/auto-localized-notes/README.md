# Auto-Localized Notes

A demo Next.js application showcasing **lingo.dev SDK** usage for automatic language detection and translation.  
Users can write notes in any language, and the app automatically detects the source language and translates the note into a target language.

This project is intentionally minimal to focus on demonstrating **SDK integration, server/client separation, and real-world usage**, rather than application complexity.

---

## What this project does

- Accepts user input in **any language**
- Detects the input language automatically
- Translates the text into a selected target language
- Displays both:
  - Original text
  - Translated text
- Allows searching notes by translated content

The lingo.dev SDK is used **server-side only** via Next.js Server Actions to ensure correct handling of Node-only dependencies and API keys.

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **lingo.dev SDK**

---

## Prerequisites

Before running this project locally, ensure you have:

- **Node.js** `>= 18`
- **pnpm / npm / yarn**
- A **lingo.dev API key**

### Environment variables

Create a `.env.local` file in the project root:

```env
LINGODOTDEV_API_KEY=your_api_key_here
```

---

## How to run locally

1. Clone the repository

```
git clone <repo-url>
cd auto-localized-notes
```

2. Install dependencies

```
npm install
# or
pnpm install
```

3. Start the development server

```
npm run dev
```

4. Open in browser

```
http://localhost:3000
```
