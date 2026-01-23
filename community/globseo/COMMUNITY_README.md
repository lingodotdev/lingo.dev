# GlobSEO - Multilingual SEO Analyzer

> A professional SEO metadata analyzer with multilingual translation powered by Lingo.dev

![GlobSEO Demo](./assets/screenshots/hero.png)

## 🎯 What This App Does

GlobSEO is a comprehensive SEO analysis tool that helps optimize website metadata for global audiences. It extracts metadata from any website, translates it into 15+ languages using **Lingo.dev's translation SDK**, and provides AI-powered SEO scoring and optimization suggestions.

### Key Features:
- **Instant Metadata Extraction** - Scrapes titles, descriptions, keywords, Open Graph, and Twitter Card data
- **Multilingual Translation** - Translates SEO metadata to 15+ languages via Lingo.dev API
- **Smart Caching** - Redis-backed cache system for optimized performance
- **SEO Scoring** - AI-powered quality analysis with actionable recommendations
- **Social Media Previews** - Live previews of how content appears on Twitter, Facebook, and LinkedIn
- **Schema Markup Generation** - Automatic structured data generation
- **Code Generation** - Ready-to-use HTML meta tags and JSON-LD

## 🚀 How Lingo.dev Powers This App

This project showcases **Lingo.dev's translation capabilities** in a real-world SEO optimization use case:

### 1. **Batch Translation API**
```javascript
// Translating metadata to multiple languages simultaneously
const translations = await translateContent(
  metadata,
  targetLanguages,
  apiKey
);
```

### 2. **Smart Content Translation**
- Translates page titles, descriptions, and keywords
- Preserves SEO quality across languages
- Context-aware translations for marketing content

### 3. **Caching Layer Integration**
```javascript
// Efficient caching of translated content
const cachedTranslation = await getCachedTranslation(
  cacheKey,
  language
);
```

### 4. **i18n File Generation**
Automatically updates frontend internationalization files with translated content for seamless multilingual UI support.

## 📸 Screenshots

| SEO Analysis | Translation Results |
|:---:|:---:|
| ![Analysis](assets/screenshots/image.png) | ![Japanese](assets/screenshots/jp.png) |

| Social Card Preview | Copy to Clipboard |
|:---:|:---:|
| ![Card](assets/screenshots/card.png) | ![Copy](assets/screenshots/copy.png) |

## 🛠️ How to Run Locally

### Prerequisites
- Node.js 18+
- npm or yarn
- Lingo.dev API key ([Get one here](https://lingo.dev))
- Google Gemini API key (for SEO analysis)
- Upstash Redis (optional, for caching)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-fork-url>
   cd GlobSEO
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run install-browsers
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   LINGODOTDEV_API_KEY=your_lingo_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   UPSTASH_REDIS_REST_URL=your_redis_url (optional)
   UPSTASH_REDIS_REST_TOKEN=your_redis_token (optional)
   PORT=3001
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open in Browser**
   ```
   http://localhost:5173
   ```

### Usage
1. Enter any website URL
2. Select target languages for translation
3. (Optional) Add API keys in settings or set as environment variables
4. Click "Analyze & Translate"
5. View comprehensive SEO analysis with translations
6. Copy generated meta tags and code snippets

## 🌐 Supported Languages

The app supports translation to 15+ languages including:
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)
- Arabic (ar)
- Russian (ru)
- Dutch (nl)
- Polish (pl)
- Turkish (tr)
- Swedish (sv)
- Danish (da)

## 🎨 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing-fast builds
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **i18next** for internationalization

### Backend
- **Node.js** with Express
- **Playwright** for web scraping
- **Lingo.dev SDK** for translations
- **Google Gemini AI** for SEO analysis
- **Upstash Redis** for caching
- **Rate limiting** for API protection

## 📚 API Endpoints

### Multilingual Analysis
```bash
POST /api/scrape-translate-score
Content-Type: application/json

{
  "url": "https://example.com",
  "languages": ["es", "fr", "de"],
  "lingoApiKey": "your_key",
  "geminiApiKey": "your_key"
}
```

### English-Only Analysis
```bash
POST /api/scrape-and-score
Content-Type: application/json

{
  "url": "https://example.com",
  "geminiApiKey": "your_key"
}
```

## 🏗️ Project Structure

```
GlobSEO/
├── backend/
│   ├── server.js              # Express server
│   ├── pipeline.js            # Main processing pipeline
│   └── utils/
│       ├── lingo-translate.js # Lingo.dev integration
│       ├── scraper.js         # Metadata extraction
│       ├── seo-score.js       # AI scoring
│       └── cache-utils.js     # Redis caching
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main application
│   │   ├── components/        # UI components
│   │   └── services/api.ts    # API client
│   └── i18n/                  # Translation files
└── README.md
```

## 🎯 Lingo.dev Features Highlighted

1. **Batch Translation** - Translate multiple text fields simultaneously
2. **Language Detection** - Automatic source language detection
3. **Context-Aware Translation** - Marketing and SEO-optimized translations
4. **API Integration** - RESTful API for easy integration
5. **Caching Strategy** - Efficient use of translation API with cache layer
6. **Error Handling** - Robust error handling with fallbacks

## 🤝 Contributing

This project is part of the Lingo.dev community showcase. Contributions are welcome!

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- [Live Demo](#) _(add your deployment link)_
- [Lingo.dev Documentation](https://lingo.dev/docs)
- [Project Repository](#)

## 💬 Questions?

Join the [Lingo.dev subreddit](https://reddit.com/r/LingovDev) for discussions and support!

---

Built with ❤️ using [Lingo.dev](https://lingo.dev)
