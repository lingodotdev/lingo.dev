# Python Basic Example for Lingo.dev

A simple Python example demonstrating how to use translations from Lingo.dev in backend applications, CLI tools, or scripts without requiring any frontend framework.

## Overview

This example shows how to:
- Load translation JSON files exported from Lingo.dev
- Access translations in a Python environment
- Switch languages dynamically at runtime
- Handle missing translation keys gracefully

## Project Structure

```
demo/python-basic/
├── translations/
│   ├── en.json          # English translations
│   ├── hi.json          # Hindi translations
│   └── es.json          # Spanish translations
├── translator.py        # Translator class implementation
├── app.py              # Demo application
└── README.md           # This file
```

## Requirements

- Python 3.7 or higher
- No external dependencies required (uses only Python standard library)

## Quick Start

1. **Navigate to the example directory:**
   ```bash
   cd demo/python-basic
   ```

2. **Run the demo application:**
   ```bash
   python app.py
   ```

## Usage

### Basic Usage

```python
from translator import Translator

# Initialize with default language (English)
t = Translator(lang="en")

# Get a translation
print(t.t("greeting"))  # Output: Hello

# Switch to another language
t.set_language("hi")
print(t.t("greeting"))  # Output: नमस्ते
```

### Advanced Features

```python
# Get available languages
languages = t.get_available_languages()
print(languages)  # Output: ['en', 'hi', 'es']

# Get current language
current = t.get_current_language()
print(current)  # Output: en

# Handle missing keys with default values
translation = t.t("missing_key", "Default text")

# Get all translations for current language
all_translations = t.get_all_translations()
```

### Custom Translation Path

```python
# Use a custom path for translation files
t = Translator(lang="en", translations_path="path/to/translations")
```

## Integration Examples

### Flask Application

```python
from flask import Flask, request
from translator import Translator

app = Flask(__name__)

@app.route('/api/greeting')
def greeting():
    lang = request.args.get('lang', 'en')
    t = Translator(lang=lang)
    return {'message': t.t('greeting')}

if __name__ == '__main__':
    app.run()
```

### FastAPI Application

```python
from fastapi import FastAPI, Query
from translator import Translator

app = FastAPI()

@app.get("/greeting")
async def get_greeting(lang: str = Query(default="en")):
    t = Translator(lang=lang)
    return {"message": t.t("greeting")}
```

### CLI Tool

```python
import argparse
from translator import Translator

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--lang', default='en', help='Language code')
    args = parser.parse_args()
    
    t = Translator(lang=args.lang)
    print(t.t('welcome_message'))

if __name__ == '__main__':
    main()
```

## Translation File Format

Translation files are simple JSON files with key-value pairs:

```json
{
  "greeting": "Hello",
  "farewell": "Goodbye",
  "welcome_message": "Welcome to Lingo.dev!"
}
```

## Adding New Languages

1. Create a new JSON file in the `translations/` directory (e.g., `fr.json`)
2. Add your translations following the same key structure
3. Use the new language code with `set_language("fr")`

## Error Handling

The Translator class handles common errors:

- **Missing translation file**: Raises `FileNotFoundError` with available languages
- **Invalid JSON**: Raises `json.JSONDecodeError`
- **Missing translation key**: Returns the key itself or a provided default value

## Best Practices

1. **Organize keys logically**: Use descriptive key names (e.g., `user.profile.title`)
2. **Provide defaults**: Always provide fallback values for missing keys
3. **Cache translator instances**: Reuse translator instances instead of creating new ones
4. **Validate translations**: Ensure all language files have the same keys

## Extending This Example

This basic example can be extended with:

- **Nested translations**: Support for hierarchical key structures
- **Pluralization**: Handle singular/plural forms
- **Variable interpolation**: Insert dynamic values into translations
- **Lazy loading**: Load translation files on-demand
- **Caching**: Cache loaded translations for better performance

## Contributing

Feel free to improve this example by:
- Adding more language examples
- Implementing advanced features
- Improving error handling
- Adding unit tests

## License

This example is part of the Lingo.dev project and follows the same license.

## Resources

- [Lingo.dev Documentation](https://lingo.dev)
- [Lingo.dev GitHub Repository](https://github.com/lingodotdev/lingo.dev)
- [Python i18n Best Practices](https://docs.python.org/3/library/i18n.html)
