# Lingo.dev CLI Integration Guide for Angular

This guide will walk you through integrating Lingo.dev CLI with an Angular application to add AI-powered internationalization (i18n). We'll build a complete multilingual Angular app from scratch using `@ngx-translate/core`, one of the most popular i18n libraries for Angular.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** version 18 or higher
- **npm** or **pnpm** (this guide uses npm)
- **Angular CLI** installed globally (`npm install -g @angular/cli`)
- **An AI API key** from one of these providers:
  - [Groq](https://console.groq.com/) (recommended for speed)
  - [Google AI Studio](https://aistudio.google.com/apikey)
  - [Mistral AI](https://console.mistral.ai)
  - Or a [Lingo.dev API key](https://lingo.dev)

## What We'll Build

We'll create an Angular application with:

- Multiple pages (Home, About, Services)
- Dynamic content that updates based on the selected language
- A language switcher component
- Translation files managed and localized by Lingo.dev CLI
- Support for English (source) and Spanish, French, and German (targets)

## Step 1: Create a New Angular Application

First, let's create a fresh Angular project:

```bash
ng new angular-lingo-demo
```

When prompted, choose:
- Would you like to add Angular routing? **Yes**
- Which stylesheet format would you like to use? **CSS** (or your preference)

Navigate into the project:

```bash
cd angular-lingo-demo
```

## Step 2: Install ngx-translate

Install the ngx-translate library, which is the most popular Angular i18n solution:

```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

## Step 3: Set Up the Translation Module

Open `src/app/app.config.ts` (for standalone Angular 17+) or create it if it doesn't exist:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// Factory function for the TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
```

If you're using Angular 16 or earlier with NgModule, update `src/app/app.module.ts` instead:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Step 4: Create Translation Files

Create the directory structure for translation files:

```bash
mkdir -p src/assets/i18n
```

Create the English source translation file at `src/assets/i18n/en.json`:

```json
{
  "app": {
    "title": "Welcome to Angular with Lingo.dev",
    "description": "Build multilingual applications with ease"
  },
  "nav": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "language": "Language"
  },
  "home": {
    "title": "Welcome to Our Application",
    "subtitle": "Experience the power of AI-driven internationalization",
    "intro": "This demo application showcases how Lingo.dev CLI can automatically translate your Angular app into multiple languages using AI.",
    "features": {
      "title": "Key Features",
      "feature1": "Automatic translation with AI",
      "feature2": "Support for 100+ languages",
      "feature3": "Easy integration with Angular",
      "feature4": "Preserves code structure and formatting"
    },
    "cta": "Get Started"
  },
  "about": {
    "title": "About Us",
    "mission": "Our Mission",
    "missionText": "We believe in making internationalization simple and accessible for all developers. With Lingo.dev, you can translate your entire application in minutes, not weeks.",
    "team": "Our Team",
    "teamText": "Our team consists of developers, linguists, and AI specialists passionate about breaking down language barriers in software."
  },
  "services": {
    "title": "Our Services",
    "subtitle": "What we offer",
    "service1": {
      "title": "AI-Powered Translation",
      "description": "Leverage cutting-edge AI models to translate your content accurately and naturally."
    },
    "service2": {
      "title": "CLI Integration",
      "description": "Seamlessly integrate translation into your development workflow with our command-line tool."
    },
    "service3": {
      "title": "Multi-Framework Support",
      "description": "Works with Angular, React, Vue, and many other frameworks and platforms."
    },
    "service4": {
      "title": "Continuous Localization",
      "description": "Keep your translations up-to-date automatically as your application evolves."
    }
  },
  "footer": {
    "copyright": "© 2025 Lingo.dev. All rights reserved.",
    "poweredBy": "Powered by Lingo.dev"
  }
}
```

## Step 5: Update the App Component

Update `src/app/app.component.ts` to initialize the translation service:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-lingo-demo';
  currentLanguage = 'en';
  availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];

  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('en');
    
    // Use English initially
    this.translate.use('en');
    
    // Add available languages
    this.translate.addLangs(['en', 'es', 'fr', 'de']);
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
  }
}
```

Update `src/app/app.component.html`:

```html
<div class="app-container">
  <header class="header">
    <div class="container">
      <h1>{{ 'app.title' | translate }}</h1>
      <nav class="navigation">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          {{ 'nav.home' | translate }}
        </a>
        <a routerLink="/about" routerLinkActive="active">
          {{ 'nav.about' | translate }}
        </a>
        <a routerLink="/services" routerLinkActive="active">
          {{ 'nav.services' | translate }}
        </a>
        
        <div class="language-switcher">
          <label>{{ 'nav.language' | translate }}:</label>
          <select [(ngModel)]="currentLanguage" (change)="switchLanguage(currentLanguage)">
            <option *ngFor="let lang of availableLanguages" [value]="lang.code">
              {{ lang.name }}
            </option>
          </select>
        </div>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p>{{ 'footer.copyright' | translate }}</p>
      <p class="powered-by">{{ 'footer.poweredBy' | translate }}</p>
    </div>
  </footer>
</div>
```

Don't forget to import `FormsModule` in your `app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // ... rest of the code
}
```

## Step 6: Create Page Components

Create the Home component:

```bash
ng generate component pages/home --standalone
```

Update `src/app/pages/home/home.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  features = ['feature1', 'feature2', 'feature3', 'feature4'];
}
```

Update `src/app/pages/home/home.component.html`:

```html
<div class="home-page">
  <section class="hero">
    <h1>{{ 'home.title' | translate }}</h1>
    <p class="subtitle">{{ 'home.subtitle' | translate }}</p>
    <p class="intro">{{ 'home.intro' | translate }}</p>
    <button class="cta-button">{{ 'home.cta' | translate }}</button>
  </section>

  <section class="features">
    <h2>{{ 'home.features.title' | translate }}</h2>
    <div class="features-grid">
      <div *ngFor="let feature of features" class="feature-card">
        <p>{{ 'home.features.' + feature | translate }}</p>
      </div>
    </div>
  </section>
