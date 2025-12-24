# Cursor AI i18n Rules
The following rules and guidelines should be followed to ensure proper internationalization (i18n) support in Cursor AI agents:
1. **Use translation keys**: All user-facing strings must use translation keys instead of hardcoded text. Reference the appropriate key from your locale files.
2. **Locale files**: Store translations in locale-specific files (e.g., `en.json`, `fr.json`). Ensure all supported languages are kept in sync.
3. **Fallback language**: Always provide a fallback language (usually English) for missing translations.
4. **Pluralization and formatting**: Use i18n libraries that support pluralization, date, and number formatting according to the user's locale.
5. **No concatenation**: Avoid string concatenation for translatable text. Use interpolation features provided by your i18n library.
6. **Contextual translations**: Provide context for translators where necessary, especially for ambiguous terms.
7. **Testing**: Test agents in multiple locales to ensure all strings are translated and formatting is correct.
_For more details, refer to the Cursor AI i18n documentation or contact the localization team._
