from faster_whisper import WhisperModel
import os
from groq import Groq
import re

whisper = WhisperModel(
    "tiny",  
    device="cpu", # i dont have a gpu so it can be slow 
    compute_type="int8"
)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def extract_final_answer(text: str) -> str:
    if "FINAL_ANSWER:" in text:
        text = text.split("FINAL_ANSWER:", 1)[1]

    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)

    text = text.strip().strip('"').strip("'")
    text = re.sub(r"^[^A-Za-z0-9]+", "", text)

    return text.strip()

def generate_text(prompt: str) -> str:
    response = client.chat.completions.create(
        model="qwen/qwen3-32b",
        messages=[
            {
                "role": "user",
                "content": (
                    "Summarize the following transcript.\n\n"
                    "STRICT RULES:\n"
                    "- No reasoning\n"
                    "- No explanations\n"
                    "- No analysis\n"
                    "- Output ONLY the final summary\n"
                    "- Start with: FINAL_ANSWER:\n\n"
                    + prompt
                )
            }
        ],
        temperature=0.2,
        max_tokens=512,
    )

    raw = response.choices[0].message.content
    return extract_final_answer(raw)

