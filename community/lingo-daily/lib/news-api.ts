import { NewsAPIResponse } from "./types";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

export async function fetchTopHeadlines(
  country: string = "us",
  pageSize: number = 10,
): Promise<NewsAPIResponse> {
  if (!NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is not configured");
  }

  const response = await fetch(
    `${NEWS_API_BASE_URL}/top-headlines?country=${country}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`,
    { next: { revalidate: 300 } }, // Cache for 5 minutes
  );

  if (!response.ok) {
    throw new Error(`News API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchNewsByCategory(
  category: string,
  country: string = "us",
  pageSize: number = 10,
): Promise<NewsAPIResponse> {
  if (!NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is not configured");
  }

  const response = await fetch(
    `${NEWS_API_BASE_URL}/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`,
    { next: { revalidate: 300 } },
  );

  if (!response.ok) {
    throw new Error(`News API error: ${response.status}`);
  }

  return response.json();
}
