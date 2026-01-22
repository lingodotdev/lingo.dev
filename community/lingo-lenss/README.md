# LingoLens 📸

**LingoLens** is a powerful OCR (Optical Character Recognition) and Translation tool built for the **Lingo.dev Community Sprint**. It allows users to upload images of text (receipts, signs, documents), extracts the text using Tesseract.js, and translates it using the **Lingo.dev SDK**.

## 🎥 Demo & Testing
We have provided resources to help you test the application quickly:

### 1. Watch the Demo
> **[Click here to watch the Demo Video on YouTube 📺](https://youtu.be/UK_GkEOumnI)**

### 2. Test with Sample Data
I have included a sample receipt image in this repository for you to test with:
* **File:** [`test.png`](./test.png)
* **Usage:** You can upload this image in the app to see the OCR and Translation in action immediately.

## 🚀 Lingo.dev Features Highlighted
This project demonstrates key capabilities of the Lingo.dev ecosystem:
1.  **Lingo.dev SDK Integration:** Seamlessly integrates `lingo.dev/sdk` into a React environment.
2.  **Real-time Localization:** Uses `lingo.localizeText` to provide accurate, context-aware translations for dynamic user content.
3.  **Secure Backend Proxy:** Implements a robust Node.js/Express bridge (`server.js`) to handle API authentication securely, resolving browser CORS restrictions.

## 🛠️ Setup Instructions

### Prerequisites
* Node.js (v18 or higher)
* A Lingo.dev API Key

## 🛠️ Setup Instructions

### Prerequisites
* Node.js (v18 or higher)
* A Lingo.dev API Key

### 1. Installation
Navigate to the project directory and install dependencies:
```bash
cd community/lingo-lens
npm install
```

### 2. Configuration
Create a .env file in the root of the lingo-lens directory and add your API key:
```bash
VITE_LINGO_API_KEY=lin_your_actual_api_key_here
```

## 3. Running the App

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

1. **Upload**  
   User uploads an image or clicks **"Try with Sample Receipt"**.

2. **Extract**  
   Tesseract.js (running in the browser) extracts raw text from the image.

3. **Translate**  
   The frontend sends the extracted text to the local Express server.

4. **Process**  
   The server authenticates with the Lingo.dev SDK and processes the translation.

5. **Result**  
   The translated text appears instantly on the screen.

---

## ✨ Summary of Changes in this README

- **Added "Demo & Quick Test" Section**  
  Explicitly highlights `demo.mp4` and the **One-Click Test** button for judges.

- **Clarified Features**  
  Emphasized the **Secure Backend Proxy** as a key technical and security feature.

- **Simple Instructions**  
  Setup steps are clear and minimal so the project can be run in seconds.
