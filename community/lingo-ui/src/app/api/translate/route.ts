  import { NextResponse } from "next/server";
  import { LingoDotDevEngine } from "lingo.dev/sdk";

  const lingo = new LingoDotDevEngine({
    apiKey: process.env.LINGODOTDEV_API_KEY! || "api_d0ru4elnfza9wo04d2gqb7m4",
  });

  export async function POST(req: Request) {
    const body = await req.json();
    const { text, targetLocale } = body;

    console.log(`[API] Translation Request: "${text?.substring(0, 20)}..." to '${targetLocale}'`);

    if (!text || typeof text !== "string") {
      console.log("[API] Invalid or empty text request");
      return NextResponse.json({ error: "Invalid text parameter" }, { status: 400 });
    }

    // Optimize: Check if target is source
    if (targetLocale === "en") {
      console.log("[API] English target - returning original text");
      return NextResponse.json({ translation: text });
    }

    // Check API Key
    if (!process.env.LINGODOTDEV_API_KEY) {
      console.error("[API] CRITICAL: LINGODOTDEV_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // Special debug logging for Hindi
    if (targetLocale === "hi") {
      console.log(`[API] Hindi translation request for: "${text}"`);
    }

    console.log(`[API] Processing single text translation...`);

    try {
      const translated = await lingo.localizeText(text, {
        sourceLocale: "en",
        targetLocale,
      });

      if (targetLocale === "hi") {
        console.log(`[API] Hindi translation success: "${text}" -> "${translated}"`);
      }

      console.log(`[API] Translation complete.`);
      return NextResponse.json({ translation: translated });
    } catch (error) {
      console.error(`[API] Failed to translate "${text}" to ${targetLocale}:`, error);
      
      // Return original text as fallback
      console.log(`[API] Returning original text as fallback`);
      return NextResponse.json({ translation: text });
    }
  }