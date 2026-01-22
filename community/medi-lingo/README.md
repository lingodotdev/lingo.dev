# medi-lingo

A medical report analyzer and explainer that translates medical jargon into patient-friendly language in 40+ languages.

**Powered by [Lingo.dev](https://lingo.dev)** - AI-powered localization for web and mobile apps.

## What it does

medi-lingo helps patients understand their medical reports by:

1. **Analyzing** medical reports using Google Gemini AI
2. **Explaining** complex medical terms in simple, patient-friendly language
3. **Translating** the explanation into any of 40+ supported languages using Lingo.dev SDK

## Features

- **Multiple input methods**: Paste text, upload PDF, or upload images
- **Client-side processing**: PDF and image text extraction happens in your browser (privacy-first)
- **40+ languages**: Translate explanations using Lingo.dev's AI translation
- **Dark mode**: System-aware dark/light theme toggle
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Loading skeletons**: Smooth loading states with skeleton animations
- **Responsive design**: Works on desktop and mobile devices
- **Safe and responsible**: No diagnosis, no medical advice, always includes disclaimers

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) | UI components |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode support |
| [Lucide React](https://lucide.dev) | Icons |
| [Google Gemini](https://ai.google.dev) | Medical report analysis |
| [Lingo.dev SDK](https://lingo.dev/sdk) | AI-powered translation |
| [PDF.js](https://mozilla.github.io/pdf.js/) | Client-side PDF text extraction |
| [Tesseract.js](https://tesseract.projectnaptha.com/) | Client-side OCR |
| [Zod](https://zod.dev) | Schema validation |

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Google Gemini API key (**FREE** - no credit card required)
- Lingo.dev API key (free tier: 10,000 words/month)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lingodotdev/lingo.dev.git
cd lingo.dev/community/medi-lingo
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Get your FREE API key from: https://aistudio.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Get your API key from: https://lingo.dev/app
LINGODOTDEV_API_KEY=your_lingo_dev_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Keys

### Google Gemini API (FREE)

The Google Gemini API is **completely free** to use with generous limits:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env.local` file

**Free tier includes**:
- 15 requests per minute
- 1 million tokens per month
- No credit card required

### Lingo.dev API

1. Go to [Lingo.dev](https://lingo.dev/app)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

**Free tier**: 10,000 translated words per month

## Project Structure

```
medi-lingo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts          # API endpoint
│   │   ├── layout.tsx                # Root layout with ThemeProvider
│   │   ├── page.tsx                  # Main page
│   │   └── globals.css               # Global styles & CSS variables
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── alert.tsx
│   │   │   └── badge.tsx
│   │   ├── ReportInput/
│   │   │   ├── TextInput.tsx         # Text paste input
│   │   │   ├── PDFUpload.tsx         # PDF upload + extraction
│   │   │   └── ImageUpload.tsx       # Image upload + OCR
│   │   ├── Results/
│   │   │   └── ResultsDisplay.tsx    # Results display with cards
│   │   ├── Header.tsx                # App header with logo
│   │   ├── Hero.tsx                  # Hero section
│   │   ├── Footer.tsx                # Footer with links
│   │   ├── FeatureHighlights.tsx     # Feature cards section
│   │   ├── AnalysisSkeleton.tsx      # Loading skeleton
│   │   ├── LanguageSelector.tsx      # Language dropdown
│   │   ├── ThemeProvider.tsx         # Dark mode provider
│   │   └── ThemeToggle.tsx           # Dark/light mode toggle
│   └── lib/
│       ├── types.ts                  # TypeScript interfaces
│       ├── prompts.ts                # LLM prompts
│       ├── gemini.ts                 # Gemini API integration
│       ├── lingo.ts                  # Lingo.dev SDK integration
│       ├── languages.ts              # Supported languages list
│       └── utils.ts                  # Utility functions
├── .env.example                      # Environment variables template
├── components.json                   # shadcn/ui config
├── package.json
└── README.md
```

## How It Works

### 1. Input Processing

- **Text**: Direct paste into textarea
- **PDF**: Client-side extraction using PDF.js
- **Image**: Client-side OCR using Tesseract.js

### 2. AI Analysis

The medical report text is sent to Google Gemini with a carefully crafted prompt that:
- Explains medical terms in simple language
- Extracts key findings
- Provides context without diagnosis
- Includes appropriate disclaimers

### 3. Translation

Using Lingo.dev SDK's `localizeObject` method, the entire structured response is translated while:
- Preserving medical terminology
- Maintaining consistent structure
- Supporting RTL languages (Arabic, Hebrew, etc.)

## Output Format

The analysis produces a structured JSON response:

```json
{
  "overview": "High-level summary...",
  "key_findings": ["Finding 1", "Finding 2"],
  "what_it_means": ["Explanation 1", "Explanation 2"],
  "medical_terms_explained": {
    "Hemoglobin": "A protein in red blood cells..."
  },
  "when_to_be_careful": ["Warning sign 1"],
  "next_steps_general": ["General guidance 1"],
  "disclaimer": "This explanation is for informational purposes only..."
}
```

## Supported Languages

medi-lingo supports 40+ languages including:

- **European**: English, Spanish, French, German, Italian, Portuguese, Russian, Polish, Dutch, Swedish, and more
- **Asian**: Chinese (Simplified/Traditional), Japanese, Korean, Hindi, Bengali, Tamil, Telugu, Thai, Vietnamese, and more
- **Middle Eastern**: Arabic, Hebrew, Turkish, Farsi
- **And many more!**

## Privacy

- PDF and image text extraction happens **entirely in your browser**
- Only the extracted text is sent to the analysis API
- No medical data is stored
- The application is completely stateless

## Disclaimer

This application is for **educational and informational purposes only**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.

## Contributing

Contributions are welcome! Please read the [Lingo.dev Contributing Guide](https://github.com/lingodotdev/lingo.dev/blob/main/CONTRIBUTING.md) before submitting a PR.

## License

This project is licensed under the same terms as the [Lingo.dev repository](https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md).

## Links

- [Lingo.dev](https://lingo.dev) - AI-powered localization platform
- [Lingo.dev SDK Docs](https://lingo.dev/sdk) - SDK documentation
- [Lingo.dev Discord](https://lingo.dev/go/discord) - Community support
- [Google AI Studio](https://aistudio.google.com) - Get your FREE Gemini API key
