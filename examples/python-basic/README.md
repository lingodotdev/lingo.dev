# Python Basic Integration Example for Lingo.dev

This example demonstrates how to use translation JSON files exported from Lingo.dev in a simple Python backend or CLI application.

## Folder Structure
python-basic/
├── translations/
│ ├── en.json
│ └── hi.json
├── translator.py
├── app.py
└── README.md


## Features

- Loads translations from JSON files
- Accesses translations for a given key
- Easily switches languages at runtime

## How to Use

1. **Translation Files:**  
   Put your exported translation files (e.g., `en.json`, `hi.json`) inside the `translations/` directory.

2. **Run the Demo:**
   In your terminal, navigate to this folder and run:
   ```bash
   python app.py
   ```

 You should see the following output:
   
      Hello
   Goodbye
   नमस्ते
   अलविदा

   # Initialize with English
   tr = Translator(lang='en')
   print(tr.t('greeting'))   # Output: Hello

   # Switch to Hindi
   tr.load_language('hi')
   print(tr.t('greeting'))   # Output: नमस्ते
   ```

## Files

- `translator.py`: Contains a simple `Translator` class for loading and accessing translations.
- `app.py`: Demo script showing how to use the `Translator` class.
- `translations/`: Folder for your translation JSON files (`en.json`, `hi.json`, etc.).

---

**You can now use these files as a starting point for integrating Lingo.dev translations in any Python backend or CLI application.**
```
