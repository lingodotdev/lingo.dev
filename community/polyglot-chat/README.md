# 🌐 PolyglotChat

> Real-time multilingual chat community powered by **Lingo.dev**

PolyglotChat is a Reddit-style community platform where language is no longer a barrier. Users can post in their native language, and every message is instantly translated into the viewer's preferred language using the Lingo.dev SDK.

![PolyglotChat Demo](https://placehold.co/1200x600/1a1a1b/ff4500?text=PolyglotChat+Demo)

## ✨ Features

- **Decentralized Language**: Speak your native tongue; understand everyone.
- **Real-time Translation**: Instant message localization using **Lingo.dev SDK**.
- **Translation Memory (TM)**: Sub-millisecond lookup for common phrases via Upstash Redis.
- **Smart Fallback**: Seamlessly switches between Lingo.dev, Gemini 2.0, and mock data.
- **Reddit-Style UI**: Modern dark mode interface with upvoting, sorting, and user avatars.
- **Moderation**: AI-powered content moderation to flag spam and harmful content.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Translation**: [Lingo.dev SDK](https://lingo.dev) (Primary), Gemini 2.0 (Fallback)
- **Cache**: Upstash Redis (Translation Memory)
- **Styling**: Vanilla CSS (Reddit-style Theme)

## 🚀 Lingo.dev Integration

This project demonstrates the power of **Lingo.dev** for building global applications.

### 1. Runtime Translation (SDK)

We use the `@lingo.dev/sdk` to translate chat messages on the fly. Key integration points:

- **Endpoint**: `https://engine.lingo.dev/i18n`
- **Workflow**: Generates a unique `workflowId` for request tracking.
- **Context**: Sends `source` and `target` locales along with the text payload.

```typescript
// Example Lingo.dev Call
const response = await fetch("https://engine.lingo.dev/i18n", {
  method: "POST",
  body: JSON.stringify({
    params: { workflowId: crypto.randomUUID(), fast: true },
    locale: { source: "en", target: "es" },
    data: { text: "Hello world" },
  }),
});
```

### 2. Build-Time Localization (CLI)

For static content (like documentation and marketing pages), we use the `@lingo.dev/cli`.

- **Config**: `lingo.config` defines content buckets (e.g., `docs/**/*.md`).
- **Extraction**: `npx @lingo.dev/cli extract` pulls strings from source files.
- **Translation**: `npx @lingo.dev/cli push` sends content to the Lingo.dev engine.
- **Generation**: `npx @lingo.dev/cli pull` retrieves localized assets for build.

### 3. Benefits Used

- **Consistency**: Unified terminology across the app.
- **Performance**: Static pages are pre-translated; dynamic content is cached.
- **SEO**: Each language gets proper metadata and URL structure (for static pages).

## ⚡ Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/lingo-dev/lingo-community-hackathon.git
   cd polyglot-chat-lingo-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Renamed `.env.example` to `.env` and add your keys:

   ```env
   LINGO_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   UPSTASH_REDIS_REST_URL=your_url
   UPSTASH_REDIS_REST_TOKEN=your_token
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
├── app/                  # Next.js App Router
│   ├── api/translate/    # Translation API (Lingo.dev + Fallbacks)
│   ├── chat/             # Reddit-style Feed Page
│   └── page.tsx          # 3D Spline Landing Page
├── lib/
│   ├── llm-adapter.ts    # Central translation logic (Lingo.dev SDK)
│   └── upstash.ts        # Redis Translation Memory
├── components/           # UI Components (Badges, Cards)
└── public/               # Static assets
```

## 🤝 Contributing

Built for the **Lingo.dev Community Hackathon**. PRs are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

_Powered by [Lingo.dev](https://lingo.dev)_
