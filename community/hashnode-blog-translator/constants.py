import os

# Async
DEFAULT_TIMEOUT = 30.0

# Hashnode
hashnode_default_url = os.environ["HASHNODE_BASE_URL"]
if not hashnode_default_url:
    raise ValueError("`HASHNODE_BASE_URL` environment variable is required")

hashnode_query = """
        query Publication($pubName: String!, $slugName: String!) {
          publication(host: $pubName) {
            isTeam
            title
            post(slug: $slugName) {
              title
              content {
                markdown
              }
            }
          }
        }
        """
hashnode_api_key = os.environ["HASHNODE_API_KEY"]
if not hashnode_api_key:
    raise ValueError("`HASHNODE_API_KEY` environment variable is required")

hashnode_headers = {
    "Authorization": f"Bearer {hashnode_api_key}",
    "Content-Type": "application/json",
}

# Lingo
LINGO_SUPPORTED_LANGUAGES = [
    "en",
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "pt-BR",
    "ru",
    "zh",
    "zh-CN",
    "zh-TW",
    "ja",
    "ko",
    "ar",
    "hi",
    "nl",
    "pl",
    "tr",
    "sv",
    "da",
    "no",
    "fi",
    "cs",
    "el",
    "he",
    "th",
    "vi",
    "id",
    "uk",
    "ro",
    "bg",
    "hr",
    "sk",
]

# Gradio
GRADIO_SERVER_PORT = int(os.environ.get("GRADIO_SERVER_PORT", 7860))
