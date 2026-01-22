import { NextResponse } from "next/server";
import { lingoDotDev } from "@/config/lingo";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const language = formData.get("language");

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!language) {
      return NextResponse.json(
        { message: "Language is required" },
        { status: 400 }
      );
    }

    const htmlString = await file.text();

    const translated = await lingoDotDev.localizeHtml(htmlString, {
      sourceLocale: "en",
      targetLocale: String(language),
    });

    return NextResponse.json({
      html: translated,
      message: "HTML translated successfully",
    });

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Translation failed";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
