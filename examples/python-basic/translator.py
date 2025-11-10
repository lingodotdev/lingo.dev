import json
import os

class Translator:
    def __init__(self, lang="en", translations_path="translations"):
        self.translations_path = translations_path
        self.set_language(lang)

    def set_language(self, lang):
        """Change active language and load the corresponding JSON file"""
        file_path = os.path.join(self.translations_path, f"{lang}.json")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Translation file not found: {file_path}")
        with open(file_path, "r", encoding="utf-8") as f:
            self.translations = json.load(f)
        self.lang = lang

    def t(self, key):
        """Fetch a translated string by key"""
        return self.translations.get(key, key)
