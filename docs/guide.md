---
title: "Tauri"
subtitle: "AI translation for Tauri apps with Lingo.dev CLI"
---

## What is Tauri?

[Tauri](https://tauri.app/) is a framework for building tiny, secure desktop applications with web technologies. It combines a Rust backend with a web frontend, allowing you to create cross-platform desktop apps using HTML, CSS, and JavaScript while maintaining native performance and security.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide explains how to set up Lingo.dev CLI in a Tauri application. You'll learn how to scaffold a project with Tauri, set up internationalization using react-intl, configure a translation pipeline, and test the results in your desktop app.

## Step 1. Set up a Tauri project

1. Install Rust (if not already installed):
   ```bash
   # On macOS/Linux:
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # On Windows, visit: https://rustup.rs/
   ```

2. Create a new Tauri project with React:
   ```bash
   npm create tauri-app@latest my-tauri-app
   ```
   
   When prompted:
   - Choose **React** for the UI template
   - Choose **TypeScript** for the language
   - Choose **npm** for the package manager

3. Navigate into the project directory:
   ```bash
   cd my-tauri-app
   ```

4. Install the required dependencies:
   ```bash
   npm install
   npm install react-intl
   ```

## Step 2. Set up internationalization

1. Create the necessary directories:
   ```bash
   mkdir src/i18n src/components src/types
   ```

2. Create a TypeScript declaration file (`src/types/json.d.ts`):
   ```typescript
   declare module '*.json' {
     const value: Record<string, any>;
     export default value;
   }
   ```

3. Create the source translation file (`src/i18n/en.json`):
   ```json
   {
     "app": {
       "title": "Welcome to Tauri",
       "description": "This text is automatically translated by Lingo.dev"
     },
     "buttons": {
       "getStarted": "Get Started",
       "learnMore": "Learn More"
     }
   }
   ```

4. Create an i18n configuration file (`src/i18n/config.ts`):
   ```typescript
   import en from './en.json';
   
   export const locales = ['en', 'es'] as const;
   export type Locale = typeof locales[number];
   
   export const getBrowserLocale = (): Locale => {
     const browserLocale = navigator.language.split('-')[0];
     return locales.includes(browserLocale as Locale) ? browserLocale as Locale : 'en';
   };
   ```

5. Create an IntlProvider component (`src/components/IntlProvider.tsx`):
   ```typescript
   import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react';
   import { IntlProvider as ReactIntlProvider } from 'react-intl';
   import { Locale, getBrowserLocale } from '../i18n/config';
   import en from '../i18n/en.json';
   
   interface IntlContextType {
     locale: Locale;
     setLocale: (locale: Locale) => void;
   }
   
   const IntlContext = createContext<IntlContextType | undefined>(undefined);
   
   export const useIntlContext = () => {
     const context = useContext(IntlContext);
     if (!context) {
       throw new Error('useIntlContext must be used within an IntlProvider');
     }
     return context;
   };
   
   interface Props {
     children: ReactNode;
   }
   
   export const IntlProvider: React.FC<Props> = ({ children }) => {
     const [locale, setLocale] = useState<Locale>(getBrowserLocale());
     const [messages, setMessages] = useState<Record<string, any>>(en);
   
     useEffect(() => {
       const loadMessages = async () => {
         if (locale === 'en') {
           setMessages(en);
         } else {
           try {
             const translations = await import(`../i18n/${locale}.json`);
             setMessages(translations.default);
           } catch {
             setMessages(en);
           }
         }
       };
   
       loadMessages();
     }, [locale]);
   
     return (
       <IntlContext.Provider value={{ locale, setLocale }}>
         <ReactIntlProvider
           locale={locale}
           messages={messages}
           defaultLocale="en"
         >
           {children}
         </ReactIntlProvider>
       </IntlContext.Provider>
     );
   };
   ```

6. Update your main App component (`src/App.tsx`):
   ```typescript
   import React from "react";
   import { FormattedMessage } from 'react-intl';
   import { IntlProvider, useIntlContext } from './components/IntlProvider';
   import { locales, Locale } from './i18n/config';
   import "./App.css";
   
   const AppContent: React.FC = () => {
     const { locale, setLocale } = useIntlContext();
   
     return (
       <div className="container">
         <h1>
           <FormattedMessage id="app.title" />
         </h1>
         <p>
           <FormattedMessage id="app.description" />
         </p>
   
         <div style={{ margin: '20px 0' }}>
           <label htmlFor="language-select">Language: </label>
           <select 
             id="language-select"
             value={locale} 
             onChange={(e) => setLocale(e.target.value as Locale)}
           >
             {locales.map((loc) => (
               <option key={loc} value={loc}>
                 {loc === 'en' ? 'English' : loc.toUpperCase()}
               </option>
             ))}
           </select>
         </div>
   
         <div style={{ display: 'flex', gap: '10px' }}>
           <button>
             <FormattedMessage id="buttons.getStarted" />
           </button>
           <button>
             <FormattedMessage id="buttons.learnMore" />
           </button>
         </div>
       </div>
     );
   };
   
   function App() {
     return (
       <IntlProvider>
         <AppContent />
       </IntlProvider>
     );
   }
   
   export default App;
   ```

## Step 3. Configure the CLI

In the root of your project, create an `i18n.json` file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "json": {
      "include": ["src/i18n/[locale].json"]
    }
  }
}
```

This file defines:
- the JSON files that Lingo.dev CLI should translate
- the languages to translate between

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

The CLI will create translated JSON files (e.g., `src/i18n/es.json`) and an `i18n.lock` file for keeping track of what has been translated.

## Step 5. Test the translations

1. Start the development server:
   ```bash
   npm run tauri dev
   ```

2. The Tauri application will launch in a desktop window. You should see:
   - The app interface in English by default
   - A language selector dropdown
   - All text strings using the FormattedMessage components

3. Use the language selector to switch between languages and verify that:
   - Text changes to the selected language
   - All UI elements are properly translated
   - If Spanish translations don't exist yet, it will fallback to English

## Step 6. Build for production

1. Build the application:
   ```bash
   npm run tauri build
   ```

2. The built application will be available in the `src-tauri/target/release` directory.

This setup provides a basic internationalization foundation for your Tauri desktop application, with AI-powered translations managed through Lingo.dev CLI.
