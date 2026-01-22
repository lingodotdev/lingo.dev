"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NewsArticle } from "@/lib/types";
import { Calendar, ExternalLink } from "lucide-react";

interface NewsCardProps {
  article: NewsArticle;
  translatedTitle?: string;
  translatedDescription?: string;
}

export function NewsCard({
  article,
  translatedTitle,
  translatedDescription,
}: NewsCardProps) {
  const displayTitle = translatedTitle || article.title;
  const displayDescription = translatedDescription || article.description;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          {article.urlToImage ? (
            <Image
              src={article.urlToImage}
              alt={displayTitle}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
              <span className="text-4xl font-bold text-muted-foreground/30">
                {article.source.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-primary">
              {article.source.name}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <h2 className="line-clamp-2 text-lg font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors">
            {displayTitle}
          </h2>
          {displayDescription && (
            <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
              {displayDescription}
            </p>
          )}
          <div className="flex items-center gap-1 pt-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
            <span>Read more</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
