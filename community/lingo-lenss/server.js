import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { LingoDotDevEngine } from "lingo.dev/sdk";

dotenv.config();

const app = express();
const PORT = 3001; // We run this on port 3001 to avoid conflict with React (5173)

app.use(cors()); // Allow React to talk to this server
app.use(express.json());

// Initialize Lingo Engine here (Server-side is safe!)
const apiKey = process.env.VITE_LINGO_API_KEY;
if (!apiKey) console.warn("WARNING: VITE_LINGO_API_KEY is missing in .env file");

const engine = new LingoDotDevEngine({ apiKey });

app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    console.log(`Processing: ${sourceLang} -> ${targetLang}`);

    // Map languages if necessary (API usually expects standard codes)
    const translation = await engine.localizeText(text, {
      sourceLocale: sourceLang,
      targetLocale: targetLang
    });

    res.json({ translation });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy Server running on http://localhost:${PORT}`);
});