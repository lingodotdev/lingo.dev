import { LingoDotDevEngine } from "lingo.dev/sdk";

// Initialize Lingo.dev SDK
let lingoEngine = null;

const apiKey = process.env.VITE_LINGO_API_KEY;

if (apiKey && apiKey !== "your_api_key_here") {
  lingoEngine = new LingoDotDevEngine({
    apiKey: apiKey,
    batchSize: 100,
    idealBatchItemSize: 1000,
  });
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { text, targetLocale, sourceLocale, type } = req.body;

  if (!lingoEngine) {
    return res.status(503).json({
      error: "Translation service not configured",
      message: "Lingo.dev API key is missing or invalid",
    });
  }

  if (!text || !targetLocale) {
    return res.status(400).json({
      error: "Missing required parameters",
      message: "Both text and targetLocale are required",
    });
  }

  try {
    const result = await lingoEngine.localizeText(text, {
      sourceLocale: sourceLocale || null,
      targetLocale: targetLocale,
      fast: false,
    });

    res.json({
      success: true,
      translated: result,
      sourceLocale: sourceLocale,
      targetLocale: targetLocale,
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      error: "Translation failed",
      message: error.message || "Unknown error occurred",
    });
  }
}
