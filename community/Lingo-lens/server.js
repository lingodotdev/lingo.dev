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
if (!apiKey) console.warn("WARNING: VITE_LINGO_API_KEY is missing in .env file");

const engine = new LingoDotDevEngine({ apiKey });

app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    console.log(`Processing: ${sourceLang} -> ${targetLang}`);

    // CONFIGURATION:
    // If sourceLang is 'auto', we pass null as per Lingo.dev SDK docs
    // This tells the AI to infer the language from the text content.
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
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Server running on http://localhost:${PORT}`);
});