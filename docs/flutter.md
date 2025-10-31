🌍 Lingo.dev CLI + Flutter Integration Guide



Learn how to integrate Lingo.dev CLI into your Flutter app to manage multilingual content effortlessly — from setup to live translations.



Overview



In this guide, you’ll set up Lingo.dev CLI in a Flutter project to:



Manage your localization files in one place.



Automatically sync translations from Lingo.dev.



Dynamically switch between languages in your app.



You’ll go from a clean Flutter app to a fully localized one — step by step.



Prerequisites



Before you begin, make sure you have:



Flutter

&nbsp;≥ 3.0 installed



Lingo.dev account



Lingo.dev CLI

&nbsp;installed



npm install -g @lingo.dev/cli





A working Flutter project (or create one with):



flutter create lingo\_flutter\_demo

cd lingo\_flutter\_demo



Step 1 – Enable localization in Flutter



First, configure your app to support localization.



Open your pubspec.yaml and add:



dependencies:

&nbsp; flutter\_localizations:

&nbsp;   sdk: flutter

&nbsp; intl: any





Then, in lib/main.dart, add localization support:



import 'package:flutter/material.dart';

import 'package:flutter\_localizations/flutter\_localizations.dart';

import 'generated/l10n.dart';



void main() {

&nbsp; runApp(const MyApp());

}



class MyApp extends StatelessWidget {

&nbsp; const MyApp({super.key});



&nbsp; @override

&nbsp; Widget build(BuildContext context) {

&nbsp;   return MaterialApp(

&nbsp;     title: 'Lingo Flutter Demo',

&nbsp;     localizationsDelegates: const \[

&nbsp;       S.delegate,

&nbsp;       GlobalMaterialLocalizations.delegate,

&nbsp;       GlobalWidgetsLocalizations.delegate,

&nbsp;       GlobalCupertinoLocalizations.delegate,

&nbsp;     ],

&nbsp;     supportedLocales: S.delegate.supportedLocales,

&nbsp;     home: const MyHomePage(),

&nbsp;   );

&nbsp; }

}



class MyHomePage extends StatelessWidget {

&nbsp; const MyHomePage({super.key});



&nbsp; @override

&nbsp; Widget build(BuildContext context) {

&nbsp;   return Scaffold(

&nbsp;     appBar: AppBar(title: Text(S.of(context).helloWorld)),

&nbsp;     body: Center(child: Text(S.of(context).welcomeMessage)),

&nbsp;   );

&nbsp; }

}



Step 2 – Initialize Lingo.dev



Connect your project to Lingo.dev:



lingo init





This command will:



Ask you to log in to your Lingo.dev account.



Create a lingo.config.json file.



Link your project to a workspace and project in Lingo.dev.



Example lingo.config.json:



{

&nbsp; "projectId": "your-lingo-project-id",

&nbsp; "output": "lib/l10n",

&nbsp; "format": "arb"

}



Step 3 – Pull translations from Lingo.dev



To fetch your translations:



lingo pull





This downloads your translation files (e.g., app\_en.arb, app\_es.arb) into lib/l10n/.



Example output:



✔ Pulled 2 languages: en, es

✔ Updated: lib/l10n/app\_en.arb

✔ Updated: lib/l10n/app\_es.arb



Step 4 – Generate localization classes



Flutter uses code generation for localization.

Run:



flutter gen-l10n





This creates a generated/l10n.dart file, giving you a strongly typed S class to access your strings.



Example:



Text(S.of(context).welcomeMessage)



Step 5 – Edit translations in Lingo.dev



Open your project dashboard on Lingo.dev

.



Add or edit your strings (keys like helloWorld or welcomeMessage).



Whenever you update translations, run:



lingo pull

flutter gen-l10n





to sync them back into your app.



Step 6 – Switch languages at runtime



You can easily change the app language dynamically:



Locale newLocale = const Locale('es');

S.load(newLocale);





Or add a simple dropdown:



DropdownButton<Locale>(

&nbsp; value: S.delegate.supportedLocales.first,

&nbsp; items: S.delegate.supportedLocales

&nbsp;     .map((locale) => DropdownMenuItem(

&nbsp;           value: locale,

&nbsp;           child: Text(locale.languageCode),

&nbsp;         ))

&nbsp;     .toList(),

&nbsp; onChanged: (locale) {

&nbsp;   if (locale != null) {

&nbsp;     S.load(locale);

&nbsp;   }

&nbsp; },

)



Step 7 – Push new keys to Lingo.dev



When you add new strings locally, push them to your Lingo.dev project:



lingo push





This uploads new keys from your .arb files so translators can work on them online.



Step 8 – Build and run



Now build your app:



flutter run





You should see your localized texts rendered according to your device’s language settings.

Try changing your system language or switching locales manually.



Example Project



You can find a working example on GitHub:

👉 github.com/lingo-dev/flutter-demo



Troubleshooting

Issue	Solution

S.of(context) returns null	Ensure MaterialApp has the localization delegates.

Missing translation key	Run flutter gen-l10n after updating .arb files.

CLI not recognized	Check your global npm path or reinstall with npm install -g @lingo.dev/cli.

Summary



✅ You now have a fully working multilingual Flutter app powered by Lingo.dev.

You can push, pull, and manage translations with a single command — all while keeping your code clean and synced.



Next steps



Explore advanced CLI options with lingo --help



Add automated CI sync using lingo pull in your build pipeline



Share your integration on GitHub



Author: Admin-space



Published with ❤️ by Lingo.dev

