import "dotenv/config";
import express from "express";
import cors from "cors";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const app = express();

app.use(cors());
app.use(express.json());

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODEV_API_KEY,
});

app.post("/translate", async (req, res) => {
  const { text, sourceLocale, targetLocale } = req.body;

  try {
    const result = await lingo.localizeText(text, {
      sourceLocale,
      targetLocale,
    });

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running at http://localhost:3000");
});
