# Unreal Engine - Lingo.dev CLI Integration Guide

## What is Unreal Engine?

Unreal Engine is a powerful game engine developed by Epic Games for creating high-quality 2D and 3D games across multiple platforms. It features built-in localization support through PO (Portable Object) files and the Internationalization framework using the ICU library for handling culture-specific data processing.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide explains how to set up Lingo.dev CLI in an Unreal Engine project. You'll learn how to configure localization targets, set up a translation pipeline, and integrate the translations into your game.

## Step 1. Set up localization in Unreal Engine

### Enable Localization

1. Open your Unreal Engine project
2. Navigate to **Edit > Project Settings**
3. Search for "Localization" in the search bar
4. Under **Engine > Localization**, enable **Localization Dashboard**
5. Restart the editor if prompted

### Create a Localization Target

1. Open the **Localization Dashboard** (Window > Localization Dashboard)
2. Click **Add New Target**
3. Name your target (e.g., "Game")
4. Set the **Native Culture** (e.g., "en" for English)
5. Add target cultures you want to support (e.g., "es" for Spanish)

### Configure Text Gathering

1. In the **Gather** section, add paths to include:
   - Content folders containing your game assets
   - Source code directories
   - Configuration files

2. Common paths to include:
   - `/Game/Content/`
   - `/Game/Source/`
   - `/Game/Config/`

## Step 2. Export localization files

### Export PO Files

1. In the **Localization Dashboard**, select your target
2. Click **Gather Text** to collect translatable strings
3. Click **Export** to export PO files
4. Choose **Export to PO format**
5. Select the cultures to export
6. Choose an export directory (e.g., `Content/Localization/Game/`)

### PO File Structure

Unreal Engine exports PO files with the following naming convention:
- `{TargetName}.manifest` - Contains all translatable strings
- `{TargetName}.archive` - Contains translations
- `{TargetName}.po` - Standard PO file format

Example PO file structure:
```
Content/Localization/Game/
├── Game.manifest
├── Game.archive
├── en/
│   └── Game.po
└── es/
    └── Game.po
```

## Step 3. Configure the CLI

In the root of your Unreal Engine project, create an `i18n.json` file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "po": {
      "include": ["Content/Localization/Game/[locale]/Game.po"]
    }
  }
}
```

This file defines:

- The PO files that Lingo.dev CLI should translate
- The languages to translate between
- The source culture (en) and target cultures (es, fr, de)

## Step 4. Translate the content

### Sign up and login

1. Sign up for a Lingo.dev account at [lingo.dev](https://lingo.dev)
2. Log in to Lingo.dev via the CLI:
   ```bash
   npx lingo.dev@latest login
   ```

### Run the translation pipeline

```bash
npx lingo.dev@latest run
```

The CLI will:
- Read the source PO files
- Send translatable content to AI models
- Update target PO files with translations
- Create an `i18n.lock` file to track translations

## Step 5. Import translations back to Unreal

### Import Translated PO Files

1. Open the **Localization Dashboard**
2. Select your target
3. Click **Import**
4. Choose **Import from PO format**
5. Select the translated PO files
6. Click **Import** to load translations

### Compile Localization

1. In the **Localization Dashboard**, select your target
2. Click **Compile** to generate localization resources
3. This creates `.locres` files that Unreal uses at runtime

## Step 6. Use the translations in your game

### Blueprint Usage

In Blueprints, use the **Text** type and set the **Namespace** and **Key**:

1. Create a **Text** variable
2. Set the **Namespace** to your localization target name
3. Set the **Key** to the translation key
4. Use **Format Text** nodes to display localized content

### C++ Usage

In C++, use the `LOCTEXT` and `NSLOCTEXT` macros:

```cpp
// Define a localized text
FText WelcomeMessage = LOCTEXT("WelcomeMessage", "Welcome to the game!");

// Use namespace-specific localization
FText GameTitle = NSLOCTEXT("Game", "Title", "My Awesome Game");

// Display the text
UE_LOG(LogTemp, Log, TEXT("%s"), *WelcomeMessage.ToString());
```

### UMG UI Localization

1. In UMG widgets, set text properties to use **Text** binding
2. Use **Format Text** to combine localized strings
3. Set **Auto Localize** to true in widget properties

### Runtime Culture Switching

```cpp
// Get the current culture
FString CurrentCulture = FInternationalization::Get().GetCurrentCulture()->GetName();

// Set a new culture
FInternationalization::Get().SetCurrentCulture("es");

// Refresh UI to apply new culture
FSlateApplication::Get().GetRenderer()->ReloadTextureResources();
```

## Step 7. Test the translations

### Test in Editor

1. Open **Project Settings**
2. Navigate to **Engine > Internationalization**
3. Set **Preview Game Language** to your target culture
4. Play in Editor (PIE) to test translations

### Test in Packaged Game

1. Package your game
2. Run with culture parameter:
   ```
   MyGame.exe -culture=es
   ```

3. Or set culture in DefaultGame.ini:
   ```ini
   [/Script/EngineSettings.GeneralProjectSettings]
   InternationalizationPreset=English
   
   [Internationalization]
   +LocalizationPaths=%GAMEDIR%Content/Localization
   ```

## Known limitations

- Unreal Engine's PO file format includes metadata that should be preserved during translation
- Some complex formatting strings may need manual review after AI translation
- Culture codes between Unreal Engine and Lingo.dev may vary (e.g., "zh-Hans" vs "zh-CN")
- Large projects may require multiple localization targets for better organization

## Best Practices

### Organize Localization Targets

- Use separate targets for different content types (UI, gameplay, cinematics)
- Keep target names descriptive and consistent
- Regularly gather and export text to maintain up-to-date PO files

### Handle Culture-Specific Content

```cpp
// Use culture-aware formatting
FNumberFormattingOptions NumberOptions;
NumberOptions.MinimumFractionalDigits = 2;
FText FormattedNumber = FText::AsNumber(1234.56, &NumberOptions);

// Handle plural forms
FText PluralText = FText::Format(
    LOCTEXT("ItemCount", "{0} {0}|plural(one=item,other=items)"),
    ItemCount
);
```

### Optimize Localization Data

1. In **Project Settings > Packaging**, configure **Localization to Package**
2. Choose appropriate ICU data set size:
   - **English** (~1.77MB) - For English-only projects
   - **EFIGS** (~2.38MB) - For European languages
   - **EFIGSCJK** (~5.99MB) - For extended language support
   - **All** (~15.3MB) - For maximum language coverage

## Next steps

To learn more about Unreal Engine's localization system, see:

- [Unreal Engine Localization Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/localization-overview-for-unreal-engine)
- [Internationalization Support](https://dev.epicgames.com/documentation/en-us/unreal-engine/internationalization-support-in-unreal-engine)
- [Localization Dashboard Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/localization-dashboard-in-unreal-engine)

For more information about Lingo.dev CLI, visit:
- [Lingo.dev Documentation](https://lingo.dev/docs)
- [CLI Configuration Reference](https://lingo.dev/docs/cli/configuration)