"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/header";
import { NewsGrid } from "@/components/news-grid";
import { NewsGridSkeleton } from "@/components/news-skeleton";
import { NewsArticle } from "@/lib/types";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [translations, setTranslations] = useState<
    Map<string, { title: string; description: string }>
  >(new Map());
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      // Filter out articles with [Removed] content
      const validArticles =
        data.articles?.filter(
          (article: NewsArticle) =>
            article.title !== "[Removed]" &&
            article.description !== "[Removed]",
        ) || [];
      setArticles(validArticles);
      setTranslations(new Map());
    } catch (err) {
      setError("Failed to load news. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const translateArticles = useCallback(
    async (targetLocale: string) => {
      if (targetLocale === "en" || articles.length === 0) {
        setTranslations(new Map());
        return;
      }

      setIsTranslating(true);
      try {
        // Prepare texts for translation
        const textsToTranslate: string[] = [];
        articles.forEach((article) => {
          textsToTranslate.push(article.title || "");
          textsToTranslate.push(article.description || "");
        });

        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            texts: textsToTranslate,
            targetLocale,
          }),
        });

        if (!response.ok) throw new Error("Translation failed");

        const data = await response.json();
        const translatedTexts = data.translations;

        // Map translations back to articles
        const newTranslations = new Map<
          string,
          { title: string; description: string }
        >();
        articles.forEach((article, index) => {
          const key = `${article.title}-${index}`;
          newTranslations.set(key, {
            title: translatedTexts[index * 2] || article.title,
            description:
              translatedTexts[index * 2 + 1] || article.description || "",
          });
        });

        setTranslations(newTranslations);
      } catch (err) {
        console.error("Translation error:", err);
        // Keep original text on error
      } finally {
        setIsTranslating(false);
      }
    },
    [articles],
  );

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (articles.length > 0 && selectedLanguage !== "en") {
      translateArticles(selectedLanguage);
    } else {
      setTranslations(new Map());
    }
  }, [selectedLanguage, articles, translateArticles]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        isTranslating={isTranslating}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Today&apos;s Top Stories
          </h2>
          <p className="mt-2 text-muted-foreground">
            Breaking news from around the world, translated instantly with{" "}
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Lingo.dev
            </a>
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNews}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchNews}>
              Try Again
            </Button>
          </div>
        )}

        {/* News Grid */}
        {isLoading ? (
          <NewsGridSkeleton />
        ) : (
          <NewsGrid articles={articles} translations={translations} />
        )}

        {/* Translation Status */}
        {isTranslating && (
          <div className="fixed bottom-4 right-4 rounded-lg border bg-background/95 px-4 py-2 shadow-lg backdrop-blur">
            <p className="text-sm text-muted-foreground">
              Translating articles...
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built for the{" "}
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Lingo.dev
            </a>{" "}
            Hackathon • News powered by{" "}
            <a
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              NewsAPI
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
