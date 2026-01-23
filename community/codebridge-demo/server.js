import express from "express";
import cors from "cors";
import { LingoDotDevEngine } from "lingo.dev/sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true,
  }),
);

// Parse JSON bodies
app.use(express.json());

// Initialize Lingo.dev SDK
let lingoEngine = null;
let initError = null;

try {
  const apiKey = process.env.VITE_LINGO_API_KEY;

  if (apiKey && apiKey !== "your_api_key_here") {
    lingoEngine = new LingoDotDevEngine({
      apiKey: apiKey,
      batchSize: 100,
      idealBatchItemSize: 1000,
    });
    console.log("✅ Lingo.dev SDK initialized successfully on server");
  } else {
    console.warn("⚠️ VITE_LINGO_API_KEY not configured");
  }
} catch (error) {
  initError = error;
  console.error("❌ Lingo.dev SDK initialization failed:", error);
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    lingoConfigured: lingoEngine !== null,
    timestamp: new Date().toISOString(),
  });
});

// Translation endpoint
app.post("/api/translate", async (req, res) => {
  try {
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

    console.log(`🌍 Translating ${type || "text"} to ${targetLocale}...`);

    const result = await lingoEngine.localizeText(text, {
      sourceLocale: sourceLocale || null,
      targetLocale: targetLocale,
      fast: false,
    });

    console.log("✅ Translation completed");

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
});

// Batch translation endpoint for comments
app.post("/api/translate-batch", async (req, res) => {
  try {
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

    console.log(
      `🌍 Batch translating ${texts.length} items to ${targetLocale}...`,
    );

    const results = await lingoEngine.localizeStringArray(texts, {
      sourceLocale: sourceLocale || null,
      targetLocale: targetLocale,
      fast: false,
    });

    console.log("✅ Batch translation completed");

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
});

// AI Code Summarization endpoint
app.post("/api/summarize", async (req, res) => {
  try {
    const { code, language, targetLocale, fileName } = req.body;

    if (!lingoEngine) {
      return res.status(503).json({
        error: "Summarization service not configured",
        message: "Lingo.dev API key is missing or invalid",
      });
    }

    if (!code || !targetLocale) {
      return res.status(400).json({
        error: "Missing required parameters",
        message: "Both code and targetLocale are required",
      });
    }

    console.log(
      `🤖 Generating AI summary for ${fileName} in ${targetLocale}...`,
    );

    // Create a concise prompt for code analysis (in English)
    const codeSnippet = code.substring(0, 2000); // Limit for performance
    const prompt = `You are a code analyst. Analyze this ${language || "code"} file and write ONLY a brief summary (2-3 sentences) explaining what this code does and its main purpose. Be concise. Do not repeat the code.

File: ${fileName}
Code:
${codeSnippet}

Summary (2-3 sentences only):`;

    // Step 1: Generate summary in English first
    const englishSummary = await lingoEngine.localizeText(prompt, {
      sourceLocale: "en-US",
      targetLocale: "en-US",
      fast: false,
    });

    // Step 2: Translate to target language if needed
    let finalSummary = englishSummary.trim();

    if (targetLocale !== "en-US") {
      finalSummary = await lingoEngine.localizeText(englishSummary, {
        sourceLocale: "en-US",
        targetLocale: targetLocale,
        fast: false,
      });
    }

    console.log("✅ AI summary generated successfully");

    res.json({
      success: true,
      summary: finalSummary,
      fileName: fileName,
      language: language,
      targetLocale: targetLocale,
    });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({
      error: "Summarization failed",
      message: error.message || "Unknown error occurred",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║  🚀 CodeBridge Translation Server                ║
║                                                  ║
║  Server running on: http://localhost:${PORT}      ║
║  Lingo.dev Status: ${lingoEngine ? "✅ Active" : "⚠️  Inactive"}              ║
║                                                  ║
║  Endpoints:                                      ║
║  GET  /api/health          - Health check        ║
║  POST /api/translate       - Translate text      ║
║  POST /api/translate-batch - Batch translate     ║
╚══════════════════════════════════════════════════╝
  `);
});

export default app;
