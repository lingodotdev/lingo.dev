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

  res.json({
    status: "ok",
    lingoConfigured: lingoEngine !== null,
    timestamp: new Date().toISOString(),
    environment: "vercel-serverless",
  });
}
