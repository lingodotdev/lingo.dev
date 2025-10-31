---
title: Electron
description: Learn how to use Lingo.dev CLI with Electron to build multilingual desktop applications
---

# Electron

[Electron](https://www.electronjs.org/) is a framework for building cross-platform desktop applications using web technologies. This guide will show you how to integrate Lingo.dev CLI into an Electron application using React and react-intl.

## Prerequisites

Before you begin, make sure you have:

- [Node.js](https://nodejs.org/) installed (v18 or later)
- A [Lingo.dev account](https://lingo.dev/signup)
- [Lingo.dev CLI](https://lingo.dev/en/cli/getting-started) installed

## Step 1: Create a new Electron project

Create a new directory and initialize a new Electron project:

```bash
mkdir my-electron-app
cd my-electron-app
npm init -y
```

Install Electron and development dependencies:

```bash
npm install --save-dev electron electron-builder webpack webpack-cli webpack-dev-server
npm install --save-dev html-webpack-plugin babel-loader @babel/core @babel/preset-react @babel/preset-typescript
npm install --save-dev typescript @types/react @types/react-dom ts-loader
```

Install React and react-intl:

```bash
npm install react react-dom react-intl
```

## Step 2: Set up the project structure

Create the following directory structure:

```bash
mkdir -p src/main src/renderer src/locales
```

Create `src/main/main.ts` for the Electron main process:

```typescript
import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

Create `src/renderer/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Electron + React</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

Create `src/renderer/index.tsx`:

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IntlProvider } from './i18n/IntlProvider';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <IntlProvider>
      <App />
    </IntlProvider>
  </React.StrictMode>
);
```

Create `src/renderer/App.tsx`:

```tsx
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import './App.css';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const intl = useIntl();

  const handleGreet = () => {
    if (name) {
      setGreeting(
        intl.formatMessage(
          { id: 'app.greeting.message', defaultMessage: 'Hello, {name}!' },
          { name }
        )
      );
    }
  };

  return (
    <div className="app">
      <LanguageSwitcher />
      <main className="container">
        <h1>
          <FormattedMessage
            id="app.welcome"
            defaultMessage="Welcome to Electron + React"
          />
        </h1>

        <div className="greet-section">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={intl.formatMessage({
              id: 'app.input.placeholder',
              defaultMessage: 'Enter your name...',
            })}
          />
          <button onClick={handleGreet}>
            <FormattedMessage id="app.greet.button" defaultMessage="Greet" />
          </button>
        </div>

        {greeting && <p className="greeting">{greeting}</p>}

        <div className="info">
          <FormattedMessage
            id="app.info"
            defaultMessage="This is a multilingual Electron application powered by Lingo.dev"
          />
        </div>
      </main>
    </div>
  );
};

export default App;
```

Create `src/renderer/App.css`:

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 40px;
}

.greet-section {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

input {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  flex: 1;
  max-width: 300px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.greeting {
  font-size: 1.5em;
  margin: 20px 0;
}

.info {
  margin-top: 40px;
  opacity: 0.9;
}
```

## Step 3: Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Step 4: Configure Webpack

Create `webpack.config.js`:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rendererConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist/renderer'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
  },
};

const mainConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/main/main.ts',
  target: 'electron-main',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/main'),
  },
};

module.exports = [mainConfig, rendererConfig];
```

Install additional webpack dependencies:

```bash
npm install --save-dev style-loader css-loader
```

## Step 5: Update package.json

Update your `package.json` with the following scripts:

```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "dist/main/main.js",
  "scripts": {
    "start": "npm run build:main && electron .",
    "dev": "concurrently \"npm run dev:renderer\" \"npm run dev:main\"",
    "dev:renderer": "webpack serve --config webpack.config.js",
    "dev:main": "NODE_ENV=development webpack --config webpack.config.js --watch",
    "build": "NODE_ENV=production webpack --config webpack.config.js",
    "build:main": "webpack --config webpack.config.js",
    "package": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.example.myelectronapp",
    "files": [
      "dist/**/*",
      "package.json"
    ],
    "directories": {
      "output": "release"
    }
  }
}
```

Install concurrently for running multiple dev scripts:

```bash
npm install --save-dev concurrently
```

## Step 6: Initialize Lingo.dev

Initialize Lingo.dev in your project:

```bash
lingo init
```

Follow the prompts:
- Select your project from the list or create a new one
- Choose your source language (e.g., `en` for English)
- Choose your target languages (e.g., `es` for Spanish, `fr` for French, `de` for German)

This will create a `lingo.config.json` file in your project root.

## Step 7: Configure Lingo.dev

Update your `lingo.config.json` to specify where translations should be stored:

```json
{
  "project": "your-project-id",
  "source": "en",
  "targets": ["es", "fr", "de"],
  "format": "react-intl",
  "output": "src/locales/{locale}.json"
}
```

## Step 8: Set up the IntlProvider

Create `src/renderer/i18n/IntlProvider.tsx`:

```tsx
import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

