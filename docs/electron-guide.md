# Electron - Lingo.dev CLI

## What is Electron?

Electron is a framework for building cross-platform desktop applications using web technologies like JavaScript, HTML, and CSS. It combines Chromium and Node.js into a single runtime, allowing you to build desktop apps with web technologies.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide explains how to set up Lingo.dev CLI in an Electron application. You'll learn how to scaffold a project with Electron, configure a translation pipeline using react-intl, and implement language switching in your desktop application.

## Step 1. Set up an Electron project

1. **Create a new Electron project with React:**

```bash
# Create a new directory for your project
mkdir electron-i18n-example
cd electron-i18n-example

# Initialize a new npm project
npm init -y

# Install Electron and development dependencies
npm install --save-dev electron electron-builder concurrently wait-on
npm install --save-dev @electron/remote

# Install React and related dependencies
npm install react react-dom react-scripts
```

2. **Set up the project structure:**

```bash
# Create necessary directories
mkdir -p src/main src/renderer public

# Create basic HTML file
touch public/index.html
```

3. **Create a basic `public/index.html` file:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Electron i18n Example</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

4. **Create the main process file `src/main/index.js`:**

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

5. **Update `package.json` with scripts:**

```json
{
  "name": "electron-i18n-example",
  "version": "1.0.0",
  "main": "src/main/index.js",
  "scripts": {
    "start": "concurrently \"npm run start:react\" \"npm run start:electron\"",
    "start:react": "BROWSER=none react-scripts start",
    "start:electron": "wait-on http://localhost:3000 && electron .",
    "build": "react-scripts build && electron-builder",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "build": {
    "appId": "com.example.electron-i18n",
    "files": [
      "build/**/*",
      "node_modules/**/*",
      "src/main/**/*"
    ],
    "directories": {
      "buildResources": "assets"
    }
  }
}
```

6. **Install additional dependencies:**

```bash
npm install electron-is-dev
```

## Step 2. Set up react-intl for internationalization

1. **Install react-intl and related dependencies:**

```bash
npm install react-intl
```

2. **Create a directory for storing localizable content:**

```bash
mkdir -p src/locales
```

3. **Create a file that contains some localizable content (e.g., `src/locales/en.json`):**

```json
{
  "app.title": "Electron Internationalization Example",
  "app.description": "This text is translated by Lingo.dev",
  "app.greeting": "Hello, {name}!",
  "app.toggle": "Switch Language",
  "app.counter": "You clicked {count} times"
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
    "targets": ["es", "fr", "de", "ja"]
  },
  "buckets": {
    "json": {
      "include": ["src/locales/[locale].json"]
    }
  }
}
```

This file defines:

- the files that Lingo.dev CLI should translate
- the languages to translate between

In this case, the configuration translates JSON files from English to Spanish, French, German, and Japanese.

It's important to note that:

- `[locale]` is a placeholder that's replaced at runtime. It ensures that content is read from one location (e.g., `src/locales/en.json`) and written to a different location (e.g., `src/locales/es.json`).
- Lingo.dev CLI supports various file formats including JSON, MDX, and more.

To learn more, see [i18n.json configuration](https://lingo.dev/en/cli/configuration).

## Step 4. Translate the content

1. **Sign up for a Lingo.dev account.**

2. **Log in to Lingo.dev via the CLI:**

```bash
npx lingo.dev@latest login
```

3. **Run the translation pipeline:**

```bash
npx lingo.dev@latest run
```

The CLI will create translation files (e.g., `src/locales/es.json`, `src/locales/fr.json`, etc.) for storing the translated content and an `i18n.lock` file for keeping track of what has been translated (to prevent unnecessary retranslations).

## Step 5. Implement language switching in your React app

1. **Create a React component for the app (`src/renderer/App.js`):**

```jsx
import React, { useState } from 'react';
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl';

// Import all locale messages
import enMessages from '../locales/en.json';
import esMessages from '../locales/es.json';
import frMessages from '../locales/fr.json';
import deMessages from '../locales/de.json';
import jaMessages from '../locales/ja.json';

const messages = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  ja: jaMessages
};

function LanguageSwitcher({ currentLocale, onLocaleChange }) {
  return (
    <div>
      <select 
        value={currentLocale} 
        onChange={(e) => onLocaleChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>
        <FormattedMessage 
          id="app.counter" 
          values={{ count }} 
        />
      </p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

function App() {
  const [locale, setLocale] = useState('en');
  
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div className="App">
        <header>
          <h1>
            <FormattedMessage id="app.title" />
          </h1>
          <p>
            <FormattedMessage id="app.description" />
          </p>
          <p>
            <FormattedMessage 
              id="app.greeting" 
              values={{ name: 'Electron' }} 
            />
          </p>
          <LanguageSwitcher 
            currentLocale={locale} 
            onLocaleChange={setLocale} 
          />
          <Counter />
        </header>
      </div>
    </IntlProvider>
  );
}

export default App;
```

2. **Create the entry point for the React app (`src/renderer/index.js`):**

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

3. **Update the project structure to include the React components:**

```bash
# Create the renderer directory if it doesn't exist
mkdir -p src/renderer

# Create the React component files
touch src/renderer/App.js
touch src/renderer/index.js
```

4. **Configure React to use the renderer directory:**

Create a `jsconfig.json` file in the root of your project:

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

## Step 6. Test the application

1. **Start the development server:**

```bash
npm start
```

This will launch both the React development server and the Electron application.

2. **Verify that the language switching works:**
   - The application should display content in English by default
   - Selecting a different language from the dropdown should update all translated text
   - The counter should continue to function in all languages

## Known limitations

- Electron applications need to bundle translation files with the application, which means that new translations require a new application build.
- For dynamic content that changes frequently, consider implementing a remote translation service.

## Next steps

To learn more about Electron and internationalization:

- [Electron Documentation](https://www.electronjs.org/docs)
- [react-intl Documentation](https://formatjs.io/docs/react-intl/)
- [Lingo.dev CLI Configuration](https://lingo.dev/en/cli/configuration)