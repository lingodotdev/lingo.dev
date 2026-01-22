# LingoLive – Real-Time Multilingual App Preview

A production-ready demo application showcasing real-world usage of [Lingo.dev](https://lingo.dev) for instant localization and multilingual content management.

![LingoLive Demo](https://img.shields.io/badge/Lingo.dev-Community%20Campaign-blue?style=for-the-badge&logo=lingo.dev)

## 🎯 Project Overview

**LingoLive** demonstrates how modern applications can implement real-time localization using Lingo.dev. This isn't just a toy example – it's a fully functional, production-quality demo that shows practical implementation patterns for:

- **Live Language Switching** – Change languages instantly without page reloads
- **Dynamic Content Translation** – See UI text, error messages, and form validations localize in real-time
- **Fallback Handling** – Graceful degradation when translations are missing
- **Performance Optimization** – Caching and batch translation for smooth UX

## 🚀 Why This Demo Matters

This demo addresses real-world challenges that developers face when implementing localization:

### ✅ Practical Use Cases
- Marketing content and hero sections
- Form validation messages
- Error handling and user feedback
- Dynamic UI labels and buttons
- Interactive forms with localized validation

### ✅ Production Features
- **Type-safe** translation system with TypeScript
- **Component-based** architecture for reusability
- **Responsive design** that works on all devices
- **Loading states** and error handling
- **Accessibility** considerations with proper ARIA labels

### ✅ Developer Experience
- Clean separation between content and presentation
- Easy-to-use React hooks for translation
- Comprehensive error handling and logging
- Environment-based configuration

## 🌍 Lingo.dev Features Showcased

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Real-time Translation** | `useTranslation` hook with live updates | Users see content change instantly |
| **Batch Processing** | `translateBatch` for multiple keys | Optimized performance with fewer API calls |
| **Fallback Language** | English defaults when translation missing | No broken UI or missing text |
| **Caching Layer** | Built-in translation cache | Reduced API calls and faster switching |
| **Error Recovery** | Graceful error states and retry logic | Robust user experience |

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Localization**: Lingo.dev API
- **State Management**: React Hooks

## 📦 Project Structure

```
community/lingolive-demo/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── HeroSection.tsx    # Landing hero with animations
│   ├── InputSection.tsx   # Text input and quick actions
│   ├── LanguageSelector.tsx # Language dropdown
│   └── LivePreview.tsx   # Real-time translation preview
├── lib/                   # Core utilities
│   └── lingo.ts          # Lingo.dev integration library
├── public/               # Static assets
├── .env.example          # Environment variables template
├── README.md             # This file
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Lingo.dev API key (optional for demo)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd community/lingolive-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Lingo.dev API Configuration
   LINGO_DEV_API_KEY=your_lingo_dev_api_key_here
   LINGO_DEV_PROJECT_ID=your_project_id_here
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   > **Note**: The demo includes fallback translations, so it works even without API keys. For production use, get your API keys from [Lingo.dev](https://lingo.dev).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

1. **Select a Language** – Use the dropdown in the header to choose from 10+ supported languages
2. **Enter Content** – Type any text in the input area to see it translate in real-time
3. **Try Quick Examples** – Click the preset buttons to test different content types
4. **Test the Form** – Fill out the demo form to see localized validation messages
5. **Copy Translations** – Use the copy button to grab translated text

## 🌐 Supported Languages

| Language | Code | Flag |
|----------|------|------|
| English | en | 🇺🇸 |
| Spanish | es | 🇪🇸 |
| French | fr | 🇫🇷 |
| German | de | 🇩🇪 |
| Italian | it | 🇮🇹 |
| Portuguese | pt | 🇵🇹 |
| Japanese | ja | 🇯🇵 |
| Korean | ko | 🇰🇷 |
| Chinese | zh | 🇨🇳 |
| Russian | ru | 🇷🇺 |

## 📱 Screenshots

### Main Interface
![LingoLive Main Interface](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=LingoLive+Demo+Interface)

### Language Switching
![Language Switching](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Real-time+Language+Switching)

### Form Localization
![Form Demo](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Localized+Form+Validation)

## 🔧 Development

### Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

### Code Quality

This project follows strict code quality standards:

- **TypeScript** for type safety
- **ESLint** for code consistency
- **Tailwind CSS** for maintainable styles
- **Component-driven** architecture
- **Error boundaries** for robustness

## 🤝 Contributing

This is a demo project for the Lingo.dev Community Campaign. Feel free to:

- Report issues or bugs
- Suggest improvements
- Fork and create your own variations
- Share feedback about the demo

## 📄 License

MIT License – feel free to use this code as inspiration for your own Lingo.dev implementations.

## 🙏 Acknowledgments

- **[Lingo.dev](https://lingo.dev)** – For providing the amazing localization API
- **[Next.js](https://nextjs.org)** – For the excellent React framework
- **[Tailwind CSS](https://tailwindcss.com)** – For the utility-first CSS framework
- **[Lucide](https://lucide.dev)** – For the beautiful icon set

## 🎯 Community Campaign

This project was created for the Lingo.dev Community Campaign to demonstrate practical, real-world usage of Lingo.dev in modern web applications.

**Built with ❤️ for the developer community**

---

> **Ready to localize your own app?** Get started with [Lingo.dev](https://lingo.dev) today and see how easy real-time localization can be!