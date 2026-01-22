"use client";

import { Loader2 } from "lucide-react";

export default function LoadMoreButton({
  onClick,
  loading,
  hasMore,
  shownCount,
  totalCount,
}) {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          No more articles to load
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-sm text-muted-foreground">
        Showing {shownCount} of {totalCount} articles
      </p>
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>Load More Articles</>
        )}
      </button>
    </div>
  );
}
