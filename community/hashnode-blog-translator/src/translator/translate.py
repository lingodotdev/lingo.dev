import os

from lingodotdev import LingoDotDevEngine

from src.models.blog import HashnodeBlogData
from src.models.output import Output, TranslationMetadata, TranslationResult


class LingoContentTranslator:
    def __init__(self, blog: HashnodeBlogData, target_locale: str):
        self.title = blog.title
        self.markdown_content = blog.markdown_content
        self.target_language = target_locale
        self.lingo_api_key = os.environ["LINGODOTDEV_API_KEY"]

        if not self.lingo_api_key:
            raise ValueError("`LINGODOTDEV_API_KEY` environment variable is required")

    async def _detect_language(self, content: str):
        async with LingoDotDevEngine({"api_key": self.lingo_api_key}) as engine:
            locale = await engine.recognize_locale(content)
            return locale

    async def _translate_title(self):
        result = await LingoDotDevEngine.quick_translate(
            self.title,
            api_key=self.lingo_api_key,
            source_locale=self.detected_title_language,
            target_locale=self.target_language,
        )

        return result

    async def _translate_content(self):
        obj = {"content": self.markdown_content}

        async with LingoDotDevEngine({"api_key": self.lingo_api_key}) as engine:
            result = await engine.localize_object(
                obj=obj,
                params={
                    "source_locale": self.detected_content_language,
                    "target_locale": self.target_language,
                },
                concurrent=True,
            )

        return result["content"]

    async def run_translator(self) -> Output:
        self.detected_title_language = await self._detect_language(self.title)
        self.detected_content_language = await self._detect_language(
            self.markdown_content
        )

        # Check if source language and target language match
        if self.detected_title_language == self.target_language:
            msg = f"Detected Title Language {self.detected_title_language} and Target Language {self.target_language} are the same"
            print(msg)

        if self.detected_content_language == self.target_language:
            msg = f"Detected Content Language {self.detected_content_language} and Target Language {self.target_language} are the same"
            print(msg)

        # Translate blog data
        self.translated_title = await self._translate_title()
        self.translated_markdown_content = await self._translate_content()

        # Build Output Model
        translated_result = TranslationResult(
            translated_title=self.translated_title,
            translated_markdown_content=self.translated_markdown_content,
        )
        translated_metadata = TranslationMetadata(
            title=self.title,
            markdown_content=self.markdown_content,
            target_language=self.target_language,
            detected_title_language=self.detected_title_language,
            detected_content_language=self.detected_content_language,
        )

        output = Output(result=translated_result, metadata=translated_metadata)

        return output
