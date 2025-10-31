import json
import os


class Translator:
    def __init__(self, lang="en"):
        self.lang = lang
        self.translations = self.load_translations(lang)

    def load_translations(self, lang):
        # Get the absolute path of this file (translator.py)
        base_dir = os.path.dirname(__file__)
        # Build the path to the translations folder dynamically
        path = os.path.join(base_dir, "python-basic",
                            "translations", f"{lang}.json")

        # Safely open and load translation file
        if not os.path.exists(path):
            raise FileNotFoundError(f"Translation file not found: {path}")

        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def set_language(self, lang):
        self.lang = lang
        self.translations = self.load_translations(lang)

    def t(self, key):
        # Return translation if exists, else fallback to key
        return self.translations.get(key, key)