interface IntlContextType {
  locale: string;
  changeLocale: (locale: string) => void;
}

const IntlContext = createContext<IntlContextType>({
  locale: 'en',
  changeLocale: () => {},
});

export const useLocale = () => useContext(IntlContext);

interface Props {
  children: ReactNode;
}

const loadMessages = async (locale: string) => {
  try {
    const messages = await import(`../../locales/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
};

export const IntlProvider: React.FC<Props> = ({ children }) => {
  const [locale, setLocale] = useState<string>('en');
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const initializeLocale = async () => {
      // Check localStorage for saved preference
      const savedLocale = localStorage.getItem('locale');
      
      // Get system locale from Electron
      const systemLocale = navigator.language.split('-')[0];
      const supportedLocales = ['en', 'es', 'fr', 'de'];
      
      const selectedLocale = savedLocale && supportedLocales.includes(savedLocale)
        ? savedLocale
        : supportedLocales.includes(systemLocale)
        ? systemLocale
        : 'en';

      setLocale(selectedLocale);
      const loadedMessages = await loadMessages(selectedLocale);
      setMessages(loadedMessages);
    };

    initializeLocale();
  }, []);

  const changeLocale = async (newLocale: string) => {
    const loadedMessages = await loadMessages(newLocale);
    setMessages(loadedMessages);
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <IntlContext.Provider value={{ locale, changeLocale }}>
      <ReactIntlProvider locale={locale} messages={messages}>
        {children}
      </ReactIntlProvider>
    </IntlContext.Provider>
  );
};
```

## Step 9: Create the language switcher

Create `src/renderer/components/LanguageSwitcher.tsx`:

```tsx
import React from 'react';
import { useLocale } from '../i18n/IntlProvider';
import './LanguageSwitcher.css';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSwitcher: React.FC = () => {
  const { locale, changeLocale } = useLocale();

  return (
    <div className="language-switcher">
      <select 
        value={locale} 
        onChange={(e) => changeLocale(e.target.value)}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
```

Create `src/renderer/components/LanguageSwitcher.css`:

```css
.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
}

.language-switcher select {
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.language-switcher select:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.language-switcher select option {
  background-color: #667eea;
  color: white;
}
```

## Step 10: Extract translations

Extract translation strings from your components:

```bash
lingo extract
```

This command will scan your code for `FormattedMessage` components and `intl.formatMessage()` calls, creating or updating `src/locales/en.json` with the source messages.

## Step 11: Push to Lingo.dev

Upload your source messages to Lingo.dev:

```bash
lingo push
```

## Step 12: Translate in Lingo.dev

1. Open your project in [Lingo.dev](https://lingo.dev)
2. Navigate to the translations view
3. Add translations for your target languages (or use AI-powered auto-translation)
4. Review and approve the translations

## Step 13: Pull translations

Download the translated messages:

```bash
lingo pull
```

This will download translation files for all your target languages to `src/locales/`.

## Step 14: Run your application

Start the development server:

```bash
npm run dev
```

In a separate terminal, start Electron:

```bash
npm start
```

Your Electron application will launch with translations based on the system locale, and users can switch languages using the language switcher.

## Step 15: Build for production

Build your application for production:

```bash
npm run build
```

Package your application:

```bash
npm run package
```

This will create distributable packages in the `release` folder for your current platform.

## Advanced: IPC for locale detection

For a more robust locale detection, you can use Electron's IPC to get the system locale from the main process.

Update `src/main/main.ts`:

```typescript
// ...existing code...
import { app, BrowserWindow, ipcMain } from 'electron';

// ...existing code...

ipcMain.handle('get-locale', () => {
  return app.getLocale();
});

// ...existing code...
```

Create `src/renderer/preload.ts`:

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getLocale: () => ipcRenderer.invoke('get-locale'),
});
```

Update `src/main/main.ts` to use the preload script:

```typescript
// ...existing code...

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      contextIsolation: true,
    },
  });

  // ...existing code...
}

