# LingoLens 📸

**LingoLens** is a powerful **AI Visual Translator** built for the **Lingo.dev Community Sprint**. 

It upgrades standard OCR with **Intelligent Script Detection** and **Lingo.dev's AI Language Inference**. Wrapped in a stunning **Glassmorphism UI**, it allows users to upload images of text (receipts, signs, documents) and automatically detects the language script and translation context in real-time.

## 🎥 Demo & Testing
We have provided resources to help you test the application quickly:

### 1. Watch the Demo
> **[Click here to watch the Demo Video on YouTube 📺](https://youtu.be/ZJFpRb-49eE)**

### 2. Test with Sample Data
I have included a sample receipt image in this repository for you to test with:
* **File:** [`test.png`](./test.png)
* **Usage:** Drag and drop this image into the app to see the Auto-Detection and Translation in action immediately.

## 🚀 Lingo.dev Features Highlighted
This project demonstrates key capabilities of the Lingo.dev ecosystem:
1.  **AI Language Inference:** Uses the `sourceLocale: null` feature of the **Lingo.dev SDK** to automatically identify the source language from the text context.
2.  **Smart Script Detection:** Implements **Tesseract OSD** (Orientation & Script Detection) to dynamically load the correct OCR alphabet (e.g., Japanese vs. Latin) before reading.
3.  **Real-time Localization:** Uses `lingo.localizeText` to provide accurate, context-aware translations for dynamic user content.
4.  **Secure Backend Proxy:** Implements a robust Node.js/Express bridge (`server.js`) to handle API authentication securely.

## 🛠️ Setup Instructions

### Prerequisites
* Node.js (v18 or higher)
* A Lingo.dev API Key

### 1. Installation
Navigate to the project directory and install dependencies:
```bash
cd community/Lingo-lens
npm install
```

### 2. Configuration
Create a .env file in the root of the Lingo-lens directory and add your API key:
```bash
LINGO_API_KEY=link_your_actual_api_key_here
```

### 3. Running the App

This application requires **both the backend server** (to communicate with Lingo.dev) and the **frontend client** (React) to run simultaneously.

---

### Terminal 1 — Backend Server

```bash
node server.js
```

You should see: `✅ Proxy Server running on http://localhost:3001`


### Terminal 2 — Frontend Client

```bash
npm run dev
```

Open the URL shown in the terminal: `(usually: http://localhost:5173)`

## 📖 How It Works

1. **Upload & Detect** User uploads an image. The app first runs **Tesseract OSD** to detect the script (e.g., "Han" for Chinese, "Latin" for English).

2. **Extract (OCR)** Based on the script, the app loads the optimized OCR model (e.g., `chi_sim` or `eng`) and extracts the raw text from the image.

3. **Inference** The frontend sends the text to the server with `sourceLang: 'auto'`.

4. **Translate** The **Lingo.dev SDK** analyzes the text content, infers the source language, and generates a context-aware translation.

5. **Result** The original text and the translation appear instantly on the animated Glassmorphism interface.


