# Angular - Lingo.dev CLI

## What is Angular?
Angular is a TypeScript-based web application framework developed by Google. It provides a comprehensive platform for building scalable web applications with features like dependency injection, routing, forms handling, and built-in internationalization (i18n) support.

## What is Lingo.dev CLI?
Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide
This guide explains how to set up Lingo.dev CLI in an Angular application. You'll learn how to create an Angular project with internationalization support, configure a translation pipeline, and implement language switching functionality.

## Step 1. Set up an Angular project

1. **Install Node.js and Angular CLI:**
   ```bash
   npm install -g @angular/cli
   ```

2. **Create a new Angular project:**
   ```bash
   ng new my-angular-app
   ```
   
   When prompted:
   - Select "Yes" for routing
   - Choose "CSS" for stylesheet format

3. **Navigate into the project directory:**
   ```bash
   cd my-angular-app
   ```

4. **Add Angular i18n support:**
   ```bash
   ng add @angular/localize
   ```

## Step 2. Create source content

1. **Generate i18n configuration:**
   ```bash
   ng extract-i18n
   ```
   
   This creates a `src/locale/messages.xlf` file with extractable text.

2. **Create a component with translatable content:**
   ```bash
   ng generate component welcome
   ```

3. **Update the generated `src/app/welcome/welcome.component.html` file:**
   ```html
   <div class="welcome-container">
     <h1 i18n="@@welcome.title">Welcome to our application</h1>
     <p i18n="@@welcome.description">
       This application demonstrates internationalization with Lingo.dev CLI.
     </p>
     <button i18n="@@welcome.cta" class="cta-button">Get Started</button>
   </div>
   ```

4. **Update `src/app/welcome/welcome.component.css`:**
   ```css
   .welcome-container {
     text-align: center;
     padding: 2rem;
     max-width: 600px;
     margin: 0 auto;
   }

   .cta-button {
     background-color: #007bff;
     color: white;
     border: none;
     padding: 0.75rem 1.5rem;
     border-radius: 4px;
     cursor: pointer;
     font-size: 1rem;
   }

   .cta-button:hover {
     background-color: #0056b3;
   }
   ```

5. **Update `src/app/app.component.html` to include the welcome component:**
   ```html
   <div class="app-container">
     <nav class="language-switcher">
       <button (click)="switchLanguage('en')" [class.active]="currentLanguage === 'en'">
         English
       </button>
       <button (click)="switchLanguage('es')" [class.active]="currentLanguage === 'es'">
         Español
       </button>
     </nav>
     <app-welcome></app-welcome>
   </div>
   ```

6. **Update `src/app/app.component.css`:**
   ```css
   .app-container {
     min-height: 100vh;
     font-family: Arial, sans-serif;
   }

   .language-switcher {
     display: flex;
     justify-content: center;
     gap: 1rem;
     padding: 1rem;
     background-color: #f8f9fa;
     border-bottom: 1px solid #dee2e6;
   }

   .language-switcher button {
     padding: 0.5rem 1rem;
     border: 1px solid #007bff;
     background-color: white;
     color: #007bff;
     border-radius: 4px;
     cursor: pointer;
     transition: all 0.2s;
   }

   .language-switcher button:hover,
   .language-switcher button.active {
     background-color: #007bff;
     color: white;
   }
   ```

7. **Update `src/app/app.component.ts`:**
   ```typescript
   import { Component } from '@angular/core';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })
   export class AppComponent {
     currentLanguage = 'en';

     switchLanguage(language: string) {
       this.currentLanguage = language;
       // In a real application, you would implement actual language switching logic here
       // For this demo, we'll just update the UI state
       console.log(`Switching to ${language}`);
     }
   }
   ```

8. **Extract the translatable strings:**
   ```bash
   ng extract-i18n
   ```

## Step 3. Configure the CLI

