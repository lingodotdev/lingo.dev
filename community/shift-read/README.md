# Shift

Read any article on the internet in your preferred language. 
Shift extracts article content from web pages and translates it while preserving formatting, images, and typography.

- [Checkout Live Here](https://shift-read.vercel.app/)
- [View Demo Here](https://5kas5z928t.ufs.sh/f/wBHVA4PQTleAKsb2NVrIL2VE9DjCy53AWlsMSoTNfqhc0U8J)


## Features

- **Web Scraping**: Extract clean article content from any URL
- **Translation**: Translate articles to 12+ languages while preserving Markdown formatting
- **Beautiful Reading**: Clean, minimal reader mode with typography optimized for long-form content
- **Language Toggle**: Seamlessly switch between original and translated content
- **Dark Mode**: Toggle between light and dark themes
- **Smart Caching**: Articles and translations are cached locally for instant re-access

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Web Scraping**: @mendable/firecrawl-js
- **Translation**: lingo.dev SDK
- **Markdown Rendering**: react-markdown with remark-gfm and rehype-highlight
- **Syntax Highlighting**: react-syntax-highlighter
- **Caching**: localStorage with timestamp-based cache management

## What lingo.dev Feature It Highlights

Shift showcases **lingo.dev's Markdown translation capabilities**. The app demonstrates how lingo.dev can:

- Translate complex Markdown content while preserving formatting
- Maintain document structure during translation
- Provide seamless language switching for content-heavy applications

The translation preserves:
- Headers and text hierarchy
- Links and their targets
- Lists, quotes, and other Markdown elements

## Installation

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shift-read
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the project root and see .env.example for variables to add:
   ```env
   FIRECRAWL_API_KEY=your_firecrawl_api_key_here
   LINGODOTDEV_API_KEY=your_lingodotdev_api_key_here
   GROQ_API_KEY=groq_api_key_here
   ```

4. **Get API Keys**
   - **Firecrawl**: Sign up at [firecrawl.dev](https://firecrawl.dev) to get your API key
   - **Groq**: Sign up at [groq.com](https://groq.com) to get your API key
   - **lingo.dev**: Sign up at [lingo.dev](https://lingo.dev) to get your API key

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Running Locally

### Development Mode
```bash
pnpm dev
```
Starts the development server with hot reload at `http://localhost:3000`

### Build for Production
```bash
pnpm build
```
Creates an optimized production build

### Start Production Server
```bash
pnpm start
```
Runs the production build at `http://localhost:3000`

### Linting
```bash
pnpm lint
```
Runs ESLint to check for code issues

## Supported Languages

Shift supports translation to these languages:

- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr) 
- 🇩🇪 German (de)
- 🇯🇵 Japanese (ja)
- 🇨🇳 Chinese (zh)
- 🇸🇦 Arabic (ar)
- 🇮🇳 Hindi (hi)
- 🇵🇹 Portuguese (pt)
- 🇷🇺 Russian (ru)
- 🇰🇷 Korean (ko)
- 🇮🇹 Italian (it)
- 🇳🇱 Dutch (nl)

The source language is automatically detected and filtered from the translation options.

## Project Structure

```text
shift-read/
├── app/
│   ├── page.tsx                    # Homepage with URL input
│   ├── layout.tsx                  # Root layout with providers
│   ├── globals.css                 # Global styles (Tailwind v4)
│   ├── read/[...url]/
│   │   └── page.tsx               # Reading page with article display
│   └── actions/
│       ├── fetchContent.ts        # Firecrawl server action
│       ├── translate.ts           # lingo.dev server action
│       └── cleanMarkdown.ts       # Markdown cleanup utilities
├── components/
│   ├── ArticleHeader.tsx          # Title, author, date, image display
│   ├── LanguageSelector.tsx       # Language dropdown
│   ├── MDXRender.tsx              # Markdown renderer with custom components
│   └── ThemeToggle.tsx            # Dark/light mode toggle
├── lib/
│   ├── utils.ts                   # Utility functions
│   └── storage.ts                 # localStorage helpers
├── README.md
├── package.json
├── next.config.ts
└── tsconfig.json
```

## How It Works

1. **URL Input**: User enters an article URL on the homepage
2. **Content Extraction**: Firecrawl scrapes the URL and extracts clean Markdown content
3. **Caching**: Article is cached in localStorage for instant future access
4. **Translation**: User can select a target language and lingo.dev translates the content
5. **Display**: Article is rendered with beautiful typography and preserved formatting
6. **Toggle**: Users can switch between original and translated content seamlessly

---

- built by [mayank](https://mayankbansal.xyz)
