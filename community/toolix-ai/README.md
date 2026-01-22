# Toolix AI - Multilingual AI Agent with Lingo.dev

<p align="center">
  <img src="public/favicon.svg" width="80" alt="Toolix AI Logo" />
</p>

<p align="center">
  <strong>🤖 Tool-Enabled AI Agent with Real-time Multilingual Support powered by Lingo.dev Compiler</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#lingo-dev-integration">Lingo.dev Integration</a> •
  <a href="#prerequisites">Prerequisites</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#tools">Tools</a>
</p>

---

## What is Toolix AI?

Toolix AI is an intelligent, tool-enabled AI chat assistant built with Next.js 16, LangChain, and the AI SDK. It features **Generative UI capabilities** powered by Thesys GenUI SDK, allowing AI responses to include interactive charts, tables, and visual components.

This demo showcases the **Lingo.dev Compiler** integration, enabling automatic multilingual support across 7 languages without modifying any existing React components.

---

## ✨ Features

- **🌐 Multilingual Support** - Instant translations to Spanish, French, German, Japanese, Hindi, and Chinese via Lingo.dev
- **🔧 Multiple AI Tools** - Weather, Calculator, Web Search, Image Generation, Image Search, YouTube Transcripts
- **📊 Generative UI** - Interactive charts, tables, and visual components in AI responses
- **⚡ Streaming Responses** - Real-time message streaming with typing indicators
- **✏️ Message Editing** - Edit previous messages and regenerate responses
- **🎨 Modern UI** - Beautiful dark theme with Radix UI components

---

## 🌍 Lingo.dev Integration

This project demonstrates the **Lingo.dev Compiler** - a zero-config solution for making React apps multilingual at build time.

### How it works

1. **Zero Code Changes** - The compiler automatically detects and transforms all translatable JSX text
2. **Build-time Processing** - Translations are generated during the build process
3. **Runtime Locale Switching** - Users can switch languages instantly without page reload
4. **AI-Powered Translations** - Uses Lingo.dev Engine for high-quality translations

### Supported Languages

| Language | Code | Flag |
|----------|------|------|
| English | `en` | 🇺🇸 |
| Spanish | `es` | 🇪🇸 |
| French | `fr` | 🇫🇷 |
| German | `de` | 🇩🇪 |
| Japanese | `ja` | 🇯🇵 |
| Hindi | `hi` | 🇮🇳 |
| Simplified Chinese | `zh-Hans` | 🇨🇳 |

### Key Lingo.dev Features Highlighted

- **LingoProvider** - Wraps the app to enable locale context
- **useLingo Hook** - Programmatic locale switching
- **useLingoLocale Hook** - Access current locale
- **Automatic JSX Transformation** - No `t()` functions or translation keys needed
- **Cookie Persistence** - Selected language persists across sessions

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** 20.x or higher
- **pnpm** (this project is part of the Lingo.dev monorepo)
- API keys for the services you want to use (see [Environment Variables](#environment-variables))

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lingodotdev/lingo.dev.git
cd lingo.dev
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Navigate to the toolix-ai directory and create your `.env` file:

```bash
cd community/toolix-ai
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required - Core AI Functionality
THESYS_API_KEY=your_thesys_api_key          # Powers all AI responses via Thesys GenUI
LINGODOTDEV_API_KEY=your_lingo_api_key      # For production translations

# Required - AI Tools
TAVILY_API_KEY=your_tavily_key              # Web search tool
OPENWEATHER_API_KEY=your_openweather_key    # Weather tool
SUPADATA_API_KEY=your_supadata_key          # YouTube transcript tool

# Required - Image Generation
A4F_API_KEY=your_a4f_key                    # Image generation
IMAGE_GEN_MODEL_ID=provider-4/imagen-4      # Image model ID

# Required - Image Upload & Search
CLOUDINARY_CLOUD_NAME=your_cloud_name       # Generated image upload
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GOOGLE_API_KEY=your_google_api_key          # Image search
GOOGLE_CX=your_google_cx                    # Google Custom Search Engine ID
```

### 4. Run the Development Server

From the `community/toolix-ai` directory:

```bash
pnpm dev
```

Or from the monorepo root:

```bash
pnpm --filter toolix-ai dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 5. Try the Language Switcher

Click the language selector in the header to switch between languages. The entire UI will update instantly!

---

## 🛠️ Tools

Toolix AI includes the following AI-powered tools:

| Tool | Description |
|------|-------------|
| **Calculator** | Mathematical calculations, equations, and financial math |
| **Weather** | Real-time weather data for any location |
| **Web Search** | Search the web for latest information |
| **Image Generation** | Generate images using AI |
| **Image Search** | Search for existing images online |
| **YouTube Transcript** | Extract and analyze video transcripts |

---

## 🏗️ Project Structure

```
toolix-ai/
├── app/
│   ├── api/chat/          # AI chat API route
│   ├── layout.tsx         # Root layout with LingoProvider
│   ├── page.tsx           # Main chat page
│   └── globals.css        # Global styles
├── components/
│   ├── ai-elements/       # Generative UI components
│   ├── chat-header.tsx    # Header with language switcher
│   ├── chat-input.tsx     # Message input component
│   ├── chat-message.tsx   # Message display component
│   ├── language-switcher.tsx  # Lingo.dev locale switcher
│   └── ui/                # Shadcn UI components
├── lib/
│   ├── graph.ts           # LangGraph agent definition
│   ├── model.ts           # AI model configuration
│   └── tools/             # AI tool implementations
├── next.config.ts         # Next.js config with Lingo.dev
└── package.json
```

---

## 🔧 Configuration

### Lingo.dev Compiler Configuration

The compiler is configured in `next.config.ts`:

```ts
import { withLingo } from "@lingo.dev/compiler/next";

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de", "ja", "hi", "zh-Hans"],
    models: "lingo.dev",
    dev: {
      usePseudotranslator: true,
    },
  });
}
```

### Adding More Languages

To add more languages, update the `targetLocales` array in `next.config.ts` and add the locale to the `LanguageSwitcher` component.

---

## 📚 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **LLM Orchestration**: [LangChain](https://langchain.com/) / [LangGraph](https://langchain-ai.github.io/langgraph/)
- **Generative UI**: [Thesys GenUI SDK](https://thesys.ai/)
- **Internationalization**: [Lingo.dev Compiler](https://lingo.dev/compiler)
- **UI Components**: [Radix UI](https://radix-ui.com/) / [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the same terms as the Lingo.dev repository.

---

## 👨‍💻 Author

**Khilesh Jawale**

- GitHub: [@khilesh321](https://github.com/khilesh321)

---

<p align="center">
  Built with ❤️ for the Lingo.dev Community
</p>
