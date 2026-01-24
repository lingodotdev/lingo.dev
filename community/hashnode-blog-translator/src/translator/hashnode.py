import httpx

from src.models.input import Input
from src.models.blog import HashnodeBlogData
from constants import (
    hashnode_default_url,
    hashnode_query,
    hashnode_headers,
    DEFAULT_TIMEOUT,
)


class HashnodeFetchContent:
    """
    Fetch the blog details from Hashnode
    """

    def __init__(self, input: Input):
        self.hashnode_publication_name = input.hashnode_publication_name
        self.hashnode_slug_name = input.hashnode_slug_name

    async def fetch_blog_content(self) -> HashnodeBlogData:
        payload = {
            "query": hashnode_query,
            "variables": {
                "pubName": self.hashnode_publication_name,
                "slugName": self.hashnode_slug_name,
            },
        }

        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            response = await client.post(
                hashnode_default_url,
                json=payload,
                headers=hashnode_headers,
            )

            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise ValueError(
                    f"Failed to fetch blog from Hashnode: {e.response.status_code}"
                ) from e

            data = response.json()

            publication = data["data"]["publication"]
            if not publication or not publication.get("post"):
                raise ValueError("Post not found for given host and slug")

            blog_post = publication["post"]
            content = blog_post.get("content") or {}
            markdown_content = content.get("markdown")
            if not markdown_content:
                raise ValueError("Fetched blog post has no markdown content")

            blog_data = HashnodeBlogData(
                title=blog_post["title"],
                markdown_content=markdown_content,
            )

            return blog_data
