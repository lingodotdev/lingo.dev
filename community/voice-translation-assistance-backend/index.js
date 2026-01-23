import express from "express";
import cors from "cors";
import { LingoDotDevEngine } from "lingo.dev/sdk";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY,
  timeout:20000,
});

async function translateWithRetry(text, sourceLocale, targetLocale) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `🔁 Attempt ${attempt}: Translating "${text}" → ${targetLocale}`
      );

      const translated = await lingo.localizeText(text, {
        sourceLocale,
        targetLocale,
      });

      console.log(`✅ Translation success: ${translated}`);
      return translated;
    } catch (err) {
      console.error(
        `❌ Attempt ${attempt} failed:`,
        err?.message || err?.toString()
      );

      if (attempt === maxRetries) {
        throw err;
      }

      // Wait before retrying
      await new Promise((res) => setTimeout(res, 800));
    }
  }
}

// ------------------------------
// API Route: /translate
// ------------------------------
app.post("/translate", async (req, res) => {
  try {
    const { text, targetLocale } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing 'text' field" });
    }
    if (!targetLocale) {
      return res.status(400).json({ error: "Missing 'targetLocale' field" });
    }

    console.log(`🌐 Incoming request: "${text}" → ${targetLocale}`);

    const translated = await translateWithRetry(text, "en", targetLocale);

    return res.json({ translated });
  } catch (err) {
    console.error("🔥 Final translation error:", err?.message || err);

    return res.status(500).json({
      error: "Translation failed. Please try again.",
      details: err?.message || err.toString(),
    });
  }
});


app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));