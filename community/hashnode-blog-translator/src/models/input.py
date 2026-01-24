from pydantic import BaseModel, Field


class Input(BaseModel):
    """
    User input
    """

    hashnode_publication_name: str = Field(..., description="Hashnode Publication Name")
    hashnode_slug_name: str = Field(..., description="Hashnode Slug Name")
    target_language: str = Field(..., description="Target to convert the blog data")
