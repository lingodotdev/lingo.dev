"use client";

import { Heart, Github, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Branding */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by the</span>
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Lingo.dev
            </a>
            <span>community</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/lingodotdev/lingo.dev/tree/main/community/medi-lingo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              Source Code
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="https://lingo.dev/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              SDK Docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center text-xs text-muted-foreground">
          <p>
            Your privacy matters. PDF and image text extraction happens entirely
            in your browser. We do not store any medical data.
          </p>
        </div>
      </div>
    </footer>
  );
}
