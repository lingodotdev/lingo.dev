import { NextRequest, NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const LINGO_API_KEY = "api_gomnex9smxctpsz0lx69bu81";

const lingoEngine = new LingoDotDevEngine({
  apiKey: LINGO_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content, targetLocale } = await request.json();

    if (!content || !targetLocale) {
      return NextResponse.json(
        { error: "Missing content or targetLocale" },
        { status: 400 }
      );
    }

    if (targetLocale === "en") {
      return NextResponse.json({ translated: content });
    }

    const translated = await lingoEngine.localizeObject(content, {
      sourceLocale: "en",
      targetLocale: targetLocale,
    });

    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
