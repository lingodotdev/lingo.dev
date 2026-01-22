# HAdye Shop - Multilingual E-commerce Website

**Website Link:** [Link](https://hdye-shop-jd.vercel.app/)

**Demo Link:** [Link](https://youtu.be/ZpghCiSz_ww?si=1XkSH2TJgctxcIKC)



A modern, multilingual e-commerce website for hair color dyes built with Next.js 15, TypeScript, and Tailwind CSS. Features support for 6 languages with AI-powered translations using Lingo.dev and GROQ API.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Lingo.dev](https://img.shields.io/badge/Translations-Lingo.dev-6C63FF)
![GROQ](https://img.shields.io/badge/AI-GROQ-orange)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

## 🌍 Supported Languages

- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇮🇳 Hindi (hi)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇮🇹 Italian (it)

<Image width="914" height="408" alt="Capture" src="https://github.com/user-attachments/assets/bfe65024-6604-4ccd-911f-917b71ecdf44" />

## ✨ Features

- 🎨 **Product Catalog** - Display hair dye products with images and descriptions
- 🌐 **Multilingual Support** - 6 languages with automatic route-based switching
- 🤖 **AI Translation** - Powered by GROQ API via Lingo.dev
- 📱 **Responsive Design** - Mobile-first Tailwind CSS design
- 🚀 **Fast Performance** - Next.js 15 with App Router
- 🐳 **Docker Support** - Containerized translation workflow
- ☁️ **Vercel Ready** - Optimized for Vercel deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **Translation**: Lingo.dev CLI + GROQ API
- **Deployment**: Vercel
- **Containerization**: Docker (for translations only)

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Docker Desktop (for translations)
- GROQ API Key (free at https://console.groq.com/)
- Lingo.dev Account (for lingo api key at https://lingo.dev/en/app/projects)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repo-url>
cd hdye-shop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# GROQ API Key (required for translations)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Lingo.dev API Key (optional)
LINGODOTDEV_API_KEY=your_lingo_api_key_here
```

**Get your GROQ API key:**
1. Visit https://console.groq.com/
2. Sign up (it's free)
3. Create a new API key
4. Copy the key to `.env`

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000/en to see your app!

Available routes:
- http://localhost:3000/en (English)
- http://localhost:3000/es (Spanish)
- http://localhost:3000/hi (Hindi)
- http://localhost:3000/fr (French)
- http://localhost:3000/de (German)
- http://localhost:3000/it (Italian)

## 🔄 Translation Workflow

This project uses Docker **only for translations**, not for running the app locally.

### Initial Setup

Translations are generated using Lingo.dev CLI in a Docker container:

```bash
# Build the translation Docker image
docker-compose -f docker-compose.translate.yml build

# Run translation (generates all language files)
docker-compose -f docker-compose.translate.yml up -d
```

### Update Translations

When you modify `messages/en.json`:

```bash
# Rebuild and run translation
docker-compose -f docker-compose.translate.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.translate.yml up --build -d
```

### Clean Docker Resources

If you encounter issues or want to free up space:

```bash
# Remove all unused Docker resources
docker system prune -a --volumes
```

### How It Works

1. **Edit** `messages/en.json` with your English content
2. **Run** Docker translation command
3. **Generated** files: `messages/es.json`, `messages/hi.json`, etc.
4. **Commit** all translation files to git
5. **Deploy** to Vercel

## 📁 Project Structure

```
hdye-shop/
├── app/
│   └── [locale]/              # Locale-based routing
│       ├── layout.tsx         # Root layout with i18n
│       ├── page.tsx           # Home page (product catalog)
│       └── styles.css         # Global styles
├── components/
│   ├── Navbar.tsx             # Navigation with language switcher
│   └── ProductCard.tsx        # Product display component
├── messages/
│   ├── en.json                # English translations (source)
│   ├── es.json                # Spanish translations (generated)
│   ├── hi.json                # Hindi translations (generated)
│   ├── fr.json                # French translations (generated)
│   ├── de.json                # German translations (generated)
│   └── it.json                # Italian translations (generated)
├── i18n.ts                    # i18n configuration
├── routing.ts                 # Routing configuration
├── middleware.ts              # Locale detection middleware
├── i18n.json                  # Lingo.dev configuration
├── Dockerfile.lingo           # Docker config for translations
├── docker-compose.translate.yml # Docker Compose for translations
├── translate.sh               # Translation script
└── next.config.js             # Next.js configuration
```

## 🎨 Adding New Products

Edit `app/[locale]/page.tsx` and add to the `products` array:

```typescript
{
  id: 'your_product_id',
  imageUrl: 'https://images.unsplash.com/photo-xxxxx',
  colorHex: '#hexcode'
}
```

Then add translations in `messages/en.json`:

```json
"dyes": {
  "your_product_id": {
    "name": "Product Name",
    "description": "Product description"
  }
}
```

Run translation to generate all languages.

## 🌐 Adding New Languages

1. **Update `routing.ts`:**
```typescript
export const locales = ['en', 'es', 'hi', 'fr', 'de', 'it', 'ja'] as const;
```

2. **Update `i18n.json`:**
```json
{
  "locale": {
    "targets": ["es", "hi", "fr", "de", "it", "ja"]
  }
}
```

3. **Update middleware matcher in `middleware.ts`:**
```typescript
matcher: ['/', '/(de|en|es|fr|hi|it|ja)/:path*']
```

## 🚢 Deployed to Vercel

**Link:** [Website Link](https://hdye-shop-jd.vercel.app/)

### Important Notes for Vercel

- ✅ Translation files are **pre-generated** and committed to git
- ✅ No Docker needed in Vercel (translations done locally)
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ Zero configuration required

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate translations (Docker)
docker-compose -f docker-compose.translate.yml up --build -d

# Clean Docker resources
docker system prune -a --volumes
```

## 📦 Docker Commands Reference

```bash
# Build translation container
docker-compose -f docker-compose.translate.yml build

# Run translation (background)
docker-compose -f docker-compose.translate.yml up -d

# Stop translation container
docker-compose -f docker-compose.translate.yml down

# Rebuild and run
docker-compose -f docker-compose.translate.yml up --build -d

# Clean all Docker resources
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Translations Not Working

**Verify Docker is running:**
    ```bash
    docker --version
    docker ps
    ```

### Docker Build Issues

```bash
# Clean everything and rebuild
docker-compose -f docker-compose.translate.yml down
docker system prune -a --volumes
docker-compose -f docker-compose.translate.yml build --no-cache
docker-compose -f docker-compose.translate.yml up
```

### Missing Translation Files

If some language files are missing:

```bash
# Ensure en.json exists
cat messages/en.json

# Run translation
docker-compose -f docker-compose.translate.yml up --build

# Check generated files
ls messages/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Lingo.dev](https://lingo.dev/) - Translation management
- [GROQ](https://groq.com/) - Fast AI inference
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Hosting platform

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Lingo.dev and AI-powered translations**
