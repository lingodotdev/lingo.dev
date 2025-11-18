import json
import os

class Translator:
    """
    A simple translation class that loads language files and provides translation for keys.

    Attributes:
        directory (str): The directory where translation files are stored.
        lang (str): The current language code.
        translations (dict): The loaded translations for the current language.
    """
    def __init__(self, lang='en', directory='translations'):
        """
        Initialize the Translator.

        Args:
            lang (str): The language code to use (default is 'en').
            directory (str): The directory containing translation files (default is 'translations').
        """
        self.directory = directory
        self.lang = lang
        self.translations = {}
        self.load_language(lang)

    def load_language(self, lang):
        """
        Load translations for the specified language from a JSON file.

        Args:
            lang (str): The language code to load.
        """
        path = os.path.join(self.directory, f"{lang}.json")
        with open(path, encoding='utf-8') as file:
            self.translations = json.load(file)
        self.lang = lang

    def t(self, key):
        """
        Translate a key using the loaded translations.

        Args:
            key (str): The key to translate.

        Returns:
            str: The translated string if found, otherwise the key itself.
        """
        return self.translations.get(key, key)