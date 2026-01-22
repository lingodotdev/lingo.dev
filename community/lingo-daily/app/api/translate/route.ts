import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/lingo-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texts, targetLocale, sourceLocale = "en" } = body;

    if (!texts || !Array.isArray(texts) || !targetLocale) {
      return NextResponse.json(
        { error: "Missing required fields: texts (array) and targetLocale" },
        { status: 400 },
      );
    }

    const translatedTexts = await translateText(
      texts,
      targetLocale,
      sourceLocale,
    );

    return NextResponse.json({ translations: translatedTexts });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Failed to translate" }, { status: 500 });
  }
}
