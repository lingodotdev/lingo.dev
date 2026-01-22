"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import LoadMoreButton from "@/components/LoadMoreButton";
import { getNews } from "@/lib/news";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Initial load
  useEffect(() => {
    loadInitialArticles();
  }, []);

  const loadInitialArticles = async () => {
    try {
      setLoading(true);
      const data = await getNews(0, 10);
      setArticles(data.articles);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(0);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreArticles = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await getNews(nextPage, 10);
      setArticles((prev) => [...prev, ...data.articles]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more articles:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero articleCount={articles.length} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={`${article.url}-${index}`} article={article} />
          ))}
        </div>

        {/* Load More */}
        <LoadMoreButton
          onClick={loadMoreArticles}
          loading={loadingMore}
          hasMore={hasMore}
          shownCount={articles.length}
          totalCount={total}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Powered by</span>
              <a
                href="https://lingo.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Lingo.dev
              </a>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg">
              This demo showcases Lingo.dev's powerful localization features
              including dynamic interpolation, pluralization, and seamless
              language switching.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
