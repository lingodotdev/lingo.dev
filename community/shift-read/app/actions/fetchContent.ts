"use server";

import Firecrawl from "@mendable/firecrawl-js";

export interface ArticleData {
  markdown: string;
  metadata: {
    title?: string;
    author?: string;
    publishedTime?: string;
    ogImage?: string;
    language?: string;
  };
}

export async function fetchContent(url: string): Promise<{
  success: boolean;
  data?: ArticleData;
  error?: string;
}> {
  try {
    const apiKey = process.env.FIRECRAWL_API_KEY;

    if (!apiKey) {
      return { success: false, error: "Firecrawl API key is not configured" };
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return { success: false, error: "Invalid URL" };
    }
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return { success: false, error: "Invalid URL protocol" };
    }

    const firecrawl = new Firecrawl({ apiKey });

    const result = await firecrawl.scrape(parsedUrl.toString(), {
      formats: ["markdown"],
      onlyMainContent: true,
      waitFor: 1000,
    });

    if (!result.markdown) {
      return { success: false, error: "Failed to extract article content" };
    }

    return {
      success: true,
      data: {
        markdown: result.markdown,
        metadata: {
          title: result.metadata?.title,
          author: result.metadata?.dcTermsAudience as string | undefined,
          publishedTime: result.metadata?.publishedTime,
          ogImage: result.metadata?.ogImage,
          language: result.metadata?.language,
        },
      },
    };
  } catch (error) {
    console.error("Firecrawl error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to scrape article";
    return { success: false, error: errorMessage };
  }
}
