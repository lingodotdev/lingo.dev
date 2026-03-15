# 🌐 Global Form Auto-Localization

A demo showcasing **Lingo.dev's** structured object translation for automatic form localization.

![Lingo.dev](https://img.shields.io/badge/Powered%20by-Lingo.dev-6366f1?style=for-the-badge)

## Demo

### [🎥 Watch the Demo Video](./public/demo-video.mp4)
*(Click to play)*

## What This App Does

This demo demonstrates a real-world use case: **writing a form once in English and automatically localizing it into multiple languages** using Lingo.dev's SDK.

Instead of translating plain text, this app translates **structured form content**:

- Form title and description
- Field labels
- Input placeholders
- Helper text
- Validation error messages
- Submit button text
- **Supported Field Types**: Text, TextArea, Radio Groups, Checkboxes, Dropdowns (Select), Date inputs
- **Option Translation**: Automatically translates options for choice-based fields

## Why This Use Case Matters

Forms are everywhere in web applications—contact forms, registration flows, checkout pages, surveys. Traditionally, localizing forms requires:

1. Extracting all strings into translation files
2. Managing keys for every field property
3. Coordinating with translators for each language
4. Keeping translations in sync as forms evolve

With Lingo.dev, you can **skip the complexity**. Just pass your form structure to the API, and get back a perfectly translated form—instantly.

## Lingo.dev Features Demonstrated

| Feature | Description |
|---------|-------------|
| **`localizeObject()`** | Translates structured JavaScript objects while preserving structure |
| **Multi-language Support** | Supports EN, ES, FR, DE, HI (easily extensible) |
| **Structured Translation** | Translates nested form properties, not just flat strings |
| **API Key Authentication** | Secure API key configuration via environment variables |

## How to Run Locally

### Prerequisites

- Node.js 18+ installed
- A [Lingo.dev](https://lingo.dev) API key

### Step-by-Step Setup

1. **Navigate to the demo directory:**

   ```bash
   cd community/lingo-global-forms
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure your API key:**

   Create a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your Lingo.dev API key:

   ```
   VITE_LINGO_API_KEY=your_actual_api_key_here
   ```

   > 💡 Get your API key at [lingo.dev](https://lingo.dev)

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Edit the form** in the left panel—change labels, placeholders, error messages
2. **Select a language** from the dropdown in the preview panel
3. **Watch the form translate** automatically
4. **Submit the form** with empty required fields to see translated validation errors

## Project Structure

```
lingo-global-forms/
├── src/
│   ├── components/
│   │   ├── FormBuilder.tsx     # Form editing panel
│   │   ├── FormPreview.tsx     # Live preview with validation
│   │   └── LanguageSelect.tsx  # Language dropdown
│   ├── lib/
│   │   ├── lingo.ts            # Lingo.dev SDK initialization
│   │   └── translateForm.ts    # Translation logic with caching
│   ├── types/
│   │   └── form.ts             # TypeScript interfaces
│   ├── App.tsx                 # Main application
│   ├── main.tsx                # Entry point
│   └── index.css               # Styles
├── .env.example                # Environment variable template
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_LINGO_API_KEY` | Your Lingo.dev API key | Yes |

## License

This project is part of the [Lingo.dev](https://github.com/lingodotdev/lingo.dev) community contributions and is licensed under the Apache-2.0 license.

---

Built with ❤️ by the community for [Lingo.dev](https://lingo.dev)
