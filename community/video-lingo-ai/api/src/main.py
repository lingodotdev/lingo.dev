from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil
import tempfile

from .models import whisper, generate_text 
from .utils.utils import extract_audio          
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="Video Lingo AI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(tempfile.gettempdir()) / "video_lingo_ai"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@app.post("/process-video")
async def process_video(file: UploadFile = File(...), issummarize: bool = False):
    """
    Process video:
    - Extract audio
    - Transcribe using Whisper
    - Optionally summarize
    """
    video_path = UPLOAD_DIR / file.filename
    with open(video_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    audio_file = extract_audio(str(video_path)) 

    segments, info = whisper.transcribe(str(audio_file))
    segments = list(segments) 

    if issummarize:
        full_text = " ".join([seg.text for seg in segments])
        summary = generate_text(f"Summarize this video:\n{full_text}")
        return JSONResponse({"summary": summary})

    result = []
    for seg in segments:
        result.append({
            "start": seg.start,
            "end": seg.end,
            "text": seg.text
        })

    return JSONResponse({"segments": result})
