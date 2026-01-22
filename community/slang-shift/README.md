# SlangShift

SlangShift is a small Next.js app that demonstrates why **localization is not translation**.

Paste slang-heavy English (abbreviations, memes, emojis), pick a target language, and choose a tone. The app returns:

- A **literal** (word-for-word) translation for comparison
- A **culturally-adapted** localization that preserves intent + vibes
- A short explanation and “highlight” callouts for slang/emoji meaning

## Run Locally

Prereqs: Node.js (recommended: 18+), npm.

1. Install dependencies

```bash
npm install
```

2. (Recommended) Configure your Lingo.dev API key

Create a `.env.local` file in the project root:

```bash
LINGODOTDEV_API_KEY=YOUR_API_KEY
```

If you don’t set `LINGODOTDEV_API_KEY`, the app runs in **demo mode** and returns mock translations so you can still click around.

3. Start the dev server

```bash
npm run dev
```

4. Open the app

Visit http://localhost:3000

## Lingo.dev Features Highlighted

This project is intentionally built to show off practical Lingo.dev usage (see the API route in `app/api/translate/route.ts`):

- **SDK Engine**: Uses `LingoDotDevEngine` from `lingo.dev/sdk`.
- **Text localization by locale**: Calls `localizeText()` with `sourceLocale` and `targetLocale`.
- **Context-aware localization**: Prepends tone/culture context (Casual / Gen‑Z / Formal) so the result is localized, not just translated.
- **Literal vs localized comparison**: Generates a literal translation and a contextualized localization side-by-side to make the difference obvious.
- **Safe demo fallback**: Returns a mock response when no API key is configured (useful for demos and CI).

## Tech Stack

- Next.js (App Router) + Route Handler (`/api/translate`)
- React + TypeScript
- Tailwind CSS
- Framer Motion
