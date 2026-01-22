# 🌍 Lingo Daily - Global News in Your Language

A modern, real-time news dashboard that brings breaking news from around the world, instantly translated into 15+ languages using [Lingo.dev](https://lingo.dev)'s powerful translation SDK.

Built for the Lingo.dev Hackathon to showcase seamless internationalization and real-time content translation.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css)

## ✨ Features

- **📰 Real-Time News**: Fetches live breaking news from [NewsAPI](https://newsapi.org)
- **🌐 15+ Languages**: Instant translation to Spanish, French, German, Japanese, Korean, Chinese, Arabic, Hindi, and more
- **⚡ Smart Loading**: Initial load of 6 articles with "Load More" functionality
- **🎨 Beautiful UI**: Professional, minimal design built with shadcn/ui components
- **🌓 Theme Support**: Seamless dark/light mode toggle
- **📱 Responsive**: Fully optimized for mobile, tablet, and desktop

## 🎯 Lingo.dev Features Highlighted

This project demonstrates:

1. **Real-Time Content Translation**: Uses the official `@lingodotdev/sdk` to translate news articles on-the-fly
2. **Batch Translation**: Efficiently translates multiple text fields (titles + descriptions) in a single API call
3. **Language Persistence**: Maintains translation state across content pagination
4. **Fallback Handling**: Gracefully handles translation errors while preserving user experience
5. **Multi-Language Support**: Showcases Lingo.dev's support for 15+ languages with proper locale codes

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **Package Manager**: npm, pnpm, or yarn
- **API Keys**:
  - [NewsAPI Key](https://newsapi.org/register) (free tier available)
  - [Lingo.dev API Key](https://lingo.dev) (get yours from the dashboard)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/lingodotdev/lingo.dev.git
   cd lingo.dev/community/lingo-daily
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**:

   Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your API keys:

   ```env
   NEWS_API_KEY=your_newsapi_key_here
   LINGO_API_KEY=your_lingo_api_key_here
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**:

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Translation**: [@lingodotdev/sdk](https://www.npmjs.com/package/@lingodotdev/sdk)
- **News API**: [NewsAPI](https://newsapi.org)

## 📁 Project Structure

```
lingo-daily/
├── app/
│   ├── api/
│   │   ├── news/         # News fetching endpoint
│   │   └── translate/    # Translation endpoint
│   ├── layout.tsx        # Root layout with theme provider
│   └── page.tsx          # Main page with news grid
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Header with language selector
│   ├── news-card.tsx     # Individual news article card
│   ├── news-grid.tsx     # Grid layout for articles
│   ├── news-skeleton.tsx # Loading skeletons
│   ├── theme-toggle.tsx  # Dark/light mode toggle
│   ├── theme-provider.tsx# Theme context provider
│   └── language-selector.tsx # Language dropdown
├── lib/
│   ├── lingo-api.ts      # Lingo.dev SDK integration
│   ├── news-api.ts       # NewsAPI integration
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── .env.example          # Environment variables template
```

## 🎨 Key Components

### Language Translation Flow

1. User selects a language from the dropdown
2. App prepares an array of texts (article titles + descriptions)
3. Texts are sent to `/api/translate` endpoint
4. Endpoint uses Lingo.dev SDK's `localizeObject` method
5. Translations are mapped back to articles
6. UI updates with translated content

### Load More Functionality

- Initially displays 6 articles
- "Load More" button appears if more articles are available
- Loads 6 additional articles per click
- Automatically translates new content if language is selected
- Smooth loading states for optimal UX

## 🌐 Supported Languages

English (en) • Spanish (es) • French (fr) • German (de) • Italian (it) • Portuguese (pt) • Russian (ru) • Japanese (ja) • Korean (ko) • Chinese (zh) • Arabic (ar) • Hindi (hi) • Dutch (nl) • Polish (pl) • Turkish (tr)

## 🤝 Contributing

This project is part of the Lingo.dev community examples. Feel free to:

- Report issues
- Suggest improvements
- Submit pull requests
- Use as a starting point for your own projects

## 📄 License

This project is licensed under the same terms as the parent repository.

## 🙏 Acknowledgments

- **News**: Powered by [NewsAPI](https://newsapi.org)
- **Translation**: Powered by [Lingo.dev](https://lingo.dev)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [Lucide](https://lucide.dev)

---

Built with ❤️ for the Lingo.dev Hackathon
