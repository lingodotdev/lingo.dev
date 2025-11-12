# Angular

## What is Angular?

[Angular](https://angular.dev/) is a TypeScript-based web application framework developed by Google. It provides a complete solution for building scalable single-page applications with built-in features for routing, forms, HTTP client, and dependency injection.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide explains how to set up Lingo.dev CLI in an Angular application. You'll learn how to create an Angular project with ngx-translate for internationalization, configure a translation pipeline, and implement language switching.

## Step 1. Set up an Angular project

1. Install Angular CLI globally:
   ```bash
   npm install -g @angular/cli
   ```

2. Create a new Angular project:
   ```bash
   ng new my-app --routing --style=css
   ```

3. Navigate into the project directory:
   ```bash
   cd my-app
   ```

4. Install ngx-translate for runtime i18n:
   ```bash
   npm install @ngx-translate/core @ngx-translate/http-loader
   ```

## Step 2. Configure ngx-translate

1. Update `src/app/app.config.ts` (for Angular 17+):
   ```typescript
   import { ApplicationConfig, importProvidersFrom } from '@angular/core';
   import { provideHttpClient } from '@angular/common/http';
   import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
   import { TranslateHttpLoader } from '@ngx-translate/http-loader';
   import { HttpClient } from '@angular/common/http';

   export function HttpLoaderFactory(http: HttpClient) {
     return new TranslateHttpLoader(http, './assets/i18n/', '.json');
   }

   export const appConfig: ApplicationConfig = {
     providers: [
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

   For Angular 16 or earlier using NgModule, update `src/app/app.module.ts` instead:
   ```typescript
   import { NgModule } from '@angular/core';
   import { HttpClientModule, HttpClient } from '@angular/common/http';
   import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
   import { TranslateHttpLoader } from '@ngx-translate/http-loader';

   export function HttpLoaderFactory(http: HttpClient) {
     return new TranslateHttpLoader(http, './assets/i18n/', '.json');
   }

   @NgModule({
     imports: [
       HttpClientModule,
       TranslateModule.forRoot({
         defaultLanguage: 'en',
         loader: {
           provide: TranslateLoader,
           useFactory: HttpLoaderFactory,
           deps: [HttpClient]
         }
       })
     ]
   })
   export class AppModule { }
   ```

2. Update `src/app/app.component.ts`:
   ```typescript
   import { Component } from '@angular/core';
   import { TranslateModule, TranslateService } from '@ngx-translate/core';
   import { FormsModule } from '@angular/forms';

   @Component({
     selector: 'app-root',
     standalone: true,
     imports: [TranslateModule, FormsModule],
     template: `
       <h1>{{ 'app.title' | translate }}</h1>
       <select [(ngModel)]="currentLang" (change)="switchLanguage()">
         <option value="en">English</option>
         <option value="es">Español</option>
       </select>
       <p>{{ 'app.welcome' | translate }}</p>
     `
   })
   export class AppComponent {
     currentLang = 'en';

     constructor(private translate: TranslateService) {
       this.translate.setDefaultLang('en');
       this.translate.use('en');
     }

     switchLanguage() {
       this.translate.use(this.currentLang);
     }
   }
   ```

## Step 3. Create source content

1. Create the translation directory:
   ```bash
   mkdir -p src/assets/i18n
   ```

2. Create a source translation file at `src/assets/i18n/en.json`:
   ```json
   {
     "app": {
       "title": "Welcome to My App",
       "welcome": "This content is automatically translated by Lingo.dev"
     }
   }
   ```

## Step 4. Configure the CLI

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
    "angular-translations": {
      "include": ["src/assets/i18n/[locale].json"]
    }
  }
}
```

This file defines:
- the files that Lingo.dev CLI should translate
- the languages to translate between

In this case, the configuration translates JSON files from English to Spanish.

It's important to note that:
- `[locale]` is a placeholder that's replaced at runtime. It ensures that content is read from one location (e.g., `src/assets/i18n/en.json`) and written to a different location (e.g., `src/assets/i18n/es.json`).
- Lingo.dev CLI will translate all JSON files that match this pattern.

To learn more, see [i18n.json configuration](https://lingo.dev/en/cli/fundamentals/i18n-json-config).

## Step 5. Translate the content

1. [Sign up for a Lingo.dev account](https://lingo.dev/en/app).

2. Log in to Lingo.dev via the CLI:
   ```bash
   npx lingo.dev@latest login
   ```

3. Run the translation pipeline:
   ```bash
   npx lingo.dev@latest run
   ```

The CLI will create a `src/assets/i18n/es.json` file for storing the translated content and an `i18n.lock` file for keeping track of what has been translated (to prevent unnecessary retranslations).

## Step 6. Test the translations

1. Start the development server:
   ```bash
   ng serve
   ```

2. Navigate to [http://localhost:4200](http://localhost:4200).

3. Use the language dropdown to switch between English and Spanish. The content should update automatically.

## Alternative: TypeScript translation files

Lingo.dev CLI also supports TypeScript translation files for better type safety:

1. Create `src/app/i18n/en.ts`:
   ```typescript
   export const translations = {
     app: {
       title: "Welcome to My App",
       welcome: "This content is automatically translated by Lingo.dev"
     }
   } as const;
   ```

2. Update `i18n.json`:
   ```json
   {
     "buckets": {
       "angular-translations": {
         "include": ["src/app/i18n/[locale].ts"]
       }
     }
   }
   ```

3. Configure ngx-translate to load TypeScript files instead of JSON files.  

   Here is an example of a custom `TranslateLoader` that loads TypeScript translation files:

   ```typescript
   // src/app/i18n/ts-translate-loader.ts
   import { TranslateLoader } from '@ngx-translate/core';
   import { Observable, of } from 'rxjs';

   // Map of supported locales to their translation modules
   const translationModules: Record<string, () => Promise<any>> = {
     en: () => import('./en').then(m => m.translations),
     es: () => import('./es').then(m => m.translations),
     // Add more locales as needed
   };

   export class TsTranslateLoader implements TranslateLoader {
     getTranslation(lang: string): Observable<any> {
       const loader = translationModules[lang];
       if (loader) {
         return new Observable(observer => {
           loader().then(translations => {
             observer.next(translations);
             observer.complete();
           });
         });
       } else {
         // Fallback: return empty object
         return of({});
       }
     }
   }
## Additional Links

- [ngx-translate documentation](https://github.com/ngx-translate/core)
- [Angular i18n guide](https://angular.io/guide/i18n)
