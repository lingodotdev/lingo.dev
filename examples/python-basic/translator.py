import json
import os

class Translator:
    def __init__(self, lang='en', directory='translations'):
        self.directory = directory
        self.lang = lang
        self.translations = {}
        self.load_language(lang)

    def load_language(self, lang):
        path = os.path.join(self.directory, f"{lang}.json")
        with open(path, encoding='utf-8') as file:
            self.translations = json.load(file)
        self.lang = lang

    def t(self, key):
        return self.translations.get(key, key)