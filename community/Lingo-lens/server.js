import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { LingoDotDevEngine } from "lingo.dev/sdk";

dotenv.config();

const app = express();
const PORT = 3001; 

app.use(cors()); 
app.use(express.json());

const apiKey = process.env.VITE_LINGO_API_KEY;
if (!apiKey) {
  console.error("ERROR: VITE_LINGO_API_KEY is missing in .env file. Server exiting.");
  process.exit(1);
}

const engine = new LingoDotDevEngine({ apiKey });

app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    // Input validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "text" parameter' });
    }
    if (!targetLang || typeof targetLang !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "targetLang" parameter' });
    }

    console.log(`Processing: ${sourceLang} -> ${targetLang}`);

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
    // Return generic error to client for security
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Server running on http://localhost:${PORT}`);
});