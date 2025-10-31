"""
Lingo.dev Python Translator

A simple translation utility for loading and using Lingo.dev JSON translations
in Python applications.
"""

import json
import os
from typing import Dict, Any, Optional


class Translator:
    """
    A lightweight translator class for managing i18n translations.
    
    Usage:
        translator = Translator(lang="en")
        print(translator.t("greeting"))  # Output: Hello
        
        translator.set_language("hi")
        print(translator.t("greeting"))  # Output: नमस्ते
    """
    
    def __init__(self, lang: str = "en", translations_path: str = "translations"):
        """
        Initialize the translator with a default language.
        
        Args:
            lang: The initial language code (e.g., "en", "hi", "es")
            translations_path: Path to the directory containing translation JSON files
        """
        self.translations_path = translations_path
        self.translations: Dict[str, Any] = {}
        self.lang: str = ""
        self.set_language(lang)
    
    def set_language(self, lang: str) -> None:
        """
        Switch to a different language by loading its translation file.
        
        Args:
            lang: The language code to switch to
            
        Raises:
            FileNotFoundError: If the translation file doesn't exist
            json.JSONDecodeError: If the translation file is invalid JSON
        """
        file_path = os.path.join(self.translations_path, f"{lang}.json")
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(
                f"Translation file not found: {file_path}\n"
                f"Available languages: {self.get_available_languages()}"
            )
        
        with open(file_path, "r", encoding="utf-8") as f:
            self.translations = json.load(f)
        
        self.lang = lang
    
    def t(self, key: str, default: Optional[str] = None) -> str:
        """
        Translate a key to the current language.
        
        Args:
            key: The translation key to look up
            default: Optional default value if key is not found
            
        Returns:
            The translated string, or the key itself if not found
        """
        return self.translations.get(key, default or key)
    
    def get_available_languages(self) -> list:
        """
        Get a list of available language codes based on JSON files in the translations directory.
        
        Returns:
            List of language codes (e.g., ["en", "hi", "es"])
        """
        if not os.path.exists(self.translations_path):
            return []
        
        return [
            f.replace(".json", "")
            for f in os.listdir(self.translations_path)
            if f.endswith(".json")
        ]
    
    def get_current_language(self) -> str:
        """
        Get the currently active language code.
        
        Returns:
            The current language code
        """
        return self.lang
    
    def get_all_translations(self) -> Dict[str, Any]:
        """
        Get all translations for the current language.
        
        Returns:
            Dictionary of all translation keys and values
        """
        return self.translations.copy()
