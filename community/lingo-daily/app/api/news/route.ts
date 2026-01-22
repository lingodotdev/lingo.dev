import { NextRequest, NextResponse } from "next/server";
import { fetchTopHeadlines, fetchNewsByCategory } from "@/lib/news-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const country = searchParams.get("country") || "us";

  try {
    const data = category
      ? await fetchNewsByCategory(category, country, 10)
      : await fetchTopHeadlines(country, 10);

    return NextResponse.json(data);
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 },
    );
  }
}
