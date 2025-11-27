## Lingo.dev CLI Integration Guide for Angular

This guide explains how to integrate the Lingo.dev CLI into an Angular project. You'll learn how to configure translation files, run the translation pipeline, and integrate multilingual support into your Angular app.

## What is Angular?

[Angular](https://angular.io/) is a popular web application framework maintained by Google. It provides a robust structure for building scalable front-end applications and includes built-in support for internationalization (i18n).

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back into your project automatically.

## Prerequisites

Before starting, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://angular.io/cli) (v15 or higher)
- A [Lingo.dev account](https://lingo.dev)
- An AI API key supported by Lingo.dev (Groq, Google, or Mistral)
  - Set as an environment variable, e.g. `GROQ_API_KEY`, `GOOGLE_API_KEY`, or `MISTRAL_API_KEY`
- Basic knowledge of Angular components and modules

## What We'll Build

We'll create an Angular application with:

- Multiple pages (Home, About, Services)
- Dynamic content that updates based on the selected language
- A language switcher component
- Translation files managed and localized by Lingo.dev CLI
- Support for English (source) and Spanish, French, and German (targets)

## Step 1. Set up your Angular project

If you don't already have an Angular project, create one using the Angular CLI:

```bash
npm install -g @angular/cli
ng new lingo-angular-demo --routing --style=scss
cd lingo-angular-demo
```

(Optional) Install Angular Material for UI components:

```bash
ng add @angular/material
```

## Step 2. Add translation support

There are two common approaches to translation in Angular:

### Option A: Using Angular i18n (XLIFF)

Angular’s built-in i18n system uses XLIFF files.

Extract strings with:

```bash
ng extract-i18n --output-path src/locale
```

This generates a file like `messages.xlf`.

### Option B: Using ngx-translate (JSON)

Install `@ngx-translate` packages:

```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

Create a folder for translation files:

```bash
mkdir -p src/assets/i18n
```

Add a base English translation file:

```json
// src/assets/i18n/en.json
{
  "HELLO": "Hello world"
}
```

## Step 3. Configure the Lingo.dev CLI

In the root of your Angular project, create an `i18n.json` file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "translations": {
      "include": ["src/assets/i18n/en.json"]
    }
  }
}
```

This configuration tells Lingo.dev CLI to translate from English to Spanish, French, and German using the provided JSON file.

## Step 4. Translate the content

1. [Sign up for a Lingo.dev account](/app).

2. Log in via the CLI:

   ```bash
   npx lingo.dev@latest login
   ```

3. Run the translation pipeline:

   ```bash
   npx lingo.dev@latest run
   ```

This will create translated files such as `src/assets/i18n/es.json`, `fr.json`, and `de.json`, along with an `i18n.lock` file to track translation progress.

## Step 5. Integrate translations into Angular

### If using Angular i18n

1. Add locale files to your build configuration in `angular.json`:

   ```json
   "projects": {
     "lingo-angular-demo": {
       "i18n": {
         "sourceLocale": "en-US",
         "locales": {
           "es": "src/locale/messages.es.xlf",
           "fr": "src/locale/messages.fr.xlf",
           "de": "src/locale/messages.de.xlf"
         }
       }
     }
   }
   ```

2. Build for a specific locale:

   ```bash
   ng build --localize
   ```

### If using ngx-translate

Set up translation loading in `app.module.ts`:

```typescript
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class AppModule {}
```

Use translations in your components:

```typescript
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  template: `
    <h1>{{ "HELLO" | translate }}</h1>
    <button (click)="switchLang('es')">Español</button>
    <button (click)="switchLang('fr')">Français</button>
    <button (click)="switchLang('de')">Deutsch</button>
    <button (click)="switchLang('en')">English</button>
  `,
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang("en");
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
```

## Step 6. Test your translations

Start your development server:

```bash
ng serve
```

Open your browser at [http://localhost:4200](http://localhost:4200).  
Click the language switcher buttons and verify the translations update dynamically.

## Known limitations

- Angular's built-in i18n is officially supported in Angular 9 and later. If you are using an older version, consider upgrading or using a third-party library.
- The `@ngx-translate` library works with Angular 6 and above. Make sure your Angular version is compatible with the version of `@ngx-translate` you install.
- Locale code formats may differ: Angular typically uses BCP 47 codes like `en-US` or `fr-FR`, while Lingo.dev may use codes like `en` or `en_US`. Ensure your locale codes match between your Angular app and your Lingo.dev project to avoid mismatches.
- Lingo.dev’s automatic translation accuracy may vary depending on context.

## Next steps

- Learn more about Angular i18n: [https://angular.io/guide/i18n](https://angular.io/guide/i18n)
- Learn more about ngx-translate: [https://github.com/ngx-translate/core](https://github.com/ngx-translate/core)
- Explore more frameworks supported by Lingo.dev: [https://lingo.dev/en/cli/frameworks](https://lingo.dev/en/cli/frameworks)

## Feedback

We'd love to hear about your experience with this guide! If you have suggestions or run into issues, please:

- Open an issue on [GitHub](https://github.com/lingodotdev/lingo.dev/issues)
- Join our [Discord community](https://lingo.dev/go/discord)
- Contribute improvements to this guide

---
