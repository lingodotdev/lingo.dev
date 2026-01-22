"use client";

import { Calendar, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
// import { useLingoContext } from "@lingo.dev/compiler/react";
import Image from "next/image";

// Mock Lingo context
function useLingoContext() {
  const [locale, setLocale] = useState("en");
  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved) setLocale(saved);

    const handleStorage = () => {
      const saved = localStorage.getItem("locale");
      if (saved) setLocale(saved);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return { locale };
}

export default function ArticleCard({ article }) {
  const { locale } = useLingoContext();

  // Format date according to locale
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50">
      {/* Article Image */}
      {article.urlToImage && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {/* Source */}
        {article.source?.name && (
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <span className="rounded-full bg-primary/10 px-2 py-1">
              {article.source.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-semibold tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h2>

        {/* Description */}
        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          </div>

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Read more
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
