# GlobSEO Translation Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │  1. Enter URL         │
                        │  2. Select Languages  │
                        │     - English (source)│
                        │     - Spanish         │
                        │     - French          │
                        │  3. Click Analyze     │
                        └───────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (App.tsx)                              │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Convert language names to codes                                     │
│     English → en, Spanish → es, French → fr                             │
│                                                                         │
│  2. Filter out source language (English)                                │
│     Target languages: [es, fr]                                          │
│                                                                         │
│  3. Conditional API call:                                               │
│     IF targetLanguages.length > 0:                                      │
│       - Call api.scrapeTranslateScore(url, ['es', 'fr'])                │
│       - Shows progress: "Scraping..." → "Translating..." → "Analyzing.."│
│     ELSE (only English selected):                                       │
│       - Call api.scrapeAndScore(url)                                    │
│       - Shows progress: "Scraping..." → "Analyzing..."                  │
│                                                                         │
│  4. Handle response and update UI                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API SERVICE (api.ts)                            │
├─────────────────────────────────────────────────────────────────────────┤
│  Conditional endpoint selection:                                        │
│                                                                         │
│  IF translations needed:                                                │
│    POST /api/scrape-translate-score                                     │
│    Body: { url, languages: ['es', 'fr'], primaryKeyword, lingoApiKey,   │ 
│    geminiApiKey }                                                       │
│                                                                         │
│  ELSE (English only):                                                   │
│    POST /api/scrape-and-score                                           │
│    Body: { url, primaryKeyword, geminiApiKey }                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (server.js)                             │
├─────────────────────────────────────────────────────────────────────────┤
│  Conditional processing based on endpoint:                              │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ FOR BOTH ENDPOINTS:                                        │         │
│  │ STEP 1: SCRAPE METADATA                                    │         │
│  │ ┌────────────────────────────────────────────────────┐     │         │
│  │ │ scraper.js                                         │     │         │
│  │ │ • Fetch webpage HTML                               │     │         │
│  │ │ • Extract metadata fields:                         │     │         │
│  │ │   - title, description, keywords, h1               │     │         │
│  │ │   - Open Graph tags                                │     │         │
│  │ │   - Twitter Card tags                              │     │         │
│  │ │   - Page content (for SEO scoring only)            │     │         │
│  │ └────────────────────────────────────────────────────┘     │         │
│  │                                                            │         │
│  │ Result: metadata = {                                       │         │
│  │   title: "Original Title",                                 │         │
│  │   description: "Original description",                     │         │
│  │   keywords: "keyword1, keyword2",                          │         │
│  │   content: "Page content..."  ← NOT translated             │         │
│  │ }                                                          │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ IF /api/scrape-translate-score (with languages):           │         │
│  │ STEP 2: TRANSLATE METADATA (OPTIMIZED)                     │         │
│  │ ┌────────────────────────────────────────────────────┐     │         │
│  │ │ lingo-translate.js                                 │     │         │
│  │ │ • processMetadataTranslations()                    │     │         │
│  │ │                                                    │     │         │
│  │ │ OPTIMIZATION 1: Check full cache                   │     │         │
│  │ │   cacheKey = hash(content + source + targets)      │     │         │
│  │ │   if cached: return immediately                    │     │         │
│  │ │                                                    │     │         │
│  │ │ OPTIMIZATION 2: Check partial cache                │     │         │
│  │ │   Find subsets of languages already translated     │     │         │
│  │ │   Merge existing + translate missing only          │     │         │
│  │ │                                                    │     │         │
│  │ │ TRANSLATION PROCESS:                               │     │         │
│  │ │ 1. Prepare translation content:                    │     │         │
│  │ │    {                                               │     │         │
│  │ │      meta: {                                       │     │         │
│  │ │        title: metadata.title,                      │     │         │
│  │ │        description: metadata.description,          │     │         │
│  │ │        keywords: metadata.keywords,                │     │         │
│  │ │        h1: metadata.h1                             │     │         │
│  │ │      },                                            │     │         │
│  │ │      og: {                                         │     │         │
│  │ │        title: metadata.ogTitle,                    │     │         │
│  │ │        description: metadata.ogDescription         │     │         │
│  │ │      },                                            │     │         │
│  │ │      twitter: {                                    │     │         │
│  │ │        title: metadata.twitterTitle,               │     │         │
│  │ │        description: metadata.twitterDescription    │     │         │
│  │ │      },                                            │     │         │
│  │ │      _sourceHost: "example.com"                    │     │         │
│  │ │    }                                               │     │         │
│  │ │                                                    │     │         │
│  │ │ 2. Setup i18n.json config                          │     │         │
│  │ │    • Write frontend/i18n.json                      │     │         │
│  │ │    • Configure source + target languages           │     │         │
│  │ │                                                    │     │         │
│  │ │ 3. Write source content                            │     │         │
│  │ │    • frontend/i18n/en.json = translationContent    │     │         │
│  │ │                                                    │     │         │
│  │ │ 4. Perform translations via Lingo.dev SDK          │     │         │
│  │ │     (in-process)                                   │     │         │
│  │ │    • Uses the in-process SDK to localize the       │     │         │
│  │ │            prepared object                         │     │         │
│  │ │    • No external `npx`/CLI calls required          │     │         │
│  │ │    • Generates translation results which are       │     │         │
│  │ │            written to frontend/i18n/*.json         │     │         │
│  │ │                                                    │     │         │
│  │ │ 5. Read translated files                           │     │         │
│  │ │    • Parse JSON from each target language file     │     │         │
│  │ │                                                    │     │         │
│  │ │ 6. Cache complete result                           │     │         │
│  │ │    • Store in cache for future requests            │     │         │
│  │ └────────────────────────────────────────────────────┘     │         │
│  │                                                            │         │
│  │ Result: translations = {                                   │         │
│  │   "es": {                                                  │         │
│  │     meta: { title: "Título", description: "Desc..." },     │         │
│  │     og: { title: "...", description: "..." },              │         │
│  │     twitter: { title: "...", description: "..." }          │         │
│  │   },                                                       │         │
│  │   "fr": { ... }                                            │         │
│  │ }                                                          │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ FOR BOTH ENDPOINTS:                                        │         │
│  │ STEP 2/3: GENERATE SEO SCORE                               │         │
│  │ ┌────────────────────────────────────────────────────┐     │         │
│  │ │ seo-score.js                                       │     │         │
│  │ │ • Analyze original metadata                        │     │         │
│  │ │ • Check title length, keywords, description        │     │         │
│  │ │ • Generate scores (0-100)                          │     │         │
│  │ │ • Provide recommendations                          │     │         │
│  │ │ • Uses Gemini AI for analysis                      │     │         │
│  │ └────────────────────────────────────────────────────┘     │         │
│  │                                                            │         │
│  │ Result: seoScore = {                                       │         │
│  │   total_score: 85,                                         │         │
│  │   scores: { title_quality: 90, ... },                      │         │
│  │   issues: [...],                                           │         │
│  │   recommendations: [...]                                   │         │
│  │ }                                                          │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │ IF /api/scrape-translate-score (with languages):           │         │
│  │ STEP 3: TRANSLATE METADATA (OPTIMIZED)                     │         │
│  │ ┌────────────────────────────────────────────────────┐     │         │
│  │ │ updateI18nFiles()                                  │     │         │
│  │ │ • Write translations to frontend/i18n/             │     │         │
│  │ │ • Merge with existing content                      │     │         │
│  │ │ • Format: { metadata: {...}, _updated: timestamp } │     │         │
│  │ └────────────────────────────────────────────────────┘     │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                         │
│  Return based on endpoint:                                              │
│                                                                         │
│  IF /api/scrape-translate-score:                                        │
│  {                                                                      │
│    success: true,                                                       │
│    metadata,                                                            │
│    translations,                                                        │
│    seoScore,                                                            │
│    targetLanguages: ['es', 'fr']                                        │
│  }                                                                      │
│                                                                         │
│  IF /api/scrape-and-score:                                              │
│  {                                                                      │
│    success: true,                                                       │
│    metadata,                                                            │
│    seoScore                                                             │
│  }                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (App.tsx)                              │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Receive response                                                    │
│  2. Store in state:                                                     │
│     - setMetadata(result.metadata)                                      │
│     - setSeoScore(result.seoScore)                                      │
│     - IF translations exist: setTranslations(result.translations)       │
│       ELSE: setTranslations({})                                         │
│  3. Pass to OutputPanel                                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    OUTPUT PANEL (OutputPanel.tsx)                       │
├─────────────────────────────────────────────────────────────────────────┤
│  FOR EACH selected language:                                            │
│    Render LanguageResultsCard with:                                     │
│      - language name                                                    │
│      - metadata (original)                                              │
│      - translations                                                     │
│      - seoScore                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                LANGUAGE CARD (LanguageResultsCard.tsx)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  IF language === 'English':                                             │
│    ┌──────────────────────────────────────────────────┐                 │
│    │ ENGLISH CARD                                     │                 │
│    │ • Title: metadata.title                          │                 │
│    │ • Description: metadata.description              │                 │
│    │ • Keywords: metadata.keywords                    │                 │
│    │ (Shows original scraped content)                 │                 │
│    └──────────────────────────────────────────────────┘                 │
│                                                                         │
│  ELSE (Spanish, French, etc.):                                          │
│    ┌──────────────────────────────────────────────────┐                 │
│    │ SPANISH CARD (langCode = 'es')                   │                 │
│    │ • Title: translations['es'].meta.title           │                 │
│    │ • Desc: translations['es'].meta.description      │                 │
│    │ • Keywords: translations['es'].meta.keywords     │                 │
│    │ (Shows Lingo.dev translated content)             │                 │
│    └──────────────────────────────────────────────────┘                 │
│                                                                         │
│    ┌──────────────────────────────────────────────────┐                 │
│    │ FRENCH CARD (langCode = 'fr')                    │                 │
│    │ • Title: translations['fr'].meta.title           │                 │
│    │ • Desc: translations['fr'].meta.description      │                 │
│    │ • Keywords: translations['fr'].meta.keywords     │                 │
│    │ (Shows Lingo.dev translated content)             │                 │
│    └──────────────────────────────────────────────────┘                 │
│                                                                         │
│  Each card also displays:                                               │
│    ✓ HTML meta tags                                                     │
│    ✓ JSON output                                                        │
│    ✓ Schema markup                                                      │
│    ✓ Social card preview                                                │
│    ✓ Copy buttons                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER SEES RESULTS                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ✓ Original metadata in English                                         │
│  ✓ SEO quality score                                                    │
│  ✓ Smart rewrite suggestions                                            │
│  ✓ Ready-to-use HTML/JSON code                                          │
│                                                                         │
│  IF translations were requested:                                        │
│  ✓ Translated metadata in selected languages                            │
└─────────────────────────────────────────────────────────────────────────┘


TRANSLATION OPTIMIZATIONS:
══════════════════════════

1. **Full Cache Match**: Exact content + languages = instant return
2. **Partial Cache Match**: Reuse existing translations, translate missing languages only
3. **Incremental Translation**: Only run Lingo.dev for languages not in cache
4. **Smart Content Preparation**: Only metadata fields, never page content
5. **Batch Processing**: Single Lingo.dev run handles multiple languages


API ENDPOINTS:
══════════════

- `GET /api/health` - Health check with cache stats and API key status
- `POST /api/scrape` - Scrape metadata only
- `POST /api/translate` - Scrape + translate metadata only
- `POST /api/seo-score` - Generate SEO score for existing metadata
- `POST /api/scrape-and-score` - Scrape + generate SEO score
- `POST /api/scrape-translate-score` - Complete pipeline (scrape + translate + score)
- `GET /api/cache/stats` - Get cache statistics
- `POST /api/cache/clear` - Clear cache

CACHE STRATEGY:
═══════════════

- **Primary Storage**: Redis for high-performance, scalable caching
- **Fallback Storage**: In-memory Map for development/local use
- **Cache Key**: Hash of (content + source_lang + target_langs + host + primaryKeyword)
- **TTL**: Configurable expiration (default: 24 hours)
- **Optimization**: Partial matches allow incremental translation
- **Connection**: Automatic fallback if Redis is unavailable
```