In the root of the project, create an `i18n.json` file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "xlf": {
      "include": ["src/locale/messages.[locale].xlf"]
    }
  }
}
```

This file defines:
- the XLF files that Lingo.dev CLI should translate
- the languages to translate between

In this case, the configuration translates XLF files from English to Spanish.

It's important to note that:
- `[locale]` is a placeholder that's replaced at runtime. It ensures that content is read from one location (e.g., `src/locale/messages.en.xlf`) and written to a different location (e.g., `src/locale/messages.es.xlf`).
- Angular uses XLF (XML Localization Interchange File Format) by default for internationalization.

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

   The CLI will create a `src/locale/messages.es.xlf` file for storing the translated content and an `i18n.lock` file for keeping track of what has been translated (to prevent unnecessary retranslations).

## Step 5. Configure Angular for multiple locales

1. **Update `angular.json` to support multiple locales:**

   Find the `"build"` configuration in `angular.json` and add the following:

   ```json
   {
     "projects": {
       "my-angular-app": {
         "i18n": {
           "sourceLocale": "en",
           "locales": {
             "es": "src/locale/messages.es.xlf"
           }
         },
         "architect": {
           "build": {
             "configurations": {
               "es": {
                 "aot": true,
                 "outputPath": "dist/es/",
                 "i18nFile": "src/locale/messages.es.xlf",
                 "i18nFormat": "xlf",
                 "i18nLocale": "es"
               }
             }
           },
           "serve": {
             "configurations": {
               "es": {
                 "buildTarget": "my-angular-app:build:es"
               }
             }
           }
         }
       }
     }
   }
   ```

2. **Update the build scripts in `package.json`:**
   ```json
   {
     "scripts": {
       "build": "ng build",
       "build:en": "ng build --configuration=production",
       "build:es": "ng build --configuration=es",
       "serve:en": "ng serve",
       "serve:es": "ng serve --configuration=es"
     }
   }
   ```

## Step 6. Use the translations

1. **Build the application for English:**
   ```bash
   npm run build:en
   ```

2. **Build the application for Spanish:**
   ```bash
   npm run build:es
   ```

3. **Serve the English version:**
   ```bash
   npm run serve:en
   ```

4. **Serve the Spanish version (in a new terminal):**
   ```bash
   npm run serve:es
   ```

5. **Navigate to the respective URLs:**
   - English: `http://localhost:4200`
   - Spanish: `http://localhost:4200` (when serving the Spanish configuration)

## Step 7. Test the translations

1. **Start the development server for English:**
   ```bash
   ng serve
   ```

2. **Navigate to `http://localhost:4200`** to see the English version.

3. **Start the development server for Spanish:**
   ```bash
   ng serve --configuration=es
   ```

4. **Navigate to `http://localhost:4200`** to see the Spanish version.

## Advanced: Runtime Language Switching

For a more dynamic approach with runtime language switching, you can implement the following:

1. **Install additional dependencies:**
   ```bash
   npm install @angular/common
   ```

2. **Create a language service:**
   ```bash
   ng generate service services/language
   ```

3. **Update `src/app/services/language.service.ts`:**
   ```typescript
   import { Injectable } from '@angular/core';
   import { BehaviorSubject } from 'rxjs';

   @Injectable({
     providedIn: 'root'
   })
   export class LanguageService {
     private currentLanguageSubject = new BehaviorSubject<string>('en');
     public currentLanguage$ = this.currentLanguageSubject.asObservable();

     constructor() {
       const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
       this.currentLanguageSubject.next(savedLanguage);
     }

     setLanguage(language: string) {
       this.currentLanguageSubject.next(language);
       localStorage.setItem('selectedLanguage', language);
     }

     getCurrentLanguage(): string {
       return this.currentLanguageSubject.value;
     }
   }
   ```

4. **Update `src/app/app.component.ts` to use the service:**
   ```typescript
   import { Component, OnInit } from '@angular/core';
   import { LanguageService } from './services/language.service';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })
   export class AppComponent implements OnInit {
     currentLanguage = 'en';

     constructor(private languageService: LanguageService) {}

     ngOnInit() {
       this.languageService.currentLanguage$.subscribe(language => {
         this.currentLanguage = language;
       });
     }

     switchLanguage(language: string) {
       this.languageService.setLanguage(language);
       // In a production app, you might reload the page or dynamically load translations
       window.location.reload();
     }
   }
   ```

## Known limitations

- Angular's i18n system requires separate builds for each locale by default, which means you need to deploy multiple versions of your application or implement a more complex routing system.
- The locale codes that Angular supports may not always match the locale codes that Lingo.dev supports. Refer to the [Angular i18n documentation](https://angular.io/guide/i18n-common-overview) for supported locales.
- Runtime language switching requires additional setup and may impact performance compared to build-time translations.

## Next steps

To learn more about Angular's internationalization system, see:
- [Angular Internationalization (i18n)](https://angular.io/guide/i18n-overview)
- [Angular i18n Common Tasks](https://angular.io/guide/i18n-common-tasks)
- [Deploying multiple locales](https://angular.io/guide/i18n-common-deploy)

For more advanced Lingo.dev CLI configuration options, see:
- [Lingo.dev CLI Configuration](https://lingo.dev/en/cli/configuration)
- [Bucket Types](https://lingo.dev/en/cli/buckets)