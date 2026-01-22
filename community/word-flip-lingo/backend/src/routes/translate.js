import express from "express";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const router = express.Router();

let lingoDotDev;

const getLingoDotDev = () => {
  if (!lingoDotDev) {
    lingoDotDev = new LingoDotDevEngine({
      apiKey: process.env.LINGODOTDEV_API_KEY,
    });
  }
  return lingoDotDev;
};

const langMap = {
  'English': 'en',
  'Japanese': 'ja',
  'Hindi': 'hi',
  'Bengali': 'bn',
  'Telugu': 'te',
  'Marathi': 'mr',
  'Tamil': 'ta',
  'Gujarati': 'gu',
  'Urdu': 'ur',
  'Kannada': 'kn',
  'Odia': 'or',
  'Malayalam': 'ml',
  'Punjabi': 'pa',
  'Sanskrit': 'sa',
  'Spanish': 'es',
  'French': 'fr',
  'German': 'de',
  'Chinese': 'zh',
  'Korean': 'ko',
};

router.post("/translate", async (req, res) => {
  try {
    const { word, sourceLang, targetLang } = req.body;

    if (!word || !sourceLang || !targetLang) {
      return res.status(400).json({ error: "Missing required fields: word, sourceLang, targetLang" });
    }

    const sourceLocale = langMap[sourceLang];
    const targetLocale = langMap[targetLang];

    const content = {
      wordToTranslate: word,
    };

    const translated = await getLingoDotDev().localizeObject(content, {
      sourceLocale,
      targetLocale,
    });

    res.json({
      original: word,
      translated: translated.wordToTranslate,
      sourceLang,
      targetLang
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Failed to translate word" });
  }
});

export default router;
