import { NextRequest, NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, text, sourceLocale, targetLocale, action } = body;

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 });
    }

    const engine = new LingoDotDevEngine({ apiKey });

    if (action === "detect") {
      const locale = await engine.recognizeLocale(text);
      return NextResponse.json({ locale });
    }

    if (action === "translate") {
      const result = await engine.localizeText(text, {
        sourceLocale: sourceLocale || null,
        targetLocale,
      });
      return NextResponse.json({ text: result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 }
    );
  }
}
