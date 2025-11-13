---
title: "Unity"
subtitle: "AI translation for Unity with Lingo.dev CLI"
---

## What is Unity?
[Unity](https://unity.com/) is a game engine for building 2D/3D games and real‑time applications. Unity provides a first‑party Localization package for managing string tables and switching locales at runtime.

## What is Lingo.dev CLI?
Lingo.dev is an AI‑powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide
This guide shows how to add Lingo.dev CLI to a Unity project using CSV string tables. You’ll create a simple string table, configure a translation pipeline, run translations, and view the results in Play Mode.

You can follow along with any Unity project. The steps assume you’re using the official Unity Localization package.

## Step 1. Install the Unity Localization package
1. Open your project in the Unity Editor.
2. Go to Window → Package Manager.
3. From the Packages dropdown, select “Unity Registry”.
4. Search for “Localization” (by Unity Technologies) and click Install.

This adds tools for locales, string tables, CSV import/export, and runtime localization APIs.

## Step 2. Create locales and a String Table Collection
1. Go to Edit → Project Settings → Localization.
2. Click “Create” to generate Localization Settings if prompted.
3. Under Locales, click “Add” and create:
   - English (en)
   - Spanish (es) (or any target locale you prefer)
4. Create a String Table Collection: Window → Asset Management → Localization Tables (or Window → Localization → String Tables in some versions).
5. Click “Create String Table Collection” and name it UI (or any name).
6. In the UI collection, add a row:
   - Key: WELCOME
   - English (en) value: Hello, world

Tip: Keys are typically uppercase, but any unique key is fine.

## Step 3. Prepare a CSV for translation
You can either export your collection to CSV from Unity, or create a minimal CSV that the CLI will manage.

Option A — Export from Unity
1. In the String Table Collection window, select your UI collection.
2. Click “Export/Import” → “Export String Table Collection to CSV”.
3. Save as Assets/Localization/strings.csv.

Option B — Create a minimal CSV (recommended for first‑time setup)
Create Assets/Localization/strings.csv with this content:

```csv
KEY,en
WELCOME,"Hello, world"
```

Notes:
- The first column header is the key column (e.g., KEY). The CLI auto‑detects its name.
- Source locale is a column named by its code (e.g., en). The CLI will add target locale columns (e.g., es) when translating.
- Empty translations are preserved but won't be re‑translated unless changed.

## Step 4. Configure the CLI
In the root of your Unity project, create an i18n.json file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "csv": {
      "include": [
        "Assets/Localization/strings.csv"
      ]
    }
  }
}
```

This configuration:
- translates the listed CSV file(s)
- from English to Spanish

To learn more, see [i18n.json configuration](/cli/fundamentals/i18n-json-config).

## Step 5. Translate the content
1. [Sign up for a Lingo.dev account](/app).
2. Log in via the CLI:

```bash
npx lingo.dev@latest login
```

3. Run the translation pipeline:

```bash
npx lingo.dev@latest run
```

The CLI updates Assets/Localization/strings.csv with a new es column and writes translations. It also creates an i18n.lock file to track what has been translated.

## Step 6. Import translated CSV back into Unity
If you used Option A (Unity‑exported CSV):
1. In the String Table Collection window, choose your UI collection.
2. Click “Export/Import” → “Import String Table Collection From CSV”.
3. Select Assets/Localization/strings.csv.
4. Map columns as needed (Key column to your key header, locale columns to their codes).
5. Click Import to update locale tables (e.g., Spanish).

If you used Option B (minimal CSV):
1. Use the same Import flow.
2. Set “Key” to KEY and map en/es columns to locales.
3. Import to update tables.

After import, you should see Spanish values populated for the WELCOME key in the UI String Table.

## Step 7. Use the translations in your scene
You can localize UI text with components or code.

Using components (no code):
1. Select a TextMeshProUGUI object in your scene.
2. Add component: Localize String Event.
3. Set Table Collection: UI, and Entry: WELCOME.
4. In the “Update String” event, hook it to your TextMeshProUGUI → text property.

Using code:

```csharp
using UnityEngine;
using UnityEngine.Localization;
using TMPro;

public class WelcomeText : MonoBehaviour
{
    public LocalizedString welcome; // Assign Table=UI, Entry=WELCOME in Inspector
    public TextMeshProUGUI label;

    void OnEnable()
    {
        welcome.StringChanged += OnStringChanged;
        welcome.RefreshString();
    }

    void OnDisable()
    {
        welcome.StringChanged -= OnStringChanged;
    }

    void OnStringChanged(string value)
    {
        if (label != null) label.text = value;
    }
}
```

## Step 8. Preview translations (switch locale)
At runtime via code:

```csharp
using UnityEngine;
using UnityEngine.Localization.Settings;

public class LocaleSwitcher : MonoBehaviour
{
    public async void SwitchToSpanish()
    {
        var spanish = (await LocalizationSettings.InitializationOperation.Task)
            .AvailableLocales.GetLocale("es");
        if (spanish != null)
            LocalizationSettings.SelectedLocale = spanish;
    }
}
```

Or via Editor for Play Mode:
- Edit → Project Settings → Localization
- Configure “Locale Selectors” (e.g., Specific Locale → es) to force a locale while testing.

Enter Play Mode and confirm the UI shows translated text.

## Keeping translations up to date
- Re‑run npx lingo.dev@latest run after adding new keys or changing source text.
- Commit i18n.lock to keep translations stable across machines/CI.
- Optional: Add Lingo.dev to CI/CD to automate on each push.

## Troubleshooting
- CSV headers: Ensure the first column is your key column (e.g., KEY). Locale columns should use locale codes (en, es). The CLI will also add missing target columns automatically.
- Unity import mapping: If your exported CSV uses headers like “English (en)”, map them to en during import.
- Missing translations: Confirm the i18n.json include path(s) match the CSV location and that you ran the CLI from the project root.

## Next steps
- Add more locales in i18n.json targets.
- Split CSVs by feature (multiple include patterns are supported).
- Explore advanced options (brand voice, glossaries) in the Lingo.dev platform.
