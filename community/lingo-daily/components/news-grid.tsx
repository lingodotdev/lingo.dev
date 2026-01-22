"use client";

import { NewsArticle } from "@/lib/types";
import { NewsCard } from "./news-card";

interface NewsGridProps {
  articles: NewsArticle[];
  translations: Map<string, { title: string; description: string }>;
}

export function NewsGrid({ articles, translations }: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-muted-foreground">No articles found</p>
        <p className="text-sm text-muted-foreground">Try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => {
        const key = `${article.title}-${index}`;
        const translation = translations.get(key);
        return (
          <NewsCard
            key={key}
            article={article}
            translatedTitle={translation?.title}
            translatedDescription={translation?.description}
          />
        );
      })}
    </div>
  );
}