</div>
```

Create the About component:

```bash
ng generate component pages/about --standalone
```

Update `src/app/pages/about/about.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {}
```

Update `src/app/pages/about/about.component.html`:

```html
<div class="about-page">
  <h1>{{ 'about.title' | translate }}</h1>
  
  <section class="about-section">
    <h2>{{ 'about.mission' | translate }}</h2>
    <p>{{ 'about.missionText' | translate }}</p>
  </section>

  <section class="about-section">
    <h2>{{ 'about.team' | translate }}</h2>
    <p>{{ 'about.teamText' | translate }}</p>
  </section>
</div>
```

Create the Services component:

```bash
ng generate component pages/services --standalone
```

Update `src/app/pages/services/services.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  services = ['service1', 'service2', 'service3', 'service4'];
}
```

Update `src/app/pages/services/services.component.html`:

```html
<div class="services-page">
  <h1>{{ 'services.title' | translate }}</h1>
  <p class="subtitle">{{ 'services.subtitle' | translate }}</p>

  <div class="services-grid">
    <div *ngFor="let service of services" class="service-card">
      <h3>{{ 'services.' + service + '.title' | translate }}</h3>
      <p>{{ 'services.' + service + '.description' | translate }}</p>
    </div>
  </div>
</div>
```

## Step 7: Set Up Routing

Update `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: '**', redirectTo: '' }
];
```

## Step 8: Add Basic Styling

Update `src/app/app.component.css`:

```css
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #1976d2;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.navigation {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.navigation a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navigation a:hover,
.navigation a.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.language-switcher {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-switcher select {
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  background-color: white;
  cursor: pointer;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background-color: #f5f5f5;
  padding: 2rem 0;
  text-align: center;
  margin-top: auto;
}

.footer p {
  margin: 0.5rem 0;
}

.powered-by {
  font-size: 0.875rem;
  color: #666;
}
```

Add styling for the home page in `src/app/pages/home/home.component.css`:

```css
.hero {
  text-align: center;
  padding: 3rem 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1976d2;
}

.subtitle {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.intro {
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.cta-button {
  background-color: #1976d2;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #1565c0;
}

.features {
  margin-top: 4rem;
}

.features h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}
```

## Step 9: Test the Application

Before adding Lingo.dev, let's make sure the app works:

```bash
ng serve
```

Open your browser to `http://localhost:4200` and verify:
- The app loads correctly
- You can navigate between pages
- The language switcher dropdown appears
- All English text displays properly

You'll notice that switching languages doesn't work yet – that's because we haven't created the Spanish, French, and German translation files. This is where Lingo.dev CLI comes in!

## Step 10: Install and Configure Lingo.dev CLI

Now let's add Lingo.dev CLI to automatically generate translations:

```bash
npm install -D lingo.dev
```

Create an `i18n.json` configuration file in the root of your project:

```json
{
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "angular-translations": {
      "include": ["src/assets/i18n/[locale].json"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

This configuration tells Lingo.dev:
- Your source language is English (`en`)
- You want to translate to Spanish (`es`), French (`fr`), and German (`de`)
- Your translation files follow the pattern `src/assets/i18n/[locale].json`

## Step 11: Set Up Your AI API Key

You need to authenticate with an AI provider. Choose one of the following options:

### Option A: Using Groq (Recommended for speed)

Set your Groq API key as an environment variable:

```bash
export GROQ_API_KEY=your_groq_api_key_here
```

Or create a `.env` file in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Option B: Using Google AI

```bash
export GOOGLE_API_KEY=your_google_api_key_here
```

Or in `.env`:

```
GOOGLE_API_KEY=your_google_api_key_here
```

### Option C: Using Mistral

```bash
export MISTRAL_API_KEY=your_mistral_api_key_here
```

Or in `.env`:

```
MISTRAL_API_KEY=your_mistral_api_key_here
```

### Option D: Using Lingo.dev API Key

Update your `i18n.json` to include your Lingo.dev API key:

```json
{
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "angular-translations": {
      "include": ["src/assets/i18n/[locale].json"]
    }
  },
  "compiler": {
    "apiKey": "your_lingo_dev_api_key_here"
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

**Important:** If you use the `.env` file or add your API key to `i18n.json`, make sure to add these files to `.gitignore` to avoid committing sensitive information:

```
.env
i18n.json
```

## Step 12: Run Lingo.dev CLI

Now for the magic moment! Run Lingo.dev CLI to generate translations:

```bash
npx lingo.dev run
```

The CLI will:
1. Read your source English file (`src/assets/i18n/en.json`)
2. Use AI to translate the content to Spanish, French, and German
3. Create `src/assets/i18n/es.json`, `src/assets/i18n/fr.json`, and `src/assets/i18n/de.json`
4. Preserve the JSON structure and key names
5. Create an `i18n.lock` file to track what's been translated

You should see output like:

```
✓ Loaded configuration from i18n.json
✓ Processing bucket: angular-translations
✓ Translating en → es
✓ Translating en → fr
✓ Translating en → de
✓ All translations completed!
```

## Step 13: Verify Translations

Check that the translation files were created:

```bash
ls src/assets/i18n/
```

You should see:
```
en.json  es.json  fr.json  de.json
```

Open one of the generated files (e.g., `src/assets/i18n/es.json`) to see the translations:

```json
{
  "app": {
    "title": "Bienvenido a Angular con Lingo.dev",
    "description": "Construye aplicaciones multilingües con facilidad"
  },
  "nav": {
    "home": "Inicio",
    "about": "Acerca de",
    "services": "Servicios",
    "language": "Idioma"
  },
  ...
}
```

## Step 14: Test the Multilingual App

With translations in place, restart your Angular development server:

```bash
ng serve
```

Open `http://localhost:4200` and test the language switcher:

1. Select "Español" from the dropdown – the entire app should switch to Spanish
2. Try "Français" – everything switches to French
3. Try "Deutsch" – everything switches to German
4. Navigate between pages while in different languages

Everything should work seamlessly!

## Step 15: Updating Translations

When you add new content to your app, simply:

1. Update the source file (`src/assets/i18n/en.json`) with new keys and values
2. Run `npx lingo.dev run` again

Lingo.dev CLI is smart:
- It only translates new or changed content (thanks to the `i18n.lock` file)
- It preserves existing translations
- It's fast and cost-effective

For example, add a new section to `en.json`:

```json
{
  ...existing content...,
  "contact": {
    "title": "Contact Us",
    "email": "Email",
    "phone": "Phone",
    "message": "Message"
  }
}
```

Run:

```bash
npx lingo.dev run
```

Only the new `contact` section will be translated!

## Advanced: Using TypeScript Translation Files

If you prefer TypeScript over JSON for better type safety, Lingo.dev supports that too!

Create `src/app/i18n/en.ts`:

```typescript
export const translations = {
  app: {
    title: "Welcome to Angular with Lingo.dev",
    description: "Build multilingual applications with ease"
  },
  // ... rest of your translations
} as const;

export type Translations = typeof translations;
```

Update your `i18n.json`:

```json
{
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "angular-translations": {
      "include": ["src/app/i18n/[locale].ts"]
    }
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

Run `npx lingo.dev run` and you'll get type-safe translation files in TypeScript!

## Advanced: Continuous Localization with CI/CD

To keep translations updated automatically, you can integrate Lingo.dev into your CI/CD pipeline.

### GitHub Actions Example

Create `.github/workflows/translate.yml`:

```yaml
name: Auto-translate

on:
  push:
    branches: [main]
    paths:
      - 'src/assets/i18n/en.json'

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Lingo.dev
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
        run: npx lingo.dev run
      
      - name: Commit translations
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add src/assets/i18n/*.json i18n.lock
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: update translations [skip ci]"
          git push
```

Add your `GROQ_API_KEY` (or other provider's key) to GitHub Secrets in your repository settings.

Now, every time you update `en.json` and push to main, translations will automatically update!

## Troubleshooting

### Translations not loading

**Issue:** Language switcher doesn't change the content.

**Solution:** Check the browser console for HTTP errors. Make sure the translation files exist in `src/assets/i18n/` and the Angular dev server is serving them correctly.

### API Key errors

**Issue:** `Error: No API key found`

**Solution:** Make sure you've set the environment variable correctly:
```bash
echo $GROQ_API_KEY  # Should print your API key
```

If empty, set it again or add it to your `.env` file.

### Translation quality issues

**Issue:** Some translations don't sound natural.

**Solution:** 
1. Try a different AI provider (Groq, Google, or Mistral may produce different results)
2. Use the `context` field in `i18n.json` to provide additional context:

```json
{
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "angular-translations": {
      "include": ["src/assets/i18n/[locale].json"]
    }
  },
  "compiler": {
    "context": "This is a professional SaaS application for project management"
  },
  "$schema": "https://lingo.dev/schema/i18n.json"
}
```

### Locking specific keys

**Issue:** You want to prevent certain keys from being translated.

**Solution:** Use `lockedKeys` in your bucket configuration:

```json
{
  "buckets": {
    "angular-translations": {
      "include": ["src/assets/i18n/[locale].json"],
      "lockedKeys": ["app.brandName", "app.productName"]
    }
  }
}
```

## Best Practices

1. **Keep source language clean**: Maintain high-quality English (or your source language) text, as it's the foundation for all translations.

2. **Use meaningful keys**: Use descriptive key names like `home.hero.title` instead of generic ones like `text1`.

3. **Commit `i18n.lock`**: Include the `i18n.lock` file in your repository to track translation history and avoid re-translating unchanged content.

4. **Review AI translations**: While Lingo.dev produces high-quality translations, consider having native speakers review critical content.

5. **Organize by feature**: Structure your translation keys by page or feature for better maintainability.

6. **Use interpolation**: For dynamic values, use ngx-translate interpolation:
   ```json
   {
     "welcome": "Welcome, {{name}}!"
   }
   ```
   ```html
   {{ 'welcome' | translate:{ name: userName } }}
   ```

## Next Steps

Congratulations! You've successfully built a multilingual Angular application with Lingo.dev CLI. Here's what you can explore next:

- **Add more languages**: Simply add locale codes to the `targets` array in `i18n.json`
- **Explore other file formats**: Lingo.dev supports JSON, TypeScript, YAML, Markdown, XML, and more
- **Set up the Lingo.dev Compiler**: For React apps, check out the build-time localization with [Lingo.dev Compiler](https://lingo.dev/compiler)
- **Learn about watch mode**: Run `npx lingo.dev watch` to automatically translate files as you edit them
- **Join the community**: Get help and share your experience on the [Lingo.dev Discord](https://lingo.dev/go/discord)

## Resources

- [Lingo.dev Documentation](https://lingo.dev/cli)
- [ngx-translate Documentation](https://github.com/ngx-translate/core)
- [Angular i18n Guide](https://angular.io/guide/i18n)
- [Example Repository](https://github.com/lingodotdev/lingo.dev) (see `/demo` folder)

## Feedback

We'd love to hear about your experience with this guide! If you have suggestions or run into issues, please:

- Open an issue on [GitHub](https://github.com/lingodotdev/lingo.dev/issues)
- Join our [Discord community](https://lingo.dev/go/discord)
- Contribute improvements to this guide

---

**Last Updated:** October 30, 2025
