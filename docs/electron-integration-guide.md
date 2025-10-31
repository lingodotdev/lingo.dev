# Electron

This guide shows you how to integrate Lingo.dev CLI with an Electron application using React and `react-intl` for internationalization.

## Prerequisites

Before you begin, make sure you have:

- Node.js (v16 or higher) and npm installed
- Basic knowledge of JavaScript, React, and Electron

## Step 1: Create a New Electron Application

Start by creating a new Electron project. Create a new directory and initialize it:

```bash
mkdir my-electron-app
cd my-electron-app
npm init -y
```

Install Electron as a dependency:

```bash
npm install electron
```

Create a basic Electron main process file `main.js`:

```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.loadFile(path.join(__dirname, 'renderer/index.html'))
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

Update your `package.json` to include the main entry point:

```json
{
  "main": "main.js",
  "scripts": {
    "start": "npm run build && electron ."
  }
}
```

## Step 2: Set Up React

Install React and React DOM:

```bash
npm install react react-dom
```

For bundling, we'll use `esbuild`. Install it as a dev dependency:

```bash
npm install --save-dev esbuild
```

Create the renderer directory structure:

```bash
mkdir -p renderer
```

Create `renderer/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Electron + Lingo.dev</title>
</head>
<body>
  <div id="root"></div>
  <script src="./dist/bundle.js"></script>
</body>
</html>
```

Create `renderer/index.js`:

```javascript
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app.js'

const root = createRoot(document.getElementById('root'))
root.render(<App />)
```

Create `renderer/App.js`:

```javascript
import React from 'react'

function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Hello!</h1>
    </div>
  )
}

export default App
```

Add the build script to `package.json`:

```json
{
  "scripts": {
    "build": "esbuild renderer/index.js --bundle --outfile=renderer/dist/bundle.js --format=iife --platform=browser --target=chrome100 --jsx=automatic --loader:.js=jsx --loader:.json=json",
    "start": "npm run build && electron ."
  }
}
```

Test your setup:

```bash
npm start
```

You should see a window with "Hello!" displayed.

## Step 3: Install and Configure react-intl

Install `react-intl`:

```bash
npm install react-intl
```

Update `renderer/app.js` to use `react-intl`:

```javascript
import React, { useState } from 'react'
import { IntlProvider, FormattedMessage } from 'react-intl'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'

const messages = { en, fr }

function App() {
  const [locale, setLocale] = useState('en')

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>
          <FormattedMessage id="app.greeting" defaultMessage="Hello!" />
        </h1>
        <button onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}>
          <FormattedMessage id="app.changeLanguage" defaultMessage="Change Language" />
        </button>
      </div>
    </IntlProvider>
  )
}

