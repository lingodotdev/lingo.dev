from pydantic import BaseModel, Field


class HashnodeBlogData(BaseModel):
    """
    Result of fetched hashnode blog data
    """

    title: str = Field(..., description="Title of the blog")
    markdown_content: str = Field(..., description="Blog content in markdown format")
