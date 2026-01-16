# Lingo.dev CLI Localization Guidelines

The following rules and guidelines should be followed to ensure effective AI-powered localization using the Lingo.dev CLI in projects using Lingo.dev:

1. **Structure content for translation**: Organize user-facing strings in supported formats (e.g., JSON locale files, ARB, PO, Markdown) to allow the Lingo.dev CLI to efficiently extract and translate content. Avoid hardcoding text directly in code where possible; use structured keys or files that the CLI can process.
2. **Locale files**: Store source content and translations in locale-specific files or directories (e.g., `en.json`, `app/i18n/fr.json`). The Lingo.dev CLI will automatically generate and keep target locale files in sync by translating only new or changed content.
3. **Source language as fallback**: Use a primary source language (usually English) as the base. The CLI treats your project files as the source of truth and provides fallbacks naturally through your runtime i18n setup for any missing translations.
4. **Pluralization and formatting**: Use i18n formats and libraries that support pluralization, placeholders, and locale-specific date/number formatting (e.g., ICU MessageFormat). The CLI preserves these structures during AI translation for accurate results.
5. **Avoid concatenation**: Do not concatenate translatable strings. Provide complete messages with interpolation placeholders so the AI translator can produce natural, contextually accurate results.
6. **Contextual translations**: Add context or translator notes in your configuration (via buckets or comments in supported formats) for ambiguous terms. This helps the AI generate higher-quality translations.
7. **Testing and review**: Run the Lingo.dev CLI regularly (e.g., in CI/CD) to generate translations, then test your application in multiple locales. Review AI-generated translations for accuracy and tone, using features like key locking to preserve approved versions.
_For more details, refer to the Lingo.dev CLI documentation at lingo.dev or join the community Discord._