export default App
```

## Step 4: Install and Initialize Lingo.dev CLI

Install Lingo.dev CLI as a dev dependency:

```bash
npm install --save-dev lingo.dev
```

**Important:** In Electron environments, the standard `npx` commands from the documentation may not work properly. Instead, use the direct Node.js commands.

Initialize Lingo.dev in your project:

```bash
node ./node_modules/lingo.dev/bin/cli.mjs init
```

This command will create an `i18n.json` configuration file. However, you'll need to replace it with the correct configuration for your Electron project.

Replace the generated `i18n.json` file with the following configuration:

```json
{
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["fr"]
  },
  "buckets": {
    "json": {
      "include": ["i18n/[locale].json"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

This configuration tells Lingo.dev:
- Your source language is English (`en`)
- Your target language is French (`fr`)
- Translation files are located in the `i18n` directory with the pattern `i18n/[locale].json`

## Step 5: Authenticate with Lingo.dev

Before you can generate translations, you need to authenticate and get your (LINGODOTDEV_API_KEY) API key. Run:

```bash
node ./node_modules/lingo.dev/bin/cli.mjs login
```

Follow the prompts to log in to your Lingo.dev account. If you don't have an account, you can create one during this process. This command will authenticate your session and store your API credentials.

## Step 6: Generate Translations

Now you can generate translations for your application. Run:

```bash
node ./node_modules/lingo.dev/bin/cli.mjs run
```

This command will:
1. Scan your source files for translatable content (strings with `FormattedMessage` components)
2. Extract the message IDs and default messages
3. Translate them to your target language(s) using Lingo.dev's AI translation service
4. Update the translation files in the `i18n` directory

After running this command, check `i18n/fr.json` - it should contain the French translations generated by Lingo.dev.

Now replace the `i18n` directory with these basic files:

Replace `i18n/en.json`:

```json
{
  "app.greeting": "Hello!",
  "app.changeLanguage": "Change Language"
}
```

Replace `i18n/fr.json` (temporary, will be managed by Lingo.dev):

```json
{
  "app.greeting": "Bonjour!",
  "app.changeLanguage": "Changer la langue"
}
```


## Step 7: npm run start



## Working with Translations

### Adding New Translatable Strings

When you add new text to your application, use the `FormattedMessage` component:

```javascript
import { FormattedMessage } from 'react-intl'

// In your component
<button>
  <FormattedMessage id="app.saveButton" defaultMessage="Save" />
</button>
```

After adding new strings, run:

```bash
node ./node_modules/lingo.dev/bin/cli.mjs run
```

Lingo.dev will detect the new strings, add them to your source language file, and translate them to your target languages.

### Updating Translations

If you modify an existing string in your code, Lingo.dev will detect the change and update the translations accordingly. Just run:

```bash
node ./node_modules/lingo.dev/bin/cli.mjs run
```

### Adding More Languages

To add more target languages, update your `i18n.json`:

```json
{
  "locale": {
    "source": "en",
    "targets": ["fr", "es", "de"]
  }
}
```

Then run `node ./node_modules/lingo.dev/bin/cli.mjs run` to generate translations for the new languages.

Don't forget to update your `App.js` to import and include the new language files:

```javascript
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'
import es from '../i18n/es.json'
import de from '../i18n/de.json'

const messages = { en, fr, es, de }
```

## Step 8: Building for Production

When building your Electron app for distribution, make sure to include the translation files in your build process. The translation files should be copied to your distribution folder.

If you're using a build tool like Electron Builder, you can configure it to include the `i18n` directory in your final package.

## Troubleshooting

### Translations Not Updating

If your translations aren't updating when you change languages:
- Ensure the message IDs in your code match the keys in your JSON files exactly (including the `app.` prefix)
- Check that you're importing the correct locale files
- Verify that the `IntlProvider` is receiving the correct `messages` prop

### Build Errors

If you encounter build errors with esbuild:
- Make sure all dependencies are installed: `npm install`
- Verify that the `--loader:.json=json` flag is included in your build command
- Check that file paths match (case-sensitive on some systems)

### Lingo.dev CLI Issues

If the CLI isn't detecting your strings:
- Ensure your source files are in the directories that Lingo.dev is scanning
- Check that you're using `FormattedMessage` components with proper `id` and `defaultMessage` props
- Verify your `i18n.json` configuration is correct
- Make sure you've authenticated by running `node ./node_modules/lingo.dev/bin/cli.mjs login`

### Using Node Commands Instead of npx

If you encounter issues with `npx` commands in your Electron environment, always use the direct Node.js commands:
- `node ./node_modules/lingo.dev/bin/cli.mjs init` instead of `npx lingo.dev@latest init`
- `node ./node_modules/lingo.dev/bin/cli.mjs login` instead of `npx lingo.dev@latest login`
- `node ./node_modules/lingo.dev/bin/cli.mjs run` instead of `npx lingo.dev@latest i18n`

## Additional Resources

- [Lingo.dev CLI Documentation](https://lingo.dev/docs)
- [react-intl Documentation](https://formatjs.io/docs/react-intl/)
- [Electron Documentation](https://www.electronjs.org/docs)