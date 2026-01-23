## GlobSEO - Multilingual SEO Analyzer

Hey! Submitting my project for the community showcase.

### What it does

GlobSEO analyzes website metadata and translates it to 15+ languages using Lingo.dev. It's basically an SEO tool that helps you optimize content for global audiences. You enter a URL, pick your target languages, and get translated metadata with SEO scores and ready-to-use code snippets.

Main features:
- Scrapes metadata from any website (titles, descriptions, OG tags, etc.)
- Translates everything using Lingo.dev's API
- AI-powered SEO scoring with Gemini
- Generates HTML meta tags and JSON-LD
- Social media card previews
- Redis caching to avoid hammering the API

### How to run it

```bash
# Backend
cd backend
npm install
npm run install-browsers
cp .env.example .env
# Add your LINGODOTDEV_API_KEY and GEMINI_API_KEY to .env
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

You'll need a Lingo.dev API key and a Gemini API key. Redis is optional but recommended for caching.

### Lingo.dev integration

The main use case is batch translating SEO metadata across multiple languages. Here's the core implementation:

```javascript
// Translating title, description, keywords for each target language
const translations = await Promise.all(
  targetLanguages.map(async (lang) => {
    return await translateContent(
      { title, description, keywords },
      lang,
      lingoApiKey
    );
  })
);
```

I'm also using:
- Smart caching to reduce API calls (checks cache before translating)
- Batch translation for multiple text fields at once
- i18n file generation for the frontend
- Proper error handling with fallbacks

The whole translation pipeline is in `backend/utils/lingo-translate.js` if you want to check out the implementation details.

### Screenshots

![Main UI](./assets/screenshots/image.png)
![Japanese Translation](./assets/screenshots/jp.png)
![Social Cards](./assets/screenshots/card.png)

### Tech stack

React 19 + TypeScript + Vite on the frontend, Node.js + Express on the backend. Using Playwright for scraping, Lingo.dev for translations, and Gemini for AI analysis.

The app is production-ready with proper environment configuration, rate limiting, and error handling.

---

Related to the community launch campaign. Let me know if you need anything else!
