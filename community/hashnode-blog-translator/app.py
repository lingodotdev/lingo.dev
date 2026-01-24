from dotenv import load_dotenv
from os.path import join, dirname

import gradio as gr

from src.translator.hashnode import HashnodeFetchContent
from src.translator.translate import LingoContentTranslator
from src.models.input import Input
from constants import LINGO_SUPPORTED_LANGUAGES, GRADIO_SERVER_PORT


dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path)


def set_loading():
    return "⏳ Translating blog… Please wait."


async def run_translation(
    hashnode_publication_name: str,
    hashnode_slug_name: str,
    target_language: str,
) -> str:
    """
    Gradio entry point returns translated Markdown
    """

    # Validate inputs
    if not hashnode_publication_name:
        raise ValueError("hashnodePublicationName is required")

    if not hashnode_slug_name:
        raise ValueError("hashnodeSlugName is required")

    if not target_language:
        raise ValueError("targetLocale is required")

    if target_language not in LINGO_SUPPORTED_LANGUAGES:
        raise ValueError(
            f"Unsupported target language: {target_language}. "
            f"Supported: {', '.join(LINGO_SUPPORTED_LANGUAGES)}"
        )

    # Build input model
    user_input = Input(
        hashnode_publication_name=hashnode_publication_name,
        hashnode_slug_name=hashnode_slug_name,
        target_language=target_language,
    )

    # Fetch blog content
    hashnode = HashnodeFetchContent(input=user_input)
    blog = await hashnode.fetch_blog_content()

    # Translate blog
    translator = LingoContentTranslator(
        blog=blog,
        target_locale=target_language,
    )
    response_output = await translator.run_translator()

    # Return Markdown
    return response_output.result.translated_markdown_content


with gr.Blocks(title="Hashnode Blog Translator") as demo:
    gr.Markdown("# 🌍 Hashnode Blog Translator")

    with gr.Row():
        publication = gr.Textbox(
            label="Hashnode Publication Name",
            placeholder="srinikethj.hashnode.dev",
        )
        slug = gr.Textbox(
            label="Blog Slug",
            placeholder="send-sms-using-twilio-for-g-calendar-events-using-naas-template",
        )

    language = gr.Dropdown(
        choices=LINGO_SUPPORTED_LANGUAGES,
        label="Target Language",
        value=LINGO_SUPPORTED_LANGUAGES[3],
    )

    output = gr.Markdown(label="Translated Markdown")

    translate_btn = gr.Button("Translate")

    translate_btn.click(
        fn=set_loading,
        outputs=output,
    ).then(
        fn=run_translation,
        inputs=[publication, slug, language],
        outputs=output,
    )


if __name__ == "__main__":
    demo.launch(server_port=GRADIO_SERVER_PORT)
