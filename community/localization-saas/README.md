# AI Website Localization SaaS

> 🎁 **Swag Campaign Submission** - This project is part of the [Lingo.dev Swag Campaign (#1761)](https://github.com/lingodotdev/lingo.dev/issues/1761)

A simple, production-ready SaaS platform that helps startups and developers localize their websites instantly using AI-powered translations from Lingo.dev.

## 📋 What This Project Does

This application provides a web-based interface for translating website content files (JSON, i18n files) into multiple languages simultaneously. It leverages Lingo.dev's AI translation engine to deliver context-aware, high-quality translations that maintain the structure and formatting of your original content.

**Key Capabilities:**
- Upload JSON/i18n files containing website text
- Select from 10+ target languages
- Get AI-powered translations in seconds
- Preview translations before downloading
- Download individual language files
- Maintains nested JSON structure
- Context-aware translations

**Perfect For:**
- Startups expanding to international markets
- Developers localizing web applications
- Content teams managing multilingual websites
- Anyone needing quick, quality translations

## 🎯 Features

- ✅ **File Upload**: Drag-and-drop or click to upload JSON files
- ✅ **Multi-Language Support**: Translate to 10+ languages simultaneously
- ✅ **Real-Time Translation**: Powered by Lingo.dev's AI engine
- ✅ **Preview Mode**: Review translations before downloading
- ✅ **Individual Downloads**: Download each language separately
- ✅ **Structure Preservation**: Maintains nested JSON hierarchy
- ✅ **Modern UI**: Clean, responsive interface built with Tailwind CSS
- ✅ **Error Handling**: Graceful error messages and validation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Translation Engine**: Lingo.dev SDK (@lingo.dev/_sdk)
- **Runtime**: Node.js

## 📦 Prerequisites

Before running this project, ensure you have:

### Required
- **Node.js**: Version 18.x or higher
  - Check your version: `node --version`
  - Download from: https://nodejs.org/

- **npm**: Version 9.x or higher (comes with Node.js)
  - Check your version: `npm --version`

- **Lingo.dev API Key**: Required for translations
  - Get your key by running: `npx lingo.dev@latest auth`
  - Or sign up at: https://lingo.dev

### Optional
- **Git**: For cloning the repository
- **VS Code**: Recommended editor with TypeScript support

## 🚀 Getting Started

### Step 1: Install Dependencies

Navigate to the project directory and install packages:

```bash
cd community/localization-saas
npm install
```

This will install:
- Next.js and React
- Lingo.dev SDK
- Tailwind CSS
- TypeScript dependencies

### Step 2: Get Your Lingo.dev API Key

You need a valid API key to use the translation service.

**Option A: Authenticate via CLI (Recommended)**
```bash
npx lingo.dev@latest auth
```
Follow the prompts to authenticate. Your API key will be displayed.

**Option B: Check Existing Configuration**
If you've used Lingo.dev before, check:
```bash
# On macOS/Linux
cat ~/.lingo/auth.json

# On Windows
type %USERPROFILE%\.lingo\auth.json
```
Look for the `apiKey` field.

### Step 3: Configure Environment Variables

Create or edit `.env.local` in the project root:

```bash
# .env.local
LINGO_API_KEY=your_actual_api_key_here
```

**Important**: 
- Never commit `.env.local` to version control
- The `.gitignore` file already excludes it
- Use `.env.example` as a template

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

You should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

## 📖 How to Use

### Basic Workflow

1. **Open the App**: Navigate to http://localhost:3000

2. **Upload a File**: 
   - Click the upload area or drag and drop
   - Use the sample file: `test-data/sample-en.json`
   - Only JSON files are accepted

3. **Select Languages**:
   - Source language defaults to English
   - Click target languages (Spanish, French, German, etc.)
   - Selected languages highlight in blue

4. **Translate**:
   - Click "Translate Now"
   - Wait for AI processing (usually 5-15 seconds)
   - Progress indicator shows status

5. **Download**:
   - Preview translations in the results section
   - Click "Download" on any language card
   - Files download as `{locale}.json`

### Sample Test File

A sample file is included at `test-data/sample-en.json`:

```json
{
  "welcome": "Welcome to our website",
  "navigation": {
    "home": "Home",
    "about": "About Us"
  }
}
```

### Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)
- Arabic (ar)

## 🏗️ Project Structure

```
community/localization-saas/
├── app/
│   ├── api/
│   │   └── translate/
│   │       └── route.ts          # Translation API endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page component
│   └── globals.css               # Global styles
├── components/
│   ├── FileUpload.tsx            # File upload component
│   ├── LanguageSelector.tsx      # Language selection UI
│   └── TranslationPreview.tsx    # Results preview
├── test-data/
│   └── sample-en.json            # Sample translation file
├── .env.local                    # Environment variables (create this)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # This file
├── SETUP.md                      # Detailed setup guide
└── TESTING.md                    # Testing instructions
```

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing instructions.

**Quick Test:**
```bash
# 1. Start the server
npm run dev

# 2. Open http://localhost:3000

# 3. Upload test-data/sample-en.json

# 4. Select Spanish and French

# 5. Click "Translate Now"

# 6. Download and verify translations
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LINGO_API_KEY` | Yes | Your Lingo.dev API key for translations |

### Next.js Configuration

The app uses Next.js 15 with:
- App Router (not Pages Router)
- React Server Components
- API Routes for backend logic
- TypeScript strict mode

### Tailwind Configuration

Custom Tailwind setup with:
- Responsive breakpoints
- Custom color palette
- Utility classes for common patterns

## 📝 API Documentation

### POST /api/translate

Translates a JSON file to multiple target languages.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: JSON file to translate
  - `sourceLocale`: Source language code (e.g., "en")
  - `targetLocales`: JSON array of target language codes

**Response:**
```json
{
  "translations": {
    "es": { "welcome": "Bienvenido" },
    "fr": { "welcome": "Bienvenue" }
  }
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## 🐛 Troubleshooting

### "API key not configured" Error
- Ensure `.env.local` exists in the project root
- Verify `LINGO_API_KEY` is set correctly
- Restart the dev server after adding the key

### "Cannot find module" Error
- Run `npm install` to install dependencies
- Delete `node_modules` and `package-lock.json`, then reinstall

### Translation Fails
- Check your API key is valid
- Ensure you have internet connectivity
- Verify the JSON file is valid
- Check console for detailed error messages

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add `LINGO_API_KEY` environment variable
4. Deploy

### Deploy to Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Lingo.dev repository and follows its license terms.

## 🔗 Links

- **Lingo.dev**: https://lingo.dev
- **Documentation**: https://lingo.dev/docs
- **SDK Reference**: https://lingo.dev/sdk
- **Discord Community**: https://lingo.dev/go/discord

## 💡 Next Steps

Want to enhance this project? Consider adding:

- [ ] User authentication
- [ ] Project management (save/load projects)
- [ ] Translation history
- [ ] Batch file upload
- [ ] Support for YAML, XML, CSV formats
- [ ] Translation memory/glossary
- [ ] Cost estimation
- [ ] Export to different formats
- [ ] API rate limiting
- [ ] Progress tracking for large files

## 📞 Support

Need help?
- Check [SETUP.md](./SETUP.md) for detailed setup instructions
- Review [TESTING.md](./TESTING.md) for testing guidance
- Join the [Lingo.dev Discord](https://lingo.dev/go/discord)
- Open an issue on GitHub
