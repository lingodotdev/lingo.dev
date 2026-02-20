"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Globe } from "lucide-react";
import { getPage } from "@/app/lib/storage";
import type { SitePage } from "@/app/lib/storage";
import SectionRenderer from "@/app/components/SectionRenderer";

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;
  const [page, setPage] = useState<SitePage | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loaded = getPage(pageId);
    if (!loaded) {
      router.push("/dashboard");
      return;
    }
    setPage(loaded);
  }, [pageId, router]);

  if (!mounted || !page) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Preview Toolbar */}
      <div className="sticky top-16 z-40 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <Link
              href={`/editor/${pageId}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Link>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-chart-2" />
              <span className="text-sm font-medium text-foreground">
                {page.title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Switch language in the navbar to see translations
            </span>
            <Link
              href={`/editor/${pageId}`}
              className="inline-flex items-center gap-1.5 text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md font-medium hover:bg-secondary/80 transition-colors"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Rendered Sections */}
      <div className="min-h-[60vh]">
        {page.sections.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-muted-foreground text-lg">
              This page has no sections yet.
            </p>
            <Link
              href={`/editor/${pageId}`}
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-chart-2 hover:underline"
            >
              <Pencil className="h-4 w-4" />
              Add some content
            </Link>
          </div>
        ) : (
          page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        )}
      </div>
    </div>
  );
}
