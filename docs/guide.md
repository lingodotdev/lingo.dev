---
title: "Tauri"
subtitle: "AI translation for Tauri with Lingo.dev CLI"
---

## What is Tauri?

[Tauri](https://tauri.app/) is a framework for building tiny, blazing fast, and secure desktop applications using a Rust backend and web-based frontend. It supports any frontend framework that can compile to HTML, CSS, and JavaScript, making it perfect for React, Vue, Svelte, and other modern web technologies.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide explains how to set up Lingo.dev CLI in a Tauri application with a React frontend using react-intl. You'll learn how to create a Tauri project, configure internationalization, set up a translation pipeline, and implement language switching in your desktop application.

## Step 1. Set up a Tauri project

1. Install the required dependencies:

   ```bash
   # Install Rust (required for Tauri)
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install Node.js (if not already installed)
   # Visit https://nodejs.org to download and install
   ```

2. Create a new Tauri project with React:

   ```bash
   npm create tauri-app@latest
   ```

   When prompted:
   - **Project name**: `tauri-i18n-app`
   - **Identifier**: `com.example.tauri-i18n-app`
   - **Frontend language**: TypeScript / JavaScript
   - **Package manager**: npm (or your preferred manager)
   - **UI template**: React
   - **UI flavor**: TypeScript

3. Navigate into the project directory:

   ```bash
   cd tauri-i18n-app
   ```

4. Install the required dependencies for internationalization:

   ```bash
   npm install react-intl
   ```

## Step 2. Create source content

1. Create a directory structure for storing translation files:

   ```bash
   mkdir -p src/locales
   ```

2. Create the English translation file (src/locales/en.json):

   ```json
   {
     "app.title": "Tauri i18n Demo",
     "app.description": "A multilingual desktop application",
     "nav.home": "Home",
     "nav.about": "About",
     "nav.settings": "Settings",
     "home.welcome": "Welcome to Tauri!",
     "home.description": "This is a demonstration of internationalization in Tauri applications.",
     "home.features.title": "Features",
     "home.features.fast": "Lightning fast performance",
     "home.features.secure": "Built with security in mind",
     "home.features.crossPlatform": "Works on Windows, macOS, and Linux",
     "about.title": "About This App",
     "about.description": "Built with Tauri, React, and react-intl for seamless multilingual support.",
     "settings.title": "Settings",
     "settings.language": "Language",
     "settings.theme": "Theme",
     "settings.save": "Save Settings"
   }
   ```

## Step 3. Configure the CLI

In the root of the project, create an `i18n.json` file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de", "ja", "zh"]
  },
  "buckets": {
    "json": {
      "include": ["src/locales/[locale].json"]
    }
  }
}
```

This file defines:

- the JSON files that Lingo.dev CLI should translate
- the languages to translate between

In this case, the configuration translates JSON files from English to Spanish, French, German, Japanese, and Chinese.

It's important to note that:

- `[locale]` is a placeholder that's replaced at runtime. It ensures that content is read from one location (e.g., `src/locales/en.json`) and written to a different location (e.g., `src/locales/es.json`).

To learn more, see [i18n.json configuration](/cli/fundamentals/i18n-json-config).

## Step 4. Translate the content

1. [Sign up for a Lingo.dev account](/app).

2. Log in to Lingo.dev via the CLI:

   ```bash
   npx lingo.dev@latest login
   ```

3. Run the translation pipeline:

   ```bash
   npx lingo.dev@latest run
   ```

   The CLI will create additional locale files (e.g., `src/locales/es.json`, `src/locales/fr.json`) for storing the translated content and an `i18n.lock` file for keeping track of what has been translated (to prevent unnecessary retranslations).

## Step 5. Set up react-intl in your Tauri app

1. Create a language context (src/contexts/LanguageContext.tsx):

   ```tsx
   import React, { createContext, useContext, useState, ReactNode } from 'react';

   type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

   interface LanguageContextType {
     language: Language;
     setLanguage: (lang: Language) => void;
   }

   const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

   export const useLanguage = () => {
     const context = useContext(LanguageContext);
     if (!context) {
       throw new Error('useLanguage must be used within a LanguageProvider');
     }
     return context;
   };

   interface LanguageProviderProps {
     children: ReactNode;
   }

   export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
     const [language, setLanguage] = useState<Language>('en');

     return (
       <LanguageContext.Provider value={{ language, setLanguage }}>
         {children}
       </LanguageContext.Provider>
     );
   };
   ```

2. Create a messages loader (src/utils/loadMessages.ts):

   ```ts
   import enMessages from '../locales/en.json';
   import esMessages from '../locales/es.json';
   import frMessages from '../locales/fr.json';
   import deMessages from '../locales/de.json';
   import jaMessages from '../locales/ja.json';
   import zhMessages from '../locales/zh.json';

   export const messages = {
     en: enMessages,
     es: esMessages,
     fr: frMessages,
     de: deMessages,
     ja: jaMessages,
     zh: zhMessages,
   };

   export type Language = keyof typeof messages;
   ```

3. Update your main App component (src/App.tsx):

   ```tsx
   import React from 'react';
   import { IntlProvider } from 'react-intl';
   import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
   import { messages } from './utils/loadMessages';
   import './App.css';

   const AppContent: React.FC = () => {
     const { language } = useLanguage();

     return (
       <IntlProvider 
         locale={language} 
         messages={messages[language]}
         defaultLocale="en"
       >
         <div className="container">
           <header>
             <h1>Tauri i18n Demo</h1>
             <nav>
               <a href="#home">Home</a>
               <a href="#about">About</a>
               <a href="#settings">Settings</a>
             </nav>
           </header>
           
           <main>
             <section id="home">
               <h2>Welcome to Tauri!</h2>
               <p>This is a demonstration of internationalization in Tauri applications.</p>
               
               <h3>Features</h3>
               <ul>
                 <li>Lightning fast performance</li>
                 <li>Built with security in mind</li>
                 <li>Works on Windows, macOS, and Linux</li>
               </ul>
             </section>
           </main>
         </div>
       </IntlProvider>
     );
   };

   const App: React.FC = () => {
     return (
       <LanguageProvider>
         <AppContent />
       </LanguageProvider>
     );
   };

   export default App;
   ```

## Step 6. Use the translations

1. Create a language switcher component (src/components/LanguageSwitcher.tsx):

   ```tsx
   import React from 'react';
   import { useLanguage } from '../contexts/LanguageContext';
   import { Language } from '../utils/loadMessages';

   const languages: { code: Language; name: string; flag: string }[] = [
     { code: 'en', name: 'English', flag: '🇺🇸' },
     { code: 'es', name: 'Español', flag: '🇪🇸' },
     { code: 'fr', name: 'Français', flag: '🇫🇷' },
     { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
     { code: 'ja', name: '日本語', flag: '🇯🇵' },
     { code: 'zh', name: '中文', flag: '🇨🇳' },
   ];

   export const LanguageSwitcher: React.FC = () => {
     const { language, setLanguage } = useLanguage();

     return (
       <div className="language-switcher">
         <select 
           value={language} 
           onChange={(e) => setLanguage(e.target.value as Language)}
           className="language-select"
         >
           {languages.map((lang) => (
             <option key={lang.code} value={lang.code}>
               {lang.flag} {lang.name}
             </option>
           ))}
         </select>
       </div>
     );
   };
   ```

2. Update the App component to use translations (src/App.tsx):

   ```tsx
   import React from 'react';
   import { IntlProvider, FormattedMessage } from 'react-intl';
   import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
   import { messages } from './utils/loadMessages';
   import { LanguageSwitcher } from './components/LanguageSwitcher';
   import './App.css';

   const AppContent: React.FC = () => {
     const { language } = useLanguage();

     return (
       <IntlProvider 
         locale={language} 
         messages={messages[language]}
         defaultLocale="en"
       >
         <div className="container">
           <header>
             <h1>
               <FormattedMessage id="app.title" />
             </h1>
             <LanguageSwitcher />
             <nav>
               <a href="#home">
                 <FormattedMessage id="nav.home" />
               </a>
               <a href="#about">
                 <FormattedMessage id="nav.about" />
               </a>
               <a href="#settings">
                 <FormattedMessage id="nav.settings" />
               </a>
             </nav>
           </header>
           
           <main>
             <section id="home">
               <h2>
                 <FormattedMessage id="home.welcome" />
               </h2>
               <p>
                 <FormattedMessage id="home.description" />
               </p>
               
               <h3>
                 <FormattedMessage id="home.features.title" />
               </h3>
               <ul>
                 <li>
                   <FormattedMessage id="home.features.fast" />
                 </li>
                 <li>
                   <FormattedMessage id="home.features.secure" />
                 </li>
                 <li>
                   <FormattedMessage id="home.features.crossPlatform" />
                 </li>
               </ul>
             </section>
           </main>
         </div>
       </IntlProvider>
     );
   };

   const App: React.FC = () => {
     return (
       <LanguageProvider>
         <AppContent />
       </LanguageProvider>
     );
   };

   export default App;
   ```

3. Add some basic styling (src/App.css):

   ```css
   .container {
     max-width: 800px;
     margin: 0 auto;
     padding: 20px;
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
   }

   header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 30px;
     padding-bottom: 20px;
     border-bottom: 1px solid #eee;
   }

   .language-switcher {
     margin: 10px 0;
   }

   .language-select {
     padding: 8px 12px;
     border: 1px solid #ddd;
     border-radius: 4px;
     background: white;
     font-size: 14px;
     cursor: pointer;
   }

   nav {
     display: flex;
     gap: 20px;
   }

   nav a {
     text-decoration: none;
     color: #333;
     padding: 8px 16px;
     border-radius: 4px;
     transition: background-color 0.2s;
   }

   nav a:hover {
     background-color: #f5f5f5;
   }

   h1, h2, h3 {
     color: #333;
   }

   h1 {
     font-size: 2.5em;
     margin-bottom: 20px;
   }

   h2 {
     font-size: 2em;
     margin-bottom: 15px;
   }

   h3 {
     font-size: 1.5em;
     margin-bottom: 10px;
   }

   p {
     line-height: 1.6;
     margin-bottom: 15px;
   }

   ul {
     list-style-type: disc;
     padding-left: 20px;
   }

   li {
     margin-bottom: 8px;
   }
   ```

## Step 7. Test the application

1. Start the Tauri development server:

   ```bash
   npm run tauri dev
   ```

2. The application window should open with your multilingual Tauri app.

3. Test the language switching by using the dropdown in the header. The interface should instantly update to display content in the selected language.

4. Verify that all translated content appears correctly in each language.

## Step 8. Build for production

1. Build the optimized version of your application:

   ```bash
   npm run tauri build
   ```

2. The built application will be available in the `src-tauri/target/release/bundle/` directory, with installers for your operating system.

## Advanced features

### Persisting language preference

To save the user's language preference between sessions, you can use Tauri's storage API:

1. Install the required Tauri plugin:

   ```bash
   npm install @tauri-apps/plugin-store
   ```

2. Update your `src-tauri/Cargo.toml` to include the store plugin:

   ```toml
   [dependencies]
   tauri-plugin-store = { version = "2.0", features = ["protocol-json"] }
   ```

3. Update your `src-tauri/src/main.rs` to initialize the plugin:

   ```rust
   #[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
   fn main() {
       tauri::Builder::default()
           .plugin(tauri_plugin_store::Builder::default().build())
           .run(tauri::generate_context!())
           .expect("error while running tauri application");
   }
   ```

4. Modify your LanguageContext to persist the preference:

   ```tsx
   import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
   import { Store } from '@tauri-apps/plugin-store';

   // ... (rest of the imports and types)

   export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
     const [language, setLanguageState] = useState<Language>('en');

     const setLanguage = async (lang: Language) => {
       setLanguageState(lang);
       const store = await Store.load('settings.json');
       await store.set('language', lang);
       await store.save();
     };

     useEffect(() => {
       const loadLanguage = async () => {
         try {
           const store = await Store.load('settings.json');
           const savedLanguage = await store.get<Language>('language');
           if (savedLanguage && ['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(savedLanguage)) {
             setLanguageState(savedLanguage);
           }
         } catch (error) {
           console.error('Failed to load language preference:', error);
         }
       };
       loadLanguage();
     }, []);

     return (
       <LanguageContext.Provider value={{ language, setLanguage }}>
         {children}
       </LanguageContext.Provider>
     );
   };
   ```

## Known limitations

- **Bundle size**: Including multiple language files will increase your application bundle size. Consider lazy loading languages for large applications.
- **Right-to-left languages**: This guide doesn't cover RTL language support. You may need additional CSS and configuration for languages like Arabic or Hebrew.
- **System integration**: Some system-level elements (like window titles or system tray tooltips) may require additional Tauri configuration for proper localization.

## Next steps

To learn more about Tauri and internationalization:

- [Tauri documentation](https://tauri.app/v1/guides/)
- [react-intl documentation](https://formatjs.io/docs/react-intl/)
- [Tauri plugin system](https://tauri.app/v1/guides/features/plugins/)
- [Advanced i18n patterns](https://formatjs.io/docs/guides/advanced-usage/)
