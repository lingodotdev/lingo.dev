# Video Lingo AI – Demo

## Overview

**Video Lingo AI** is a web application that allows users to:

* Upload a video file.
* Extract audio and transcribe it using Whisper AI.
* Optionally generate a summarized version of the transcript.
* View the transcript with timestamps.
* Due to limited resources please upload any english spoked video.


This tool is built to demonstrate how AI can help automatically understand, summarize, and localize video content.

---

## Features Highlighted

* **Video Processing & Transcription:** Uses Whisper AI to convert spoken content into text segments with timestamps.
* **Summarization:** Generates concise summaries of video content (via a language model).
* **Dynamic Transcript Display:** Shows each segment with start/end times for easy navigation.
* **Multi-language Support :** Designed to translate transcript and summary into other languages, demonstrating the power of Lingo.dev for localization.
* **Interactive Vue3 Frontend:** Drag-and-drop video uploads, toggles for summarization, and responsive results display.

---

## Tech Stack

* **Backend:** FastAPI, Python 3.10+, Whisper AI, OpenAI API (for summarization & translation).
* **Frontend:** Vue 3, Composition API, Axios for API requests.
* **Other Libraries:** Pydantic, Requests, pathlib, shutil.

---

## How to Run Locally

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd video-lingo-ai/api
```

2. **Create and activate a virtual environment:**

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Set environment variables:**

Create a `.env` file 

```env
GROQ_API_KEY=<your_openai_api_key>
LINGODOTDEV_API_KEY=<your_lingo_api_key>
```

5. **Run the backend:**

```bash
uvicorn src.main:app --reload
```

6. **Run the frontend:**

```bash
npm install
npm run dev
```

7. **Access the app in your browser:**

```
http://localhost:5173
```

* Drag and drop a video file to upload.
* Toggle summarization if needed.
* View the transcript and summary in English/Hindi.

---

## Lingo.dev Integration

The app is designed to highlight Lingo.dev features:

* Translating dynamic content such as transcripts and summaries.
* Supporting multiple languages for global accessibility.
* Easy integration with web apps for localization workflows.

---

## Notes

* The summarization feature may take a few seconds depending on video length.

Thank you for Organizing this

---
