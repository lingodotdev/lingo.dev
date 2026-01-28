from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil
import tempfile

from .models import whisper, generate_text 
from .utils.utils import extract_audio, translate_text_with_lingo       
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Video Lingo AI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# for demo project above i have allowed all origins. 

UPLOAD_DIR = Path(tempfile.gettempdir()) / "video_lingo_ai"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.post("/process-video")
async def process_video(
    file: UploadFile = File(...),
    issummarize: bool = False,
    lang: str = "en"
):
    video_path = UPLOAD_DIR / file.filename
    with open(video_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    audio_file = extract_audio(str(video_path))

    segments, _info = whisper.transcribe(str(audio_file))
    segments = list(segments)

    full_text = " ".join(seg.text for seg in segments)

    if issummarize:
        summary = generate_text(f"Summarize this video:\n{full_text}")
        if lang != "en":
            summary = await translate_text_with_lingo(summary, lang)
        return JSONResponse({"summary": summary})

    result = []
    for seg in segments:
        text = seg.text
        if lang != "en":
            text = await translate_text_with_lingo(text, lang)

        result.append({
            "start": seg.start,
            "end": seg.end,
            "text": text
        })

    return JSONResponse({"segments": result})
