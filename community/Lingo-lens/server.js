import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { LingoDotDevEngine } from "lingo.dev/sdk";

dotenv.config();

const app = express();
const PORT = 3001; 

app.use(cors()); 
app.use(express.json());

// Security: Renamed to LINGO_API_KEY to distinguish it as a server-side secret
const apiKey = process.env.LINGO_API_KEY;

// Fail-fast: Stop the server immediately if the API key is missing
if (!apiKey) {
  console.error("ERROR: LINGO_API_KEY is missing in .env file. Server exiting.");
  process.exit(1);
}

const engine = new LingoDotDevEngine({ apiKey });

app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    // Input Validation: Ensure all required parameters are present and valid
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "text" parameter' });
    }
    if (!targetLang || typeof targetLang !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "targetLang" parameter' });
    }

    console.log(`Processing: ${sourceLang} -> ${targetLang}`);

    // Configuration: Pass null for sourceLocale if 'auto' is selected 
    // to trigger Lingo.dev AI inference
    const options = {
      targetLocale: targetLang,
      sourceLocale: sourceLang === 'auto' ? null : sourceLang
    };

    if (sourceLang === 'auto') {
        console.log("Auto-detecting source language via Lingo.dev...");
    }

    const translation = await engine.localizeText(text, options);

    res.json({ translation });

  } catch (error) {
    console.error("Server Error:", error);
    // Security: Avoid exposing raw SDK error messages to the client
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Server running on http://localhost:${PORT}`);
});