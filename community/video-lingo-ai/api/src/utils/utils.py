import subprocess
import os
from lingodotdev import LingoDotDevEngine

def extract_audio(video_path, output_audio="temp_audio.wav"):

    command = ["ffmpeg", "-y", "-i", video_path, "-ac", "1", "-ar", "16000", output_audio]
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    if not os.path.exists(output_audio):
        raise RuntimeError("Audio extraction failed")

    return output_audio


async def translate_text_with_lingo(text: str, target_lang: str) -> str:
    result = await LingoDotDevEngine.quick_translate(
        text,
        api_key=os.getenv("LINGODOTDEV_API_KEY"),
        target_locale=target_lang
    )
    return result
