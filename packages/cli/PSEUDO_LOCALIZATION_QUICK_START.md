# Pseudo-Localization Quick Start Guide

## Installation

The pseudo-localization feature is built into Lingo.dev CLI. No additional installation needed!

## Quick Commands

### Test a single locale
```bash
pnpx lingo.dev run --pseudo
```

### Test specific locales
```bash
pnpx lingo.dev run --pseudo --target-locale es --target-locale fr
```

### Watch mode (auto-pseudo-translate on file changes)
```bash
pnpx lingo.dev run --pseudo --watch
```

### Force re-pseudo-translation
```bash
pnpx lingo.dev run --pseudo --force
```

### Filter by file pattern
```bash
pnpx lingo.dev run --pseudo --file messages.json
```

### Filter by key prefix
```bash
pnpx lingo.dev run --pseudo --key "auth.login"
```

## Example Output

### Before
```json
{
  "welcome": "Welcome back!",
  "submit": "Submit",
  "cancel": "Cancel"
}
```

### After (with `--pseudo`)
```json
{
  "welcome": "Ŵèļçømèƀãçķ!⚡",
  "submit": "Šûbmíţ⚡",
  "cancel": "Çãñçèļ⚡"
}
```

## What You'll Notice

✅ **Text is longer** - Many languages are longer than English (20-30% common)
✅ **Characters look weird** - Accented characters help spot untranslated strings
✅ **⚡ marker visible** - Easy to see what's pseudo-localized
✅ **Spacing issues appear** - Reveals layout problems immediately

## Common Use Cases

### Before Translations Arrive
```bash
# Start development with pseudo-localization
pnpx lingo.dev run --pseudo

# Test your UI with the pseudo-translated files
npm run dev

# Fix any layout issues you find
# When real translations arrive, just switch to real provider
pnpx lingo.dev run  # Uses configured provider
```

### In CI/CD
```yaml
# .github/workflows/i18n.yml
name: Validate i18n
on: [push]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npx lingo.dev run --pseudo --frozen
        # --frozen ensures nothing needs translating
```

### Testing UI Component Libraries
```bash
# Test components with pseudo-localized strings
pnpx lingo.dev run --pseudo --bucket json

# Build Storybook with pseudo-localized strings
npm run build-storybook
```

## Troubleshooting

### "Pseudo-localization is enabled but I don't see the ⚡"

Check if your strings are being extracted correctly:
```bash
pnpx lingo.dev run --verbose --pseudo
```

### "Text is being truncated badly"

This is exactly what pseudo-localization should catch! 🎯

Solutions:
- Increase container width/height
- Use flexible layouts (flexbox, grid)
- Set `word-wrap: break-word` in CSS
- Avoid hardcoded width/height values

### "Some strings aren't showing up pseudo-localized"

Possible causes:
- String not marked for i18n in code
- String in a component that's not being processed
- String in a comment or non-extractable location

Use `--verbose` flag to see what's being extracted.

## Next Steps

1. **Test your UI** - Navigate your app with pseudo-localized strings
2. **Fix issues** - Address any layout or truncation problems
3. **Switch to real translations** - Remove `--pseudo` flag when ready
4. **Deploy with confidence** - Your app is now ready for international users!

## More Information

- 📖 [Full Documentation](./PSEUDO_LOCALIZATION.md)
- 🐛 [Report Issues](https://github.com/LingoDotDev/lingo.dev/issues)
- 💬 [Ask Questions](https://lingo.dev/go/discord)
- ⭐ [Give us a star!](https://github.com/LingoDotDev/lingo.dev)
