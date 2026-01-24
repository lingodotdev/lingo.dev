from pydantic import BaseModel, Field


class TranslationResult(BaseModel):
    """
    Output result
    """

    translated_title: str = Field(..., description="Translated blog title")
    translated_markdown_content: str = Field(
        ..., description="Translated markdown content"
    )


class TranslationMetadata(BaseModel):
    """
    Output metadata
    """

    title: str = Field(..., description="Original blog title")
    markdown_content: str = Field(..., description="Original markdown content")
    target_language: str = Field(..., description="Target translation language")
    detected_title_language: str = Field(
        ..., description="Detected language of the title"
    )
    detected_content_language: str = Field(
        ..., description="Detected language of the content"
    )


class Output(BaseModel):
    """
    Response output
    """

    result: TranslationResult
    metadata: TranslationMetadata
