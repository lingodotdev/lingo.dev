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

  const { texts, targetLocale, sourceLocale } = req.body;

  if (!lingoEngine) {
    return res.status(503).json({
      error: "Translation service not configured",
      message: "Lingo.dev API key is missing or invalid",
    });
  }

  if (!texts || !Array.isArray(texts) || !targetLocale) {
    return res.status(400).json({
      error: "Missing required parameters",
      message: "texts (array) and targetLocale are required",
    });
  }

  try {
    const results = await lingoEngine.localizeStringArray(texts, {
      sourceLocale: sourceLocale || null,
      targetLocale: targetLocale,
      fast: false,
    });

    res.json({
      success: true,
      translated: results,
      count: results.length,
    });
  } catch (error) {
    console.error("Batch translation error:", error);
    res.status(500).json({
      error: "Batch translation failed",
      message: error.message || "Unknown error occurred",
    });
  }
}
