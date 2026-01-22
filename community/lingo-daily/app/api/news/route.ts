import { NextRequest, NextResponse } from "next/server";
import { fetchTopHeadlines, fetchNewsByCategory } from "@/lib/news-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const country = searchParams.get("country") || "us";
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  try {
    const data = category
      ? await fetchNewsByCategory(category, country, pageSize)
      : await fetchTopHeadlines(country, pageSize);

    return NextResponse.json(data);
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 },
    );
  }
}