// ...existing code...
```

Update your webpack config to build the preload script:

```javascript
// ...existing code...

const preloadConfig = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/renderer/preload.ts',
  target: 'electron-preload',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, 'dist/renderer'),
  },
};

module.exports = [mainConfig, rendererConfig, preloadConfig];
```

Update `src/renderer/i18n/IntlProvider.tsx` to use the API:

```typescript
// ...existing code...

declare global {
  interface Window {
    electronAPI: {
      getLocale: () => Promise<string>;
    };
  }
}

export const IntlProvider: React.FC<Props> = ({ children }) => {
  // ...existing code...

  useEffect(() => {
    const initializeLocale = async () => {
      const savedLocale = localStorage.getItem('locale');
      
      let systemLocale = 'en';
      if (window.electronAPI) {
        const electronLocale = await window.electronAPI.getLocale();
        systemLocale = electronLocale.split('-')[0];
      } else {
        systemLocale = navigator.language.split('-')[0];
      }
      
      const supportedLocales = ['en', 'es', 'fr', 'de'];
      
      const selectedLocale = savedLocale && supportedLocales.includes(savedLocale)
        ? savedLocale
        : supportedLocales.includes(systemLocale)
        ? systemLocale
        : 'en';

      setLocale(selectedLocale);
      const loadedMessages = await loadMessages(selectedLocale);
      setMessages(loadedMessages);
    };

    initializeLocale();
  }, []);

  // ...existing code...
};
```

## Continuous localization workflow

To keep your translations in sync as you develop:

1. **Extract** new translation strings:
   ```bash
   lingo extract
   ```

2. **Push** changes to Lingo.dev:
   ```bash
   lingo push
   ```

3. **Translate** in the Lingo.dev dashboard

4. **Pull** updated translations:
   ```bash
   lingo pull
   ```

5. **Test** your application with the new translations

## Best practices

- **Namespace your translation IDs**: Use descriptive, hierarchical IDs like `app.welcome`, `menu.file.open`, etc.
- **Provide default messages**: Always include `defaultMessage` in your `FormattedMessage` components for better developer experience
- **Handle missing translations gracefully**: The IntlProvider will fall back to the source language if translations are missing
- **Automate with CI/CD**: Integrate `lingo push` and `lingo pull` into your build pipeline
- **Use ICU Message Format**: Take advantage of pluralization, gender, and number formatting features
- **Test all platforms**: Build and test your app on Windows, macOS, and Linux with different locales

## Troubleshooting

### Translations not loading

Make sure your locale files are in the correct location (`src/locales/{locale}.json`) and that webpack can properly bundle them. Check the browser console for import errors.

### Webpack build errors

Ensure all loaders are properly configured and that TypeScript files are being processed correctly. Run `npm run build` to see detailed error messages.

### Missing translations

Check that you've run `lingo extract` after adding new `FormattedMessage` components, and that you've pushed and pulled translations from Lingo.dev.

### Electron security warnings

If you see security warnings, ensure you're using `contextIsolation: true` and a proper preload script for IPC communication.

## Next steps

- Explore [react-intl's documentation](https://formatjs.io/docs/react-intl/) for advanced formatting options
- Learn about [Electron's IPC](https://www.electronjs.org/docs/latest/tutorial/ipc) for more complex integrations
- Set up [automated workflows](https://lingo.dev/en/cli/automation) with GitHub Actions
- Add [spell checking](https://www.electronjs.org/docs/latest/tutorial/spellchecker) in multiple languages
- Implement [native menus](https://www.electronjs.org/docs/latest/api/menu) with localized text

---

**Need help?** Join our [community Discord](https://lingo.dev/discord) or check out the [CLI documentation](https://lingo.dev/en/cli).