# Lingo.dev CLI Integration Guide for Angular

This guide takes you from a fresh Angular app to a multilingual workflow using the Lingo.dev CLI. You'll translate your project with a single command and keep translations up to date via CI.

## Prerequisites

- Node.js 18+
- pnpm, npm, or yarn (examples use pnpm)
- An AI API key supported by Lingo.dev (Groq, Google, or Mistral)
  - Set as an environment variable, e.g. `GROQ_API_KEY`, `GOOGLE_API_KEY`, or `MISTRAL_API_KEY`

## 1) Create a new Angular project

```bash
pnpm dlx @angular/cli@latest new my-angular-app --routing --style=scss
cd my-angular-app
pnpm install
pnpm start
```

Open http://localhost:4200 to confirm the app runs.

## 2) Add Lingo.dev CLI

You can run the CLI without installing:

```bash
npx lingo.dev@latest --help
```

Or install as a dev dependency:

```bash
pnpm add -D lingo.dev
```

## 3) Create `i18n.json`

At the root of your Angular app, add an `i18n.json` file to describe what to translate.

```json
{
  "sourceLocale": "en",
  "targetLocales": ["es", "fr"],
  "include": [
    "src/**/*.ts",
    "src/**/*.html"
  ],
  "exclude": [
    "node_modules/**",
    "dist/**"
  ],
  "output": {
    "format": "json",
    "path": "i18n/{locale}.json"
  }
}
```

Notes:
- `include` covers Angular templates and TS files.
- `output` writes compiled translations to JSON files per locale.

## 4) Add a few translatable strings

Edit `src/app/app.component.html`:

```html
<h1>Welcome to our Angular app</h1>
<p>Click the button to start</p>
<button>Start</button>
```

Optionally, add strings in a component file `src/app/app.component.ts`:

```ts
export class AppComponent {
  title = 'Welcome to our Angular app';
}
```

## 5) Authenticate with a model provider

Set one of the supported API keys in your environment before running the CLI, e.g.:

- macOS/Linux:
  ```bash
  export GROQ_API_KEY=your_groq_key
  ```
- Windows PowerShell:
  ```powershell
  $env:GROQ_API_KEY = "your_groq_key"
  ```

See also: https://lingo.dev/en/cli/quick-start#step-2-authentication

## 6) Run the CLI

From the project root:

```bash
# Using npx
npx lingo.dev@latest run

# Or if installed
pnpm lingo.dev run
```

The CLI fingerprints strings, caches results, and writes translations to `i18n/es.json`, `i18n/fr.json`, etc.

## 7) Load translations at runtime (minimal approach)

Create a simple loader `src/app/i18n-loader.ts`:

```ts
export async function loadMessages(locale: string): Promise<Record<string, string>> {
  try {
    const messages = await import(`../i18n/${locale}.json`);
    return (messages as any).default ?? (messages as any);
  } catch {
    const messages = await import('../i18n/en.json');
    return (messages as any).default ?? (messages as any);
  }
}
```

Use it in a component `src/app/app.component.ts`:

```ts
import { Component, OnInit } from '@angular/core';
import { loadMessages } from './i18n-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  t: Record<string, string> = {};
  locale = navigator.language?.slice(0, 2) || 'en';

  async ngOnInit() {
    this.t = await loadMessages(this.locale);
  }
}
```

Then in `src/app/app.component.html`:

```html
<h1>{{ t['Welcome to our Angular app'] || 'Welcome to our Angular app' }}</h1>
<p>{{ t['Click the button to start'] || 'Click the button to start' }}</p>
<button>{{ t['Start'] || 'Start' }}</button>
```

This minimal approach uses the original English string as the key. For bigger apps, adopt a key-based convention and a translate pipe/service.

## 8) Keep translations fresh in CI

Add a GitHub Actions workflow `.github/workflows/i18n.yml`:

```yaml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9.12.3
      - uses: actions/setup-node@v4
        with:
          node-version: 20.12.2
      - run: pnpm install --frozen-lockfile
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

This runs the CLI on each push and can commit updated translation files automatically depending on your configuration.

## 9) Troubleshooting

- No translations generated: ensure an AI API key is set and `include` patterns match your files.
- Access errors: check provider limits or wrong API key env var name.
- Over-translation: refine `include`/`exclude` patterns to skip non-user strings.

## 10) Next steps

- Add more locales in `i18n.json`.
- Introduce a key-based pattern with an Angular service/pipe for translation.
- Add e2e tests asserting translated outputs for critical routes.

---

Screenshots to include (add before publishing):
- App before translation
- CLI run output
- App after switching locale
