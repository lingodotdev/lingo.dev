import { NextRequest, NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

// Simple in-memory rate limiting implementation
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

const requestCounts: Record<string, { count: number; expiresAt: number }> = {};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts[ip];

  if (!record || now > record.expiresAt) {
    requestCounts[ip] = {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW,
    };
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const ip in requestCounts) {
    if (now > requestCounts[ip].expiresAt) {
      delete requestCounts[ip];
    }
  }
}, RATE_LIMIT_WINDOW);

// Helper to get SDK instance lazily
function getLingoDotDev() {
  // Check key only when needed
  const apiKey = process.env.LINGODOTDEV_API_KEY;
  if (!apiKey) {
    throw new Error("LINGODOTDEV_API_KEY is not set");
  }
  return new LingoDotDevEngine({ apiKey });
}

export async function POST(req: NextRequest) {
  // 1. Rate Limiting
  const ip = req.headers.get("x-forwarded-for") || "unknown-ip";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 },
    );
  }

  try {
    // Initialize SDK inside handler to avoid build-time errors if env is missing
    let lingoDotDev;
    try {
      lingoDotDev = getLingoDotDev();
    } catch (e) {
      console.error("SDK Init Error:", e);
      return NextResponse.json(
        { error: "Configuration Error: LINGODOTDEV_API_KEY missing." },
        { status: 500 },
      );
    }

    // 2. Input Validation
    const body = await req.json();
    const { text, type, targetLanguage, fast } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Missing "text" field' },
        { status: 400 },
      );
    }
    if (!["text", "json", "html"].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid "type". Must be one of: text, json, html' },
        { status: 400 },
      );
    }

    if (!targetLanguage) {
      return NextResponse.json(
        { error: "Target language is required for translation." },
        { status: 400 },
      );
    }

    try {
      let result;
      const params = {
        targetLocale: targetLanguage,
        sourceLocale: null,
        fast: !!fast,
      };

      switch (type) {
        case "text":
          result = await lingoDotDev.localizeText(text, params);
          break;
        case "json":
          let jsonObj;
          try {
            jsonObj = typeof text === "string" ? JSON.parse(text) : text;
          } catch (e) {
            return NextResponse.json(
              { error: "Invalid JSON format" },
              { status: 400 },
            );
          }
          result = await lingoDotDev.localizeObject(jsonObj, params);
          break;
        case "html":
          result = await lingoDotDev.localizeHtml(text, params);
          break;
      }

      return NextResponse.json({ result });
    } catch (sdkError: unknown) {
      console.error("Lingo SDK Error:", sdkError);
      const errorMessage =
        sdkError instanceof Error ? sdkError.message : "Translation failed";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
