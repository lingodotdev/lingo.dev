"""
Lingo.dev Python Example - Demo Application

This script demonstrates how to use the Translator class to manage
translations in a Python application.
"""

from translator import Translator


def main():
    """Main demo function showing various translation features."""
    
    print("=" * 60)
    print("Lingo.dev Python Translation Example")
    print("=" * 60)
    print()
    
    # Initialize translator with English
    t = Translator(lang="en")
    
    # Show available languages
    print(f"Available languages: {', '.join(t.get_available_languages())}")
    print()
    
    # Demo 1: Basic translation
    print("--- Demo 1: Basic Translation ---")
    print(f"Current language: {t.get_current_language()}")
    print(f"Translation: {t.t('welcome_message')}")
    print(f"Greeting: {t.t('greeting')}")
    print(f"Farewell: {t.t('farewell')}")
    print()
    
    # Demo 2: Switch to Hindi
    print("--- Demo 2: Switch to Hindi ---")
    t.set_language("hi")
    print(f"Current language: {t.get_current_language()}")
    print(f"Translation: {t.t('welcome_message')}")
    print(f"Greeting: {t.t('greeting')}")
    print(f"Farewell: {t.t('farewell')}")
    print(f"Status: {t.t('language_switched')}")
    print()
    
    # Demo 3: Switch to Spanish
    print("--- Demo 3: Switch to Spanish ---")
    t.set_language("es")
    print(f"Current language: {t.get_current_language()}")
    print(f"Translation: {t.t('welcome_message')}")
    print(f"Greeting: {t.t('greeting')}")
    print(f"Farewell: {t.t('farewell')}")
    print(f"Status: {t.t('language_switched')}")
    print()
    
    # Demo 4: Handling missing keys
    print("--- Demo 4: Missing Key Handling ---")
    print(f"Missing key: {t.t('non_existent_key')}")  # Returns the key itself
    print(f"With default: {t.t('non_existent_key', 'Default value')}")
    print()
    
    # Demo 5: Get all translations
    print("--- Demo 5: All Translations (English) ---")
    t.set_language("en")
    all_translations = t.get_all_translations()
    for key, value in all_translations.items():
        print(f"  {key}: {value}")
    print()
    
    print("=" * 60)
    print("Demo completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
