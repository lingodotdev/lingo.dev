const express = require('express');
const cors = require('cors');
const { LingoDotDevEngine } = require('lingo.dev/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const lingo = new LingoDotDevEngine({ apiKey: process.env.LINGO_API_KEY });

app.post('/translate', async (req, res) => {
  const { word, targetLocale } = req.body;
  try {
    const result = await lingo.localizeText(word, {
      sourceLocale: 'en',
      targetLocale: targetLocale
    });
    res.json({ translation: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));