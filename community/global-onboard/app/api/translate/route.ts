import { NextResponse } from "next/server";

import { translateWithLingo } from "@/lib/lingo";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

type TranslationPayload = {
  text?: string;
  targetLocale?: Locale;
};

export async function POST(request: Request) {
  let payload: TranslationPayload;

  try {
    payload = (await request.json()) as TranslationPayload;
  } catch (error) {
    console.error("Invalid translation payload", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { text, targetLocale } = payload;

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing welcome note" }, { status: 400 });
  }

  if (!targetLocale || !SUPPORTED_LOCALES.includes(targetLocale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }

  try {
    const translated = await translateWithLingo(text, targetLocale);
    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Lingo translation failed", error);
    const message =
      error instanceof Error ? error.message : "Unable to translate welcome note";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
