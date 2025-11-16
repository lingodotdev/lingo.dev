# Unreal Engine – Lingo.dev CLI Integration Guide

## What is Unreal Engine?

Unreal Engine is a powerful real‑time 3D creation platform for building games and interactive experiences. Unreal’s localization system gathers text from C++ macros (e.g., `LOCTEXT`/`NSLOCTEXT`), Blueprints/UMG widgets, and String Tables, exports translations as `.po` files, and compiles them into `.locres` files per culture.

## What is Lingo.dev CLI?

Lingo.dev is an AI-powered translation platform. The Lingo.dev CLI reads source files, sends translatable content to large language models, and writes translated files back to your project.

## About this guide

This guide shows how to integrate Lingo.dev CLI into an Unreal Engine 5 project. You’ll configure Unreal’s Localization Dashboard to export `.po` files, translate them with Lingo.dev, import translations, compile `.locres`, and switch languages at runtime to verify a working multilingual experience.

---

## Step 1. Set up an Unreal project

- Create a new project in Unreal Engine (Games → Blank → Blueprint or C++ → no starter content). Name it `LingoDemo`.
- Ensure the project opens and you can run Play‑In‑Editor (PIE).

### Example project (for PR reviewers)

- Create an `examples/UnrealLingoDemo` folder in your repository.
- Include a `README` that points to this guide and notes the following assets in the Unreal project:
  - `Content/UI/WBP_HUD.uasset` with a `Text` widget set to `Hello, world`.
  - `Content/Localization/Game/` containing `en.po` after export and `es.po` after translation.
  - Root‑level `i18n.json` configured as shown below.
- Commit the `.po` files and `i18n.json`. Binary assets can be omitted; reviewers can recreate them by following this guide.

## Step 2. Create source content

Add localizable text and set up Unreal’s localization pipeline.

- Add some UI: create a `Widget Blueprint` (e.g., `WBP_HUD`), add a `Text` block with the value `Hello, world`.
- If using C++, add text via macros:
  ```cpp
  #define LOCTEXT_NAMESPACE "Game"
  const FText WelcomeText = LOCTEXT("WELCOME", "Hello, world");
  #undef LOCTEXT_NAMESPACE
  ```
  Or with explicit namespace/key:
  ```cpp
  const FText WelcomeText = NSLOCTEXT("Game", "WELCOME", "Hello, world");
  ```
- Open `Window → Localization Dashboard` and create a `Localization Target` named `Game`.
  - Source language: `en`
  - Cultures to support: add `es` (you can also add `es-ES` if you prefer region codes)
  - Gather settings: include `Content/` and `Source/` so Unreal finds text in Blueprints/UMG and C++.
- Click `Gather` to build a manifest/archives from your project content.
- Click `Export for Translation` to generate `.po` files on disk. Unreal will create a folder like:
  - `Content/Localization/Game/en.po`

Note: Folder names may vary slightly depending on target settings (e.g., `Content/Localization/Game/Game.en.po`). Use the path Unreal generates in your project.

Optional: If you prefer String Tables, create one under `Content/Localization/StringTables/GameStrings` and add keys/values. Ensure the localization target gathers `StringTables`.

## Step 3. Configure the CLI

In the root of your Unreal project, create an `i18n.json` file:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es"]
  },
  "buckets": {
    "po": {
      "include": ["Content/Localization/Game/[locale].po"]
    }
  }
}
```

This configuration:

- Translates `.po` files from English (`en`) to Spanish (`es`).
- Uses `[locale]` as a placeholder so content is read from one location (e.g., `.../en.po`) and written to another (e.g., `.../es.po`).

## Step 4. Translate the content

- Sign up for a Lingo.dev account.
- Log in via the CLI:
  - `npx lingo.dev@latest login`
- Run the translation pipeline:
  - `npx lingo.dev@latest run`

The CLI will:

- Update or create `Content/Localization/Game/es.po` with translated entries.
- Create an `i18n.lock` file to track what’s been translated.

## Step 5. Import and compile translations in Unreal

Bring Lingo.dev’s translations back into the engine and compile `.locres`.

- In `Localization Dashboard → Game` target:
  - Click `Import Translations` and select the generated `Content/Localization/Game/es.po`.
  - Click `Compile` to build `.locres` files for each culture.
- Unreal writes compiled resources to your target’s `Intermediate` folder (e.g., `Content/Localization/Game/Intermediate/Es/Game.locres`) and uses them at runtime.

Project settings:

- Open `Edit → Project Settings → Internationalization`.
- Set `Default Culture` to `en`.
- Ensure the `Game` localization target is enabled so compiled resources are included when packaging.

## Step 6. Use and test the translations

Switch languages and verify localized UI.

- Blueprint (Recommended for quick testing):

  - In your `Game Instance` or a simple `Level Blueprint`, call `Set Current Culture` (from `Internationalization`) with `es`.
  - Run PIE: your `Text` block and any `LOCTEXT`/`NSLOCTEXT` strings should appear in Spanish.

- C++ (Runtime culture switching):

  ```cpp
  #include "Internationalization/Internationalization.h"
  FInternationalization::Get().SetCurrentCulture("es"); // or "es-ES"
  ```

- Packaging note: When packaging the game, ensure your `Game` localization target is included and compiled so `.locres` files are bundled.

Troubleshooting:

- If text remains in English, verify the key/namespace of `LOCTEXT`/`NSLOCTEXT` matches entries in the `.po`.
- Confirm that `Gather` ran after you added text and that the `.po` files contain the strings.
- Ensure the culture code matches the compiled `.locres` culture (`es` vs `es-ES`).

---

## Known limitations

- Locale codes supported by Unreal aren’t guaranteed to match those supported by Lingo.dev. Use culture codes that both tools recognize (e.g., `en`, `es`, `es-ES`).
- Ensure the `Gather` step includes all directories with text (Blueprints/UMG/C++, String Tables). Ungathered text will not appear in `.po` files and thus won’t be translated.
- `.po` path patterns differ per project/target. Confirm the exact path Unreal generates and update `i18n.json` accordingly.

## Next steps

- Add more cultures (e.g., `fr`, `de`) to your `i18n.json` and Unreal target.
- Localize additional content: menus, dialogs, tooltips, and String Tables.
- Automate: run `Gather` and `Compile` as part of CI before packaging.

---

## End‑to‑end checklist

- Project created and sample text added
- Localization target configured and `Gather` succeeded
- `en.po` exported and `i18n.json` added
- Lingo.dev CLI `login` + `run` generated `es.po`
- `es.po` imported and `.locres` compiled
- Runtime culture switched and UI verified in Spanish
