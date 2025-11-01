---
title: "Flutter"
subtitle: "AI translation for Flutter with Lingo.dev CLI"
---

## What is Flutter?

[Flutter](https://flutter.dev/) is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase. It uses the Dart programming language and provides built-in internationalization support through ARB (Application Resource Bundle) files.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide explains how to set up Lingo.dev CLI in a Flutter application. You'll learn how to create a Flutter project with localization support, configure a translation pipeline, and test the translations in your app.

## Step 1. Set up a Flutter project

1. Create a new Flutter application:

   ```bash
   flutter create my_app
   ```

2. Navigate into the project directory:

   ```bash
   cd my_app
   ```

3. Add the localization dependencies to `pubspec.yaml`:

   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     flutter_localizations:
       sdk: flutter
     intl: any
   ```

4. Install the dependencies:

   ```bash
   flutter pub get
   ```

## Step 2. Create source content

1. Create a directory for storing ARB files:

   ```bash
   mkdir -p lib/l10n
   ```

2. Create an ARB file for your source locale (e.g., `lib/l10n/app_en.arb`):

   ```json
   {
     "@@locale": "en",
     "welcome": "Welcome to Flutter",
     "@welcome": {
       "description": "Welcome message shown on home screen"
     },
     "helloWorld": "Hello, world!",
     "@helloWorld": {
       "description": "Traditional first app message"
     },
     "greeting": "Hello {name}!",
     "@greeting": {
       "description": "Greeting message with user's name",
       "placeholders": {
         "name": {
           "type": "String",
           "example": "John"
         }
       }
     }
   }
   ```

## Step 3. Configure Flutter localization

1. Enable localization generation in `pubspec.yaml`:

   ```yaml
   flutter:
     generate: true
   ```

2. Create a localization configuration file at `l10n.yaml`:

   ```yaml
   arb-dir: lib/l10n
   template-arb-file: app_en.arb
   output-localization-file: app_localizations.dart
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
    "flutter": {
      "include": ["lib/l10n/app_[locale].arb"]
    }
  }
}
```

This file defines:

- the ARB files that Lingo.dev CLI should translate
- the languages to translate between

In this case, the configuration translates ARB files from English to Spanish.

It's important to note that:

- `[locale]` is a placeholder that's replaced at runtime. It ensures that content is read from one location (e.g., `lib/l10n/app_en.arb`) and written to a different location (e.g., `lib/l10n/app_es.arb`).
- Flutter uses the `flutter` bucket type which understands ARB file format, including metadata and placeholders.

To learn more, see [i18n.json configuration](/cli/fundamentals/i18n-json-config).

## Step 5. Translate the content

1. [Sign up for a Lingo.dev account](/app).

2. Log in to Lingo.dev via the CLI:

   ```bash
   npx lingo.dev@latest login
   ```

3. Run the translation pipeline:

   ```bash
   npx lingo.dev@latest run
   ```

   The CLI will create a `lib/l10n/app_es.arb` file for storing the translated content and an `i18n.lock` file for keeping track of what has been translated (to prevent unnecessary retranslations).

## Step 6. Use the translations

1. Update your `lib/main.dart` file to enable localization:

   ```dart
   import 'package:flutter/material.dart';
   import 'package:flutter_localizations/flutter_localizations.dart';
   import 'package:flutter_gen/gen_l10n/app_localizations.dart';

   void main() {
     runApp(const MyApp());
   }

   class MyApp extends StatelessWidget {
     const MyApp({super.key});

     @override
     Widget build(BuildContext context) {
       return MaterialApp(
         title: 'Flutter Lingo.dev Demo',
         localizationsDelegates: const [
           AppLocalizations.delegate,
           GlobalMaterialLocalizations.delegate,
           GlobalWidgetsLocalizations.delegate,
           GlobalCupertinoLocalizations.delegate,
         ],
         supportedLocales: const [
           Locale('en'),
           Locale('es'),
         ],
         home: const MyHomePage(),
       );
     }
   }

   class MyHomePage extends StatefulWidget {
     const MyHomePage({super.key});

     @override
     State<MyHomePage> createState() => _MyHomePageState();
   }

   class _MyHomePageState extends State<MyHomePage> {
     Locale _currentLocale = const Locale('en');

     void _toggleLocale() {
       setState(() {
         _currentLocale = _currentLocale.languageCode == 'en'
             ? const Locale('es')
             : const Locale('en');
       });
     }

     @override
     Widget build(BuildContext context) {
       return Localizations.override(
         context: context,
         locale: _currentLocale,
         child: Builder(
           builder: (context) {
             final localizations = AppLocalizations.of(context)!;
             return Scaffold(
               appBar: AppBar(
                 title: Text(localizations.welcome),
               ),
               body: Center(
                 child: Column(
                   mainAxisAlignment: MainAxisAlignment.center,
                   children: <Widget>[
                     Text(
                       localizations.helloWorld,
                       style: Theme.of(context).textTheme.headlineMedium,
                     ),
                     const SizedBox(height: 20),
                     Text(
                       localizations.greeting('Flutter'),
                       style: Theme.of(context).textTheme.bodyLarge,
                     ),
                     const SizedBox(height: 40),
                     ElevatedButton(
                       onPressed: _toggleLocale,
                       child: Text(
                         _currentLocale.languageCode == 'en'
                             ? 'Switch to Español'
                             : 'Cambiar a English',
                       ),
                     ),
                   ],
                 ),
               ),
             );
           },
         ),
       );
     }
   }
   ```

2. Generate the localization files:

   ```bash
   flutter gen-l10n
   ```

## Step 7. Test the translations

1. Run the Flutter application:

   ```bash
   flutter run
   ```

   Or for web:

   ```bash
   flutter run -d chrome
   ```

2. The app will display the welcome message and greeting in English by default.

3. Click the "Switch to Español" button to toggle between English and Spanish translations.

## Known limitations

- The locale codes that Flutter supports aren't guaranteed to match the locale codes that Lingo.dev supports. Flutter uses language codes like `en`, `es`, `fr`, while some locales may require country codes like `zh_CN` or `pt_BR`.

## Next steps

To learn more about Flutter's internationalization system, see:

- [Internationalizing Flutter apps](https://docs.flutter.dev/ui/accessibility-and-internationalization/internationalization)
- [Flutter localization package](https://pub.dev/packages/flutter_localizations)
- [ARB file format](https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification)
