"use client";

import { Heart, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-600 text-white shadow-lg shadow-primary/25">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">medi-lingo</h1>
            <p className="text-xs text-muted-foreground">
              Medical Report Explainer
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://lingo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Powered by Lingo.dev
            <ExternalLink className="h-3 w-3" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
