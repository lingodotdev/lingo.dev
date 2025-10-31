# Unity

**AI translation for Unity games with Lingo.dev CLI**

## What is Unity?

[Unity](https://unity.com/) is a cross-platform game engine and development platform for creating 2D, 3D, VR, and AR games and applications. It supports deployment to mobile devices, desktops, consoles, and the web from a single codebase.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide explains how to set up Lingo.dev CLI in a Unity project. You'll learn how to organize localization files, configure a translation pipeline, and integrate the translations into your game.

## Prerequisites

This guide requires Newtonsoft.Json (Json.NET for Unity) to parse nested JSON structures. Install it via:

- **Unity Package Manager**: Window > Package Manager > Add package by name: `com.unity.nuget.newtonsoft-json`
- **Manual**: Download from the [Unity Asset Store](https://assetstore.unity.com/packages/tools/input-management/json-net-for-unity-11347)

## Step 1. Set up a Unity project

1. Create a new Unity project or open an existing one.

2. In your Unity project, create a folder structure for localization:

   ```
   Assets/
   └── Resources/
       └── Localization/
   ```

   The `Resources` folder allows Unity to load localization files at runtime.

## Step 2. Create source content

1. Create a JSON file for your source language (e.g., `Assets/Resources/Localization/en.json`):

   ```json
   {
     "ui": {
       "mainMenu": {
         "title": "Welcome to the Game",
         "playButton": "Play",
         "settingsButton": "Settings",
         "quitButton": "Quit"
       },
       "gameplay": {
         "score": "Score: {0}",
         "lives": "Lives: {0}",
         "gameOver": "Game Over",
         "victory": "Victory!"
       }
     },
     "tutorial": {
       "movement": "Use WASD to move",
       "attack": "Press Space to attack",
       "pause": "Press ESC to pause"
     }
   }
   ```

## Step 3. Configure the CLI

In the root of your Unity project, create an `i18n.json` file:

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
      "include": ["Assets/Resources/Localization/[locale].json"]
    }
  }
}
```

This file defines:

- the files that Lingo.dev CLI should translate
- the languages to translate between

In this case, the configuration translates JSON files from English to Spanish, French, German, and Japanese.

It's important to note that:

- `[locale]` is a placeholder that's replaced at runtime. It ensures that content is read from one location (e.g., `Assets/Resources/Localization/en.json`) and written to different locations (e.g., `Assets/Resources/Localization/es.json`).
- Lingo.dev CLI supports various file formats including JSON, MDX, and more.

To learn more, see [i18n.json configuration](/cli/fundamentals/i18n-json-config).

## Step 4. Translate the content

1. [Sign up for a Lingo.dev account](/app).

2. Log in to Lingo.dev via the CLI:

   ```bash
   npx lingo.dev@latest login
   ```

3. Run the translation pipeline:

   ```bash
   npx lingo.dev@latest run
   ```

   The CLI will create translated JSON files (e.g., `Assets/Resources/Localization/es.json`, `Assets/Resources/Localization/fr.json`) and an `i18n.lock` file for keeping track of what has been translated (to prevent unnecessary retranslations).

## Step 5. Use the translations in Unity

1. Create a C# script to manage localization (e.g., `Assets/Scripts/LocalizationManager.cs`):

   ```csharp
   using System;
   using System.Collections.Generic;
   using UnityEngine;
   using Newtonsoft.Json;
   using Newtonsoft.Json.Linq;

   public class LocalizationManager : MonoBehaviour
   {
       public static LocalizationManager Instance { get; private set; }

       private JObject currentLocalization;
       private string currentLanguage = "en";

       private void Awake()
       {
           if (Instance == null)
           {
               Instance = this;
               DontDestroyOnLoad(gameObject);
               LoadLocalization(currentLanguage);
           }
           else
           {
               Destroy(gameObject);
           }
       }

       public void LoadLocalization(string languageCode)
       {
           string path = $"Localization/{languageCode}";
           TextAsset jsonFile = Resources.Load<TextAsset>(path);

           if (jsonFile != null)
           {
               try
               {
                   currentLocalization = JObject.Parse(jsonFile.text);
                   currentLanguage = languageCode;
                   Debug.Log($"Loaded localization: {languageCode}");
               }
               catch (Exception ex)
               {
                   Debug.LogError($"Failed to parse localization JSON: {ex.Message}");
               }
           }
           else
           {
               Debug.LogError($"Localization file not found: Resources/{path}.json");
           }
       }

       public string GetLocalizedString(string key)
       {
           if (currentLocalization == null)
           {
               Debug.LogError("Localization not loaded!");
               return key;
           }

           try
           {
               JToken token = currentLocalization.SelectToken(key.Replace('.', '.'));
               return token?.ToString() ?? key;
           }
           catch (Exception)
           {
               Debug.LogWarning($"Localization key not found: {key}");
               return key;
           }
       }

       public string GetLocalizedString(string key, params object[] args)
       {
           string text = GetLocalizedString(key);
           return string.Format(text, args);
       }

       public string CurrentLanguage => currentLanguage;
   }
   ```

2. Create a helper script for UI text elements (e.g., `Assets/Scripts/LocalizedText.cs`):

   ```csharp
   using UnityEngine;
   using UnityEngine.UI;
   using TMPro;

   public class LocalizedText : MonoBehaviour
   {
       [SerializeField]
       private string localizationKey;

       private Text uiText;
       private TextMeshProUGUI tmpText;

       private void Start()
       {
           uiText = GetComponent<Text>();
           tmpText = GetComponent<TextMeshProUGUI>();
           UpdateText();
       }

       public void UpdateText()
       {
           if (LocalizationManager.Instance == null)
           {
               Debug.LogWarning("LocalizationManager not initialized yet!");
               return;
           }

           string localizedText = LocalizationManager.Instance.GetLocalizedString(localizationKey);

           if (uiText != null)
               uiText.text = localizedText;

           if (tmpText != null)
               tmpText.text = localizedText;
       }

       public void SetKey(string key)
       {
           localizationKey = key;
           UpdateText();
       }
   }
   ```

3. In your Unity scene:
   - Create an empty GameObject (e.g., "LocalizationManager") and attach the `LocalizationManager` script
   - For any UI Text element, attach the `LocalizedText` script and set the localization key (e.g., `ui.mainMenu.title`)

4. To switch languages at runtime, create a language selector (e.g., `Assets/Scripts/LanguageSelector.cs`):

   ```csharp
   using UnityEngine;

   public class LanguageSelector : MonoBehaviour
   {
       public void SetLanguage(string languageCode)
       {
           LocalizationManager.Instance.LoadLocalization(languageCode);

           // Refresh all localized text in the scene
           LocalizedText[] localizedTexts = FindObjectsOfType<LocalizedText>();
           foreach (var text in localizedTexts)
           {
               text.UpdateText();
           }
       }
   }
   ```

   Attach this script to a UI Button and connect the `SetLanguage` method with the desired language code (e.g., "es", "fr", "de", "ja").

5. Run your Unity project and test the localization by switching between languages.

## Tips for Unity localization

- **Use string formatting**: For dynamic content like scores, use placeholders: `"Score: {0}"` and call `GetLocalizedString("ui.gameplay.score", playerScore)`.
- **Organize by context**: Group related strings (UI, gameplay, tutorial, etc.) for better maintainability.
- **Test with long strings**: Some languages (like German) can be 30% longer than English, so design your UI with flexibility.
- **Consider TextMeshPro**: Use TextMeshPro for better text rendering and support for complex scripts (Arabic, Chinese, etc.).
- **Cache translations**: For frequently accessed strings, consider caching them to improve performance.

## Next steps

- Add more target languages to your `i18n.json` configuration
- Implement language detection based on system settings using `Application.systemLanguage`
- Add support for plural forms and gender-specific translations
- Set up automated translation workflows in your CI/CD pipeline